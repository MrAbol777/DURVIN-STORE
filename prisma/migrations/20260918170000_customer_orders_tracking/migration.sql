-- Safe additive migration: existing orders remain intact. New checkout orders always
-- receive a tracking code and idempotency key in application code. Existing tracking
-- values intentionally remain NULL so this migration never invents or exposes codes.

ALTER TABLE `orders`
    ADD COLUMN `trackingCode` VARCHAR(191) NULL,
    ADD COLUMN `idempotencyKey` VARCHAR(191) NULL;

ALTER TABLE `order_items` ADD COLUMN `lineTotalRials` BIGINT NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX `orders_trackingCode_key` ON `orders`(`trackingCode`);
CREATE UNIQUE INDEX `orders_idempotencyKey_key` ON `orders`(`idempotencyKey`);

-- Preserve a correct total snapshot for all existing order items without changing
-- prices or quantities. New rows are written with the computed value atomically.
UPDATE `order_items` SET `lineTotalRials` = `unitPriceRials` * `quantity`;

ALTER TABLE `orders` MODIFY `status` ENUM('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled') NOT NULL DEFAULT 'pending';
