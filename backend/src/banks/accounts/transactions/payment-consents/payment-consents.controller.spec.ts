import { Test, TestingModule } from '@nestjs/testing';
import { PaymentConsentsController } from './payment-consents.controller';

describe('PaymentConsentsController', () => {
  let controller: PaymentConsentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentConsentsController],
    }).compile();

    controller = module.get<PaymentConsentsController>(PaymentConsentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
