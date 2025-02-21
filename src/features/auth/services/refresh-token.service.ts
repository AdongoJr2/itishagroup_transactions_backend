import { injectable } from "inversify";
import { RefreshToken } from "../entities/refresh-token.entity";
import { Repository } from "typeorm";
import AppDataSource from "../../../config/database";

@injectable()
export class RefreshTokenService {
    private refreshTokenRepository: Repository<RefreshToken>;

    constructor() {
        this.refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
    }

    async create(token: string): Promise<RefreshToken> {
        try {
            const details = this.refreshTokenRepository.create({ token });
            const savedRecord = await this.refreshTokenRepository.save(details);
            return new RefreshToken({ ...savedRecord });
        } catch (error) {
            throw error;
        }
    }

    async findOneByToken(token: string) {
        try {
            const foundItem = await this.refreshTokenRepository.findOne({
                where: { token },
            });

            if (!foundItem) {
                return `The refresh token provided does not exist`
            }

            return foundItem;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number) {
        try {
            const result = await this.refreshTokenRepository.delete(id);
            return result;
        } catch (error) {
            throw error;
        }
    }
}