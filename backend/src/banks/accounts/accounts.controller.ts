import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import {AccountsService} from "./accounts.service";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import {User} from "../../common/decorators/user.decorator";

@Controller('accounts')
export class AccountsController {
    public constructor(private readonly accountsService: AccountsService) {
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    public async getAccounts(@User("id") userId: number) {
        return this.accountsService.getAccounts(userId);
    }

    @Get("/:bankId/:accountId/balance")
    @UseGuards(JwtAuthGuard)
    public async getBalance(@Param() params: object, @User("id") userId: number) {
        return this.accountsService.getBalance(params["accountId"], params["bankId"], userId);
    }

    @Get("/balance")
    @UseGuards(JwtAuthGuard)
    public async getTotalBalance(@User("id") userId: number) {
        return this.accountsService.getTotalBalance(userId);
    }
}
