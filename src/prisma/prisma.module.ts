import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PrismaService, ConfigService],
  exports: [ConfigService, PrismaService],
})
export class PrismaModule {}
