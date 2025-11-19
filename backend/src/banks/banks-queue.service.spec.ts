import { Test, TestingModule } from '@nestjs/testing';
import { BanksQueueService } from './banks-queue.service';

describe('BanksQueueService', () => {
  let service: BanksQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BanksQueueService],
    }).compile();

    service = module.get<BanksQueueService>(BanksQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
