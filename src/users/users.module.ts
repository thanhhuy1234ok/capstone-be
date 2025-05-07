import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '@/roles/entities/role.entity';
import { Major } from '@/major/entities/major.entity';
import { Course } from '@/course/entities/course.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User,Role,Major,Course])],
  exports: [UsersService],
})
export class UsersModule {}
