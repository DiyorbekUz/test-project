import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { handleErrorResponse } from 'src/utils/error-handler.util';
import { Request, Response } from 'express';
import { BadRequest, NotFound } from 'src/common/exception/error.exception';
import { LoginDto } from './dto/login.dto';
import { loginSchema } from './schema/login.schema';
import { UsersService } from 'src/users/users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        try {
            const { error, value } = loginSchema.validate(loginDto);
            if (error) throw new BadRequest(error.message, 'INVALID_FIELDS');

            const { username, password } = loginDto;

            const user = await this.authService.validateUser(username, password);
            if (!user) throw new NotFound('User', 'USER_NOT_FOUND');

            const tokenResult = await this.authService.login(user);
            if (!tokenResult) throw new BadRequest('Failed to login', 'LOGIN_FAILED');

            return res.json({
                ok: true,
                message: 'User successfully logged in',
                data: tokenResult,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @ApiBearerAuth()
    @Post('refresh-token')
    async refreshToken(@Req() req: Request, @Res() res: Response) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            const result = await this.authService.refreshToken(token);
            if (!result) throw new BadRequest('Failed to refresh token', 'REFRESH_TOKEN_FAILED');

            return res.json({
                ok: true,
                message: 'Token successfully refreshed',
                data: result,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }
    
    @ApiBearerAuth()
    @Post('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            const result = await this.authService.logout(token);
            if (!result) throw new BadRequest('Failed to logout', 'LOGOUT_FAILED');

            return res.json({
                ok: true,
                message: 'User successfully logged out',
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }
}