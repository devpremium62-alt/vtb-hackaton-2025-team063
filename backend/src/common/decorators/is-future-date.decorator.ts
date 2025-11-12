import {registerDecorator, ValidationOptions, ValidationArguments} from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isFutureDate',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (!value) return false;
                    const inputDate = new Date(value);
                    const now = new Date();
                    return inputDate.getTime() >= now.getTime();
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} должна быть больше текущей даты`;
                },
            },
        });
    };
}
