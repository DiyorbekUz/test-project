import { Module, forwardRef } from '@nestjs/common';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from './entities/grade.entity';
import { User } from 'src/users/entities/user.entity';
import { BcryptService } from 'src/utils/bcrypt.util';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Group } from 'src/groups/entities/group.entity';
import { UsersModule } from 'src/users/users.module';
import { SubjectsModule } from 'src/subjects/subjects.module';
import { GroupsModule } from 'src/groups/groups.module';

@Module({
    imports: [forwardRef(() => UsersModule), forwardRef(() => SubjectsModule), forwardRef(() => GroupsModule), TypeOrmModule.forFeature([Grade, User, Subject, Group])],
    controllers: [GradesController],
    providers: [GradesService, BcryptService],
    exports: [GradesService]

})
export class GradesModule { }
