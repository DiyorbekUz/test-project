import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { handleErrorResponse } from 'src/utils/error-handler.util';
import { Request, Response } from 'express';
import { BadRequest, Forbidden, NotFound } from 'src/common/exception/error.exception';
import { createGradeSchema } from './schema/create-grade.schema';
import { updateGradeSchema } from './schema/update-grade.schema';
import * as commonValidator from '../utils/common-validator.util';
import { UsersService } from 'src/users/users.service';
import { SubjectsService } from 'src/subjects/subjects.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('grades')
@ApiBearerAuth()
@Controller('grades')
export class GradesController {
    constructor(
        private readonly gradesService: GradesService,
        private readonly usersService: UsersService,
        private readonly subjectsService: SubjectsService
        ) { }

    @Post()
    async create(@Body() createGradeDto: CreateGradeDto, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'teacher') throw new Forbidden();

            const { error } = createGradeSchema.validate(createGradeDto);
            if (error) throw new BadRequest(error.message, 'INVALID_FIELDS');

            let user = await this.usersService.findOne(+createGradeDto?.user_id);
            if (!user) throw new NotFound('User', 'USER_NOT_FOUND');

            let subject = await this.subjectsService.findOne(+createGradeDto?.subject_id);
            if (!subject) throw new NotFound('Subject', 'SUBJECT_NOT_FOUND');

            const result = await this.gradesService.create(createGradeDto);
            if (!result) {
                throw new BadRequest('Failed to create grade', 'CREATE_GRADE_FAILED');
            }

            return res.json({
                ok: true,
                message: 'Grade successfully created',
                data: result,
            });
            
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @Get()
    async findAll( @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'teacher' && req?.user?.role !== 'director' && req?.user?.role !== 'student') throw new Forbidden()

            if(req?.user?.role === 'teacher') {
                const result = await this.gradesService.findAllByGroupId(req?.user?.group_id);
                if (!result) {
                    throw new BadRequest('Failed to find grades', 'FIND_GRADES_FAILED');
                }

                return res.json({
                    ok: true,
                    message: 'Grades successfully found',
                    data: result,
                });
            }else if(req?.user?.role === 'student') {
                const result = await this.gradesService.findAllByUserId(req?.user?.id);

                return res.json({
                    ok: true,
                    message: 'Grades successfully found',
                    data: result,
                });
            }

            const result = await this.gradesService.findAll();
            if (!result) {
                throw new BadRequest('Failed to find grades', 'FIND_GRADES_FAILED');
            }

            return res.json({
                ok: true,
                message: 'Grades successfully found',
                data: result,
            });            
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @Get('/get-by-user/:id')
    async getAllByUser(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'teacher' && req?.user?.role !== 'director') throw new Forbidden()

            let validId = commonValidator.path.validate([id])
            if (!validId) throw new BadRequest('Invalid id');

            if(req?.user?.role === 'teacher') {
                const result = await this.gradesService.findAllByUserAndGroupId(+id, req?.user?.group_id);
                if (!result) {
                    throw new BadRequest('Failed to find grades', 'FIND_GRADES_FAILED');
                }

                return res.json({
                    ok: true,
                    message: 'Grade successfully found',
                    data: result,
                });
            }

            const result = await this.gradesService.findAllByUserId(+id);
            if (!result) {
                throw new BadRequest('Failed to find grades', 'FIND_GRADES_FAILED');
            }

            return res.json({
                ok: true,
                message: 'Grades successfully found',
                data: result,
            });            
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'teacher' && req?.user?.role !== 'director') throw new Forbidden()

            let validId = commonValidator.path.validate([id])
            if (!validId) throw new BadRequest('Invalid id');

            const result = await this.gradesService.findOne(+id);
            if (!result) {
                throw new BadRequest('Failed to find grade', 'FIND_GRADE_FAILED');
            }

            return res.json({
                ok: true,
                message: 'Grade successfully found',
                data: result,
            });            
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateGradeDto: UpdateGradeDto, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'teacher') throw new Forbidden();

            const { error } = updateGradeSchema.validate(updateGradeDto);
            if (error) throw new BadRequest(error.message, 'INVALID_FIELDS');

            if(updateGradeDto?.user_id) {
                let user = await this.usersService.findOne(+updateGradeDto?.user_id);
                if (!user) throw new NotFound('User', 'USER_NOT_FOUND');
            }

            if(updateGradeDto?.subject_id) {
                let subject = await this.subjectsService.findOne(+updateGradeDto?.subject_id);
                if (!subject) throw new NotFound('Subject', 'SUBJECT_NOT_FOUND');
            }

            const result = await this.gradesService.update(+id, updateGradeDto);
            if (!result) {
                throw new BadRequest('Failed to update grade', 'UPDATE_GRADE_FAILED');
            }

            return res.json({
                ok: true,
                message: 'Grade successfully updated',
                data: result,
            });
            
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'teacher') throw new Forbidden();

            let validId = commonValidator.path.validate([id])
            if (!validId) throw new BadRequest('Invalid id');

            const result = await this.gradesService.remove(+id);
            if (!result) {
                throw new BadRequest('Failed to delete grade', 'DELETE_GRADE_FAILED');
            }

            return res.json({
                ok: true,
                message: 'Grade successfully deleted',
                data: result,
            });
            
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }
}
