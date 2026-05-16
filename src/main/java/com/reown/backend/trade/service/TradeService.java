package com.reown.backend.trade.service;

import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.entity.ProductOption;
import com.reown.backend.catalog.repository.ProductOptionRepository;
import com.reown.backend.catalog.repository.ProductRepository;
import com.reown.backend.trade.dto.*;
import com.reown.backend.trade.entity.TradeCartItem;
import com.reown.backend.trade.entity.TradeOrder;
import com.reown.backend.trade.entity.TradeOrderItem;
import com.reown.backend.trade.entity.TradePayment;
import com.reown.backend.trade.repository.TradeCartItemRepository;
import com.reown.backend.trade.repository.TradeOrderItemRepository;
import com.reown.backend.trade.repository.TradeOrderRepository;
import com.reown.backend.trade.repository.TradePaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TradeService {

    private final TradeCartItemRepository cartItemRepository;
    private final TradeOrderRepository orderRepository;
    private final TradeOrderItemRepository orderItemRepository;
    private final TradePaymentRepository paymentRepository;
    private final PortOnePaymentService portOnePaymentService;

    private final ProductRepository productRepository;
    private final ProductOptionRepository productOptionRepository;

    @Transactional
    public CartItemResponse addCartItem(CartItemAddRequest request) {
        ProductOption option = productOptionRepository.findById(request.optionId())
                .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + request.optionId()));

        Product product = productRepository.findById(option.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + option.getProductId()));

        TradeCartItem cartItem = cartItemRepository
                .findByUserIdAndOptionId(request.userId(), request.optionId())
                .map(existingCartItem -> {
                    existingCartItem.increaseQuantity(request.quantity());
                    return existingCartItem;
                })
                .orElseGet(() -> new TradeCartItem(
                        request.userId(),
                        request.optionId(),
                        request.quantity()
                ));

        TradeCartItem savedCartItem = cartItemRepository.save(cartItem);

        return CartItemResponse.from(savedCartItem, product, option);
    }

    public List<CartItemResponse> getCartItems(Long userId) {
        return cartItemRepository.findByUserId(userId)
                .stream()
                .map(cartItem -> {
                    ProductOption option = productOptionRepository.findById(cartItem.getOptionId())
                            .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + cartItem.getOptionId()));

                    Product product = productRepository.findById(option.getProductId())
                            .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + option.getProductId()));

                    return CartItemResponse.from(cartItem, product, option);
                })
                .toList();
    }

    @Transactional
    public CartItemResponse updateCartItemQuantity(
            Long cartItemId,
            CartItemQuantityUpdateRequest request
    ) {
        TradeCartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 상품을 찾을 수 없습니다. cartItemId=" + cartItemId));

        cartItem.updateQuantity(request.quantity());

        ProductOption option = productOptionRepository.findById(cartItem.getOptionId())
                .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + cartItem.getOptionId()));

        Product product = productRepository.findById(option.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + option.getProductId()));

        return CartItemResponse.from(cartItem, product, option);
    }

    @Transactional
    public void deleteCartItem(Long cartItemId) {
        if (!cartItemRepository.existsById(cartItemId)) {
            throw new IllegalArgumentException("장바구니 상품을 찾을 수 없습니다. cartItemId=" + cartItemId);
        }

        cartItemRepository.deleteById(cartItemId);
    }

    @Transactional
    public OrderResponse createOrder(OrderCreateRequest request) {
        List<TradeCartItem> cartItems = cartItemRepository.findByUserId(request.userId());

        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("장바구니가 비어 있습니다.");
        }

        int totalPaymentAmount = 0;

        for (TradeCartItem cartItem : cartItems) {
            ProductOption option = productOptionRepository.findById(cartItem.getOptionId())
                    .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + cartItem.getOptionId()));

            Product product = productRepository.findById(option.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + option.getProductId()));

            totalPaymentAmount += product.getPrice() * cartItem.getQuantity();
        }

        String orderNo = "ORD-" + System.currentTimeMillis();

        TradeOrder order = new TradeOrder(
                request.userId(),
                orderNo,
                totalPaymentAmount,
                request.shippingAddressSnapshot()
        );

        TradeOrder savedOrder = orderRepository.save(order);

        for (TradeCartItem cartItem : cartItems) {
            ProductOption option = productOptionRepository.findById(cartItem.getOptionId())
                    .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + cartItem.getOptionId()));

            Product product = productRepository.findById(option.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + option.getProductId()));

            TradeOrderItem orderItem = new TradeOrderItem(
                    savedOrder.getOrderId(),
                    cartItem.getOptionId(),
                    cartItem.getQuantity(),
                    product.getPrice()
            );

            orderItemRepository.save(orderItem);
        }

        cartItemRepository.deleteByUserId(request.userId());

        return getOrder(savedOrder.getOrderId());
    }

    public OrderResponse getOrder(Long orderId) {
        TradeOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다. orderId=" + orderId));

        List<OrderItemResponse> itemResponses = orderItemRepository.findByOrderId(orderId)
                .stream()
                .map(orderItem -> {
                    ProductOption option = productOptionRepository.findById(orderItem.getOptionId())
                            .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + orderItem.getOptionId()));

                    Product product = productRepository.findById(option.getProductId())
                            .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + option.getProductId()));

                    return OrderItemResponse.from(orderItem, product, option);
                })
                .toList();

        return OrderResponse.from(order, itemResponses);
    }

    public List<OrderResponse> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(order -> getOrder(order.getOrderId()))
                .toList();
    }

    public List<PurchasedOrderItemResponse> getPurchasedOrderItems(Long userId) {
        return orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, "PAID")
                .stream()
                .flatMap(order -> orderItemRepository.findByOrderId(order.getOrderId())
                        .stream()
                        .map(orderItem -> {
                            ProductOption option = productOptionRepository.findById(orderItem.getOptionId())
                                    .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + orderItem.getOptionId()));

                            Product product = productRepository.findById(option.getProductId())
                                    .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + option.getProductId()));

                            return PurchasedOrderItemResponse.from(order, orderItem, product, option);
                        }))
                .toList();
    }


    @Transactional
    public OrderResponse prepareShipping(Long orderId) {
        TradeOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다. orderId=" + orderId));

        order.prepareShipping();

        return getOrder(order.getOrderId());
    }

    @Transactional
    public OrderResponse shipOrder(Long orderId, String trackingNumber) {
        TradeOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다. orderId=" + orderId));

        order.ship(trackingNumber);

        return getOrder(order.getOrderId());
    }

    @Transactional
    public OrderResponse deliverOrder(Long orderId) {
        TradeOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다. orderId=" + orderId));

        order.deliver();

        return getOrder(order.getOrderId());
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(order -> getOrder(order.getOrderId()))
                .toList();
    }

    public List<SellerOrderItemResponse> getSellerOrderItems(Long brandId) {
        if (brandId == null) {
            throw new IllegalArgumentException("brandId가 필요합니다.");
        }

        return orderItemRepository.findAll()
                .stream()
                .map(orderItem -> toSellerOrderItemResponse(orderItem, brandId))
                .filter(response -> response != null)
                .sorted((left, right) -> right.orderedAt().compareTo(left.orderedAt()))
                .toList();
    }

    public SellerOrderSummaryResponse getSellerOrderSummary(Long brandId) {
        List<SellerOrderItemResponse> items = getSellerOrderItems(brandId);

        long totalOrders = items.stream()
                .map(SellerOrderItemResponse::orderId)
                .distinct()
                .count();

        long paidOrders = items.stream()
                .filter(item -> "PAID".equals(item.orderStatus()))
                .map(SellerOrderItemResponse::orderId)
                .distinct()
                .count();

        long readyOrders = countOrdersByShippingStatus(items, "READY");
        long preparingOrders = countOrdersByShippingStatus(items, "PREPARING");
        long shippedOrders = countOrdersByShippingStatus(items, "SHIPPED");
        long deliveredOrders = countOrdersByShippingStatus(items, "DELIVERED");

        int totalSalesAmount = items.stream()
                .filter(item -> "PAID".equals(item.orderStatus()))
                .mapToInt(SellerOrderItemResponse::itemTotalPrice)
                .sum();

        int pendingShipmentAmount = items.stream()
                .filter(item -> "PAID".equals(item.orderStatus()))
                .filter(item -> !"DELIVERED".equals(item.shippingStatus()))
                .mapToInt(SellerOrderItemResponse::itemTotalPrice)
                .sum();

        return new SellerOrderSummaryResponse(
                totalOrders,
                paidOrders,
                readyOrders,
                preparingOrders,
                shippedOrders,
                deliveredOrders,
                items.size(),
                totalSalesAmount,
                pendingShipmentAmount
        );
    }

    @Transactional
    public OrderResponse prepareSellerOrderShipping(Long orderId, Long brandId) {
        assertOrderContainsBrand(orderId, brandId);
        return prepareShipping(orderId);
    }

    @Transactional
    public OrderResponse shipSellerOrder(Long orderId, Long brandId, String trackingNumber) {
        assertOrderContainsBrand(orderId, brandId);
        return shipOrder(orderId, trackingNumber);
    }

    @Transactional
    public OrderResponse deliverSellerOrder(Long orderId, Long brandId) {
        assertOrderContainsBrand(orderId, brandId);
        return deliverOrder(orderId);
    }

    private long countOrdersByShippingStatus(List<SellerOrderItemResponse> items, String shippingStatus) {
        return items.stream()
                .filter(item -> shippingStatus.equals(item.shippingStatus()))
                .map(SellerOrderItemResponse::orderId)
                .distinct()
                .count();
    }

    private SellerOrderItemResponse toSellerOrderItemResponse(TradeOrderItem orderItem, Long brandId) {
        ProductOption option = productOptionRepository.findById(orderItem.getOptionId())
                .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + orderItem.getOptionId()));

        Product product = productRepository.findById(option.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + option.getProductId()));

        if (!brandId.equals(product.getBrandId())) {
            return null;
        }

        TradeOrder order = orderRepository.findById(orderItem.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다. orderId=" + orderItem.getOrderId()));

        return SellerOrderItemResponse.from(order, orderItem, product, option);
    }

    private void assertOrderContainsBrand(Long orderId, Long brandId) {
        if (brandId == null) {
            throw new IllegalArgumentException("brandId가 필요합니다.");
        }

        boolean containsBrandItem = orderItemRepository.findByOrderId(orderId)
                .stream()
                .anyMatch(orderItem -> {
                    ProductOption option = productOptionRepository.findById(orderItem.getOptionId())
                            .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + orderItem.getOptionId()));

                    Product product = productRepository.findById(option.getProductId())
                            .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + option.getProductId()));

                    return brandId.equals(product.getBrandId());
                });

        if (!containsBrandItem) {
            throw new IllegalArgumentException("해당 셀러 브랜드의 주문이 아닙니다. orderId=" + orderId + ", brandId=" + brandId);
        }
    }

    @Transactional
    public PaymentResponse payMock(MockPaymentRequest request) {
        TradeOrder order = getPayableOrder(request.orderId());

        String paymentMethod = request.paymentMethod() != null ? request.paymentMethod() : "MOCK_CARD";
        String pgTid = "MOCK-" + System.currentTimeMillis();

        return completePayment(order, pgTid, paymentMethod, order.getTotalPaymentAmount());
    }

    @Transactional
    public PaymentResponse payPortOne(PortOnePaymentVerifyRequest request) {
        TradeOrder order = getPayableOrder(request.orderId());

        PortOnePaymentService.PortOneVerifiedPayment verifiedPayment =
                portOnePaymentService.verify(request, order.getTotalPaymentAmount());

        return completePayment(
                order,
                verifiedPayment.paymentId(),
                verifiedPayment.paymentMethod(),
                verifiedPayment.amount()
        );
    }

    private TradeOrder getPayableOrder(Long orderId) {
        TradeOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다. orderId=" + orderId));

        if ("PAID".equals(order.getStatus())) {
            throw new IllegalArgumentException("이미 결제된 주문입니다.");
        }

        return order;
    }

    private PaymentResponse completePayment(TradeOrder order, String pgTid, String paymentMethod, Integer amount) {
        List<TradeOrderItem> orderItems = orderItemRepository.findByOrderId(order.getOrderId());

        for (TradeOrderItem orderItem : orderItems) {
            ProductOption option = productOptionRepository.findById(orderItem.getOptionId())
                    .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + orderItem.getOptionId()));

            option.decreaseStock(orderItem.getQuantity());
        }

        order.markPaid();

        TradePayment payment = new TradePayment(
                order.getOrderId(),
                pgTid,
                paymentMethod,
                amount
        );

        TradePayment savedPayment = paymentRepository.save(payment);

        return PaymentResponse.from(savedPayment);
    }
}