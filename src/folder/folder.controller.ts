import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { FolderDto } from './dto/folder.dto';
import { FolderService } from './folder.service';

@Controller('folder')
export class FolderController {
  constructor(private folderService: FolderService) {}
  @UseGuards(JwtGuard)
  @Post('create')
  @UsePipes(new ValidationPipe())
  createFolder(@Body() dto: FolderDto, @Request() req) {
    return this.folderService.createFolder(dto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Delete('delete/:id')
  deleteFolder(@Param('id', ParseIntPipe) id: number) {
    return this.folderService.deleteFolder(id);
  }

  @UseGuards(JwtGuard)
  @Get('/root')
  getRootFilesAndFolders() {
    return this.folderService.getRootFilesAndFolders();
  }

  @UseGuards(JwtGuard)
  @Get('/all/:id')
  getAllContents(@Param('id', ParseIntPipe) folderId: number) {
    return this.folderService.getAllContentsByFolderId(folderId);
  }
}
