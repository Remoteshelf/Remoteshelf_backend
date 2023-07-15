import { Module } from '@nestjs/common';
import { AccessService } from './access.service';
import { AccessController } from './access.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FileModule } from 'src/file/file.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, FileModule, UsersModule],
  providers: [AccessService],
  controllers: [AccessController],
})
export class AccessModule {}
