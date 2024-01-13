import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { BadRequest, Forbidden } from 'src/common/exception/error.exception';
import { Request, Response } from 'express';
import { createGroupSchema } from './schema/create-group.schema';
import { updateGroupSchema } from './schema/update-group.schema';
import { handleErrorResponse } from 'src/utils/error-handler.util';
import * as commonValidator from 'src/utils/common-validator.util';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('groups')
@ApiBearerAuth()
@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) { }

    @Post()
    async create(@Body() createGroupDto: CreateGroupDto, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director') throw new Forbidden();

            const { error, value } = createGroupSchema.validate(createGroupDto);
            if (error) throw new BadRequest(error.message, 'INVALID_FIELDS');

            let group = await this.groupsService.findOneByName(createGroupDto?.name);
            if (group) throw new BadRequest('Group already exists', 'GROUP_ALREADY_EXISTS');

            const result = await this.groupsService.create(value);
            if (!result) {
                throw new BadRequest('Failed to create group', 'CREATE_GROUP_FAILED');
            }

            return res.json({
                ok: true,
                message: 'Group successfully created',
                data: result,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }

    }

    @Get()
    async findAll(@Req() req: Request, @Res() res: Response) {
        try {
            console.log(req)
            if (req?.user?.role !== 'director') throw new Forbidden();

            const result = await this.groupsService.findAll();
            return res.json({
                ok: true,
                message: 'Groups successfully found',
                data: result,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director') throw new Forbidden();

            let validId = commonValidator.path.validate(id);
            if (!validId) throw new BadRequest('Invalid id', 'INVALID_ID');

            const result = await this.groupsService.findOne(+id);
            if (!result) {
                throw new BadRequest('Group not found', 'GROUP_NOT_FOUND');
            }

            return res.json({
                ok: true,
                message: 'Group successfully found',
                data: result,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
        
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() updateGroupDto: UpdateGroupDto, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director') throw new Forbidden();

            const { error } = updateGroupSchema.validate(updateGroupDto);
            if (error) throw new BadRequest(error.message, 'INVALID_FIELDS');

            let validId = commonValidator.path.validate(id);
            if (!validId) throw new BadRequest('Invalid id', 'INVALID_ID');

            let group = await this.groupsService.findOneByName(updateGroupDto?.name);
            if (group) {
                if (group.id !== id) {
                    throw new BadRequest('Group already exists', 'GROUP_ALREADY_EXISTS');
                }
            }

            const result = await this.groupsService.update(+id, updateGroupDto);
            if (!result) {
                throw new BadRequest('Failed to update group', 'UPDATE_GROUP_FAILED');
            }

            return res.json({
                ok: true,
                message: 'Group successfully updated',
                data: result,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director') throw new Forbidden();

            let validId = commonValidator.path.validate(id);
            if (!validId) throw new BadRequest('Invalid id', 'INVALID_ID');

            let group = await this.groupsService.findOne(+id);
            if (!group) throw new BadRequest('Group not found', 'GROUP_NOT_FOUND');

            const result = await this.groupsService.remove(+id);
            if (!result) {
                throw new BadRequest('Failed to delete group', 'DELETE_GROUP_FAILED');
            }

            return res.json({
                ok: true,
                message: 'Group successfully deleted',
                data: result,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }
}
