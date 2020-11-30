import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreatePlayerDTO {
    @IsString()
    @IsNotEmpty()
    readonly name?: string

    @IsNumber()
    @IsNotEmpty()
    readonly phoneNumber?: string

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    readonly email: string
}
