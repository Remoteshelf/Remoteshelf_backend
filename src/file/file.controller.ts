import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { multerConfig } from 'src/config/multer.config';
import { FileService } from './file.service';
import { FileDto } from './dto/file.dto';
import { Response } from 'express';
import * as path from 'path';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}
  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Body() body: any,
  ) {
    const dto = new FileDto();
    dto.folderId = parseInt(body.folderId);

    dto.userId = req.user.id;
    return this.fileService.saveFile(file, dto);
  }

  @UseGuards(JwtGuard)
  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.fileService.deleteFile(id);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getFileById(@Query('id', ParseIntPipe) id: number) {
    return await this.fileService.getFileById(id);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getFilesByFolderId(@Query('folderId', ParseIntPipe) folderId: number) {
    return await this.fileService.getFilesByFolderId(folderId);
  }

  @UseGuards(JwtGuard)
  @Get('/me')
  async getFilesByUserId(@Request() req) {
    return await this.fileService.getFilesByUserId(req.user.id);
  }
  @UseGuards(JwtGuard)
  @Get('/download/:id')
  async downloadFile(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const file = await this.fileService.getFileById(id);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${file.filename}`,
    );
    const filepath = path.join(process.cwd(), file.path);
    res.sendFile(filepath);
  }
}
