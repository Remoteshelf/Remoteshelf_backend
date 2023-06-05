import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { FolderModule } from './folder/folder.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, ConfigModule, FileModule, FolderModule],
  controllers: [UsersController],
  providers: [PrismaService],
})
export class AppModule {}
