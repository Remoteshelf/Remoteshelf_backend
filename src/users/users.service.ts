import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getUserById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException('User with given id not found');
    }
    delete user.password;
    return user;
  }

  async getAllUsers() {
    const users = await this.prismaService.user.findMany({
      select: {
        email: true,
        id: true,
        firstname: true,
        lastname: true,
      },
    });
    if (!users) {
      throw new NotFoundException('There was an error fetching user list');
    }
    return users;
  }
}
