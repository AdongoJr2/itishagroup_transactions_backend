import { validate, ValidationError } from "class-validator";
import { ValidationErrorFormatted } from "../../core/types/validation-error";
import { plainToInstance } from "class-transformer";

export const formatValidationErrors = (
    validationErrors: ValidationError[],
): ValidationErrorFormatted[] => {
    const validationErrorsFormatted = validationErrors.map((error) => {
        return {
            field: error.property,
            errors: Object.values(error.constraints ?? {}),
        };
    });

    return validationErrorsFormatted;
}

export async function validateDto<T extends object>(dtoClass: { new(): T }, data: any): Promise<ValidationErrorFormatted[] | null> {
    const object = plainToInstance(dtoClass, data);
    const validationErrors = await validate(object, { whitelist: true });
    if (validationErrors.length > 0) {
        return formatValidationErrors(validationErrors);
    }
    return null;
}