/*
  Warnings:

  - You are about to drop the column `conflictvValue` on the `data_conflicts` table. All the data in the column will be lost.
  - Added the required column `conflictValue` to the `data_conflicts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "data_conflicts" DROP COLUMN "conflictvValue",
ADD COLUMN     "conflictValue" TEXT NOT NULL;
