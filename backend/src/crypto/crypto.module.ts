import {Global, Module} from '@nestjs/common';
import { CryptoService } from './crypto.service';
import {EnvKeyProvider} from "./key.provider";

@Global()
@Module({
  providers: [
    { provide: 'KeyProvider', useClass: EnvKeyProvider },
    {
      provide: CryptoService,
      useFactory: async (keyProvider: EnvKeyProvider) => {
        const svc = new CryptoService(keyProvider);
        await svc.onModuleInit();
        return svc;
      },
      inject: ['KeyProvider'],
    },
  ],
  exports: [CryptoService],
})
export class CryptoModule {}
