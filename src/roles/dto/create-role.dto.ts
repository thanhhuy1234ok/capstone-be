import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'name không được để trống' })
  name: string;

  @IsOptional()
  @IsString({ message: 'description không được để trống' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive có giá trị boolean' })
  isActive: boolean;

}
