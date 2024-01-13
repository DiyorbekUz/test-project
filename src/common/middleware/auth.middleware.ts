import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Unauthorized } from '../exception/error.exception';
import { handleErrorResponse } from 'src/utils/error-handler.util';
import { Connection } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: User;
            role?: string;
        }
    }
}

interface CustomJwtPayload extends JwtPayload {
    user_id: number;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private connection: Connection) { }
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const { authorization } = req.headers;
            if (!authorization) throw new Unauthorized();

            const [_, token] = authorization.split(" ");
            if (!token) throw new Unauthorized();

            let jwtSecret: string = process.env.JWT_SECRET;
            if (!jwtSecret) throw new Error("MISSING ELEMENT: JWT SECRET");

            const payload = jwt.verify(token, jwtSecret) as CustomJwtPayload;
            
            if (!payload) throw new Unauthorized();
            const { user_id } = payload;

            const userRepository = this.connection.getRepository(User);
            let user: User = await userRepository.findOne({ where: { id: user_id } });
            if (!user) throw new Unauthorized();

            req.user = user;
            req.role = user.role;
            next();
        } catch (error) {
            handleErrorResponse(res, error)
        }
    }
}
