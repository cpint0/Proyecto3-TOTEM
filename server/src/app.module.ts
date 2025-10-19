import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalasModule } from './salas/salas.module';
import { DepartamentoModule } from './departamento/departamento.module';
import { UsuariosModule } from './usuarios/usuarios.module';

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
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
