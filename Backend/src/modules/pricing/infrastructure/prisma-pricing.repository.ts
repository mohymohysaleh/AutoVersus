import { IPricingRepository } from '../domain/repositories/pricing-repository.interface.js';
import { VariantPriceEntity } from '../domain/entities/variant-price.entity.js';
import { PriceAlertEntity } from '../domain/entities/price-alert.entity.js';
import { PriceHistoryDto, PriceAlertDto } from '../application/dtos/pricing.dtos.js';
import { PrismaService } from '../../../shared/infrastructure/database/prisma.service.js';
import { PriceType } from '@prisma/client';

export class PrismaPricingRepository implements IPricingRepository {
  private prisma = PrismaService.getInstance();

  async findPriceHistoryByVariant(variantIdOrSlug: string): Promise<PriceHistoryDto> {
    const variant = await this.prisma.marketVariant.findFirst({
      where: {
        OR: [{ id: variantIdOrSlug }, { slug: variantIdOrSlug }],
      },
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
        prices: {
          orderBy: { recordedAt: 'desc' },
        },
      },
    });

    if (!variant) {
      const error: any = new Error(`Market variant with id or slug '${variantIdOrSlug}' was not found.`);
      error.statusCode = 404;
      throw error;
    }

    const modelName = `${variant.modelYear.generation.model.brand.name} ${variant.modelYear.generation.model.name}`;
    const trimName = `${modelName} ${variant.trimName}`;

    const msrpPrice = variant.prices.find((p) => p.priceType === PriceType.OFFICIAL_MSRP);
    const overprice = variant.prices.find((p) => p.priceType === PriceType.DEALER_OVERPRICE);

    return {
      variantId: variant.id,
      variantSlug: variant.slug,
      trimName,
      currentMSRP: msrpPrice ? Number(msrpPrice.price) : variant.startingPriceEGP ? Number(variant.startingPriceEGP) : null,
      currentOverprice: overprice ? Number(overprice.price) : null,
      history: variant.prices.map((p) => ({
        id: p.id,
        price: Number(p.price),
        currency: p.currency,
        priceType: p.priceType,
        recordedAt: p.recordedAt.toISOString(),
        sourceName: p.sourceName,
      })),
    };
  }

  async savePriceRecord(priceEntity: VariantPriceEntity): Promise<void> {
    const variant = await this.prisma.marketVariant.findFirst({
      where: {
        OR: [{ id: priceEntity.variantId }, { slug: priceEntity.variantId }],
      },
    });

    if (!variant) {
      const error: any = new Error(`Vehicle variant '${priceEntity.variantId}' was not found.`);
      error.statusCode = 404;
      throw error;
    }

    await this.prisma.variantPrice.create({
      data: {
        id: priceEntity.id,
        variantId: variant.id,
        price: priceEntity.price,
        currency: priceEntity.currency,
        priceType: priceEntity.priceType,
        recordedAt: priceEntity.recordedAt,
        sourceName: priceEntity.sourceName,
      },
    });
  }

  async savePriceAlert(alertEntity: PriceAlertEntity): Promise<PriceAlertDto> {
    const variant = await this.prisma.marketVariant.findFirst({
      where: {
        OR: [{ id: alertEntity.variantId }, { slug: alertEntity.variantId }],
      },
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
      },
    });

    if (!variant) {
      const error: any = new Error(`Vehicle variant '${alertEntity.variantId}' was not found.`);
      error.statusCode = 404;
      throw error;
    }

    const created = await this.prisma.priceAlert.create({
      data: {
        id: alertEntity.id,
        userId: alertEntity.userId,
        variantId: variant.id,
        targetPriceEGP: alertEntity.targetPrice,
        isActive: !alertEntity.isTriggered,
      },
    });

    const brand = variant.modelYear.generation.model.brand.name;
    const model = variant.modelYear.generation.model.name;
    const trim = variant.trimName;

    return {
      id: created.id,
      variantId: created.variantId,
      variantName: `${brand} ${model} ${trim}`,
      targetPrice: Number(created.targetPriceEGP),
      isTriggered: !created.isActive,
      createdAt: created.createdAt.toISOString(),
    };
  }

  async findAlertsByUser(userId: string): Promise<PriceAlertDto[]> {
    const alerts = await this.prisma.priceAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (alerts.length === 0) {
      return [];
    }

    const variantIds = Array.from(new Set(alerts.map((a) => a.variantId)));
    const variants = await this.prisma.marketVariant.findMany({
      where: { id: { in: variantIds } },
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
      },
    });

    const variantMap = new Map<string, string>();
    for (const v of variants) {
      const brand = v.modelYear.generation.model.brand.name;
      const model = v.modelYear.generation.model.name;
      const trim = v.trimName;
      variantMap.set(v.id, `${brand} ${model} ${trim}`);
    }

    return alerts.map((a) => ({
      id: a.id,
      variantId: a.variantId,
      variantName: variantMap.get(a.variantId),
      targetPrice: Number(a.targetPriceEGP),
      isTriggered: !a.isActive,
      createdAt: a.createdAt.toISOString(),
    }));
  }

  async findAlertById(id: string): Promise<PriceAlertEntity | null> {
    const alert = await this.prisma.priceAlert.findUnique({
      where: { id },
    });

    if (!alert) return null;

    return PriceAlertEntity.create(
      {
        userId: alert.userId,
        variantId: alert.variantId,
        targetPrice: Number(alert.targetPriceEGP),
        isTriggered: !alert.isActive,
        createdAt: alert.createdAt,
      },
      alert.id
    );
  }

  async deleteAlert(id: string): Promise<boolean> {
    try {
      await this.prisma.priceAlert.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
