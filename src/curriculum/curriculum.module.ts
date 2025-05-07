import { Module } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CurriculumController } from './curriculum.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curriculum } from './entities/curriculum.entity';
import { Major } from '@/major/entities/major.entity';
import { Course } from '@/course/entities/course.entity';
import { CurriculumSubject } from '@/curriculum-subject/entities/curriculum-subject.entity';

@Module({
  controllers: [CurriculumController],
  providers: [CurriculumService],
  imports:[TypeOrmModule.forFeature([Curriculum,Major,Course,CurriculumSubject])]
})
export class CurriculumModule {}
