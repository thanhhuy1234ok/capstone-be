import { IsString } from "class-validator";

export class CreateFacilityCategoryDto {
    @IsString()
    name:string

    @IsString()
    description:string
}
