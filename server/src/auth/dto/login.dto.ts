import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class LoginDto {

    @IsEmail()
    @IsNotEmpty()
    correo: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(8)
    contrasena: string;
}