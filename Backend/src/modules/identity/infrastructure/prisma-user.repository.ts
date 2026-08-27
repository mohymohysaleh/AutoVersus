import { IUserRepository } from '../domain/repositories/user-repository.interface.js';
import { UserEntity } from '../domain/entities/user.entity.js';
import { UserProfileDto, UpdatePreferencesDto } from '../application/dtos/auth.dtos.js';
import { PrismaService } from '../../../shared/infrastructure/database/prisma.service.js';

export class PrismaUserRepository implements IUserRepository {
  private prisma = PrismaService.getInstance();

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
        country: user.country,
        preferredCurrency: user.preferredCurrency,
        preferredLang: user.preferredLang,
        measurementSystem: user.measurementSystem,
      },
    });
    return this.mapToEntity(created);
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto): Promise<UserProfileDto> {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.preferredCurrency && { preferredCurrency: dto.preferredCurrency }),
        ...(dto.preferredLang && { preferredLang: dto.preferredLang }),
        ...(dto.measurementSystem && { measurementSystem: dto.measurementSystem }),
      },
    });

    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      avatarUrl: updated.avatarUrl,
      role: updated.role,
      country: updated.country,
      preferredCurrency: updated.preferredCurrency,
      preferredLang: updated.preferredLang,
      measurementSystem: updated.measurementSystem,
    };
  }

  private mapToEntity(u: any): UserEntity {
    return UserEntity.create(
      {
        email: u.email,
        passwordHash: u.passwordHash,
        name: u.name,
        avatarUrl: u.avatarUrl,
        role: u.role,
        country: u.country,
        preferredCurrency: u.preferredCurrency,
        preferredLang: u.preferredLang,
        measurementSystem: u.measurementSystem,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      },
      u.id
    );
  }
}
