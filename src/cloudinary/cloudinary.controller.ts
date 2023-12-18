import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from 'src/shared/utils/utils';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class ClientController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  @Post('/image')
  @UseInterceptors(FileInterceptor('file', imageUploadOptions))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      url: (await this.cloudinaryService.uploadFile(file)).secure_url,
    };
  }
}
