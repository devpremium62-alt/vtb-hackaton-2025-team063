import { Test, TestingModule } from '@nestjs/testing';
import { ConsentsController } from './consents.controller';

describe('ConsentsController', () => {
  let controller: ConsentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsentsController],
    }).compile();

    controller = module.get<ConsentsController>(ConsentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
