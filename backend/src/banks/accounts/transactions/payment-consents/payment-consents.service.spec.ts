import { Test, TestingModule } from '@nestjs/testing';
import { PaymentConsentsService } from './payment-consents.service';

describe('PaymentConsentsService', () => {
  let service: PaymentConsentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentConsentsService],
    }).compile();

    service = module.get<PaymentConsentsService>(PaymentConsentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
