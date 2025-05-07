import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { getHashPassword, isValidPassword } from '@/helpers/func/password.util';
import { Role } from '@/roles/entities/role.entity';
import aqp from 'api-query-params';
import { ChangePasswordAuthDto, ForgotPasswordAuthDto } from '@/auth/dto/create-user.dto';
import { IUser } from '@/helpers/types/user.interface';
import { DateFormatter } from '@/helpers/func/formatTime';
import { Major } from '@/major/entities/major.entity';
import { Course } from '@/course/entities/course.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(Major)
    private majorRepository: Repository<Major>,

    @InjectRepository(Course)
    private courseRepository: Repository<Major>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const hashPassword = await getHashPassword(createUserDto.password);

    const role = await this.roleRepository.findOne({
      where: { id: createUserDto.role },
    });

       let major = null;
       if (createUserDto.major) {
         major = await this.majorRepository.findOne({
           where: { id: +createUserDto.major },
         });

         if (!major) {
           throw new BadRequestException(
             `Major with ID ${createUserDto.major} not found`,
           );
         }
       }
       let courseEntity = null;
       if (createUserDto.course) {
         const cohort = await this.courseRepository.findOne({
           where: { id: createUserDto.course },
         });
         if (!cohort) {
           throw new BadRequestException('Course not found');
         }
         courseEntity = cohort;
       }

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashPassword,
      role: role,
      major,
      course:courseEntity
    });

        

    return await this.usersRepository.save(newUser);
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
    if (filter.email) {
      whereCondition.push({ email: ILike(`%${filter.email}%`) });
    }

    if (filter.role && filter.subjects) {
      whereCondition.push({
        role: { name: ILike(`%${filter.role}%`) },
        subjects: { name: ILike(`%${filter.subjects}%`) },
      });
    } else {
      if (filter.role) {
        whereCondition.push({ role: { name: ILike(`%${filter.role}%`) } });
      }
    }
    const where = whereCondition.length ? whereCondition : filter;

    let order = {};
    if (sort) {
      const [sortBy, sortOrder] = Object.entries(sort)[0];
      order = { [sortBy]: sortOrder === 1 ? 'ASC' : 'DESC' };
    }

    const totalItems = await this.usersRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.usersRepository.find({
      where,
      // relations: ['major', 'class'],
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
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByUsername(username: string) {
    return await this.usersRepository.findOne({
      where: { email: username },
      relations: ['role'],
      select: {
        role: { id: true, name: true },
      },
    });
  }

  updateUserToken = async (refreshToken: string, id: number) => {
    return await this.usersRepository.update({ id }, { refreshToken });
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.usersRepository.findOne({
      where: { refreshToken: refreshToken },
      relations: ['role'],
      select: {
        role: { id: true, name: true },
      },
    });
  };

  verifyCode = async (email: string) => {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }
    const codeId = Math.floor(10000 + Math.random() * 90000);

    const data = {
      name: user.name,
      codeId,
    };

    // await this.mailService.sendMailRetryPassword(data);

    await this.usersRepository.update(
      { email },
      {
        codeID: codeId,
        codeExpired: DateFormatter.getTimePlusMinutes(new Date(), 5),
      },
    );

    return { id: user.id, email: user.email };
  };

  forgotPassword = async (data: ForgotPasswordAuthDto) => {
    if (data.confirmPassword !== data.password) {
      throw new BadRequestException(
        'Mật khẩu/ xác nhận mật khẩu không chính xác',
      );
    }

    const user = await this.usersRepository.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    const isCodeExpired = DateFormatter.isAfter(user.codeExpired, new Date());
    if (isCodeExpired) {
      throw new BadRequestException('Mã khôi phục mật khẩu đã hết hạn');
    }

    const newPassword = await getHashPassword(data.password);
    await this.usersRepository.update(
      { id: user.id },
      { password: newPassword },
    );

    return { id: user.id, email: user.email };
  };

  changePassword = async (data: ChangePasswordAuthDto, user: IUser) => {
    const checkUser = await this.usersRepository.findOne({
      where: { id: user.id },
    });
    if (!checkUser) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }
    if (checkUser.codeID !== +data.code) {
      throw new BadRequestException('Mã xác nhận không chính xác / do hết hạn');
    }
    const isMatch = await isValidPassword(data.oldPassword, checkUser.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không chính xác');
    }

    if (data.password !== data.confirmPassword) {
      throw new BadRequestException(
        'Mật khẩu/ xác nhận mật khẩu không chính xác',
      );
    }

    const newPassword = await getHashPassword(data.password);
    return await this.usersRepository.update(
      { id: user.id },
      { password: newPassword },
    );
  };
}
