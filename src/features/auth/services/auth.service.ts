import { inject, injectable } from "inversify";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../../users/entities/user.entity";
import { UserService } from "../../users/services/user.service";
import * as bcrypt from 'bcrypt';
import { instanceToPlain } from "class-transformer";
import * as jwt from 'jsonwebtoken';
import { LoginUserDto } from "../dto/login-user.dto";
import { TokenUserData } from "../../../core/types/token-user-data";
import { RefreshTokenService } from "./refresh-token.service";
import logger from "../../../utils/logger/logger";

@injectable()
export class AuthService {
    constructor(
        @inject(UserService) private userService: UserService,
        @inject(RefreshTokenService) private refreshTokenService: RefreshTokenService,
    ) { }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            const newRecord = await this.userService.createUser(createUserDto);
            return instanceToPlain(new User({ ...newRecord })) as User
        } catch (error) {
            throw error;
        }
    }

    async hashPassword(rawPassword: string) {
        try {
            const hashedPassword = await bcrypt.hash(rawPassword, 10);
            return hashedPassword;
        } catch (error) {
            throw error;
        }
    }

    async validateUser(
        loginUserDetails: Pick<LoginUserDto, 'email' | 'password'>,
    ): Promise<TokenUserData | null> {
        try {
            const foundUser = await this.userService.findOneByEmail(
                loginUserDetails.email,
            );

            logger.info(JSON.stringify(loginUserDetails?.password, null, 2))
            logger.info(JSON.stringify(foundUser, null, 2))

            const isPasswordCorrect = await bcrypt.compare(
                loginUserDetails?.password,
                foundUser.password,
            );

            logger.info(`Is password correct :: ${isPasswordCorrect}`)

            if (!isPasswordCorrect) {
                return null;
            }

            const user: TokenUserData = {
                id: foundUser.id,
            };

            return user;
        } catch (error) {
            return null;
        }
    }

    async login(
        tokenUserData: TokenUserData,
    ) {
        try {
            const authTokens = await this.generateAuthTokens(
                tokenUserData,
            );

            await this.refreshTokenService.create(authTokens.refreshToken);

            return authTokens;
        } catch (error) {
            throw error;
        }
    }

    async generateAuthTokens(
        { id, ...rest }: TokenUserData,
    ) {
        try {
            const payload = {
                sub: id,
                ...rest,
            };

            const [accessToken, refreshToken] = await Promise.all([
                jwt.sign(
                    payload,
                    process.env.ACCESS_TOKEN_SECRET as string,
                    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIMESPAN as any },
                ),

                jwt.sign(
                    payload,
                    <string>process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIMESPAN as any }
                ),
            ]);

            return { accessToken, refreshToken };
        } catch (error) {
            throw error;
        }
    }
}