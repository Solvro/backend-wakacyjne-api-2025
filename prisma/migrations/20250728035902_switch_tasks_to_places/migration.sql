/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_ownerEmail_fkey";

-- DropTable
DROP TABLE "Task";

-- CreateTable
CREATE TABLE "Place" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "ownerEmail" TEXT NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_ownerEmail_fkey" FOREIGN KEY ("ownerEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
