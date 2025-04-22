import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity/post.entity';
import { User } from 'user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post]),TypeOrmModule.forFeature([User])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
