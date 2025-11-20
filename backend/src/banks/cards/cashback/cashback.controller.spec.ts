import { Test, TestingModule } from '@nestjs/testing';
import { CashbackController } from './cashback.controller';

describe('CashbackController', () => {
  let controller: CashbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashbackController],
    }).compile();

    controller = module.get<CashbackController>(CashbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
