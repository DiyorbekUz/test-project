import { Module } from '@nestjs/common';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from './entities/grade.entity';
import { User } from 'src/users/entities/user.entity';
import { GroupsService } from 'src/groups/groups.service';
import { UsersService } from 'src/users/users.service';
import { BcryptService } from 'src/utils/bcrypt.util';
import { Subject } from 'src/subjects/entities/subject.entity';
import { SubjectsService } from 'src/subjects/subjects.service';
import { Group } from 'src/groups/entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grade, User, Subject, Group])],
  controllers: [GradesController],
  providers: [GradesService, UsersService, BcryptService, GroupsService, SubjectsService],
  
})
export class GradesModule {}
