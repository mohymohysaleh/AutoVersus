import { IUserRepository } from '../../domain/repositories/user-repository.interface.js';
import { UserProfileDto } from '../dtos/auth.dtos.js';

export class GetUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserProfileDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error: any = new Error('User profile not found.');
      error.statusCode = 404;
      throw error;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name || null,
      avatarUrl: user.avatarUrl || null,
      role: user.role,
      country: user.country,
      preferredCurrency: user.preferredCurrency,
      preferredLang: user.preferredLang,
      measurementSystem: user.measurementSystem,
    };
  }
}
