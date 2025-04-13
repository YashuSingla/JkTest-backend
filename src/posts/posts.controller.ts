import { Controller, Get, Post as HttpPost, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto/update-post.dto';
import { JwtAuthGuard } from 'auth/guards/jwt-auth/jwt-auth.guard';


@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  // Public: Get all posts (for dashboard display)
  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  // Public: Get a single post by id (for post detail page)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  // Protected: Create a new post (only for logged in users)
  @HttpPost()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createPostDto: CreatePostDto, @Req() req) {
    return this.postsService.create(createPostDto, JSON.stringify(Math.random() * 1000));
  }

  // Protected: Update a post
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  // Protected: Delete a post
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.postsService.remove(+id);
    return { message: 'Post deleted successfully' };
  }
}
