import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CurriculumSubjectService } from './curriculum-subject.service';
import { CreateCurriculumSubjectDto } from './dto/create-curriculum-subject.dto';
import { UpdateCurriculumSubjectDto } from './dto/update-curriculum-subject.dto';

@Controller('curriculum-subject')
export class CurriculumSubjectController {
  constructor(private readonly curriculumSubjectService: CurriculumSubjectService) {}

  @Post()
  create(@Body() createCurriculumSubjectDto: CreateCurriculumSubjectDto) {
    return this.curriculumSubjectService.create(createCurriculumSubjectDto);
  }

  @Get()
  findAll() {
    return this.curriculumSubjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.curriculumSubjectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCurriculumSubjectDto: UpdateCurriculumSubjectDto) {
    return this.curriculumSubjectService.update(+id, updateCurriculumSubjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.curriculumSubjectService.remove(+id);
  }
}
