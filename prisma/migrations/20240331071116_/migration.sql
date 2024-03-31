/*
  Warnings:

  - You are about to drop the column `vat` on the `supplier` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `supplier_contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "raw_material" ADD COLUMN     "description" TEXT,
ADD COLUMN     "re_order_level" TEXT,
ADD COLUMN     "re_order_qty" DECIMAL(65,30),
ALTER COLUMN "item_code" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "supplier" DROP COLUMN "vat",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "fax" TEXT,
ADD COLUMN     "telephone" TEXT,
ADD COLUMN     "vat_reg_no" TEXT,
ALTER COLUMN "br_number" DROP NOT NULL,
ALTER COLUMN "br_number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "supplier_contact" DROP COLUMN "address";
