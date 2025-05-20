import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get, // Added Get
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { AccessDto, UpdateAccessDto } from 'src/access/dto/access.dto';
import { AccessService } from './access.service';

@ApiTags('Access Control')
@Controller('access')
export class AccessController {
  constructor(private service: AccessService) {}

  @UseGuards(JwtGuard)
  @Post('/file')
  @ApiOperation({ summary: 'Grant access to a file' })
  @ApiResponse({ status: 201, description: 'Access granted successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., validation error)',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized (not file owner)' })
  @ApiResponse({ status: 404, description: 'File or User not found' })
  @ApiResponse({
    status: 409,
    description: 'Conflict (access already exists or granting to self)',
  })
  async addAccess(@Body() dto: AccessDto, @Request() req) {
    if (dto.userId == req.user.id) {
      throw new ConflictException('You already own this file');
    }
    return await this.service.addAccess(dto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Put('/:id')
  @ApiOperation({ summary: 'Update access role for a file' })
  @ApiResponse({ status: 200, description: 'Access role updated successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., validation error)',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized (not file owner)' })
  @ApiResponse({ status: 404, description: 'Access entry or File not found' })
  async updateAccess(
    @Body() dto: UpdateAccessDto,
    @Param('id', ParseIntPipe) id,
    @Request() req,
  ) {
    return await this.service.updateAccess(id, dto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Delete('/:id')
  // Assuming similar responses for delete, can be more specific if needed
  @ApiOperation({ summary: 'Revoke access to a file' })
  @ApiResponse({ status: 200, description: 'Access revoked successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized (not file owner)' })
  @ApiResponse({ status: 404, description: 'Access entry not found' })
  async deleteAccess(@Param('id', ParseIntPipe) id, @Request() req) {
    return await this.service.deleteAccess(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get('/shared-with-me')
  @ApiOperation({ summary: 'List files shared with the current user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved shared files.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSharedWithMe(@Request() req) {
    return this.service.getSharedWithMe(req.user.id);
  }
}
