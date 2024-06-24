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
import { EstateAgencyService } from './estate-agency.service';
import { InsertEstateAgencyDTO } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateUploadImage } from 'src/config/pipes';

@Controller('estate-agency')
export class EstateAgencyController {
  @Inject(EstateAgencyService)
  private readonly estateAgencyService: EstateAgencyService;

  @Post()
  createEtateAgency(@Body() dto: InsertEstateAgencyDTO) {
    return this.estateAgencyService.createEstateAgency(dto);
  }

  @Delete(':id')
  deleteEstateAgencyById(@Param('id', ParseIntPipe) id: number) {
    return this.estateAgencyService.deleteEstateAgencyById(id);
  }

  @Put(':id')
  updateEtateAgencyById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: InsertEstateAgencyDTO,
  ) {
    return this.estateAgencyService.updateEstateAgencyById(id, dto);
  }

  @Get(':id')
  findEstateAgencyById(@Param('id', ParseIntPipe) id: number) {
    return this.estateAgencyService.findEstateAgencyById(id);
  }

  @Get()
  findAllEStateAgencies(@Query() query: any) {
    return this.estateAgencyService.findAllEstateAgencies(
      query.page,
      query.limit,
    );
  }

  @Post('upload-logo')
  @UseInterceptors(FileInterceptor('logo'))
  uploadEstateAgencyLogo(
    @UploadedFile(ValidateUploadImage)
    logo: Express.Multer.File,
  ) {
    return this.estateAgencyService.uploadEstateAgencyLogo(logo);
  }
}
