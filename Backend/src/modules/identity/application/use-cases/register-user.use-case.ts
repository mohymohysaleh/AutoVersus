import { IUserRepository } from '../../domain/repositories/user-repository.interface.js';
import { IPasswordHasher } from '../ports/password-hasher.interface.js';
import { ITokenService } from '../ports/token-service.interface.js';
import { RegisterUserDto, AuthTokensDto, UserProfileDto } from '../dtos/auth.dtos.js';
import { UserEntity } from '../../domain/entities/user.entity.js';
import { Role, Language, MeasurementSystem } from '@prisma/client';

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private tokenService: ITokenService
  ) {}

  async execute(dto: RegisterUserDto): Promise<{ user: UserProfileDto; tokens: AuthTokensDto }> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      const error: any = new Error(`User with email '${dto.email}' already exists.`);
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);

    const user = UserEntity.create({
      email: dto.email.toLowerCase().trim(),
      passwordHash,
      name: dto.name || null,
      role: Role.USER,
      country: dto.country || 'EG',
      preferredCurrency: dto.preferredCurrency || 'EGP',
      preferredLang: dto.preferredLang || Language.EN,
      measurementSystem: dto.measurementSystem || MeasurementSystem.METRIC,
    });

    const savedUser = await this.userRepository.save(user);

    const tokens = this.tokenService.generateTokens({
      userId: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    });

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name || null,
        avatarUrl: savedUser.avatarUrl || null,
        role: savedUser.role,
        country: savedUser.country,
        preferredCurrency: savedUser.preferredCurrency,
        preferredLang: savedUser.preferredLang,
        measurementSystem: savedUser.measurementSystem,
      },
      tokens,
    };
  }
}
