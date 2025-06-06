
import { Campus } from "@/campus/entities/campus.entity";
import { Floor } from "@/floor/entities/floor.entity";
import { Room } from "src/room/entities/room.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Building {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @Column({ type: 'boolean', default: true })
  hasFloors: boolean;

  @ManyToOne(() => Campus, (campus) => campus.buildings, {
    nullable: false,
    onDelete: 'CASCADE',
    eager:true
  })
  @JoinColumn({ name: 'campusID'})
  campus: Campus;

  @OneToMany(() => Floor, (floor) => floor.building)
  floors: Floor[];

  @OneToMany(() => Room, (room) => room.building, { cascade: true })
  rooms: Room[];

  @Column({ nullable: true })
  totalFloors: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
