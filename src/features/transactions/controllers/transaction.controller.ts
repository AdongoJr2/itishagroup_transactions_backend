import { injectable } from "inversify";
import { Body, Controller, Post, Query, Request, Res, Route, Security, SuccessResponse, Tags, TsoaResponse } from "tsoa";
import { ApiResponseService } from "../../_common/services/api-response.service";
import { TransactionService } from "../services/transaction.service";
import { APIResponseBodyStatus } from "../../../core/types/api-response-body-status";
import { SendMoneyDto } from "../dto/send-money.dto";
import { APIResponseBodyDTO } from "../../../core/types/api-response-body.dto";
import { validateDto } from "../../../utils/exceptions/validation-errors";
import { UserService } from "../../users/services/user.service";
import { VerifiedToken } from "../../../core/types/token-user-data";
import { ApiListResponseService } from "../../_common/services/api-list-response.service";

@Tags("Transactions")
@Route('transactions')
@injectable()
export class TransactionController extends Controller {
    private apiListResponseService: ApiListResponseService
    private apiResponseService: ApiResponseService
    private transactionService: TransactionService
    private userService: UserService

    constructor() {
        super()
        this.apiResponseService = new ApiResponseService()
        this.apiListResponseService = new ApiListResponseService()
        this.transactionService = new TransactionService()
        this.userService = new UserService()
    }

    /**
    * Send Money 
    */
    @Post()
    @SuccessResponse(200, 'Money sent successfully')
    @Security('jwt')
    public async sendMoney(
        @Body() sendMoneyDto: SendMoneyDto,
        @Res() success: TsoaResponse<200, APIResponseBodyDTO>,
        @Res() badRequest: TsoaResponse<400, APIResponseBodyDTO>,
        @Res() notFound: TsoaResponse<404, APIResponseBodyDTO>,
        @Res() unknownError: TsoaResponse<500, APIResponseBodyDTO>,
        @Request() req: VerifiedToken,
    ) {
        try {
            const validationErrorsFormatted = await validateDto(SendMoneyDto, sendMoneyDto)
            if (validationErrorsFormatted?.length) {
                return badRequest(400, this.apiResponseService.getResponseBody({
                    status: APIResponseBodyStatus.ERROR,
                    message: `Invalid input`,
                    data: validationErrorsFormatted,
                }))
            }

            const senderId = (req as any).user.sub;

            if (!senderId) {
                return badRequest(400, this.apiResponseService.getResponseBody({
                    status: APIResponseBodyStatus.ERROR,
                    message: `Sender not found`,
                }))
            }

            if (senderId === sendMoneyDto.recipientId) {
                return badRequest(400, this.apiResponseService.getResponseBody({
                    status: APIResponseBodyStatus.ERROR,
                    message: `You cannot send money to yourself`,
                }))
            }

            const sender = await this.userService.findOne(senderId)
            const recipient = await this.userService.findOne(sendMoneyDto.recipientId)

            if (sender.wallet.balance < sendMoneyDto.amount) {
                return badRequest(400, this.apiResponseService.getResponseBody({
                    status: APIResponseBodyStatus.ERROR,
                    message: `You have insufficient balance to complete the transaction`,
                    data: {
                        amount: sendMoneyDto.amount,
                        balance: +sender.wallet.balance,
                    }
                }))
            }

            await this.transactionService.sendMoney(
                sendMoneyDto.amount,
                sender,
                recipient,
            )

            const responseBody = this.apiResponseService.getResponseBody({
                status: APIResponseBodyStatus.SUCCESS,
                message: `Money sent successfully`,
            });

            return success(200, responseBody);
        } catch (error: any) {
            return unknownError(500, this.apiResponseService.getResponseBody({
                status: APIResponseBodyStatus.ERROR,
                message: error?.message ?? error ?? `An unknown error occurred`,
            }))
        }
    }

    /**
    * Retrieve transactions history 
    */
    @Post("history")
    @SuccessResponse(200, 'Transactions history success')
    @Security('jwt')
    public async getTransactionHistory(
        @Query() page: number = 1,
        @Query() pageSize: number = 5,
        @Res() success: TsoaResponse<200, APIResponseBodyDTO>,
        @Res() badRequest: TsoaResponse<400, APIResponseBodyDTO>,
        @Res() notFound: TsoaResponse<404, APIResponseBodyDTO>,
        @Res() unknownError: TsoaResponse<500, APIResponseBodyDTO>,
        @Request() req: VerifiedToken,
    ) {
        try {
            // Validate pagination parameters 
            if (page < 1 || pageSize < 1 || pageSize > 50) {
                this.setStatus(400);
                throw new Error('Invalid pagination parameters');
            }

            const userId = (req as any).user.sub;

            if (!userId) {
                this.setStatus(400);
                throw new Error('User not found');
            }

            const [records, count] = await this.transactionService.getTransactions(
                { page, pageSize },
                userId,
            );

            const responseBody = this.apiListResponseService.getResponseBody({
                message: 'Transaction history retrieved successfully',
                count,
                pageSize,
                records,
              });

            return success(200, responseBody);
        } catch (error: any) {
            return unknownError(500, this.apiResponseService.getResponseBody({
                status: APIResponseBodyStatus.ERROR,
                message: error?.message ?? error ?? `An unknown error occurred`,
            }))
        }
    }
}

export default TransactionController