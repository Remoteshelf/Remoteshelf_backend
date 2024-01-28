import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.auth.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.auth.signin(dto);
  }
}
