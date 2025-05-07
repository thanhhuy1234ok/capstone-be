import { Injectable } from '@nestjs/common';
import { CreateCurriculumSubjectDto } from './dto/create-curriculum-subject.dto';
import { UpdateCurriculumSubjectDto } from './dto/update-curriculum-subject.dto';

@Injectable()
export class CurriculumSubjectService {
  create(createCurriculumSubjectDto: CreateCurriculumSubjectDto) {
    return 'This action adds a new curriculumSubject';
  }

  findAll() {
    return `This action returns all curriculumSubject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} curriculumSubject`;
  }

  update(id: number, updateCurriculumSubjectDto: UpdateCurriculumSubjectDto) {
    return `This action updates a #${id} curriculumSubject`;
  }

  remove(id: number) {
    return `This action removes a #${id} curriculumSubject`;
  }
}
