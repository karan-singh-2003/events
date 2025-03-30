/*
  Warnings:

  - You are about to drop the column `universityId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_universityId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "universityId",
ADD COLUMN     "Id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_Id_key" ON "User"("Id");
