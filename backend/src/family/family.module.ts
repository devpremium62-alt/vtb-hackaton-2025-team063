import {Module} from '@nestjs/common';
import {FamilyService} from './family.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/user.entity";
import { CodeModule } from './code/code.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), CodeModule],
    providers: [FamilyService],
    exports: [FamilyService],
})
export class FamilyModule {
}
