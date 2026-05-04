package com.reown.backend.trade.service;

import com.reown.backend.trade.dto.PortOnePaymentVerifyRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PortOnePaymentService {

    private final RestClient restClient = RestClient.create();

    @Value("${portone.api-secret:}")
    private String apiSecret;

    public PortOneVerifiedPayment verify(PortOnePaymentVerifyRequest request, Integer orderAmount) {
        if (apiSecret == null || apiSecret.isBlank()) {
            throw new IllegalStateException("PortOne API Secret이 설정되지 않았습니다. PORTONE_API_SECRET 환경변수를 확인하세요.");
        }

        Map response = restClient.get()
                .uri("https://api.portone.io/payments/{paymentId}", request.paymentId())
                .header("Authorization", "PortOne " + apiSecret)
                .retrieve()
                .body(Map.class);

        if (response == null) {
            throw new IllegalStateException("PortOne 결제 정보를 조회하지 못했습니다.");
        }

        String status = getString(response, "status");
        if (!"PAID".equals(status)) {
            throw new IllegalArgumentException("결제가 완료되지 않았습니다. status=" + status);
        }

        Integer paidAmount = readPaidAmount(response);
        Integer expectedAmount = request.expectedAmount() != null ? request.expectedAmount() : orderAmount;

        if (!expectedAmount.equals(orderAmount)) {
            throw new IllegalArgumentException("요청 금액과 주문 금액이 일치하지 않습니다. requestAmount=" + expectedAmount + ", orderAmount=" + orderAmount);
        }

        if (!expectedAmount.equals(paidAmount)) {
            throw new IllegalArgumentException("PortOne 결제 금액과 주문 금액이 일치하지 않습니다. paidAmount=" + paidAmount + ", orderAmount=" + expectedAmount);
        }

        String method = request.paymentMethod() != null && !request.paymentMethod().isBlank()
                ? request.paymentMethod()
                : readPaymentMethod(response);

        return new PortOneVerifiedPayment(request.paymentId(), method, paidAmount);
    }

    private Integer readPaidAmount(Map response) {
        Object amount = response.get("amount");

        if (amount instanceof Number number) {
            return number.intValue();
        }

        if (amount instanceof Map amountMap) {
            Object total = amountMap.get("total");
            if (total instanceof Number number) {
                return number.intValue();
            }
            if (total != null) {
                return Integer.parseInt(total.toString());
            }
        }

        Object paidAmount = response.get("paidAmount");
        if (paidAmount instanceof Number number) {
            return number.intValue();
        }
        if (paidAmount != null) {
            return Integer.parseInt(paidAmount.toString());
        }

        throw new IllegalStateException("PortOne 응답에서 결제 금액을 확인하지 못했습니다.");
    }

    private String readPaymentMethod(Map response) {
        Object method = response.get("method");
        if (method != null) {
            return method.toString();
        }

        Object paymentMethod = response.get("paymentMethod");
        if (paymentMethod != null) {
            return paymentMethod.toString();
        }

        return "PORTONE";
    }

    private String getString(Map response, String key) {
        Object value = response.get(key);
        return value != null ? value.toString() : null;
    }

    public record PortOneVerifiedPayment(
            String paymentId,
            String paymentMethod,
            Integer amount
    ) {
    }
}
