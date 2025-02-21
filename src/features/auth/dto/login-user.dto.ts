import { IsEmail, MinLength, ValidationArguments } from "class-validator";

export class LoginUserDto {
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
   * @example "123456"
   */
  @MinLength(6, {
    message: '$property must be at least $constraint1 characters long',
  })
  password: string;
}