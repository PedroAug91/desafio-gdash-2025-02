import { Test, TestingModule } from '@nestjs/testing';
import { DefaultUserCreatorService } from './default-user-creator.service';

describe('DefaultUserCreatorService', () => {
  let service: DefaultUserCreatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DefaultUserCreatorService],
    }).compile();

    service = module.get<DefaultUserCreatorService>(DefaultUserCreatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
