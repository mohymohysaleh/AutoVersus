import { ICatalogRepository } from '../domain/repositories/catalog-repository.interface.js';
import { BrandResponseDto, VariantDetailDto, CarSearchFilterDto } from '../application/dtos/catalog.dtos.js';
import { PrismaService } from '../../../shared/infrastructure/database/prisma.service.js';
import { VehicleBodyType } from '@prisma/client';

export class PrismaCatalogRepository implements ICatalogRepository {
  private prisma = PrismaService.getInstance();

  async findAllBrands(): Promise<BrandResponseDto[]> {
    const brands = await this.prisma.brand.findMany({
      orderBy: { name: 'asc' },
    });

    return brands.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      country: b.country,
      foundedYear: b.foundedYear,
    }));
  }

  async findVariantBySlug(slug: string): Promise<VariantDetailDto | null> {
    const variant = await this.prisma.marketVariant.findFirst({
      where: { slug },
      include: {
        modelYear: {
          include: {
            generation: {
              include: {
                model: {
                  include: {
                    brand: true,
                  },
                },
              },
            },
          },
        },
        engine: true,
        dimensions: true,
        performance: true,
        fuelEconomy: true,
        safety: true,
      },
    });

    if (!variant) return null;

    return this.mapToVariantDetailDto(variant);
  }

  async searchVehicles(filters: CarSearchFilterDto): Promise<{ items: VariantDetailDto[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { isPublished: true };

    if (filters.brandSlug) {
      where.modelYear = {
        generation: {
          model: {
            brand: {
              slug: filters.brandSlug,
            },
          },
        },
      };
    }

    if (filters.bodyType) {
      where.modelYear = {
        ...where.modelYear,
        generation: {
          ...where.modelYear?.generation,
          model: {
            ...where.modelYear?.generation?.model,
            bodyType: filters.bodyType.toUpperCase() as VehicleBodyType,
          },
        },
      };
    }

    if (filters.minPriceEGP || filters.maxPriceEGP) {
      where.startingPriceEGP = {};
      if (filters.minPriceEGP) where.startingPriceEGP.gte = filters.minPriceEGP;
      if (filters.maxPriceEGP) where.startingPriceEGP.lte = filters.maxPriceEGP;
    }

    const [variants, total] = await Promise.all([
      this.prisma.marketVariant.findMany({
        where,
        skip,
        take: limit,
        include: {
          modelYear: {
            include: {
              generation: {
                include: {
                  model: {
                    include: {
                      brand: true,
                    },
                  },
                },
              },
            },
          },
          engine: true,
          dimensions: true,
          performance: true,
          fuelEconomy: true,
          safety: true,
        },
        orderBy: { startingPriceEGP: 'asc' },
      }),
      this.prisma.marketVariant.count({ where }),
    ]);

    return {
      items: variants.map((v) => this.mapToVariantDetailDto(v)),
      total,
    };
  }

  private mapToVariantDetailDto(v: any): VariantDetailDto {
    const model = v.modelYear.generation.model;
    const brand = model.brand;
    const gen = v.modelYear.generation;

    return {
      id: v.id,
      brandName: brand.name,
      modelName: model.name,
      generationName: gen.name,
      year: v.modelYear.year,
      trimName: v.trimName,
      slug: v.slug,
      startingPriceEGP: v.startingPriceEGP ? Number(v.startingPriceEGP) : null,
      completenessScore: v.completenessScore,
      isPublished: v.isPublished,
      engine: v.engine
        ? {
            fuelType: v.engine.fuelType,
            displacementCc: v.engine.displacementCc,
            cylinders: v.engine.cylinders,
            powerKw: Number(v.engine.powerKw),
            powerHp: v.engine.powerHp,
            torqueNm: Number(v.engine.torqueNm),
            transmission: v.engine.transmission,
            drivetrain: v.engine.drivetrain,
          }
        : null,
      dimensions: v.dimensions
        ? {
            lengthMm: v.dimensions.lengthMm,
            widthMm: v.dimensions.widthMm,
            heightMm: v.dimensions.heightMm,
            wheelbaseMm: v.dimensions.wheelbaseMm,
            cargoCapacityL: v.dimensions.cargoCapacityL,
            seatingCapacity: v.dimensions.seatingCapacity,
          }
        : null,
      performance: v.performance
        ? {
            zeroToHundredKmh: v.performance.zeroToHundredKmh ? Number(v.performance.zeroToHundredKmh) : null,
            topSpeedKmh: v.performance.topSpeedKmh,
          }
        : null,
      fuelEconomy: v.fuelEconomy
        ? {
            combinedL100km: Number(v.fuelEconomy.combinedL100km),
            sourceType: v.fuelEconomy.sourceType,
          }
        : null,
      safety: v.safety
        ? {
            airbagsCount: v.safety.airbagsCount,
            hasAbs: v.safety.hasAbs,
            hasEsc: v.safety.hasEsc,
            hasAeb: v.safety.hasAeb,
          }
        : null,
    };
  }
}
