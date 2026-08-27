import { Entity } from '../../../../shared/domain/entity.base.js';
import { PriceType } from '@prisma/client';

export interface VariantPriceProps {
  variantId: string;
  price: number;
  currency: string;
  priceType: PriceType;
  recordedAt?: Date;
  sourceName?: string | null;
}

export class VariantPriceEntity extends Entity<VariantPriceProps> {
  private constructor(props: VariantPriceProps, id?: string) {
    super(props, id);
  }

  public static create(props: VariantPriceProps, id?: string): VariantPriceEntity {
    return new VariantPriceEntity(props, id);
  }

  get variantId(): string { return this.props.variantId; }
  get price(): number { return this.props.price; }
  get currency(): string { return this.props.currency; }
  get priceType(): PriceType { return this.props.priceType; }
  get recordedAt(): Date { return this.props.recordedAt || new Date(); }
  get sourceName(): string | null | undefined { return this.props.sourceName; }
}
