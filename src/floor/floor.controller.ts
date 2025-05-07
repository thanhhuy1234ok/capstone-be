import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FloorService } from './floor.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';

@Controller('floor')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Post()
  create(@Body() createFloorDto: CreateFloorDto) {
    return this.floorService.create(createFloorDto);
  }

  @Get()
  findAll(
     @Query('current') currentPage: string,
        @Query('pageSize') limit: string,
        @Query() qs: string,
  ) {
    return this.floorService.findAll(+currentPage, +limit, qs);
  }
}
