import { Module } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividad } from './entities/actividade.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Actividad]) // <-- 3. Registra la entidad aquí
  ],
  controllers: [ActividadesController],
  providers: [ActividadesService],
})
export class ActividadesModule {}
