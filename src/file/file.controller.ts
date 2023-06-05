import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { multerConfig } from 'src/config/multer.config';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}
  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async upload(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.fileService.saveFile(file, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.fileService.deleteFile(id);
  }
}
