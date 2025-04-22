import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from 'user/entities/user.entity';
import { Post } from './entities/post.entity/post.entity';


const mockUser: User = {
  id: 123,
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  picture: 'http://example.com/pic.jpg',
  posts: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPost: Post = {
  id: 1,
  title: 'Test Post',
  content: 'Test content',
  user: mockUser,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('PostsService', () => {
  let service: PostsService;
  let repo: jest.Mocked<Repository<Post>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repo = module.get(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create and save a post with user', async () => {
      repo.create.mockReturnValue(mockPost);
      repo.save.mockResolvedValue(mockPost);

      const result = await service.create(
        { title: 'Test Post', content: 'Test content' },
        mockUser,
      );

      expect(repo.create).toHaveBeenCalledWith({
        title: 'Test Post',
        content: 'Test content',
        user: mockUser,
      });
      expect(repo.save).toHaveBeenCalledWith(mockPost);
      expect(result).toEqual(mockPost);
    });
  });

  describe('findOne()', () => {
    it('should return a post if it exists', async () => {
      repo.findOne.mockResolvedValue(mockPost);

      const result = await service.findOne(1);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user'],
      });
      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException if post does not exist', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should update and return the post', async () => {
      repo.findOne.mockResolvedValue(mockPost);
      repo.save.mockResolvedValue({ ...mockPost, title: 'Updated Title' });

      const result = await service.update(1, { title: 'Updated Title' });

      expect(repo.save).toHaveBeenCalledWith({ ...mockPost, title: 'Updated Title' });
      expect(result.title).toBe('Updated Title');
    });
  });

  describe('remove()', () => {
    it('should delete a post if it exists', async () => {
      repo.delete.mockResolvedValue({ affected: 1, raw: {} });

      await service.remove(1);
      expect(repo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if post not found', async () => {
      repo.delete.mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
