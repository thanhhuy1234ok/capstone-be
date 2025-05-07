import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Building } from '@/building/entities/building.entity';
import { Floor } from '@/floor/entities/floor.entity';



@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [
    TypeOrmModule.forFeature([Room, Building, Floor]),
    // FacilityAssignmentModule,
  ],
})
export class RoomModule {}
