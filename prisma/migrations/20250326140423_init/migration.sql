/*
  Warnings:

  - You are about to drop the column `canCreate` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "canCreate",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
