/*
  Warnings:

  - You are about to drop the column `links` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "links" TEXT[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "links";
