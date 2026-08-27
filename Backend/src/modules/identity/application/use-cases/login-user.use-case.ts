import { IUserRepository } from '../../domain/repositories/user-repository.interface.js';
import { IPasswordHasher } from '../ports/password-hasher.interface.js';
import { ITokenService } from '../ports/token-service.interface.js';
import { LoginUserDto, AuthTokensDto, UserProfileDto } from '../dtos/auth.dtos.js';

export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private tokenService: ITokenService
  ) {}

  async execute(dto: LoginUserDto): Promise<{ user: UserProfileDto; tokens: AuthTokensDto }> {
    const user = await this.userRepository.findByEmail(dto.email.toLowerCase().trim());
    if (!user) {
      const error: any = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isValidPassword = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!isValidPassword) {
      const error: any = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const tokens = this.tokenService.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name || null,
        avatarUrl: user.avatarUrl || null,
        role: user.role,
        country: user.country,
        preferredCurrency: user.preferredCurrency,
        preferredLang: user.preferredLang,
        measurementSystem: user.measurementSystem,
      },
      tokens,
    };
  }
}
