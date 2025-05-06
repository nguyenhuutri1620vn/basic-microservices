import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('login')
  async ogin(@Query('username') username: string, @Query('password') password: string): Promise<{ message: string }> {
    return this.appService.validateUser(username, password);
  }
}
