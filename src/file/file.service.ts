import { Injectable, NotFoundException, UploadedFile } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}
  async saveFile(@UploadedFile() file: Express.Multer.File, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException();
    const savedFile = await this.prisma.file.create({
      data: {
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
}
