/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `ownerEmail` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_ownerId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "ownerId",
ADD COLUMN     "ownerEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_ownerEmail_fkey" FOREIGN KEY ("ownerEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
