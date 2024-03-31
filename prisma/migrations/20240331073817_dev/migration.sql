/*
  Warnings:

  - You are about to drop the column `rm_sub_category_id` on the `raw_material` table. All the data in the column will be lost.
  - You are about to drop the `rm_sub_category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rm_category_id` to the `raw_material` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "raw_material" DROP CONSTRAINT "raw_material_rm_sub_category_id_fkey";

-- DropForeignKey
ALTER TABLE "rm_sub_category" DROP CONSTRAINT "rm_sub_category_rm_category_id_fkey";

-- AlterTable
ALTER TABLE "raw_material" DROP COLUMN "rm_sub_category_id",
ADD COLUMN     "rm_category_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "supplier_contact" ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Denam';

-- DropTable
DROP TABLE "rm_sub_category";

-- AddForeignKey
ALTER TABLE "raw_material" ADD CONSTRAINT "raw_material_rm_category_id_fkey" FOREIGN KEY ("rm_category_id") REFERENCES "rm_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
