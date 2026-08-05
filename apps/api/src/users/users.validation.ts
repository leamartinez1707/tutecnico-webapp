import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
} from 'class-validator';

@Injectable()
export class UserValidator implements ValidatorConstraintInterface {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly field: keyof User
    ) { }

    async validate(value: string, args: ValidationArguments): Promise<boolean> {
        const user = await this.usersRepository.findOne({ where: { [this.field]: value } });
        return !user;
    }

    defaultMessage(args: ValidationArguments): string {
        return `${args.property} ${args.value} is already in use.`;
    }
}

@ValidatorConstraint({ async: true })
export class EmailExistsValidator extends UserValidator {
    constructor(field: Repository<User>) {
        super(field, 'email');
    }
}

@ValidatorConstraint({ async: true })
export class UsernameExistsValidator extends UserValidator {
    constructor(field: Repository<User>) {
        super(field, 'username');
    }
}

export function IsEmailExists(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [EmailExistsValidator],
            validator: EmailExistsValidator,
        });
    };
}

export function IsUsernameExists(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [UsernameExistsValidator],
            validator: UsernameExistsValidator,
        });
    };
}