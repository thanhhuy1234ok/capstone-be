import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ILike, Repository } from 'typeorm';
import aqp from 'api-query-params';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}
  async create(createCourseDto: CreateCourseDto) {
    const { startYear, endYear } = createCourseDto;

    if (!Number.isInteger(startYear)) {
      throw new BadRequestException('Năm nhập học phải là số nguyên');
    }

    if (!Number.isInteger(endYear)) {
      throw new BadRequestException('Năm kết thúc phải là số nguyên');
    }

    if (startYear <= 2000 || startYear >= 2100) {
      throw new BadRequestException(
        'Năm nhập học phải lớn hơn 2000 và nhỏ hơn 2100',
      );
    }

    if (endYear <= 2000 || endYear >= 2100) {
      throw new BadRequestException(
        'Năm kết thúc phải lớn hơn 2000 và nhỏ hơn 2100',
      );
    }

    const unitStartEndYear = await this.courseRepository.findOne({
      where: { startYear: startYear, endYear: endYear },
    });

    if (unitStartEndYear) {
      throw new BadRequestException('Năm bắt đầu và kết thúc đã có');
    }

    if (startYear >= endYear) {
      throw new BadRequestException('End year must be greater than start year');
    }

    const course = this.courseRepository.create(createCourseDto);
    return await this.courseRepository.save(course);
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit ? limit : 10;

    const whereCondition = [];
    if (filter.startYear) {
      whereCondition.push({ startYear: ILike(`%${filter.startYear}%`) });
    }
    if (filter.endYear) {
      whereCondition.push({ endYear: ILike(`%${filter.endYear}%`) });
    }

    const where = whereCondition.length ? whereCondition : filter;

    let order = {};
    if (sort) {
      const [sortBy, sortOrder] = Object.entries(sort)[0];
      order = { [sortBy]: sortOrder === 1 ? 'ASC' : 'DESC' };
    }

    const totalItems = await this.courseRepository.count({
      where: filter,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.courseRepository.find({
      where,
      skip: offset,
      take: defaultLimit,
      order,
    });

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }
}
