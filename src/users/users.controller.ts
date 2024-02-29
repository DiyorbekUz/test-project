import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards  } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { GroupsService } from 'src/groups/groups.service';
import { SubjectsService } from 'src/subjects/subjects.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateGradeUserDto } from './dto/create-grade.dto';
import { Forbidden, BadRequest, NotFound } from '../common/exception/error.exception';
import { createUserSchema } from './schema/create-user.schema';
import { updatePasswordSchema } from './schema/update-password.schema';
import { createGradeSchema } from './schema/create-grade.schema';
import { updateUserSchema } from './schema/update-user.schema';
import { handleErrorResponse } from '../utils/error-handler.util';
import * as commonValidator from '../utils/common-validator.util';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly groupsService: GroupsService,
        private readonly subjectsService: SubjectsService,
        ) { }
        
    @Post()
    async create(@Body() createUserDto: CreateUserDto, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director') throw new Forbidden();

            const { error } = createUserSchema.validate(createUserDto);
            if (error) throw new BadRequest(error.message, 'INVALID_FIELDS');


            let user = await this.usersService.usernameExists(createUserDto?.username);
            if (user) throw new BadRequest('Username already exists', 'USERNAME_ALREADY_EXISTS');

            if (createUserDto?.role == 'director') {
                createUserDto.group_id = null;
            } else {
                let group = await this.groupsService.findOne(+createUserDto?.group_id);
                if (!group) throw new NotFound('Group', 'GROUP_NOT_FOUND');
            }

            const result = await this.usersService.create(createUserDto);
            if (!result) {
                throw new BadRequest('Failed to create user', 'CREATE_USER_FAILED');
            }

            return res.json({
                ok: true,
                message: 'User successfully created',
                data: result,
            });
        } catch (error) {
            console.error(error);
            handleErrorResponse(res, error);
        }
    }

    @Post('grade/:id')
    async createGrade(@Param('id') id: number, @Body() createGradeData: CreateGradeUserDto, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director' && req?.user?.role !== 'teacher') throw new Forbidden();

            let oneUser = await this.usersService.findOneWithOutSubject(+id);
            if(!oneUser) throw new NotFound('User', 'USER_NOT_FOUND');

            const { error } = createGradeSchema.validate(createGradeData);
            if (error) throw new BadRequest(error.message, 'INVALID_FIELDS');

            let oneSubject = await this.subjectsService.findOne(+createGradeData?.subject_id);
            if(!oneSubject) throw new NotFound('Subject', 'SUBJECT_NOT_FOUND');

            let gradess = oneUser.gradess || [];
            gradess.push(createGradeData);

            const result = await this.usersService.createGrade(id, gradess);
            if (!result) throw new BadRequest('Failed to create grade', 'CREATE_GRADE_FAILED')

            return res.json({
                ok: true,
                message: 'Grade successfully updated',
                data: result,
            });
        } catch (error) {   
            console.error(error);
            handleErrorResponse(res, error);
        }
    }

    @Get()
    async findAll(@Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director' && req?.user?.role !== 'teacher') throw new Forbidden();

            if (req?.user?.role === 'teacher') {
                const result = await this.usersService.findAllByRoleAndGroup('student', req?.user?.group?.id);
                return res.json({
                    ok: true,
                    message: 'Users successfully found',
                    data: result,
                })
            }

            const result = await this.usersService.findAll();

            return res.json({
                ok: true,
                message: 'Users successfully found',
                data: result,
            })
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director' && req?.user?.role !== 'teacher') throw new Forbidden();

            let validId = commonValidator.path.validate([id])
            if (!validId) throw new BadRequest('Invalid id');

            if (req?.user?.role === 'teacher') {
                const result = await this.usersService.findOneByGroupAndId(req?.user?.group?.id, +id);
                if (!result) throw new NotFound('User');

                delete result?.password;
                return res.json({
                    ok: true,
                    message: 'User successfully found',
                    data: result,
                })
            }

            const result = await this.usersService.findOne(+id);
            if (!result) throw new NotFound('User');

            delete result?.password;

            return res.json({
                ok: true,
                message: 'User successfully found',
                data: result,
            })
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Req() req: Request, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director') throw new Forbidden();

            let validId = commonValidator.path.validate([id])
            if (!validId) throw new BadRequest('Invalid id');

            const { error } = updateUserSchema.validate(updateUserDto);
            if (error) throw new BadRequest(error.message);

            let user = await this.usersService.findOne(+id);
            if (!user) throw new NotFound('User');

            let checkUsername = await this.usersService.usernameExists(updateUserDto?.username || '', +id);
            if (checkUsername) {
                throw new BadRequest('Username already exists', 'USERNAME_ALREADY_EXISTS');
            }

            if (updateUserDto?.role === 'director') {
                updateUserDto.group_id = null;
            } else {
                let group = await this.groupsService.findOne(+updateUserDto.group_id);
                if (!group) throw new NotFound('Group', 'GROUP_NOT_FOUND');
            }

            const result = await this.usersService.update(+id, updateUserDto);
            if (!result) throw new BadRequest('Failed to update user', 'UPDATE_USER_FAILED')

            return res.json({
                ok: true,
                message: 'User successfully updated',
                data: result,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    @Patch(':id/password')
    async updatePassword(@Param('id') id: string, @Req() req: Request, @Body() updateUserDto: UpdatePasswordDto, @Res() res: Response) {
        try {
            if (req?.user?.role !== 'director') throw new Forbidden();
            let validId = commonValidator.path.validate([id])
            if (!validId) throw new BadRequest('Invalid id', 'INVALID_ID');

            const { error } = updatePasswordSchema.validate(updateUserDto);
            if (error) throw new BadRequest(error.message, 'INVALID_FIELDS');

            let user = this.usersService.findOne(+id);
            if (!user) throw new NotFound('User', 'USER_NOT_FOUND');

            let password = updateUserDto?.password;
            const result = await this.usersService.updatePassword(+id, password);
            if (!result) {
                throw new BadRequest('Failed to update user password', 'UPDATE_USER_PASSWORD_FAILED');
            }

            return res.json({
                ok: true,
                message: 'User password successfully updated',
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
            let validId = commonValidator.path.validate([id])
            if (!validId) throw new BadRequest('Invalid id');

            let user = this.usersService.findOne(+id);
            if (!user) throw new NotFound('User');

            const result = await this.usersService.remove(+id);
            if (!result) {
                throw new BadRequest('Failed to delete user', 'DELETE_USER_FAILED');
            }

            return res.json({
                ok: true,
                message: 'User successfully deleted',
                data: result,
            });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }
}
