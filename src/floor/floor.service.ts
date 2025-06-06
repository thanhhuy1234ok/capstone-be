import { Injectable } from '@nestjs/common';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Floor } from './entities/floor.entity';
import { ILike, Repository } from 'typeorm';
import { Building } from '../building/entities/building.entity';
import aqp from 'api-query-params';

@Injectable()
export class FloorService {
  constructor(
    @InjectRepository(Floor)
    private floorRepository: Repository<Floor>,

    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
  ) {}
  async create(createFloorDto: CreateFloorDto) {
    const checkBuilding = await this.buildingRepository.findOne({
      where: { id: createFloorDto.buildingID },
      relations: ['floors'],
    });

    if (!checkBuilding) {
      return 'Building not found';
    }

    if (!checkBuilding.hasFloors) {
      return 'This building does not support floors.';
    }

    const currentFloors = checkBuilding.floors.length;
    if (
      checkBuilding.totalFloors !== null &&
      currentFloors >= checkBuilding.totalFloors
    ) {
      return `Cannot add more floors. Building has reached the limit of ${checkBuilding.totalFloors} floors.`;
    }

    const floor = this.floorRepository.create({
      name: createFloorDto.name,
      floorNumber: currentFloors + 1,
      building: checkBuilding,
    });

    return await this.floorRepository.save(floor);
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit || 10;

    const whereCondition: any[] = [];

    // Tìm theo tên nếu có
    if (filter.name) {
      whereCondition.push({ name: ILike(`%${filter.name}%`) });
    }

    // Tìm theo buildingId nếu có
    if (filter.buildingId) {
      whereCondition.push({ building: { id: filter.buildingId } });
    }

    // Nếu không có điều kiện nào, lấy toàn bộ
    const where = whereCondition.length ? whereCondition : {};

    // Xử lý sort
    let order = {};
    if (sort) {
      const [sortBy, sortOrder] = Object.entries(sort)[0];
      order = { [sortBy]: sortOrder === 1 ? 'ASC' : 'DESC' };
    }

    // Tổng số bản ghi
    const totalItems = await this.floorRepository.count({ where });
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // Lấy dữ liệu
    const result = await this.floorRepository.find({
      where,
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

}
