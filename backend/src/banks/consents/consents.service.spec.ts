import { Test, TestingModule } from '@nestjs/testing';
import { ConsentsService } from './consents.service';

describe('ConsentsService', () => {
  let service: ConsentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsentsService],
    }).compile();

    service = module.get<ConsentsService>(ConsentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
