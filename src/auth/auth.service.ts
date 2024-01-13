import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { BcryptService } from '../utils/bcrypt.util';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<User | null> {
        const user = await this.userService.findOneByUsername(username);
        if (user && (await this.bcryptService.comparePassword(password, user.password))) {
            return user;
        }
        return null;
    }

    async validateUserById(userId: number): Promise<User | null> {
        return this.userService.findOne(userId);
    }

    async generateAccessToken(user: User): Promise<string> {
        const payload = { user_id: user.id };
        return this.jwtService.sign(payload);
    }

    async generateRefreshToken(user: User): Promise<string> {
        const payload = { sub: user.id };
        return this.jwtService.sign(payload, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
        });
    }

    async login(user: User): Promise<{ access_token: string }> {
        const token = await this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user);
        await this.userService.updateRefreshToken(user.id, refreshToken);
        return {
            access_token: token,
        };
    }

    async refreshToken(token: string): Promise<{ access_token: string } | null> {
        try {
            const payload = this.jwtService.verify(token) as { user_id: number };
            const user = await this.userService.findOne(payload.user_id);

            if (user) {
                const newToken = await this.generateAccessToken(user);
                const newRefreshToken = await this.generateRefreshToken(user);

                await this.userService.updateRefreshToken(user.id, newRefreshToken);

                return { access_token: newToken };
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    async logout(token: string): Promise<{ ok: boolean, message: string } | null> {
        try {
            const payload = this.jwtService.verify(token) as { user_id: number };
            const user = await this.userService.findOne(payload.user_id);
            if (user) {
                await this.userService.updateRefreshToken(user.id, null);
                return { ok: true, message: 'User successfully logged out' };
            }
            return null;
        } catch (error) {
            return null;
        }
    }
}