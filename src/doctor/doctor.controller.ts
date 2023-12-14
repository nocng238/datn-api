import {
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/user-decorator';
import { Client } from 'src/client/client.entity';
import { PaginationRequestDto } from 'src/shared/dto/pagination.request.dto';
import { pdfUploadOptions } from 'src/shared/utils/utils';
import { Doctor } from './doctor.entity';
import { DoctorService } from './doctor.service';
import { FindDoctor } from './dto/find.dto';

@Controller('doctor')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Get()
  async getListDoctors(
    @Query() findDoctor: FindDoctor,
    @Query() paginationRequestdto: PaginationRequestDto,
  ) {
    return this.doctorService.getListDoctors(findDoctor, paginationRequestdto);
  }

  @Post('upload-cv')
  @UseInterceptors(FileInterceptor('file', pdfUploadOptions))
  @UseGuards(JwtAuthGuard)
  async uploadCV(
    @GetUser() user: Client | Doctor,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!user.isDoctor) {
      throw new ForbiddenException('Not allow client');
    }
    return this.doctorService.uploadCV(user, file);
  }
}
