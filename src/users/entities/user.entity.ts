import { Course } from "@/course/entities/course.entity";
import { Major } from "@/major/entities/major.entity";
import { Role } from "@/roles/entities/role.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  date_of_birth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @ManyToOne(() => Role, { nullable: true, eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Course, (course) => course.students, {
    nullable: true,
    eager: true,
  })
  course: Course;

  @ManyToOne(() => Major, (major) => major.users, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'major_id' })
  major: Major;

  /** Column Token */
  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  codeID: number;

  @Column({ type: 'timestamp', nullable: true })
  codeExpired: Date;

  /** Column Active */
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
