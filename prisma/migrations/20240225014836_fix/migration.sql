/*
  Warnings:

  - You are about to drop the column `CategoryId` on the `Products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Categories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Products` DROP FOREIGN KEY `Products_CategoryId_fkey`;

-- AlterTable
ALTER TABLE `Products` DROP COLUMN `CategoryId`,
    ADD COLUMN `Category` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Categories_name_key` ON `Categories`(`name`);

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_Category_fkey` FOREIGN KEY (`Category`) REFERENCES `Categories`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;
