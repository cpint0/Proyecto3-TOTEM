import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalasModule } from './salas/salas.module';
import { DepartamentoModule } from './departamento/departamento.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { FormulariosModule } from './formularios/formularios.module';
import { ActividadesModule } from './actividades/actividades.module';
import { OficinasModule } from './oficinas/oficinas.module';
import { CargosModule } from './cargos/cargos.module';
import { EmpleadoCargosModule } from './empleado-cargos/empleado-cargos.module';

import { Sala } from './salas/entities/sala.entity';
import { Departamento } from './departamento/entities/departamento.entity';
import { Usuario } from './usuarios/entities/usuario.entity';
import { Formulario } from './formularios/entities/formulario.entity';
import { Actividad } from './actividades/entities/actividade.entity';
import { Oficina } from './oficinas/entities/oficina.entity';
import { Cargo } from './cargos/entities/cargo.entity';
import { EmpleadoCargo } from './empleado-cargos/entities/empleado-cargo.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [SalasModule,DepartamentoModule, UsuariosModule,
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3307,
    username: 'user_proy3',
    password: 'root',
    database: 'db_crud',
    entities: [
        Usuario,
        Sala,
        Departamento,
        Formulario,
        Actividad,
        Oficina,
        Cargo,
        EmpleadoCargo,
      ],

    synchronize: false,
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}']
  }),
    FormulariosModule,
    ActividadesModule,
    OficinasModule,
    CargosModule,
    EmpleadoCargosModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
