import {Body, Controller, Post, Put, Res, Get, UseGuards, Req, HttpCode} from '@nestjs/common';
import {UserDTO, UserLoginDTO} from "../users/user.dto";
import {AuthService} from "./auth.service";
import {type Request, type Response} from 'express';
import {JwtAuthGuard} from "./jwt-auth.guard";

@Controller('auth')
export class AuthController {
    public constructor(private authService: AuthService) {
    }

    @Post()
    @HttpCode(201)
    public async register(@Body() dto: UserDTO, @Res() res: Response) {
        const data = await this.authService.register(dto);

        res.cookie('access_token', data.accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        return res.send({success: true, data: {user: data.user}});
    }

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

    @Get()
    @UseGuards(JwtAuthGuard)
    public async getMe(@Req() req: Request) {
        return req.user;
    }
}
