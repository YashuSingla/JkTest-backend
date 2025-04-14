import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'auth/guards/jwt-auth/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('posts')
  async getMyPosts(@Req() req) {
    const userId = req.user.id;
    return this.userService.getUserPosts(userId);
  }

  @Get('all')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
