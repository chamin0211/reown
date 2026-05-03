package com.reown.backend.trade.controller;

import com.reown.backend.trade.dto.MockPaymentRequest;
import com.reown.backend.trade.dto.PaymentResponse;
import com.reown.backend.trade.service.TradeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final TradeService tradeService;

    @PostMapping("/mock")
    public PaymentResponse payMock(
            @Valid @RequestBody MockPaymentRequest request
    ) {
        return tradeService.payMock(request);
    }
}