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

@Module({
  imports: [SalasModule,DepartamentoModule, UsuariosModule,
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3307,
    username: 'user_proy3',
    password: 'root',
    database: 'db_crud',
    autoLoadEntities: true,
    synchronize: true
  }),
    FormulariosModule,
    ActividadesModule,
    OficinasModule,
    CargosModule,
    EmpleadoCargosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
