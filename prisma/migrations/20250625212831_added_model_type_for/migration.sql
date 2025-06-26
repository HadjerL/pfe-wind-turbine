/*
  Warnings:

  - Added the required column `modelType` to the `ForecastModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ForecastModel" ADD COLUMN     "modelType" TEXT NOT NULL;
