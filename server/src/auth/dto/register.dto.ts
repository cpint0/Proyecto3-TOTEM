// En: src/auth/dto/register.dto.ts
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    @MinLength(1)
    nombre: string;

    @IsString()
    @IsNotEmpty()
    apellidos: string; 

    @IsString()
    @IsNotEmpty()
    rut: string; 

    @IsEmail()
    @IsNotEmpty()
    correo: string;

    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    contrasena: string; 
}