import { IsBoolean, IsInt } from "class-validator";

export class CreateCurriculumSubjectDto {
  @IsInt()
  semesterId: number;

  @IsInt()
  subjectId: number;

  @IsBoolean()
  isElective: boolean;

}
