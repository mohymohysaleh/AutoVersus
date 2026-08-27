-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'NEWS_EDITOR', 'CONTENT_DATA_EDITOR', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'AR');

-- CreateEnum
CREATE TYPE "MeasurementSystem" AS ENUM ('METRIC', 'IMPERIAL');

-- CreateEnum
CREATE TYPE "VehicleBodyType" AS ENUM ('SEDAN', 'SUV', 'CROSSOVER', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'WAGON', 'PICKUP', 'VAN', 'MPV', 'EV');

-- CreateEnum
CREATE TYPE "MarketCode" AS ENUM ('EG', 'SA', 'AE', 'GLOBAL');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('PETROL', 'DIESEL', 'HYBRID', 'PLUG_IN_HYBRID', 'ELECTRIC');

-- CreateEnum
CREATE TYPE "TransmissionType" AS ENUM ('MANUAL', 'AUTOMATIC', 'CVT', 'DCT', 'SINGLE_SPEED_EV');

-- CreateEnum
CREATE TYPE "Drivetrain" AS ENUM ('FWD', 'RWD', 'AWD', 'FOUR_WD');

-- CreateEnum
CREATE TYPE "FuelReadingSource" AS ENUM ('OFFICIAL_CYCLE', 'ESTIMATED', 'OWNER_REPORTED');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('OFFICIAL_MSRP', 'DEALER_OVERPRICE', 'MARKET_AVERAGE', 'PROMOTIONAL');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "country" TEXT NOT NULL DEFAULT 'EG',
    "preferredCurrency" TEXT NOT NULL DEFAULT 'EGP',
    "preferredLang" "Language" NOT NULL DEFAULT 'EN',
    "measurementSystem" "MeasurementSystem" NOT NULL DEFAULT 'METRIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "logoUrl" TEXT,
    "foundedYear" INTEGER,
    "websiteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_models" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bodyType" "VehicleBodyType" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "car_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generations" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "internalCode" TEXT,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_years" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "isFacelift" BOOLEAN NOT NULL DEFAULT false,
    "changesSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "model_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_variants" (
    "id" TEXT NOT NULL,
    "modelYearId" TEXT NOT NULL,
    "market" "MarketCode" NOT NULL DEFAULT 'EG',
    "trimName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "startingPriceEGP" DECIMAL(12,2),
    "completenessScore" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engine_specs" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "engineCode" TEXT,
    "fuelType" "FuelType" NOT NULL,
    "displacementCc" INTEGER,
    "cylinders" INTEGER,
    "aspiration" TEXT,
    "powerKw" DECIMAL(7,2) NOT NULL,
    "powerHp" INTEGER NOT NULL,
    "torqueNm" DECIMAL(7,2) NOT NULL,
    "transmission" "TransmissionType" NOT NULL,
    "gearsCount" INTEGER,
    "drivetrain" "Drivetrain" NOT NULL DEFAULT 'FWD',
    "batteryCapacityKwh" DECIMAL(6,2),
    "electricRangeKm" INTEGER,

    CONSTRAINT "engine_specs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dimension_specs" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "lengthMm" INTEGER NOT NULL,
    "widthMm" INTEGER NOT NULL,
    "heightMm" INTEGER NOT NULL,
    "wheelbaseMm" INTEGER NOT NULL,
    "groundClearanceMm" INTEGER,
    "cargoCapacityL" INTEGER NOT NULL,
    "fuelTankCapacityL" INTEGER,
    "seatingCapacity" INTEGER NOT NULL DEFAULT 5,
    "curbWeightKg" INTEGER,

    CONSTRAINT "dimension_specs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_specs" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "zeroToHundredKmh" DECIMAL(4,2),
    "topSpeedKmh" INTEGER,
    "brakingDistanceM" DECIMAL(4,2),

    CONSTRAINT "performance_specs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fuel_economy_specs" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "cityL100km" DECIMAL(4,2),
    "highwayL100km" DECIMAL(4,2),
    "combinedL100km" DECIMAL(4,2) NOT NULL,
    "sourceType" "FuelReadingSource" NOT NULL DEFAULT 'OFFICIAL_CYCLE',

    CONSTRAINT "fuel_economy_specs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safety_specs" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "airbagsCount" INTEGER NOT NULL DEFAULT 2,
    "hasAbs" BOOLEAN NOT NULL DEFAULT true,
    "hasEsc" BOOLEAN NOT NULL DEFAULT true,
    "hasBlindSpot" BOOLEAN NOT NULL DEFAULT false,
    "hasLaneKeepAssist" BOOLEAN NOT NULL DEFAULT false,
    "hasAdaptiveCruise" BOOLEAN NOT NULL DEFAULT false,
    "hasAeb" BOOLEAN NOT NULL DEFAULT false,
    "parkingSensors" TEXT,
    "euroNcapStars" INTEGER,

    CONSTRAINT "safety_specs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features_equipment" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "touchscreenInches" DECIMAL(3,1),
    "hasAppleCarPlay" BOOLEAN NOT NULL DEFAULT false,
    "hasAndroidAuto" BOOLEAN NOT NULL DEFAULT false,
    "hasWirelessCharging" BOOLEAN NOT NULL DEFAULT false,
    "hasSunroof" BOOLEAN NOT NULL DEFAULT false,
    "hasPanoramicRoof" BOOLEAN NOT NULL DEFAULT false,
    "climateControlZones" INTEGER NOT NULL DEFAULT 1,
    "seatMaterial" TEXT,
    "hasVentilatedSeats" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "features_equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variant_prices" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "priceType" "PriceType" NOT NULL DEFAULT 'OFFICIAL_MSRP',
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourceName" TEXT,

    CONSTRAINT "variant_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_sources" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "confidenceScore" INTEGER NOT NULL DEFAULT 90,
    "verifiedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_conflicts" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "existingValue" TEXT NOT NULL,
    "conflictvValue" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_conflicts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "contentHtml" TEXT NOT NULL,
    "coverImage" TEXT,
    "authorId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_comparisons" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "variantIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_alerts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "targetPriceEGP" DECIMAL(12,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "car_models_brandId_slug_key" ON "car_models"("brandId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "model_years_generationId_year_key" ON "model_years"("generationId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "market_variants_modelYearId_market_slug_key" ON "market_variants"("modelYearId", "market", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "engine_specs_variantId_key" ON "engine_specs"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "dimension_specs_variantId_key" ON "dimension_specs"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "performance_specs_variantId_key" ON "performance_specs"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "fuel_economy_specs_variantId_key" ON "fuel_economy_specs"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "safety_specs_variantId_key" ON "safety_specs"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "features_equipment_variantId_key" ON "features_equipment"("variantId");

-- CreateIndex
CREATE INDEX "variant_prices_variantId_recordedAt_idx" ON "variant_prices"("variantId", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "news_articles_slug_key" ON "news_articles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorites_userId_variantId_key" ON "user_favorites"("userId", "variantId");

-- AddForeignKey
ALTER TABLE "car_models" ADD CONSTRAINT "car_models_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generations" ADD CONSTRAINT "generations_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "car_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_years" ADD CONSTRAINT "model_years_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "generations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_variants" ADD CONSTRAINT "market_variants_modelYearId_fkey" FOREIGN KEY ("modelYearId") REFERENCES "model_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engine_specs" ADD CONSTRAINT "engine_specs_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "market_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dimension_specs" ADD CONSTRAINT "dimension_specs_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "market_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_specs" ADD CONSTRAINT "performance_specs_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "market_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fuel_economy_specs" ADD CONSTRAINT "fuel_economy_specs_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "market_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safety_specs" ADD CONSTRAINT "safety_specs_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "market_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features_equipment" ADD CONSTRAINT "features_equipment_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "market_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_prices" ADD CONSTRAINT "variant_prices_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "market_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_sources" ADD CONSTRAINT "data_sources_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "market_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_sources" ADD CONSTRAINT "data_sources_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_conflicts" ADD CONSTRAINT "data_conflicts_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "market_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_articles" ADD CONSTRAINT "news_articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "market_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_comparisons" ADD CONSTRAINT "saved_comparisons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
