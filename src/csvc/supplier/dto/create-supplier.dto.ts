import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSupplierDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  note: string;
}
