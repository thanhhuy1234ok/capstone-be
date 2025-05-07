import { Curriculum } from "@/curriculum/entities/curriculum.entity";
import { Semester } from "@/semester/entities/semester.entity";
import { Subject } from "@/subject/entities/subject.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CurriculumSubject {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Curriculum)
  @JoinColumn({ name: 'curriculumId' })
  curriculum: Curriculum;

  @ManyToOne(() => Semester)
  @JoinColumn({ name: 'semesterId' })
  semester: Semester;

  @ManyToOne(() => Subject)
  @JoinColumn({ name: 'subjectId' })
  subject: Subject;

  @Column({ default: false })
  isElective: boolean;

  @Column({ default: 1 })
  orderInSemester: number;
}
