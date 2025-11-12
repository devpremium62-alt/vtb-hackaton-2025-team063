import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post, Put,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ApiConsumes, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ChildAccountsService} from "./child-accounts.service";
import {JwtAuthGuard} from "../../../auth/jwt-auth.guard";
import {User} from "../../../common/decorators/user.decorator";
import {ChildAccountDTO, UpdateChildAccountDTO} from "./child-account.dto";
import AvatarInterceptor from "../../../common/interceptors/avatar.interceptor";
import {DepositDTO} from "../transactions/transaction.dto";

@ApiTags("Детские счета")
@Controller('child-accounts')
export class ChildAccountsController {
    public constructor(private readonly childAccountsService: ChildAccountsService) {
    }

    @ApiOperation({summary: 'Получение детских счетов семьи'})
    @ApiResponse({status: 200, description: 'Список детских счетов'})
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public async getAll(@User("id") userId: number) {
        return this.childAccountsService.getChildAccounts(userId);
    }

    @ApiOperation({summary: 'Создание детского счета'})
    @ApiResponse({status: 201, description: 'Созданный детский счет'})
    @ApiCookieAuth('access_token')
    @ApiConsumes('multipart/form-data')
    @Post()
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AvatarInterceptor)
    public async create(@UploadedFile() file: Express.Multer.File, @User("id") userId: number, @Body() childAccountDTO: ChildAccountDTO) {
        return this.childAccountsService.createChildAccount(userId, {
            ...childAccountDTO,
            avatar: `/uploads/${file.filename}`
        });
    }

    @ApiOperation({summary: 'Удаление детского счета'})
    @ApiResponse({status: 204})
    @ApiCookieAuth('access_token')
    @Delete("/:childAccountId")
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    public async delete(@User("id") userId: number, @Param("childAccountId") childAccountId: string) {
        return this.childAccountsService.deleteChildAccount(userId, childAccountId);
    }

    @ApiOperation({summary: 'Редактирование детского счета'})
    @ApiResponse({status: 200, description: "Обновленный детский счет"})
    @ApiCookieAuth('access_token')
    @Patch("/:childAccountId")
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    public async update(@User("id") userId: number, @Param("childAccountId") childAccountId: string, @Body() updateChildAccountDTO: UpdateChildAccountDTO) {
        return this.childAccountsService.updateChildAccount(userId, childAccountId, updateChildAccountDTO);
    }

    @ApiOperation({summary: 'Пополнение детского счета'})
    @ApiResponse({status: 200, description: "Детский счет"})
    @ApiCookieAuth('access_token')
    @Put("/:childAccountId")
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    public async deposit(@User("id") userId: number, @Param("childAccountId") childAccountId: string, @Body() depositDTO: DepositDTO) {
        return this.childAccountsService.depositChildAccount(userId, childAccountId, depositDTO);
    }
}
