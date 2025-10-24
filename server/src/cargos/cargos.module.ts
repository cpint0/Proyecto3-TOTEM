import { Module } from '@nestjs/common';
import { CargosService } from './cargos.service';
import { CargosController } from './cargos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cargo } from './entities/cargo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cargo]) // <-- 3. Registra la entidad aquí
  ],
  controllers: [CargosController],
  providers: [CargosService],
})
export class CargosModule {}
