import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from './configs/connectDB.config';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CourseModule } from './course/course.module';
import { MajorModule } from './major/major.module';
import { SemesterModule } from './semester/semester.module';
import { SubjectModule } from './subject/subject.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { CurriculumSubjectModule } from './curriculum-subject/curriculum-subject.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    CourseModule,
    MajorModule,
    SemesterModule,
    SubjectModule,
    CurriculumModule,
    CurriculumSubjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
