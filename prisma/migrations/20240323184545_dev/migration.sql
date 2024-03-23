/*
  Warnings:

  - You are about to drop the column `record_id` on the `activity_type` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "activity_type" DROP COLUMN "record_id";

-- AlterTable
ALTER TABLE "user_activity" ADD COLUMN     "record_id" TEXT;
