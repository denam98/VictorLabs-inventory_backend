/*
  Warnings:

  - The primary key for the `raw_material` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `supplier` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "rm_supplier" DROP CONSTRAINT "rm_supplier_rm_id_fkey";

-- DropForeignKey
ALTER TABLE "rm_supplier" DROP CONSTRAINT "rm_supplier_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "supplier_contact" DROP CONSTRAINT "supplier_contact_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "sys_login" DROP CONSTRAINT "sys_login_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_activity" DROP CONSTRAINT "user_activity_user_id_fkey";

-- AlterTable
ALTER TABLE "raw_material" DROP CONSTRAINT "raw_material_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "raw_material_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "raw_material_id_seq";

-- AlterTable
ALTER TABLE "rm_supplier" ALTER COLUMN "rm_id" SET DATA TYPE TEXT,
ALTER COLUMN "supplier_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "supplier" DROP CONSTRAINT "supplier_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "supplier_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "supplier_id_seq";

-- AlterTable
ALTER TABLE "supplier_contact" ALTER COLUMN "supplier_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "sys_login" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "user" DROP CONSTRAINT "user_pkey",
ALTER COLUMN "user_id" DROP DEFAULT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("user_id");
DROP SEQUENCE "user_user_id_seq";

-- AlterTable
ALTER TABLE "user_activity" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "sys_login" ADD CONSTRAINT "sys_login_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_contact" ADD CONSTRAINT "supplier_contact_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rm_supplier" ADD CONSTRAINT "rm_supplier_rm_id_fkey" FOREIGN KEY ("rm_id") REFERENCES "raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rm_supplier" ADD CONSTRAINT "rm_supplier_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
