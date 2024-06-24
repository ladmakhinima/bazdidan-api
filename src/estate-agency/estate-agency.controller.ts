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
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' })],
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        exceptionFactory: () =>
          new BadRequestException(
            'باشد jpg , jpeg , png نوع فایل ارسالی باید از جنس ',
          ),
      }),
    )
    logo: Express.Multer.File,
  ) {
    return this.estateAgencyService.uploadEstateAgencyLogo(logo);
  }
}
