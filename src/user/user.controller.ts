import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UpdateUserDTO } from './dtos';
import { RolePipe, ValidateUploadImage } from 'src/config/pipes';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  @Inject(UserService) private readonly userService: UserService;

  @Post()
  createPost(@Body() dto: CreateUserDTO) {
    return this.userService.createUser(dto);
  }

  @Put(':id')
  updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDTO,
  ) {
    return this.userService.updateUserById(id, dto);
  }

  @Delete(':id')
  deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUserById(id);
  }

  @Get('/detail/:role/:id')
  findUserById(
    @Param('id', ParseIntPipe) id: number,
    @Param('role', RolePipe) role: string,
  ) {
    return this.userService.findUserById(id, role.toUpperCase() as any);
  }

  @Get(':role')
  findUsers(
    @Param('role', RolePipe) role: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.findUsers(role.toUpperCase() as any, +page, +limit);
  }

  @Post('upload-profile')
  @UseInterceptors(FileInterceptor('profile'))
  uploadProfileEstateConsultant(
    @UploadedFile(ValidateUploadImage)
    profile: Express.Multer.File,
  ) {
    return this.userService.uploadProfile(profile);
  }
}
