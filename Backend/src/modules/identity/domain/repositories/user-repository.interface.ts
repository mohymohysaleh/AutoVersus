import { UserEntity } from '../entities/user.entity.js';
import { UserProfileDto, UpdatePreferencesDto } from '../../application/dtos/auth.dtos.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<UserEntity>;
  updatePreferences(userId: string, dto: UpdatePreferencesDto): Promise<UserProfileDto>;
}
