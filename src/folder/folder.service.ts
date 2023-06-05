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
}