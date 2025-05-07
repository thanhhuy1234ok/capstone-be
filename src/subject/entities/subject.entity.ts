import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // Mã môn học

  @Column()
  name: string; // Tên môn học

  @Column({ nullable: true, default: 3 })
  credits: number;

  @Column({ default: false })
  isElective: boolean;

  @Column({ nullable: true })
  price: number;
}
