import {
    Body,
    Controller,
    Post,
    Put,
    Res,
    Get,
    UseGuards,
    HttpCode,
    UploadedFile,
    UseInterceptors,
    BadRequestException, Delete
} from '@nestjs/common';
import {UserDTO, UserLoginDTO} from "../users/user.dto";
import {AuthService} from "./auth.service";
import {type Response} from 'express';
import {JwtAuthGuard} from "./jwt-auth.guard";
import {ApiBody, ApiConsumes, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UsersService} from "../users/users.service";
import {User} from "../common/decorators/user.decorator";
import AvatarInterceptor from "../common/interceptors/avatar.interceptor";

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
    public constructor(private authService: AuthService, private usersService: UsersService) {
    }

    @ApiOperation({summary: 'Регистрация пользователя'})
    @ApiResponse({status: 201, description: 'Зарегистрированный пользователь'})
    @ApiBody({type: UserDTO})
    @ApiConsumes('multipart/form-data')
    @Post()
    @HttpCode(201)
    @UseInterceptors(AvatarInterceptor)
    public async register(@UploadedFile() file: Express.Multer.File, @Body() dto: UserDTO, @Res() res: Response) {
        const data = await this.authService.register({...dto, avatar: `/uploads/${file.filename}`});

        res.cookie('access_token', data.accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        return res.send({success: true, data: {user: data.user}});
    }

    @ApiOperation({summary: 'Валидация данных перед регистрацией'})
    @ApiResponse({status: 200})
    @ApiBody({type: UserDTO})
    @Post("/validation")
    @HttpCode(200)
    public async validate(@Body() dto: UserDTO) {
        let user: any;
        try {
            user = await this.usersService.getUserByPhone(dto);
        } catch (e) {}

        if (user) {
            throw new BadRequestException("Пользователь с таким номером уже зарегистрирован");
        }
    }

    @ApiOperation({summary: 'Вход пользователя в аккаунт'})
    @ApiResponse({status: 200, description: 'Данные пользователя'})
    @ApiBody({type: UserLoginDTO})
    @Put()
    public async login(@Body() dto: UserLoginDTO, @Res() res: Response) {
        const data = await this.authService.login(dto);

        res.cookie('access_token', data.accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        return res.send({success: true, data: {user: data.user}});
    }

    @ApiOperation({summary: 'Получение пользователя по его токену'})
    @ApiResponse({status: 200, description: 'Данные пользователя'})
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public async getMe(@User("id") userId: number) {
        return this.usersService.findUser(userId);
    }

    @ApiOperation({summary: 'Выход из аккаунта'})
    @ApiResponse({status: 204})
    @ApiCookieAuth('access_token')
    @Delete()
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    public async logout(@Res() res: Response) {
        res.clearCookie('access_token');
        res.send();
    }
}
