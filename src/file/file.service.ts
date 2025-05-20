import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AccessRole } from 'src/access/enums/enums';
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

  async deleteFile(id: number, userId: number) {
    try {
      const file = await this.prisma.file.findUnique({
        where: { id: id },
        select: { owner_id: true },
      });

      if (!file) {
        throw new NotFoundException('File not found!');
      }

      if (file.owner_id !== userId) {
        const access = await this.prisma.access.findUnique({
          where: {
            file_id_user_id: {
              file_id: id,
              user_id: userId,
            },
          },
          select: { role: true },
        });

        if (!access || access.role === AccessRole.VIEWER) {
          throw new UnauthorizedException(
            'You do not have permission to delete this file.',
          );
        }
      }

      // If owner or editor, proceed with deletion
      const result = await this.prisma.file.delete({ where: { id: id } });
      return `File with filename ${result.filename} has been deleted successfully!`;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Error deleting file: File not found.');
      }
      throw error; // Re-throw other errors
    }
  }

  async getFileById(id: number) {
    try {
      const file = await this.prisma.file.findUnique({
        include: {
          access: {
            select: {
              role: true, // Changed from access_right to role
              id: true,
              user: {
                select: { firstname: true, lastname: true, email: true },
              },
            },
          },
        },
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
        include: {
          access: {
            select: {
              role: true, // Changed from access_right to role
              id: true,
              user: {
                select: { firstname: true, lastname: true, email: true },
              },
            },
          },
        },
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
        include: {
          access: {
            select: {
              role: true, // Changed from access_right to role
              id: true,
              user: {
                select: { firstname: true, lastname: true, email: true },
              },
            },
          },
        },
        where: { owner_id: id },
      });
      return files;
    } catch (error) {
      throw error;
    }
  }
}
