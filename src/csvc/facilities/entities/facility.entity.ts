import { FacilityCategory } from '@/csvc/facility_categories/entities/facility_category.entity';
import { Supplier } from '@/csvc/supplier/entities/supplier.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Facility {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Supplier, { eager: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column()
  quantity_total: number;

  @ManyToOne(() => FacilityCategory, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: FacilityCategory;

  @Column({ default: 0 })
  quantity_remaining: number;

  @Column({ default: 0 })
  quantity_allocated: number;
  
  @Column({ default: 0 })
  quantity_borrowed: number; 
}
