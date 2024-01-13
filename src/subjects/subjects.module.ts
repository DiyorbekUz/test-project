import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { GroupsService } from 'src/groups/groups.service';
import { GradesService } from 'src/grades/grades.service';
import { Group } from 'src/groups/entities/group.entity';
import { Grade } from 'src/grades/entities/grade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Grade, Group])],
  controllers: [SubjectsController],
  providers: [SubjectsService, GroupsService, GradesService],
})
export class SubjectsModule {}
