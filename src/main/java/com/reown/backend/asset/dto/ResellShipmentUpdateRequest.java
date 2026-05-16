package com.reown.backend.asset.dto;

public record ResellShipmentUpdateRequest(
        String courierName,
        String trackingNumber
) {
}
