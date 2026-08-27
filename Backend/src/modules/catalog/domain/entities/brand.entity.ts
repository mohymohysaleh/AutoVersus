import { Entity } from '../../../../shared/domain/entity.base.js';

export interface BrandProps {
  name: string;
  slug: string;
  country: string;
  foundedYear?: number | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
}

export class BrandEntity extends Entity<BrandProps> {
  private constructor(props: BrandProps, id?: string) {
    super(props, id);
  }

  public static create(props: BrandProps, id?: string): BrandEntity {
    return new BrandEntity(props, id);
  }

  get name(): string { return this.props.name; }
  get slug(): string { return this.props.slug; }
  get country(): string { return this.props.country; }
  get foundedYear(): number | null | undefined { return this.props.foundedYear; }
}
