import { Module } from '@nestjs/common';
import { SalasService } from './salas.service';
import { SalasController } from './salas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sala } from './entities/sala.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sala]) // <-- 3. Registra la entidad aquí
  ],
  controllers: [SalasController],
  providers: [SalasService],
})
export class SalasModule {}
