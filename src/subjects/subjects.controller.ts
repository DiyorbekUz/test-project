import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { BadRequest, Forbidden, NotFound } from 'src/common/exception/error.exception';
import { Request, Response } from 'express';
import { handleErrorResponse } from 'src/utils/error-handler.util';
import { createSubjectSchema } from './schema/create-subject.schema';
import { updateSubjectSchema } from './schema/update-subject.schema';
import * as commonValidator from 'src/utils/common-validator.util';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('subjects')
@ApiBearerAuth()
@Controller('subjects')
export class SubjectsController {
    constructor(private readonly subjectsService: SubjectsService) { }

    @Post()
    async create(@Body() createSubjectDto: CreateSubjectDto, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director') throw new Forbidden();

            const { error, value } = createSubjectSchema.validate(createSubjectDto);
            if (error) throw new BadRequest(error.message, 'INVALID_FIELDS');

            const result = await this.subjectsService.create(value);
            if (!result) {
                throw new BadRequest('Failed to create subject', 'CREATE_SUBJECT_FAILED');
            }

            return res.json({
                ok: true,
                message: 'Subject successfully created',
                data: result,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @Get()
    async findAll(@Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director') throw new Forbidden();

            const result = await this.subjectsService.findAll();
            return res.json({
                ok: true,
                message: 'Subjects successfully found',
                data: result,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director') throw new Forbidden();

            const result = await this.subjectsService.findOne(+id);
            if(!result) throw new NotFound('Subject', 'SUBJECT_NOT_FOUND');
            return res.json({
                ok: true,
                message: 'Subject successfully found',
                data: result,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director') throw new Forbidden();

            const { error, value } = updateSubjectSchema.validate(updateSubjectDto);
            if (error) throw new BadRequest(error.message, 'INVALID_FIELDS');

            const validId = commonValidator.path.validate(id);
            if (!validId) throw new BadRequest('Invalid id', 'INVALID_ID');

            const one = await this.subjectsService.findOne(+id);
            if(!one) throw new NotFound('Subject', 'SUBJECT_NOT_FOUND');

            const result = await this.subjectsService.update(+id, value);
            if (!result) {
                throw new BadRequest('Failed to update subject', 'UPDATE_SUBJECT_FAILED');
            }

            return res.json({
                ok: true,
                message: 'Subject successfully updated',
                data: result,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director') throw new Forbidden();

            const validId = commonValidator.path.validate(id);
            if (!validId) throw new BadRequest('Invalid id', 'INVALID_ID');

            const one = await this.subjectsService.findOne(+id);
            if(!one) throw new NotFound('Subject', 'SUBJECT_NOT_FOUND');

            const result = await this.subjectsService.remove(+id);
            if (!result) {
                throw new BadRequest('Failed to delete subject', 'DELETE_SUBJECT_FAILED');
            }

            return res.json({
                ok: true,
                message: 'Subject successfully deleted',
                data: result,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }
}
