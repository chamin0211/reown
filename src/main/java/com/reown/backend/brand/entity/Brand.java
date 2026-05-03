package com.reown.backend.brand.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "partner_brand")
@Getter
@NoArgsConstructor
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "brand_id")
    private Long brandId;

    @Column(name = "owner_user_id")
    private Long ownerUserId;

    @Column(name = "brand_name", nullable = false)
    private String brandName;

    @Column(name = "brand_logo_url")
    private String brandLogoUrl;

    @Column(name = "business_number")
    private String businessNumber;

    @Column(name = "sales_status")
    private String salesStatus;

    @Column(name = "settlement_cycle")
    private String settlementCycle;

    @Column(name = "status")
    private String status;
}