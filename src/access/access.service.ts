import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccessDto, UpdateAccessDto } from 'src/access/dto/access.dto';
import { FileService } from 'src/file/file.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AccessService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    private userService: UsersService,
  ) {}

  async addAccess(dto: AccessDto) {
    try {
      await this.fileService.getFileById(dto.fileId);
      await this.userService.getUserById(dto.userId);
      let access = await this.prisma.access.findFirst({
        where: { file_id: dto.fileId, user_id: dto.userId },
      });
      if (!access) {
        access = await this.prisma.access.create({
          data: {
            access_right: dto.accessRight.toString(),
            file_id: dto.fileId,
            user_id: dto.userId,
          },
        });
        return access;
      } else {
        throw new ConflictException('The user already has an access');
      }
    } catch (e) {
      throw e;
    }
  }

  async updateAccess(id: number, dto: UpdateAccessDto) {
    try {
      let access = await this.prisma.access.findUnique({ where: { id: id } });
      if (!access) {
        throw new NotFoundException('Invalid access id');
      } else {
        access = await this.prisma.access.update({
          where: { id: id },
          data: { access_right: dto.accessRight },
        });
        console.log(access);
        return access;
      }
    } catch (e) {
      throw e;
    }
  }
}
