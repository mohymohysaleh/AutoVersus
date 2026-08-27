/// <reference types="node" />
import { PrismaClient, VehicleBodyType, MarketCode, FuelType, TransmissionType, Drivetrain, FuelReadingSource } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting AutoVersus Egyptian Market Seed...");

    // 1. Seed Brands
    const toyota = await prisma.brand.upsert({
        where: { slug: "toyota" },
        update: {},
        create: {
            name: "Toyota",
            slug: "toyota",
            country: "Japan",
            foundedYear: 1937,
        },
    });

    const hyundai = await prisma.brand.upsert({
        where: { slug: "hyundai" },
        update: {},
        create: {
            name: "Hyundai",
            slug: "hyundai",
            country: "South Korea",
            foundedYear: 1967,
        },
    });

    // 2. Models
    const corollaModel = await prisma.carModel.upsert({
        where: { brandId_slug: { brandId: toyota.id, slug: "corolla" } },
        update: {},
        create: {
            brandId: toyota.id,
            name: "Corolla",
            slug: "corolla",
            bodyType: VehicleBodyType.SEDAN,
        },
    });

    const elantraModel = await prisma.carModel.upsert({
        where: { brandId_slug: { brandId: hyundai.id, slug: "elantra" } },
        update: {},
        create: {
            brandId: hyundai.id,
            name: "Elantra",
            slug: "elantra",
            bodyType: VehicleBodyType.SEDAN,
        },
    });

    // 3. Generations
    const corollaGen = await prisma.generation.create({
        data: {
            modelId: corollaModel.id,
            name: "E210 (12th Gen)",
            internalCode: "E210",
            startYear: 2019,
        },
    });

    const elantraGen = await prisma.generation.create({
        data: {
            modelId: elantraModel.id,
            name: "CN7 (7th Gen)",
            internalCode: "CN7",
            startYear: 2021,
        },
    });

    // 4. Model Years
    const corolla2026 = await prisma.modelYear.create({
        data: {
            generationId: corollaGen.id,
            year: 2026,
        },
    });

    const elantra2026 = await prisma.modelYear.create({
        data: {
            generationId: elantraGen.id,
            year: 2026,
        },
    });

    // 5. Market Variants with Normalized Specs (Rule 7: kW, Nm, mm, Liters)
    await prisma.marketVariant.create({
        data: {
            modelYearId: corolla2026.id,
            market: MarketCode.EG,
            trimName: "Comfort",
            slug: "comfort",
            startingPriceEGP: 1450000,
            completenessScore: 95,
            isPublished: true,
            engine: {
                create: {
                    fuelType: FuelType.PETROL,
                    displacementCc: 1598,
                    cylinders: 4,
                    aspiration: "Naturally Aspirated",
                    powerKw: 88.0,   // ~120 HP
                    powerHp: 120,
                    torqueNm: 154.0,
                    transmission: TransmissionType.CVT,
                    drivetrain: Drivetrain.FWD,
                },
            },
            dimensions: {
                create: {
                    lengthMm: 4630,
                    widthMm: 1780,
                    heightMm: 1435,
                    wheelbaseMm: 2700,
                    cargoCapacityL: 470,
                    seatingCapacity: 5,
                },
            },
            performance: {
                create: {
                    zeroToHundredKmh: 11.0,
                    topSpeedKmh: 190,
                },
            },
            fuelEconomy: {
                create: {
                    combinedL100km: 6.8,
                    sourceType: FuelReadingSource.OFFICIAL_CYCLE,
                },
            },
            safety: {
                create: {
                    airbagsCount: 6,
                    hasAbs: true,
                    hasEsc: true,
                    hasAeb: true,
                },
            },
        },
    });

    await prisma.marketVariant.create({
        data: {
            modelYearId: elantra2026.id,
            market: MarketCode.EG,
            trimName: "Smart",
            slug: "smart",
            startingPriceEGP: 1400000,
            completenessScore: 95,
            isPublished: true,
            engine: {
                create: {
                    fuelType: FuelType.PETROL,
                    displacementCc: 1591,
                    cylinders: 4,
                    aspiration: "Naturally Aspirated",
                    powerKw: 93.0,   // ~126 HP
                    powerHp: 126,
                    torqueNm: 155.0,
                    transmission: TransmissionType.AUTOMATIC,
                    gearsCount: 6,
                    drivetrain: Drivetrain.FWD,
                },
            },
            dimensions: {
                create: {
                    lengthMm: 4675,
                    widthMm: 1825,
                    heightMm: 1430,
                    wheelbaseMm: 2720,
                    cargoCapacityL: 474,
                    seatingCapacity: 5,
                },
            },
            performance: {
                create: {
                    zeroToHundredKmh: 11.3,
                    topSpeedKmh: 195,
                },
            },
            fuelEconomy: {
                create: {
                    combinedL100km: 7.0,
                    sourceType: FuelReadingSource.OFFICIAL_CYCLE,
                },
            },
            safety: {
                create: {
                    airbagsCount: 4,
                    hasAbs: true,
                    hasEsc: true,
                    hasAeb: false,
                },
            },
        },
    });

    console.log("✅ Seed completed successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });