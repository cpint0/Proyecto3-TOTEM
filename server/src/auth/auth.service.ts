import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto) { 
        
        const user = await this.usuariosService.findOneByEmail(registerDto.correo);
        if (user) {
            throw new BadRequestException('El correo ya existe');
        }

        const hashedPassword = await bcryptjs.hash(registerDto.contrasena, 10);

        const createUsuarioDto: CreateUsuarioDto = {
            ...registerDto, // 'nombre', 'apellidos', 'rut', 'correo'
            contrasena: hashedPassword, 
            rol: 'funcionario', 
            departamento_id: 1,
        };

        return await this.usuariosService.create(createUsuarioDto);
    }

    async login({ correo, contrasena } : LoginDto) {
        const user = await this.usuariosService.findOneByEmail(correo);
        if (!user) {
            throw new UnauthorizedException('Email no es correcto');
        }
        const isPasswordValid = await bcryptjs.compare(contrasena, user.contrasena);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Contraseña no es correcta');
        }

        const payload = { correo: user.correo};
        const token = this.jwtService.signAsync(payload);
        return {token, correo,};
    }
}