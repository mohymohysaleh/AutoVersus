import { PriceType } from '@prisma/client';

export interface PricePointDto {
  id: string;
  price: number;
  currency: string;
  priceType: PriceType;
  recordedAt: string;
  sourceName: string | null;
}

export interface PriceHistoryDto {
  variantId: string;
  variantSlug: string;
  trimName: string;
  currentMSRP: number | null;
  currentOverprice: number | null;
  history: PricePointDto[];
}

export interface RecordPriceDto {
  variantId: string;
  price: number;
  currency?: string;
  priceType: PriceType;
  sourceName?: string;
}

export interface CreatePriceAlertDto {
  variantId: string;
  targetPrice: number;
}

export interface PriceAlertDto {
  id: string;
  variantId: string;
  variantName?: string;
  targetPrice: number;
  isTriggered: boolean;
  createdAt: string;
}
