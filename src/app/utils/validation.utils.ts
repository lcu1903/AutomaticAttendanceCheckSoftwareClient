import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ZodSchema } from 'zod';

export const isNullOrWhiteSpace = (str: string) => {
    return !str || /^\s*$/.test(str);
};

export const isNullOrEmptyNumber = (num: number | null | undefined | ''): boolean => {
    return num === null || num === undefined || num === '';
};

export function zodValidator(schema: ZodSchema<any>): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const result = schema.safeParse(control.value);
        if (!result.success) {
            const errors: any = {};

            // Map each error: the first path element is used as control key.
            result.error.errors.forEach((err) => {
                console.log(err);

                const key = err.path[0] || 'form';
                errors[key] = err.message;
            });
            return errors;
        }
        return null;
    };
}
