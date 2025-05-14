import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ILike, Repository } from 'typeorm';
import aqp from 'api-query-params';
import { Supplier } from './entities/supplier.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}
  async create(dto: CreateSupplierDto): Promise<Supplier> {
    const { name, phone, address, email, note } = dto;
    const checkName = await this.supplierRepository.findOne({
      where: { name: name },
    });
    if (checkName) {
      throw new BadRequestException('Name supplier already exists');
    }
    const checkPhone = await this.supplierRepository.findOne({
      where: { phone: phone },
    });
    if (checkPhone) {
      throw new BadRequestException('Phone supplier already exists');
    }
    const checkEmail = await this.supplierRepository.findOne({
      where: { email: email },
    });
    if (checkEmail) {
      throw new BadRequestException('Email supplier already exists');
    }
    const checkAddress = await this.supplierRepository.findOne({
      where: { address: address },
    });
    if (checkAddress) {
      throw new BadRequestException('Address supplier already exists');
    }
    const supplier = this.supplierRepository.create({
      name,
      phone,
      address,
      email,
      note,
    });
    return this.supplierRepository.save(supplier);
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

    const totalItems = await this.supplierRepository.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.supplierRepository.find({
      where,
      skip: offset,
      take: defaultLimit,
      order,
    });

    // Trả về kết quả và thông tin phân trang
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
