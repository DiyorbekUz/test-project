import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { BadRequest, Forbidden, NotFound } from 'src/common/exception/error.exception';
import { Request, Response } from 'express';
import { handleErrorResponse } from 'src/utils/error-handler.util';
import { createScheduleSchema } from './schema/create-schedule.schema';
import { updateScheduleSchema } from './schema/update-schedule.schema';
import { UsersService } from 'src/users/users.service';
import { GroupsService } from 'src/groups/groups.service';
import { SubjectsService } from 'src/subjects/subjects.service';
import { isFutureTime } from 'src/utils/helper.util';
import * as commonValidator from 'src/utils/common-validator.util';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('schedules')
@ApiBearerAuth()
@Controller('schedules')
export class SchedulesController {
    constructor(
        private readonly schedulesService: SchedulesService,
        private readonly usersService: UsersService,
        private readonly groupsService: GroupsService,
        private readonly subjectsService: SubjectsService
    ) { }

    @Post()
    async create(@Body() createScheduleDto: CreateScheduleDto, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director') throw new Forbidden();

            const { error } = createScheduleSchema.validate(createScheduleDto);
            if (error) throw new BadRequest(error.message, 'INVALID_FIELDS');

            if(!isFutureTime(createScheduleDto?.start_date)) throw new BadRequest('Start date must be a future time', 'START_DATE_MUST_BE_A_FUTURE_TIME');
            if(!isFutureTime(createScheduleDto?.end_date)) throw new BadRequest('End date must be a future time', 'END_DATE_MUST_BE_A_FUTURE_TIME');

            let teacher_id = createScheduleDto?.teacher_id;
            let group_id = createScheduleDto?.group_id;
            let subject_id = createScheduleDto?.subject_id;

            const teacher = await this.usersService.findOne(teacher_id);
            if (!teacher) throw new NotFound('Teacher', 'TEACHER_NOT_FOUND');

            if(teacher?.role !== 'teacher') throw new BadRequest('User is not a teacher', 'USER_IS_NOT_A_TEACHER');

            const group = await this.groupsService.findOne(group_id);
            if (!group) throw new NotFound('Group', 'GROUP_NOT_FOUND');

            const subject = await this.subjectsService.findOne(subject_id);
            if (!subject) throw new NotFound('Subject', 'SUBJECT_NOT_FOUND');

            const result = await this.schedulesService.create(createScheduleDto);
            if (!result) {
                throw new BadRequest('Failed to create schedule', 'CREATE_SCHEDULE_FAILED');
            }

            return res.json({
                ok: true,
                message: 'Schedule successfully created',
                data: result,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @Get()
    async findAll(@Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director' && req?.user?.role !== 'teacher' && req?.user?.role !== 'student') throw new Forbidden();

            if(req?.user?.role === 'teacher') {
                const result = await this.schedulesService.findAllByTeacherId(req?.user?.id);
                return res.json({
                    ok: true,
                    message: 'Schedules successfully found',
                    data: result,
                });
            } else if(req?.user?.role === 'student') {
                const result = await this.schedulesService.findAllByGroupId(req?.user?.group?.id);
                return res.json({
                    ok: true,
                    message: 'Schedules successfully found',
                    data: result,
                });
            }

            const result = await this.schedulesService.findAll();
            return res.json({
                ok: true,
                message: 'Schedules successfully found',
                data: result,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director' && req?.user?.role !== 'teacher') throw new Forbidden();

            let validId = commonValidator.path.validate(id);
            if (!validId.error) throw new BadRequest('Invalid id', 'INVALID_ID');

            if(req?.user?.role === 'teacher') {
                const result = await this.schedulesService.findOneByIdAndTeacherId(+id, req?.user?.id);
                if (!result) throw new NotFound('Schedule', 'SCHEDULE_NOT_FOUND');

                return res.json({
                    ok: true,
                    message: 'Schedule successfully found',
                    data: result,
                });
            }

            const result = await this.schedulesService.findOne(+id);
            if (!result) throw new NotFound('Schedule', 'SCHEDULE_NOT_FOUND');

            return res.json({
                ok: true,
                message: 'Schedule successfully found',
                data: result,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director') throw new Forbidden();

            let validId = commonValidator.path.validate([id]);
            if (validId?.error) throw new BadRequest('Invalid id', 'INVALID_ID');

            const { error } = updateScheduleSchema.validate(updateScheduleDto);
            if (error) throw new BadRequest(error.message, 'INVALID_FIELDS');

            if(!isFutureTime(updateScheduleDto?.start_date)) throw new BadRequest('Start date must be a future time', 'START_DATE_MUST_BE_A_FUTURE_TIME');
            if(!isFutureTime(updateScheduleDto?.end_date)) throw new BadRequest('End date must be a future time', 'END_DATE_MUST_BE_A_FUTURE_TIME');

            let teacher_id = updateScheduleDto?.teacher_id;
            let group_id = updateScheduleDto?.group_id;
            let subject_id = updateScheduleDto?.subject_id;

            if(teacher_id) {
                const teacher = await this.usersService.findOne(teacher_id);
                if (!teacher) throw new NotFound('Teacher', 'TEACHER_NOT_FOUND');

                if(teacher?.role !== 'teacher') throw new BadRequest('User is not a teacher', 'USER_IS_NOT_A_TEACHER');
            }

            if(group_id){
                const group = await this.groupsService.findOne(group_id);
                if (!group) throw new NotFound('Group', 'GROUP_NOT_FOUND');
            }

            if(subject_id){
                const subject = await this.subjectsService.findOne(subject_id);
                if (!subject) throw new NotFound('Subject', 'SUBJECT_NOT_FOUND');
            }

            const result = await this.schedulesService.update(+id, updateScheduleDto);
            if (!result) {
                throw new BadRequest('Failed to update schedule', 'UPDATE_SCHEDULE_FAILED');
            }

            return res.json({
                ok: true,
                message: 'Schedule successfully updated',
                data: result,
            });
        } catch (error) {
            console.error(error)
            handleErrorResponse(res, error);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director') throw new Forbidden();

            let validId = commonValidator.path.validate(id);
            if (!validId) throw new BadRequest('Invalid id', 'INVALID_ID');

            let schedule = await this.schedulesService.findOne(+id);
            if (!schedule) throw new NotFound('Schedule', 'SCHEDULE_NOT_FOUND');

            const result = await this.schedulesService.remove(+id);
            if (!result) {
                throw new BadRequest('Failed to remove schedule', 'REMOVE_SCHEDULE_FAILED');
            }

            return res.json({
                ok: true,
                message: 'Schedule successfully removed',
                data: result,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }
}
