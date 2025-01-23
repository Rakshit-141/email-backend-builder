import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';

@Controller()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not provided');
    }

    // ✅ Convert to Base64 string
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    return { base64: base64Image }; // ✅ Return Base64 instead of URL
  }
}
