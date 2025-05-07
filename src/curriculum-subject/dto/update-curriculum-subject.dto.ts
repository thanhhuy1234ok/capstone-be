import { PartialType } from '@nestjs/mapped-types';
import { CreateCurriculumSubjectDto } from './create-curriculum-subject.dto';

export class UpdateCurriculumSubjectDto extends PartialType(CreateCurriculumSubjectDto) {}
