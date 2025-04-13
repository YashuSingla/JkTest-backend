import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockPost: Post = {
  id: 1,
  title: 'Test Post',
  content: 'Test content',
  authorId: '123',
  createdAt: new Date(),
  updatedAt: new Date()
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
            findOneBy: jest.fn(),
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<PostsService>(PostsService);
    repo = module.get(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create and save a post', async () => {
      repo.create.mockReturnValue(mockPost);
      repo.save.mockResolvedValue(mockPost);

      const result = await service.create({ title: 'Test Post', content: 'Test content' }, '123');
      expect(repo.create).toHaveBeenCalledWith({ title: 'Test Post', content: 'Test content', authorId: '123' });
      expect(repo.save).toHaveBeenCalledWith(mockPost);
      expect(result).toEqual(mockPost);
    });
  });

  describe('findAll()', () => {
    it('should return all posts', async () => {
      repo.find.mockResolvedValue([mockPost]);

      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalledWith({ order: { createdAt: 'DESC' } });
      expect(result).toEqual([mockPost]);
    });
  });

  describe('findOne()', () => {
    it('should return a post if it exists', async () => {
      repo.findOneBy.mockResolvedValue(mockPost);

      const result = await service.findOne(1);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException if post does not exist', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should update and return the post', async () => {
      repo.findOneBy.mockResolvedValue(mockPost);
      repo.save.mockResolvedValue({ ...mockPost, title: 'Updated' });

      const result = await service.update(1, { title: 'Updated' });
      expect(repo.save).toHaveBeenCalledWith({ ...mockPost, title: 'Updated' });
      expect(result.title).toBe('Updated');
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
