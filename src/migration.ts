import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function migrate() {
    const app = await NestFactory.createApplicationContext(AppModule);

    try {
        const userService = app.get(UsersService);
        await app.init();

        const user = await userService.findOne(1);

        if (!user) {
            await userService.create({
                full_name: 'Diyorbek Ermamatov',
                username: 'diordev',
                password: '123456',
                role: 'director',
                group_id: null,
            });
        }

        console.log('Migration has been completed successfully');
    } catch (err) {
        console.log(err);
    } finally {
        await app.close();
    }
}

migrate();
