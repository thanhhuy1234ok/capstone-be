import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FacilityCategory {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @Column()
    description:string
}
