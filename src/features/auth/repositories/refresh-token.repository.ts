import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import AppDataSource from '../../../config/database';

export class RefreshTokenRepository {
  private repository: Repository<RefreshToken>;

  constructor() {
    this.repository = AppDataSource.getRepository(RefreshToken);
  }

  async save(details: Partial<RefreshToken>): Promise<RefreshToken> {
    const newRecord = this.repository.create(details);
    return this.repository.save(newRecord);
  }
}