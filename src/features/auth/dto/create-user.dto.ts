import { IsDefined, IsEmail, IsMobilePhone, MinLength, ValidationArguments } from "class-validator";

export class CreateUserDto {
    /**
     * @example "John"
     */
    @IsDefined({
        message: '$property is required',
    })
    firstName: string;

    /**
     * @example "Doe"
     */
    @IsDefined({
        message: '$property is required',
    })
    lastName: string;

    /**
     * @example "jdoe@example.com"
     */
    @IsEmail(undefined, {
        message: (args: ValidationArguments) => {
            if (args.value !== undefined && args.value !== null) {
                return 'the $property provided is invalid';
            }

            return 'provide a valid email address';
        },
    })
    email: string;

    /**
     * @example "+254700000000"
     */
    @IsMobilePhone(
        undefined,
        {},
        {
            message: (args: ValidationArguments) => {
                if (args.value !== undefined && args.value !== null) {
                    if (args.value.length === 0) {
                        return '$property cannot be empty';
                    }

                    return '$value is not a valid mobile phone number';
                }

                return '$property should be valid mobile phone number';
            },
        },
    )
    phoneNumber: string;

    /**
     * @example "123456"
     */
    @MinLength(6, {
        message: '$property must be at least $constraint1 characters long',
    })
    @IsDefined({
        message: '$property is required',
    })
    password: string;
}