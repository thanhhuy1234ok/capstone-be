import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Curriculum } from './entities/curriculum.entity';
import { Major } from '@/major/entities/major.entity';
import { Repository } from 'typeorm';
import { Course } from '@/course/entities/course.entity';
import { CurriculumSubject } from '@/curriculum-subject/entities/curriculum-subject.entity';

@Injectable()
export class CurriculumService {
  constructor(
    @InjectRepository(Curriculum)
    private curriculumRepository: Repository<Curriculum>,

    @InjectRepository(Major)
    private readonly majorRepository: Repository<Major>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(CurriculumSubject)
    private curriculumSubjectRepository: Repository<CurriculumSubject>,
  ) {}
  async create(createCurriculumDto: CreateCurriculumDto) {
    const { course, major, subjects } = createCurriculumDto;

    // ✅ Kiểm tra course tồn tại
    const isCheckCourse = await this.courseRepository.findOne({
      where: { id: course },
    });

    if (!isCheckCourse) {
      throw new BadRequestException('Course không tồn tại!');
    }

    const isCheckMajor = await this.majorRepository.findOne({
      where: { id: major },
    });

    if (!isCheckMajor) {
      throw new BadRequestException('Chuyên ngành không tồn tại!');
    }

    // ✅ Tạo tên nếu chưa có
    const finalName = `${isCheckMajor.name} ${isCheckCourse.startYear}-${isCheckCourse.endYear}`;

    // ✅ Tạo curriculum
    const curriculum = await this.curriculumRepository.save({
      name: finalName,
      majorId: major,
      courseId: course,
    });

    const data = subjects.map((s) => ({
      curriculum,
      semester: { id: s.semesterId },
      subject: { id: s.subjectId },
      isElective: s.isElective,
      orderInSemester: s.orderInSemester || 1,
    }));

    await this.curriculumSubjectRepository.insert(data);

    return curriculum;
  }

  async findAll() {
      return this.curriculumRepository.find({
        relations: [
          'major',
          'course',
          'subjects',
          'subjects.subject',
          'subjects.semester',
        ],
        order: {
          id: 'DESC',
          subjects: {
            semester: {
              id: 'ASC',
            },
            orderInSemester: 'ASC',
          },
        },
      });
  }

  findOne(id: number) {
    return `This action returns a #${id} curriculum`;
  }

  update(id: number, updateCurriculumDto: UpdateCurriculumDto) {
    return `This action updates a #${id} curriculum`;
  }

  remove(id: number) {
    return `This action removes a #${id} curriculum`;
  }
}
