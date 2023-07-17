import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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

  async addAccess(dto: AccessDto, currentUserId: number) {
    try {
      const file = await this.fileService.getFileById(dto.fileId);
      if (file) {
        if (file.owner_id != currentUserId) {
          throw new UnauthorizedException(
            'You do not have permission to perform this action',
          );
        }
      }
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

  async updateAccess(id: number, dto: UpdateAccessDto, currentUserId: number) {
    try {
      let access = await this.prisma.access.findUnique({ where: { id: id } });
      if (!access) {
        throw new NotFoundException('Invalid access id');
      } else {
        const file = await this.prisma.file.findUnique({
          where: { id: access.file_id },
        });
        if (file) {
          if (file.owner_id != currentUserId) {
            return new UnauthorizedException(
              'You do not have permission to perform this action',
            );
          }
          access = await this.prisma.access.update({
            where: { id: id },
            data: { access_right: dto.accessRight },
          });
          console.log(access);
          return access;
        }
      }
    } catch (e) {
      throw e;
    }
  }

  async deleteAccess(id: number, currentUserId: number) {
    try {
      if (!(await this.prisma.access.findUnique({ where: { id: id } }))) {
        throw new NotFoundException('Could not delete the access');
      }
      const access = await this.prisma.access.findUnique({ where: { id: id } });
      if (access) {
        const file = await this.prisma.file.findUnique({
          where: { id: access.file_id },
        });
        if (file) {
          if (file.owner_id != currentUserId) {
            return new UnauthorizedException(
              'You do not have permission to perform this action',
            );
          }
          await this.prisma.access.delete({ where: { id: id } });
        }
      }
    } catch (e) {
      throw e;
    }
  }
}
