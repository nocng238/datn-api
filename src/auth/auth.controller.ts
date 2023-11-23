import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Credentials } from './dto/credentials.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials: Credentials) {
    return this.authService.login(credentials);
  }
}
