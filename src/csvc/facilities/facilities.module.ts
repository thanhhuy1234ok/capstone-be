import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from './entities/facility.entity';
import { FacilityCategory } from '../facility_categories/entities/facility_category.entity';
import { Supplier } from '../supplier/entities/supplier.entity';

@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesService],
  imports: [TypeOrmModule.forFeature([Facility,FacilityCategory,Supplier])],
})
export class FacilitiesModule {}
