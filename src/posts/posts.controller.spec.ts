import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto/update-post.dto';
import { JwtAuthGuard } from 'auth/guards/jwt-auth/jwt-auth.guard';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'Test content'
  };

  const postsServiceMock = {
    findAll: jest.fn().mockResolvedValue([mockPost]),
    findOne: jest.fn().mockResolvedValue(mockPost),
    create: jest.fn().mockResolvedValue(mockPost),
    update: jest.fn().mockResolvedValue({ ...mockPost, title: 'Updated' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController,JwtAuthGuard],
      providers: [
        { provide: PostsService, useValue: postsServiceMock },
        
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all posts', async () => {
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockPost]);
  });

  it('should return a single post by id', async () => {
    const result = await controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockPost);
  });

  it('should create a new post', async () => {
    const dto: CreatePostDto = { title: 'Test Post', content: 'Test content' };
    const reqMock = { user: { id: 'abc' } }; // if needed in real logic
    const result = await controller.create(dto, reqMock);
    expect(service.create).toHaveBeenCalled();
    expect(result).toEqual(mockPost);
  });

  it('should update a post by id', async () => {
    const dto: UpdatePostDto = { title: 'Updated', content: 'Updated content' };
    const result = await controller.update('1', dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual({ ...mockPost, title: 'Updated' });
  });

  it('should delete a post by id', async () => {
    const result = await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: 'Post deleted successfully' });
  });
});
