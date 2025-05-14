import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFacilityDto {
  @IsString()
  name: string;

  @IsNumber()
  supplier: number;

  @IsNumber()
  quantity_total: number;

  @IsNumber()
  category: number;
}
