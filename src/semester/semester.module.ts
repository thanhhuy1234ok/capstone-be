import { Module } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { SemesterController } from './semester.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semester } from './entities/semester.entity';

@Module({
  controllers: [SemesterController],
  providers: [SemesterService],
  imports:[TypeOrmModule.forFeature([Semester])]
})
export class SemesterModule {}
