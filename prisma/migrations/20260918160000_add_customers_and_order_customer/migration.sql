-- Additive migration: existing guest orders keep a NULL customerId and remain intact.
CREATE TABLE `customers` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(100) NOT NULL,
    `lastName` VARCHAR(100) NOT NULL,
    `mobile` VARCHAR(32) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `customers_mobile_key`(`mobile`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `orders` ADD COLUMN `customerId` VARCHAR(191) NULL;
CREATE INDEX `orders_customerId_createdAt_idx` ON `orders`(`customerId`, `createdAt`);
ALTER TABLE `orders` ADD CONSTRAINT `orders_customerId_fkey`
  FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
