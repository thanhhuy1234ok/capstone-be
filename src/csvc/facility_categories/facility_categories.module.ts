import { Module } from '@nestjs/common';
import { FacilityCategoriesService } from './facility_categories.service';
import { FacilityCategoriesController } from './facility_categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilityCategory } from './entities/facility_category.entity';

@Module({
  controllers: [FacilityCategoriesController],
  providers: [FacilityCategoriesService],
  imports:[TypeOrmModule.forFeature([FacilityCategory])]
})
export class FacilityCategoriesModule {}
