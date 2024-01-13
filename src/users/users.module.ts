import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Group } from 'src/groups/entities/group.entity';
import { BcryptService } from 'src/utils/bcrypt.util';
import { GroupsService } from 'src/groups/groups.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Group])],
    controllers: [UsersController],
    providers: [UsersService, BcryptService, GroupsService],
})
export class UsersModule { }
