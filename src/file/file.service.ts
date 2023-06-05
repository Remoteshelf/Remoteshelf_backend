import { Injectable, NotFoundException, UploadedFile } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}
  async saveFile(@UploadedFile() file: Express.Multer.File, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException();
    const savedFile = await this.prisma.file.create({
      data: {
        folder_id: null,
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        owner_id: userId,
      },
    });
    delete savedFile.owner_id;
    return savedFile;
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
}
