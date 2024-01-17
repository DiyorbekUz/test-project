import { Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Include ConfigService from @nestjs/config
import { GroupsModule } from './groups/groups.module';
import { AuthModule } from './auth/auth.module';
import { SubjectsModule } from './subjects/subjects.module';
import { GradesModule } from './grades/grades.module';
import { UsersModule } from './users/users.module';
import { NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { SchedulesModule } from './schedules/schedules.module';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.cwd() + '/.env' });

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.number().default(5432),
                DB_USERNAME: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_DATABASE: Joi.string().required(),
            }),
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME || '1h',
            },
        }),
        DatabaseModule,
        UsersModule,
        GroupsModule,
        AuthModule,
        SubjectsModule,
        GradesModule,
        SchedulesModule,
    ],
    controllers: [AppController],
    providers: [AppService, ConfigService], // Include ConfigService in providers
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude(
                { path: 'auth/login', method: RequestMethod.POST },
                { path: 'swagger', method: RequestMethod.GET },
                { path: '/', method: RequestMethod.GET }
            )
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
