import { Course } from "@/course/entities/course.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Semester {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // VD: "Học kỳ 1", "Học kỳ 2", "Học kỳ hè"

  @Column({ type: 'int' })
  order: number;
  // Thứ tự kỳ học trong toàn bộ chương trình (1 -> 8)
  // Dùng để map với CurriculumDetail.semesterOrder

  @Column({ type: 'int', default: 21 })
  maxCredits: number;

  @Column('date')
  startDate: Date;

  @Column('date')
  endDate: Date;

  @Column({ default: true })
  isMainSemester: boolean; // true = kỳ chính, false = kỳ phụ (hè)

  @ManyToOne(() => Course, (course) => course.semesters)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
