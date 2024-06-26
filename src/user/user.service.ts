import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from './dtos';
import { PrismaService } from 'src/config/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as path from 'path';
import * as jimp from 'jimp';
import { UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  @Inject(PrismaService) private readonly prisma: PrismaService;

  async createUser(dto: CreateUserDTO) {
    const duplicatedByPhone = await this.prisma.user.findUnique({
      where: { phone: dto.phone, deletedAt: null },
    });
    if (duplicatedByPhone) {
      throw new ConflictException(
        'شماره تماس وارد شده از قبل توی سیستم ثبت شده است',
      );
    }
    dto.password = await bcrypt.hash(dto.password, 8);
    return this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: dto.password,
        phone: dto.phone,
        profile: dto.profile,
        bio: dto.bio,
        status: 'ACTIVE',
        role: dto.isClient ? 'CLIENT' : 'ESTATE_CONSULTANT',
      },
    });
  }

  async findUserById(id: number, role: UserRole) {
    const user = await this.prisma.user.findUnique({
      where: { id, role },
    });
    if (!user) {
      throw new NotFoundException(
        `${role === 'CLIENT' ? 'کاربر' : 'مشاور املاک'} یافت نشد`,
      );
    }
    return user;
  }

  async findUsers(
    role: UserRole | 'BOTH',
    page: number = 0,
    limit: number = 10,
  ) {
    const roleCondition = role === 'BOTH' ? {} : { role };
    const generalCondition = { where: { ...roleCondition } };
    const content = await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: page * limit,
      take: limit,
      ...generalCondition,
    });
    const count = await this.prisma.user.count({ ...generalCondition });
    return { content, count };
  }

  async deleteUserById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }
    return this.prisma.user.delete({ where: { id } });
  }

  async updateUserById(id: number, dto: UpdateUserDTO) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 8);
    }
    return this.prisma.user.update({ data: dto, where: { id } });
  }

  async uploadProfile(image: Express.Multer.File) {
    const fileExtension = path.extname(image.originalname);
    const fileName = `${new Date().getTime()}-${Math.random() * 100000000}${fileExtension}`;
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'profiles',
      fileName,
    );
    const localFile = await jimp.read(image.buffer);
    await localFile.resize(150, 150).quality(90).writeAsync(filePath);
    return { fileName };
  }
}
