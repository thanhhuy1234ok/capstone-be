import { PartialType } from '@nestjs/mapped-types';
import { CreateFacilityCategoryDto } from './create-facility_category.dto';

export class UpdateFacilityCategoryDto extends PartialType(CreateFacilityCategoryDto) {}
