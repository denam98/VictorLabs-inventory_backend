-- CreateTable
CREATE TABLE "priority" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "priority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prn" (
    "id" TEXT NOT NULL,
    "requested_by" TEXT,
    "remark" TEXT,
    "approved_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "priority_id" INTEGER NOT NULL,

    CONSTRAINT "prn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prn_item" (
    "id" TEXT NOT NULL,
    "qty" DECIMAL(65,30) NOT NULL,
    "ordered_qty" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "estimated_price_per_unit" DECIMAL(65,30) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "prn_id" TEXT NOT NULL,
    "rm_id" TEXT NOT NULL,

    CONSTRAINT "prn_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "po" (
    "id" TEXT NOT NULL,
    "special_note" TEXT,
    "delivery_location" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "discount_type" TEXT NOT NULL,
    "discount" DECIMAL(65,30) NOT NULL,
    "supplier_id" TEXT NOT NULL,

    CONSTRAINT "po_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "po_item" (
    "id" TEXT NOT NULL,
    "qty" DECIMAL(65,30) NOT NULL,
    "price_per_unit" DECIMAL(65,30) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "po_id" TEXT NOT NULL,
    "rm_id" TEXT NOT NULL,

    CONSTRAINT "po_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prn_item_po_item" (
    "id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "prn_item_id" TEXT NOT NULL,
    "po_item_id" TEXT NOT NULL,

    CONSTRAINT "prn_item_po_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "prn" ADD CONSTRAINT "prn_priority_id_fkey" FOREIGN KEY ("priority_id") REFERENCES "priority"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prn_item" ADD CONSTRAINT "prn_item_prn_id_fkey" FOREIGN KEY ("prn_id") REFERENCES "prn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prn_item" ADD CONSTRAINT "prn_item_rm_id_fkey" FOREIGN KEY ("rm_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "po" ADD CONSTRAINT "po_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "po_item" ADD CONSTRAINT "po_item_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "po"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "po_item" ADD CONSTRAINT "po_item_rm_id_fkey" FOREIGN KEY ("rm_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prn_item_po_item" ADD CONSTRAINT "prn_item_po_item_prn_item_id_fkey" FOREIGN KEY ("prn_item_id") REFERENCES "prn_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prn_item_po_item" ADD CONSTRAINT "prn_item_po_item_po_item_id_fkey" FOREIGN KEY ("po_item_id") REFERENCES "po_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
