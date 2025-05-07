import { IsNumber, IsOptional } from "class-validator";

export class CreateCurriculumDto {
  @IsNumber()
  major: number;

  @IsNumber()
  course: number;

  @IsOptional()
  subjects: {
    semesterId: number;
    subjectId: number;
    isElective: boolean;
    orderInSemester?: number;
  }[];
}
