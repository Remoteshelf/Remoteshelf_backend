import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileDto } from './dto/file.dto';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}
  async saveFile(file: Express.Multer.File, dto: FileDto) {
    try {
      const savedFile = dto.folderId
        ? await this.prisma.file.create({
            data: {
              filename: file.originalname,
              path: file.path,
              mimetype: file.mimetype,
              size: file.size,
              folder: { connect: { id: dto.folderId } },
              owner: { connect: { id: dto.userId } },
            },
          })
        : await this.prisma.file.create({
            data: {
              filename: file.originalname,
              path: file.path,
              mimetype: file.mimetype,
              size: file.size,
              owner: { connect: { id: dto.userId } },
            },
          });
      return savedFile;
    } catch (error) {
      throw error;
    }
  }

  async deleteFile(id: number) {
    try {
      const result = await this.prisma.file.delete({ where: { id: id } });
      return `File with filename ${result.filename} has been deleted successfully!`;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2025') {
          return new NotFoundException('Error deleting file!');
        }
      }
      return 'Something went wrong!';
    }
  }

  async getFileById(id: number) {
    try {
      const file = await this.prisma.file.findUnique({
        where: {
          id: id,
        },
      });
      if (!file) throw new NotFoundException('File not found!');
      return file;
    } catch (error) {
      throw error;
    }
  }

  async getFilesByFolderId(id: number) {
    try {
      const files = await this.prisma.file.findMany({
        where: { folder_id: id },
      });
      return files;
    } catch (error) {
      throw error;
    }
  }

  async getFilesByUserId(id: number) {
    try {
      const files = await this.prisma.file.findMany({
        where: { owner_id: id },
      });
      return files;
    } catch (error) {
      throw error;
    }
  }
}
