import { inject, injectable } from "inversify";
import { Body, Controller, Post, Res, Route, SuccessResponse, Tags, TsoaResponse } from "tsoa";
import { ApiResponseService } from "../../_common/services/api-response.service";
import { APIResponseBodyStatus } from "../../../core/types/api-response-body-status";
import { UserService } from "../../users/services/user.service";
import { AuthService } from "../services/auth.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { APIResponseBodyDTO } from "../../../core/types/api-response-body.dto";
import { validateDto } from "../../../utils/exceptions/validation-errors";
import { LoginUserDto } from "../dto/login-user.dto";
import { RefreshTokenService } from "../services/refresh-token.service";

@Tags("Auth")
@Route('auth')
@injectable()
export class AuthController extends Controller {
    private authService: AuthService
    private userService: UserService
    private refreshTokenService: RefreshTokenService
    private apiResponseService: ApiResponseService

    constructor(
        // @inject(AuthService) private authService: AuthService,
        // @inject(UserService) private userService: UserService,
        // @inject(ApiResponseService) private apiResponseService: ApiResponseService,
    ) {
        super();
        this.apiResponseService = new ApiResponseService()
        this.userService = new UserService()
        this.refreshTokenService = new RefreshTokenService()
        this.authService = new AuthService(this.userService, this.refreshTokenService)
    }

    /**
     * User Signup 
     */
    @Post("signup")
    @SuccessResponse(200, 'User Created')
    public async signup(
        @Body() createUserDto: CreateUserDto,
        @Res() success: TsoaResponse<200, APIResponseBodyDTO>,
        @Res() badRequest: TsoaResponse<400, APIResponseBodyDTO>,
        @Res() unknownError: TsoaResponse<500, APIResponseBodyDTO>,
    ) {
        try {
            const validationErrorsFormatted = await validateDto(CreateUserDto, createUserDto)
            if (validationErrorsFormatted?.length) {
                return badRequest(400, this.apiResponseService.getResponseBody({
                    status: APIResponseBodyStatus.ERROR,
                    message: `Invalid input`,
                    data: validationErrorsFormatted,
                }))
            }

            const hashedPassword = await this.authService.hashPassword(
                createUserDto.password,
            );
            createUserDto.password = hashedPassword;

            const createdUser = await this.authService.createUser(createUserDto);

            const responseBody = this.apiResponseService.getResponseBody({
                status: APIResponseBodyStatus.SUCCESS,
                message: `User registered successfully`,
                data: createdUser,
            });

            return success(200, responseBody);
        } catch (error) {
            return unknownError(500, this.apiResponseService.getResponseBody({
                status: APIResponseBodyStatus.ERROR,
                message: `An unknown error occurred`,
            }))
        }
    }

    /**
     * User Login 
     */
    @Post("login")
    @SuccessResponse(200, 'User Logged in')
    public async login(
        @Body() loginUserDto: LoginUserDto,
        @Res() success: TsoaResponse<200, APIResponseBodyDTO>,
        @Res() badRequest: TsoaResponse<400, APIResponseBodyDTO>,
        @Res() unknownError: TsoaResponse<500, APIResponseBodyDTO>,
    ) {
        try {
            const validationErrorsFormatted = await validateDto(LoginUserDto, loginUserDto)
            if (validationErrorsFormatted?.length) {
                return badRequest(400, this.apiResponseService.getResponseBody({
                    status: APIResponseBodyStatus.ERROR,
                    message: `Invalid input`,
                    data: validationErrorsFormatted,
                }))
            }

            const validatedUser = await this.authService.validateUser(loginUserDto);

            if (!validatedUser) {
                return badRequest(400, this.apiResponseService.getResponseBody({
                    status: APIResponseBodyStatus.ERROR,
                    message: `Incorrect email or password`,
                }))
            }

            const authTokens = await this.authService.login({ id: validatedUser?.id })

            const responseBody = this.apiResponseService.getResponseBody({
                status: APIResponseBodyStatus.SUCCESS,
                message: `User logged in successfully`,
                data: authTokens,
            });

            return success(200, responseBody);
        } catch (error) {
            return unknownError(500, this.apiResponseService.getResponseBody({
                status: APIResponseBodyStatus.ERROR,
                message: `An unknown error occurred`,
            }))
        }
    }
}

export default AuthController