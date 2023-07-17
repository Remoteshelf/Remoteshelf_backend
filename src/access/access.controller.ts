import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { AccessDto, UpdateAccessDto } from 'src/access/dto/access.dto';
import { AccessService } from './access.service';

@Controller('access')
export class AccessController {
  constructor(private service: AccessService) {}
  @UseGuards(JwtGuard)
  @Post('/file')
  async addAccess(@Body() dto: AccessDto, @Request() req) {
    if (dto.userId == req.user.id) {
      throw new ConflictException('You already own this file');
    }
    return await this.service.addAccess(dto);
  }
  @UseGuards(JwtGuard)
  @Put('/:id')
  async updateAccess(
    @Body() dto: UpdateAccessDto,
    @Param('id', ParseIntPipe) id,
  ) {
    return await this.service.updateAccess(id, dto);
  }

  @UseGuards(JwtGuard)
  @Delete('/:id')
  async deleteAccess(@Param('id', ParseIntPipe) id) {
    return await this.service.deleteAccess(id);
  }
}
