/*
  Warnings:

  - Added the required column `workplaceId` to the `WaitingQueue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WaitingQueue" ADD COLUMN     "workplaceId" INTEGER NOT NULL;
