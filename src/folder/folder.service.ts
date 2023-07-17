import { Injectable, NotFoundException } from '@nestjs/common';
import { FolderDto } from './dto/folder.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FolderService {
  constructor(private prisma: PrismaService) {}
  async createFolder(dto: FolderDto, userId: number) {
    const folder = await this.prisma.folder.create({
      data: { name: dto.name, user_id: userId, parent_id: dto.parentId },
    });
    return folder;
  }

  async deleteFolder(id: number) {
    try {
      const result = await this.prisma.folder.delete({ where: { id: id } });
      return `${result.name} deleted successfully!`;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2025')
          return new NotFoundException('Error deleting folder!');
      }
      return 'Something went wrong!';
    }
  }

  async getRootFilesAndFolders() {
    try {
      const rootFiles = await this.prisma.file.findMany({
        include: {
          access: {
            select: {
              id: true,
              access_right: true,
              user: {
                select: { firstname: true, lastname: true, email: true },
              },
            },
          },
        },
        where: { folder_id: null },
      });
      const rootFolders = await this.prisma.folder.findMany({
        where: { parent_id: null },
      });
      return { files: rootFiles, folders: rootFolders };
    } catch (error) {
      throw error;
    }
  }
  async getAllContentsByFolderId(folderId: number) {
    try {
      const files = await this.prisma.file.findMany({
        include: {
          access: {
            select: {
              access_right: true,
              id: true,
              user: {
                select: { firstname: true, lastname: true, email: true },
              },
            },
          },
        },
        where: { folder_id: folderId },
      });
      const folders = await this.prisma.folder.findMany({
        where: { parent_id: folderId },
      });
      return { files: files, folders: folders };
    } catch (error) {
      throw error;
    }
  }
}
