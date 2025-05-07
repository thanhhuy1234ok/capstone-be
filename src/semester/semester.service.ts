import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Semester } from './entities/semester.entity';
import { ILike, Repository } from 'typeorm';
import { Course } from '@/course/entities/course.entity';
import aqp from 'api-query-params';

@Injectable()
export class SemesterService {
  constructor(
    @InjectRepository(Semester)
    private readonly semesterRepository: Repository<Semester>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createSemesterDto: CreateSemesterDto): Promise<Semester> {
    const { startDate, endDate } = createSemesterDto;

    if (startDate >= endDate) {
      throw new BadRequestException('Ngày kết thúc phải lớn hơn ngày bắt đầu!');
    }

    const course = await this.courseRepository.findOne({
      where: { id: createSemesterDto.course },
    });
    if (!course) {
      throw new BadRequestException('Course không tồn tại!');
    }

    const name = createSemesterDto.isMainSemester
      ? `Học kỳ ${createSemesterDto.order}`
      : `Học kỳ hè ${createSemesterDto.order}`;

    const exist = await this.semesterRepository.findOne({
      where: {
        course: { id: createSemesterDto.course },
        order: createSemesterDto.order,
      },
    });
    if (exist) {
      throw new BadRequestException(
        `Học kỳ với thứ tự ${createSemesterDto.order} đã tồn tại cho khóa học này!`,
      );
    }

    const semester = this.semesterRepository.create({
      ...createSemesterDto,
      course: course,
      name
    });
    return await this.semesterRepository.save(semester);
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

    const totalItems = await this.semesterRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.semesterRepository.find({
      where,
      relations: ['course'],
      skip: offset,
      take: defaultLimit,
      order,
    });

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

  findOne(id: number) {
    return `This action returns a #${id} semester`;
  }

  update(id: number, updateSemesterDto: UpdateSemesterDto) {
    return `This action updates a #${id} semester`;
  }

  remove(id: number) {
    return `This action removes a #${id} semester`;
  }
}
