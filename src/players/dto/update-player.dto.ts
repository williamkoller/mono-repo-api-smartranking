import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class UpdatePlayerDTO {
    @IsString()
    @IsNotEmpty()
    readonly name: string

    @IsNumber()
    @IsNotEmpty()
    readonly phoneNumber: string
}
