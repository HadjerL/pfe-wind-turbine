-- CreateTable
CREATE TABLE "ClassificationModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "modelType" TEXT NOT NULL,
    "architecture" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "hyperparameters" JSONB NOT NULL,
    "evaluation" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassificationModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForecastModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "architecture" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "hyperparameters" JSONB NOT NULL,
    "evaluation" JSONB NOT NULL,
    "forecastHorizon" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForecastModel_pkey" PRIMARY KEY ("id")
);
