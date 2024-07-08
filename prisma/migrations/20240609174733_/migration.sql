/*
  Warnings:

  - You are about to drop the `prn_item_po_item` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[po_no]` on the table `po` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "prn_item_po_item" DROP CONSTRAINT "prn_item_po_item_po_item_id_fkey";

-- DropForeignKey
ALTER TABLE "prn_item_po_item" DROP CONSTRAINT "prn_item_po_item_prn_item_id_fkey";

-- AlterTable
ALTER TABLE "po" ADD COLUMN     "contact_person" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deliver_before" TIMESTAMP(3),
ADD COLUMN     "po_no" TEXT,
ALTER COLUMN "currency" SET DEFAULT 'LKR',
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "discount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "po_item" ADD COLUMN     "prn_item_id" TEXT;

-- DropTable
DROP TABLE "prn_item_po_item";

-- CreateTable
CREATE TABLE "prn_item_po" (
    "id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "prn_item_id" TEXT NOT NULL,
    "po_id" TEXT NOT NULL,

    CONSTRAINT "prn_item_po_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grn" (
    "id" TEXT NOT NULL,
    "grn_no" TEXT NOT NULL,
    "comment" TEXT,
    "discount_type" TEXT,
    "discount" DECIMAL(65,30),
    "supplier_inv_no" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "po_id" TEXT NOT NULL,

    CONSTRAINT "grn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grn_item" (
    "id" TEXT NOT NULL,
    "recieved_type" TEXT NOT NULL,
    "qty" DECIMAL(65,30) NOT NULL,
    "price_per_unit" DECIMAL(65,30) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "grn_id" TEXT NOT NULL,
    "rm_id" TEXT NOT NULL,

    CONSTRAINT "grn_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "srn" (
    "id" TEXT NOT NULL,
    "srn_no" TEXT NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "grn_id" TEXT NOT NULL,

    CONSTRAINT "srn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "srn_item" (
    "id" TEXT NOT NULL,
    "qty" DECIMAL(65,30) NOT NULL,
    "reason" TEXT,
    "discount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "returned_by" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "srn_id" TEXT NOT NULL,
    "rm_id" TEXT NOT NULL,

    CONSTRAINT "srn_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tax_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "po_tax_type" (
    "id" SERIAL NOT NULL,
    "po_id" TEXT NOT NULL,
    "tax_type_id" INTEGER NOT NULL,

    CONSTRAINT "po_tax_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "srn_tax_type" (
    "id" SERIAL NOT NULL,
    "srn_id" TEXT NOT NULL,
    "tax_type_id" INTEGER NOT NULL,

    CONSTRAINT "srn_tax_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grn_tax_type" (
    "id" SERIAL NOT NULL,
    "grn_id" TEXT NOT NULL,
    "tax_type_id" INTEGER NOT NULL,

    CONSTRAINT "grn_tax_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "grn_grn_no_key" ON "grn"("grn_no");

-- CreateIndex
CREATE UNIQUE INDEX "grn_po_id_key" ON "grn"("po_id");

-- CreateIndex
CREATE UNIQUE INDEX "srn_srn_no_key" ON "srn"("srn_no");

-- CreateIndex
CREATE UNIQUE INDEX "srn_grn_id_key" ON "srn"("grn_id");

-- CreateIndex
CREATE UNIQUE INDEX "po_po_no_key" ON "po"("po_no");

-- AddForeignKey
ALTER TABLE "po_item" ADD CONSTRAINT "po_item_prn_item_id_fkey" FOREIGN KEY ("prn_item_id") REFERENCES "prn_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prn_item_po" ADD CONSTRAINT "prn_item_po_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "po"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prn_item_po" ADD CONSTRAINT "prn_item_po_prn_item_id_fkey" FOREIGN KEY ("prn_item_id") REFERENCES "prn_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn" ADD CONSTRAINT "grn_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "po"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_item" ADD CONSTRAINT "grn_item_grn_id_fkey" FOREIGN KEY ("grn_id") REFERENCES "grn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_item" ADD CONSTRAINT "grn_item_rm_id_fkey" FOREIGN KEY ("rm_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "srn" ADD CONSTRAINT "srn_grn_id_fkey" FOREIGN KEY ("grn_id") REFERENCES "grn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "srn_item" ADD CONSTRAINT "srn_item_rm_id_fkey" FOREIGN KEY ("rm_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "srn_item" ADD CONSTRAINT "srn_item_srn_id_fkey" FOREIGN KEY ("srn_id") REFERENCES "srn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "po_tax_type" ADD CONSTRAINT "po_tax_type_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "po"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "po_tax_type" ADD CONSTRAINT "po_tax_type_tax_type_id_fkey" FOREIGN KEY ("tax_type_id") REFERENCES "tax_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "srn_tax_type" ADD CONSTRAINT "srn_tax_type_srn_id_fkey" FOREIGN KEY ("srn_id") REFERENCES "srn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "srn_tax_type" ADD CONSTRAINT "srn_tax_type_tax_type_id_fkey" FOREIGN KEY ("tax_type_id") REFERENCES "tax_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_tax_type" ADD CONSTRAINT "grn_tax_type_grn_id_fkey" FOREIGN KEY ("grn_id") REFERENCES "grn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_tax_type" ADD CONSTRAINT "grn_tax_type_tax_type_id_fkey" FOREIGN KEY ("tax_type_id") REFERENCES "tax_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
