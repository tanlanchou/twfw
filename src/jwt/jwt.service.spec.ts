// src/jwt/jwt.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [JwtService],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createToken', () => {
    it('should create a token', async () => {
      const token = await service.createToken({ username: 'testuser' });
      expect(token).toBeDefined();
    });
  });

  describe('verifyToken', () => {
    it('should verify a token', async () => {
      const token = await service.createToken({ username: 'testuser' });
      const decodedToken = await service.verifyToken(token);
      expect(decodedToken.username).toEqual('testuser');
    });
  });

  describe('refreshToken', () => {
    it('should refresh a token', async () => {
      const token = await service.createToken({ username: 'testuser' });
      const newToken = await service.refreshToken(token);
      expect(newToken).toBeDefined();
    });
  });
});