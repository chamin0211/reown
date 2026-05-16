USE reown_db;

DROP PROCEDURE IF EXISTS add_column_if_missing;

DELIMITER $$

CREATE PROCEDURE add_column_if_missing(
    IN p_table_name VARCHAR(100),
    IN p_column_name VARCHAR(100),
    IN p_column_definition TEXT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = p_table_name
          AND COLUMN_NAME = p_column_name
    ) THEN
        SET @sql = CONCAT('ALTER TABLE ', p_table_name, ' ADD COLUMN ', p_column_definition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END $$

DELIMITER ;

CALL add_column_if_missing(
    'asset_resell_transaction',
    'courier_name',
    'courier_name VARCHAR(100) NULL AFTER status'
);

CALL add_column_if_missing(
    'asset_resell_transaction',
    'tracking_number',
    'tracking_number VARCHAR(100) NULL AFTER courier_name'
);

CALL add_column_if_missing(
    'asset_resell_transaction',
    'settlement_amount',
    'settlement_amount INT NULL AFTER tracking_number'
);

CALL add_column_if_missing(
    'asset_resell_transaction',
    'cancel_reason',
    'cancel_reason TEXT NULL AFTER settlement_amount'
);

CALL add_column_if_missing(
    'asset_resell_transaction',
    'paid_at',
    'paid_at DATETIME NULL AFTER created_at'
);

CALL add_column_if_missing(
    'asset_resell_transaction',
    'shipment_prepared_at',
    'shipment_prepared_at DATETIME NULL AFTER paid_at'
);

CALL add_column_if_missing(
    'asset_resell_transaction',
    'shipped_at',
    'shipped_at DATETIME NULL AFTER shipment_prepared_at'
);

CALL add_column_if_missing(
    'asset_resell_transaction',
    'purchase_confirmed_at',
    'purchase_confirmed_at DATETIME NULL AFTER shipped_at'
);

CALL add_column_if_missing(
    'asset_resell_transaction',
    'settled_at',
    'settled_at DATETIME NULL AFTER purchase_confirmed_at'
);

CALL add_column_if_missing(
    'asset_resell_transaction',
    'canceled_at',
    'canceled_at DATETIME NULL AFTER settled_at'
);

DROP PROCEDURE IF EXISTS add_column_if_missing;

UPDATE asset_resell_transaction
SET settlement_amount = GREATEST(COALESCE(resell_price, 0) - COALESCE(platform_fee, 0), 0)
WHERE settlement_amount IS NULL;