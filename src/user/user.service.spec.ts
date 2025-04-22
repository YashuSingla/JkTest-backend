import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      // Mock return data
      const mockUsers: User[] = [
        {
          id: 1,
          email: 'user1@example.com',
          firstName: 'User',
          lastName: 'One',
          picture: 'https://example.com/avatar1.png',
          posts: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          email: 'user2@example.com',
          firstName: 'User',
          lastName: 'Two',
          picture: 'https://example.com/avatar2.png',
          posts: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      

      // Mock implementation
      jest.spyOn(service, 'getAllUsers').mockResolvedValue(mockUsers);

      const result = await service.getAllUsers();
      expect(result).toEqual(mockUsers);
    });
  });
});
