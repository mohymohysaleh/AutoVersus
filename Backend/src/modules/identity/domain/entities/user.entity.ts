import { Entity } from '../../../../shared/domain/entity.base.js';
import { Role, Language, MeasurementSystem } from '@prisma/client';

export interface UserProps {
  email: string;
  passwordHash: string;
  name?: string | null;
  avatarUrl?: string | null;
  role: Role;
  country: string;
  preferredCurrency: string;
  preferredLang: Language;
  measurementSystem: MeasurementSystem;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserEntity extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  public static create(props: UserProps, id?: string): UserEntity {
    return new UserEntity(props, id);
  }

  get email(): string { return this.props.email; }
  get passwordHash(): string { return this.props.passwordHash; }
  get name(): string | null | undefined { return this.props.name; }
  get avatarUrl(): string | null | undefined { return this.props.avatarUrl; }
  get role(): Role { return this.props.role; }
  get country(): string { return this.props.country; }
  get preferredCurrency(): string { return this.props.preferredCurrency; }
  get preferredLang(): Language { return this.props.preferredLang; }
  get measurementSystem(): MeasurementSystem { return this.props.measurementSystem; }

  public updatePreferences(currency?: string, lang?: Language, system?: MeasurementSystem): void {
    if (currency) (this.props as any).preferredCurrency = currency;
    if (lang) (this.props as any).preferredLang = lang;
    if (system) (this.props as any).measurementSystem = system;
  }
}
