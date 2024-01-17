import { Module, forwardRef } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Grade } from 'src/grades/entities/grade.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ forwardRef(() => UsersModule), TypeOrmModule.forFeature([Subject, Grade, Group, User])],
  controllers: [SubjectsController],
  providers: [SubjectsService],
  exports: [SubjectsService]
})
export class SubjectsModule {}
