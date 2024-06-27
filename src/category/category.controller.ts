import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dtos';
import { AccessTokenGuard } from 'src/auth/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateUploadImage } from 'src/config/pipes';

@Controller('category')
export class CategoryController {
  @Inject(CategoryService) private readonly categoryService: CategoryService;

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  createCategory(
    @Body() dto: CreateCategoryDTO,
    @UploadedFile(ValidateUploadImage) file: Express.Multer.File,
  ) {
    return this.categoryService.createCategory(dto, file);
  }

  @Get()
  getCategoriesList(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.categoryService.getCategoriesList(+page, +limit);
  }

  @Get(':id')
  getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getCategoryById(id);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  deleteCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategoryById(id);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  @SetMetadata('IS_FILE_REQUIRE', false)
  updateCategoryById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDTO,
    @UploadedFile(ValidateUploadImage) file: Express.Multer.File,
  ) {
    return this.categoryService.updateCategoryById(id, dto, file);
  }
}
