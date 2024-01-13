import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { Schedule } from './entities/schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from 'src/groups/groups.service';
import { UsersService } from 'src/users/users.service';
import { Group } from 'src/groups/entities/group.entity';
import { User } from 'src/users/entities/user.entity';
import { BcryptService } from 'src/utils/bcrypt.util';
import { SubjectsService } from 'src/subjects/subjects.service';
import { Subject } from 'src/subjects/entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, User, Group, Subject])],
  controllers: [SchedulesController],
  providers: [SchedulesService, UsersService, SubjectsService, GroupsService, BcryptService],
})
export class SchedulesModule {}
