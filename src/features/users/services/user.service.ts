import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import AppDataSource from "../../../config/database";
import { injectable } from "inversify";
import { CreateUserDto } from "../../auth/dto/create-user.dto";

@injectable()
export class UserService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            const details = this.userRepository.create({ ...createUserDto, wallet: { balance: 50 } });
            const savedRecord = await this.userRepository.save(details);
            return new User({ ...savedRecord });
        } catch (error) {
            throw error;
        }
    }

    async findOne(id: number) {
        try {
            const foundUser = await this.userRepository.findOne({
                where: { id },
                relations: {
                    wallet: true,
                },
                select: {
                    wallet: {
                        id: true,
                        balance: true,
                    },
                },
            });

            if (!foundUser) {
                throw 'user not found'
            }

            return foundUser;
        } catch (error) {
            throw error;
        }
    }

    async findOneByEmail(email: string) {
        try {
            const foundUser = await this.userRepository.findOne({
                where: { email },
            });

            if (!foundUser) {
                throw `User not found`;
            }

            return foundUser;
        } catch (error) {
            throw error;
        }
    }
}