import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { SearchService } from './search.service';
import { SearchQueryDto } from './search.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @UseGuards(JwtGuard)
  @Get()
  @ApiOperation({ summary: 'Search for files and folders' })
  @ApiResponse({
    status: 200,
    description: 'Search results successfully retrieved.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., empty search term)',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async performSearch(@Request() req, @Query() query: SearchQueryDto) {
    return this.searchService.search(req.user.id, query.q);
  }
}
