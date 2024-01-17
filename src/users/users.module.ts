import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Group } from 'src/groups/entities/group.entity';
import { BcryptService } from 'src/utils/bcrypt.util';
import { Subject } from 'src/subjects/entities/subject.entity';
import { GroupsModule } from 'src/groups/groups.module';
import { GradesModule } from 'src/grades/grades.module';
import { SubjectsModule } from 'src/subjects/subjects.module';

@Module({
    imports: [forwardRef(() => SubjectsModule), forwardRef(() => GroupsModule), forwardRef(() => GradesModule), TypeOrmModule.forFeature([User, Group, Subject])],
    controllers: [UsersController],
    providers: [UsersService, BcryptService],
    exports: [UsersService]
})
export class UsersModule { }
