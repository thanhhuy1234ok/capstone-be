import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FacilityCategoriesService } from './facility_categories.service';
import { CreateFacilityCategoryDto } from './dto/create-facility_category.dto';
import { UpdateFacilityCategoryDto } from './dto/update-facility_category.dto';

@Controller('facility-categories')
export class FacilityCategoriesController {
  constructor(
    private readonly facilityCategoriesService: FacilityCategoriesService,
  ) {}

  @Post()
  create(@Body() createFacilityCategoryDto: CreateFacilityCategoryDto) {
    return this.facilityCategoriesService.create(createFacilityCategoryDto);
  }

  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.facilityCategoriesService.findAll(+currentPage, +limit, qs);
  }
}
