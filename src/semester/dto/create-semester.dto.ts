import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Max } from "class-validator";

export class CreateSemesterDto {
  @Type(() => Date)
  @IsDate({ message: 'Ngày bắt đầu phải là kiểu Date hợp lệ' })
  @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
  startDate: Date;

  @Type(() => Date)
  @IsDate({ message: 'Ngày kết thúc phải là kiểu Date hợp lệ' })
  @IsNotEmpty({ message: 'Ngày kết thúc không được để trống' })
  endDate: Date;

  @IsOptional()
  @IsBoolean()
  isMainSemester?: boolean;

  @IsOptional()
  @IsNumber()
  @Max(22, { message: 'Số tín chỉ tối đa phải nhỏ hơn 21' })
  maxCredits?: number;

  @IsOptional()
  status?: number;

  @IsOptional()
  course: number;

  @IsOptional()
  order:number
}
