import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Post } from 'posts/entities/post.entity/post.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserPosts(userId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOrCreateUser(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }): Promise<User> {
    let user = await this.userRepository.findOneBy({ email: googleUser.email });
    
    if (!user) {
      user = this.userRepository.create(googleUser);
      user = await this.userRepository.save(user);
    }

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      order: { createdAt: 'DESC' }, // optional, to get latest users first
    });
  }
  
}
