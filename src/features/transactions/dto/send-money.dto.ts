import { IsDefined, IsInt, IsPositive, Max, Min } from "class-validator";

export class SendMoneyDto {
    /**
     * @example "17"
     */
    @IsDefined({
        message: '$property is required',
    })
    @IsInt({ message: '$property must be an integer' })
    recipientId: number;

    /**
     * @example "7"
     */
    @IsDefined({
        message: '$property is required',
    })
    @IsInt({ message: '$property must be an integer' })
    @IsPositive({ message: '$property must be greater than 0' })
    @Min(1, { message: '$property to send must be more that $constraint1' })
    @Max(5, { message: '$property to send must be less than $constraint1' })
    amount: number;
}