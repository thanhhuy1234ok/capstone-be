import { Module } from '@nestjs/common';
import { CurriculumSubjectService } from './curriculum-subject.service';
import { CurriculumSubjectController } from './curriculum-subject.controller';

@Module({
  controllers: [CurriculumSubjectController],
  providers: [CurriculumSubjectService],
})
export class CurriculumSubjectModule {}
