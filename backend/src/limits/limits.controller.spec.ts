import { Test, TestingModule } from '@nestjs/testing';
import { LimitsController } from './limits.controller';

describe('LimitsController', () => {
  let controller: LimitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LimitsController],
    }).compile();

    controller = module.get<LimitsController>(LimitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
