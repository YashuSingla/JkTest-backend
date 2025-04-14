import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity/post.entity';
import { CreatePostDto } from './dto/create-post.dto/create-post.dto';
import { User } from 'user/entities/user.entity';
import { UpdatePostDto } from './dto/update-post.dto/update-post.dto';


@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      user, // linking user entity directly
    });
    return this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.postsRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  
    // Filter out posts that have no associated user
    return posts.filter((post) => post.user !== null);
  }

  async findByUserEmail(email: string): Promise<Post[]> {
    if (!email || typeof email !== 'string') {
      throw new BadRequestException('Invalid user email');
    }
  
    return this.postsRepository.find({
      where: { user: { email } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
  

  async findOne(id: number): Promise<Post> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid ID');
    }
  
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  
    return post;
  }
  

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const result = await this.postsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }
}
