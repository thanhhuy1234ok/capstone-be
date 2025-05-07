import { Building } from '@/building/entities/building.entity';
import { Floor } from '@/floor/entities/floor.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Building, (building) => building.rooms, {
    nullable: false,
    onDelete: 'CASCADE',
    eager:true
  })
  @JoinColumn({ name: 'buildingID' })
  building: Building; // Mỗi phòng thuộc một tòa nhà

  @ManyToOne(() => Floor, (floor) => floor.rooms, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'floorID' })
  floor: Floor | null;

  @Column('int')
  capacity: number;

  @Column({
    type: 'enum',
    enum: ['Available', 'Occupied', 'Under Maintenance'],
    default: 'Available',
  })
  status: 'Available' | 'Occupied' | 'Under Maintenance';

  // @OneToMany(() => Schedule, (schedule) => schedule.room)
  // schedules: Schedule[];

  // @OneToMany(() => FacilityAssignment, (assignment) => assignment.room)
  // assignments: FacilityAssignment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
