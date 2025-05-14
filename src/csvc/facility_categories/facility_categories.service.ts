import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFacilityCategoryDto } from './dto/create-facility_category.dto';
import { UpdateFacilityCategoryDto } from './dto/update-facility_category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityCategory } from './entities/facility_category.entity';
import { ILike, Repository } from 'typeorm';
import aqp from 'api-query-params';

@Injectable()
export class FacilityCategoriesService {
  constructor(
    @InjectRepository(FacilityCategory)
    private facilityCategoriesRepository: Repository<FacilityCategory>,
  ) {}
  async create(createFacilityCategoryDto: CreateFacilityCategoryDto) {
    const { name, description } = createFacilityCategoryDto;
    const checkName = await this.facilityCategoriesRepository.findOne({
      where: { name: name },
    });


    if (checkName) {
      throw new BadRequestException('Name categories already exists');
    }

    const newCategories = await this.facilityCategoriesRepository.create({
      name,
      description,
    });

    const newFacilityCa =
      await this.facilityCategoriesRepository.save(newCategories);

    return newFacilityCa;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs); // Phân tích query string với aqp

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

    const totalItems = await this.facilityCategoriesRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    // Truy vấn dữ liệu với phân trang
    const result = await this.facilityCategoriesRepository.find({
      where: whereCondition,
      skip: offset,
      take: defaultLimit, 
      order: { id: 'ASC' },
    });

    // Trả về kết quả cùng thông tin phân trang
    return {
      meta: {
        current: currentPage, // Trang hiện tại
        pageSize: defaultLimit, // Số bản ghi mỗi trang
        pages: totalPages, // Tổng số trang
        total: totalItems, // Tổng số bản ghi
      },
      result, // Kết quả truy vấn
    };
  }
}
