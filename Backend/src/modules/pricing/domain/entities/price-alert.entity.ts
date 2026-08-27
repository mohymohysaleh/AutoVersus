import { Entity } from '../../../../shared/domain/entity.base.js';

export interface PriceAlertProps {
  userId: string;
  variantId: string;
  targetPrice: number;
  isTriggered: boolean;
  createdAt?: Date;
}

export class PriceAlertEntity extends Entity<PriceAlertProps> {
  private constructor(props: PriceAlertProps, id?: string) {
    super(props, id);
  }

  public static create(props: PriceAlertProps, id?: string): PriceAlertEntity {
    return new PriceAlertEntity(props, id);
  }

  get userId(): string { return this.props.userId; }
  get variantId(): string { return this.props.variantId; }
  get targetPrice(): number { return this.props.targetPrice; }
  get isTriggered(): boolean { return this.props.isTriggered; }

  public trigger(): void {
    (this.props as any).isTriggered = true;
  }
}
