import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { FacilityCategory } from '../facility_categories/entities/facility_category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from '../supplier/entities/supplier.entity';
import { ILike, Repository } from 'typeorm';
import { Facility } from './entities/facility.entity';
import aqp from 'api-query-params';

@Injectable()
export class FacilitiesService {
  constructor(
    @InjectRepository(Facility)
    private readonly facilityRepo: Repository<Facility>,

    @InjectRepository(FacilityCategory)
    private facilityCategoryRepository: Repository<FacilityCategory>,

    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}
  async create(createFacilityDto: CreateFacilityDto) {
    const checkIDCategory = await this.facilityCategoryRepository.findOne({
      where: { id: createFacilityDto.category },
    });

    const checkIDSupplier = await this.supplierRepository.findOne({
      where: { id: createFacilityDto.supplier },
    });

    if (!checkIDCategory) {
      throw new BadRequestException('Category not found');
    }
    if (!checkIDSupplier) {
      throw new BadRequestException('Supplier not found');
    }

    if (createFacilityDto.quantity_total < 0) {
      throw new BadRequestException('Quantity total must be greater than 0');
    }
    const facility = this.facilityRepo.create({
      ...createFacilityDto,
      category: checkIDCategory,
      supplier: checkIDSupplier,
    });
    return this.facilityRepo.save(facility);
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit || 10;

    const whereCondition = [];
    if (filter.name) {
      whereCondition.push({ name: ILike(`%${filter.name}%`) });
    }

    const where = whereCondition.length ? whereCondition : filter;

    let order = {};
    if (sort) {
      const [sortBy, sortOrder] = Object.entries(sort)[0];
      order = { [sortBy]: sortOrder === 1 ? 'ASC' : 'DESC' };
    }

    const totalItems = await this.facilityRepo.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.facilityRepo.find({
      where,
      skip: offset,
      take: defaultLimit,
      order,
    });

    // Trả về kết quả và thông tin phân trang
    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }
}
