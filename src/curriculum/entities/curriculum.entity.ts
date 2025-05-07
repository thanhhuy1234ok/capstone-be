import { Course } from "@/course/entities/course.entity";
import { CurriculumSubject } from "@/curriculum-subject/entities/curriculum-subject.entity";
import { Major } from "@/major/entities/major.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Curriculum {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @ManyToOne(() => Major)
  major: Major;

  @ManyToOne(() => Course)
  course: Course;

  @OneToMany(() => CurriculumSubject, (cs) => cs.curriculum)
  subjects: CurriculumSubject[];
}
