import { Test, TestingModule } from '@nestjs/testing';
import { FamilyAccountsService } from './family-accounts.service';

describe('FamilyAccountsService', () => {
  let service: FamilyAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FamilyAccountsService],
    }).compile();

    service = module.get<FamilyAccountsService>(FamilyAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
