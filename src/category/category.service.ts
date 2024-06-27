import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dtos';
import { PrismaService } from 'src/config/prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class CategoryService {
  @Inject(PrismaService) private readonly prisma: PrismaService;

  async createCategory(dto: CreateCategoryDTO, file: Express.Multer.File) {
    const isDuplicatedByTitle = await this.prisma.category.findUnique({
      where: {
        title: dto.title,
      },
    });

    if (isDuplicatedByTitle) {
      throw new ConflictException('تایتل دسته بندی از قبل ثبت شده است');
    }

    const image = this._uploadImage(file);

    return this.prisma.category.create({
      data: {
        title: dto.title,
        image: image.fileName,
        isVisible: dto.isVisible,
      },
    });
  }

  async updateCategoryById(
    id: number,
    dto: UpdateCategoryDTO,
    file: Express.Multer.File,
  ) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('دسته بندی مورد نظر یافت نشد');
    }
    if (dto.title) {
      const isDuplicatedByTitle = await this.prisma.category.findUnique({
        where: {
          NOT: { id },
          title: dto.title,
        },
      });

      if (isDuplicatedByTitle) {
        throw new ConflictException('تایتل دسته بندی از قبل ثبت شده است');
      }
    }

    if (file) {
      const image = this._uploadImage(file);
      dto.image = image.fileName;
    }

    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async deleteCategoryById(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('دسته بندی مورد نظر یافت نشد');
    }
    return this.prisma.category.delete({ where: { id } });
  }

  async getCategoryById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { houseAds: true },
    });
    if (!category) {
      throw new NotFoundException('دسته بندی یافت نشد');
    }
    return category;
  }

  async getCategoriesList(page: number, limit: number) {
    const categoriesContent = await this.prisma.category.findMany({
      take: limit,
      skip: limit * page,
    });
    const categoriesCount = await this.prisma.category.count();

    return {
      content: categoriesContent,
      count: categoriesCount,
      currentPage: page,
      totalPage: Math.ceil(categoriesCount / limit),
    };
  }

  _uploadImage(file: Express.Multer.File) {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${new Date().getTime()}-${Math.random() * 100000000}${fileExtension}`;
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'categories',
      fileName,
    );
    fs.createWriteStream(file.buffer).write(filePath);
    return { fileName };
  }
}
