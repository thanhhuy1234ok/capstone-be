import { User } from "@/users/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startYear: number;

  @Column()
  endYear: number;

  @OneToMany(() => User, (student) => student.course, {
    nullable: true,
  })
  students: User[];

//   @OneToMany(() => Semester, (semester) => semester.cohort)
//   semesters: Semester[];
}
