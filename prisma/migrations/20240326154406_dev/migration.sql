/*
  Warnings:

  - You are about to drop the column `rm_category_id` on the `raw_material` table. All the data in the column will be lost.
  - You are about to drop the `raw_material_category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rm_sub_category_id` to the `raw_material` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "raw_material" DROP CONSTRAINT "raw_material_rm_category_id_fkey";

-- AlterTable
ALTER TABLE "raw_material" DROP COLUMN "rm_category_id",
ADD COLUMN     "rm_sub_category_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "raw_material_category";

-- CreateTable
CREATE TABLE "rm_category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "rm_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rm_sub_category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "rm_category_id" INTEGER NOT NULL,

    CONSTRAINT "rm_sub_category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rm_sub_category" ADD CONSTRAINT "rm_sub_category_rm_category_id_fkey" FOREIGN KEY ("rm_category_id") REFERENCES "rm_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raw_material" ADD CONSTRAINT "raw_material_rm_sub_category_id_fkey" FOREIGN KEY ("rm_sub_category_id") REFERENCES "rm_sub_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
