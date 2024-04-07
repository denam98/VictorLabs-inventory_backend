/*
  Warnings:

  - Added the required column `prn_no` to the `prn` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prn" ADD COLUMN     "prn_no" BIGINT NOT NULL;
