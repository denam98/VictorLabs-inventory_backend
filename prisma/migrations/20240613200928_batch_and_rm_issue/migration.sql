-- CreateTable
CREATE TABLE "batch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_complete" BOOLEAN NOT NULL,

    CONSTRAINT "batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_item" (
    "id" SERIAL NOT NULL,
    "batch_id" TEXT NOT NULL,
    "rm_id" TEXT NOT NULL,
    "qty" DECIMAL(65,30) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "batch_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rm_issue" (
    "id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "issue_note_no" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "rm_issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rm_issue_item" (
    "id" SERIAL NOT NULL,
    "rm_issue_id" TEXT NOT NULL,
    "rm_id" TEXT NOT NULL,
    "qty" DECIMAL(65,30) NOT NULL,
    "issue_to" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "rm_issue_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "batch_item_rm_id_key" ON "batch_item"("rm_id");

-- CreateIndex
CREATE UNIQUE INDEX "rm_issue_batch_id_key" ON "rm_issue"("batch_id");

-- CreateIndex
CREATE UNIQUE INDEX "rm_issue_item_rm_id_key" ON "rm_issue_item"("rm_id");

-- AddForeignKey
ALTER TABLE "batch_item" ADD CONSTRAINT "batch_item_rm_id_fkey" FOREIGN KEY ("rm_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_item" ADD CONSTRAINT "batch_item_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rm_issue" ADD CONSTRAINT "rm_issue_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rm_issue_item" ADD CONSTRAINT "rm_issue_item_rm_id_fkey" FOREIGN KEY ("rm_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rm_issue_item" ADD CONSTRAINT "rm_issue_item_rm_issue_id_fkey" FOREIGN KEY ("rm_issue_id") REFERENCES "rm_issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
