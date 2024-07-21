-- DropForeignKey
ALTER TABLE "batch_item" DROP CONSTRAINT "batch_item_rm_id_fkey";

-- DropForeignKey
ALTER TABLE "rm_issue" DROP CONSTRAINT "rm_issue_batch_id_fkey";

-- DropForeignKey
ALTER TABLE "rm_issue_item" DROP CONSTRAINT "rm_issue_item_rm_id_fkey";

-- DropIndex
DROP INDEX "batch_item_rm_id_key";

-- DropIndex
DROP INDEX "rm_issue_batch_id_key";

-- DropIndex
DROP INDEX "rm_issue_item_rm_id_key";

-- CreateTable
CREATE TABLE "product_category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "product_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_sub_category" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "uom_id" INTEGER NOT NULL,

    CONSTRAINT "product_sub_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_costing_item" (
    "id" SERIAL NOT NULL,
    "rm_id" TEXT NOT NULL,
    "qty" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "product_costing_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "product_sub_category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "uom_id" INTEGER NOT NULL,
    "is_customized" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_price" (
    "id" SERIAL NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "reason_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "product_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_change_reason" (
    "id" SERIAL NOT NULL,
    "reason_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "price_change_reason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fg_store_item" (
    "id" SERIAL NOT NULL,
    "store_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "transfer_note_no" TEXT NOT NULL,
    "finished_by" TEXT NOT NULL,
    "qty" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "fg_store_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_product_sub_category_id_key" ON "product"("product_sub_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_price_reason_id_key" ON "product_price"("reason_id");

-- AddForeignKey
ALTER TABLE "product_sub_category" ADD CONSTRAINT "product_sub_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_sub_category" ADD CONSTRAINT "product_sub_category_uom_id_fkey" FOREIGN KEY ("uom_id") REFERENCES "uom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_costing_item" ADD CONSTRAINT "product_costing_item_rm_id_fkey" FOREIGN KEY ("rm_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_product_sub_category_id_fkey" FOREIGN KEY ("product_sub_category_id") REFERENCES "product_sub_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_price" ADD CONSTRAINT "product_price_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_price" ADD CONSTRAINT "product_price_reason_id_fkey" FOREIGN KEY ("reason_id") REFERENCES "price_change_reason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fg_store_item" ADD CONSTRAINT "fg_store_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fg_store_item" ADD CONSTRAINT "fg_store_item_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fg_store_item" ADD CONSTRAINT "fg_store_item_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
