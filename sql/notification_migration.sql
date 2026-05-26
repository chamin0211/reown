USE reown_db;

CREATE TABLE IF NOT EXISTS user_notification (
    notification_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'INFO',
    link_url VARCHAR(300) NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME NULL,
    PRIMARY KEY (notification_id),
    INDEX idx_user_notification_user_created (user_id, created_at),
    INDEX idx_user_notification_user_read (user_id, is_read)
);
