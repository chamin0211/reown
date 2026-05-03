package com.reown.backend.brand.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "partner_brand")
@Getter
@NoArgsConstructor
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "brand_id")
    private Long brandId;

    @Column(name = "owner_user_id", nullable = false)
    private Long ownerUserId;

    @Column(name = "brand_name", nullable = false)
    private String brandName;

    @Column(name = "brand_logo_url")
    private String brandLogoUrl;

    @Column(name = "business_number")
    private String businessNumber;

    @Column(name = "sales_status", nullable = false)
    private String salesStatus;

    @Column(name = "settlement_cycle")
    private String settlementCycle;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public Brand(Long ownerUserId, String brandName, String brandLogoUrl, String businessNumber, String settlementCycle) {
        this.ownerUserId = ownerUserId;
        this.brandName = brandName;
        this.brandLogoUrl = brandLogoUrl;
        this.businessNumber = businessNumber;
        this.settlementCycle = settlementCycle;
        this.salesStatus = "INACTIVE";
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
    }

    public void approve() {
        this.status = "APPROVED";
        this.salesStatus = "ACTIVE";
    }

    public void reject() {
        this.status = "REJECTED";
        this.salesStatus = "INACTIVE";
    }
}
