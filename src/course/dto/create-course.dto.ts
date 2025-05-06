import { IsOptional } from "class-validator";

export class CreateCourseDto {
  @IsOptional()
  startYear?: number;

  @IsOptional()
  endYear?: number;
}
