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
import { CampusModule } from './campus/campus.module';
import { BuildingModule } from './building/building.module';
import { FloorModule } from './floor/floor.module';
import { RoomModule } from './room/room.module';
import { FacilityCategoriesModule } from './csvc/facility_categories/facility_categories.module';
import { SupplierModule } from './csvc/supplier/supplier.module';
import { FacilitiesModule } from './csvc/facilities/facilities.module';

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
    CampusModule,
    BuildingModule,
    FloorModule,
    RoomModule,
    FacilityCategoriesModule,
    SupplierModule,
    FacilitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
