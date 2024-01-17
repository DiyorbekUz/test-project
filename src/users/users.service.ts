import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateGradeDto } from './dto/create-grade.dto';
import { User } from './entities/user.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Not, Repository } from 'typeorm';
import { BcryptService } from 'src/utils/bcrypt.util';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly bcryptService: BcryptService,
        @InjectRepository(Subject)
        private readonly subjectRepository: Repository<Subject>,
    ) { }

    async create(createUserDto: CreateUserDto) {
        let hashedPassword = await this.bcryptService.hashPassword(createUserDto.password);
        createUserDto.password = hashedPassword;

        const user = this.usersRepository.create(createUserDto);
        await this.usersRepository.save(user);
        return user;
    }

    async createGrade(id: number, createGradeDto: CreateGradeDto[]) {
        const user = await this.usersRepository.findOne({
            where: { id, deleted: false, active: true },
            select: ['id', 'full_name', 'username', 'role', 'group', 'createdAt', 'updatedAt', 'deleted', 'deletedAt'],
        });

        user.gradess = createGradeDto;
        await this.usersRepository.save(user);
        return user;
    }

    private async fetchSubjectsForUser(gradeDtos: CreateGradeDto[]): Promise<{ [key: string]: Subject }> {
        const subjectIds = gradeDtos?.map((gradeDto) => gradeDto.subject_id) || [];
        const subjects = await this.subjectRepository.findByIds(subjectIds);

        // Create a mapping from subject ID to subject
        const subjectMap: { [key: string]: Subject } = {};
        subjects.forEach((subject) => {
            subjectMap[subject.id.toString()] = subject;
        });

        return subjectMap;
    }

    async findAll() {
        const users = await this.usersRepository.find({
            where: { deleted: false, active: true },
            relations: ['group'],
            select: ['id', 'full_name', 'username', 'role', 'group', 'createdAt', 'updatedAt', 'deleted', 'deletedAt', 'gradess'],
        });

        if (!users || users.length === 0) {
            return [];
        }

        for (const user of users) {
            const subjectMap = await this.fetchSubjectsForUser(user.gradess);
            user?.gradess?.forEach((gradeDto) => {
                const subjectId = gradeDto.subject_id.toString();
                gradeDto.subject = subjectMap[subjectId];
            });
        }

        return users;
    }


    async findAllByRoleAndGroup(role: string, group_id: number) {
        let users = await this.usersRepository.find({
            where: { role, group: { id: group_id }, deleted: false, active: true },
            select: ['id', 'full_name', 'username', 'role', 'group', 'createdAt', 'updatedAt', 'deleted', 'deletedAt', 'gradess'],
        });
        return users ? users : [];
    }

    async findOne(id: number) {
        let user = await this.usersRepository.findOne({
            where: { id, deleted: false, active: true },
            relations: ['group'],
            select: ['id', 'full_name', 'username', 'role', 'group', 'createdAt', 'updatedAt', 'deleted', 'deletedAt', 'gradess'],
        });

        const subjectMap = await this.fetchSubjectsForUser(user.gradess);
        user?.gradess?.forEach((gradeDto) => {
            const subjectId = gradeDto.subject_id.toString();
            gradeDto.subject = subjectMap[subjectId];
        });
        return user;
    }

    async usernameExists(username: string, excludeUserId?: number): Promise<boolean> {
        const queryOptions: FindOneOptions<User> = {
            where: { username, deleted: false, active: true },
            select: ['id'],
        };

        if (excludeUserId) {
            queryOptions.where['id'] = Not(excludeUserId);
        }

        const user = await this.usersRepository.findOne(queryOptions);
        return !!user;
    }

    async findOneByUsername(username: string) {
        let user = await this.usersRepository.findOne({ where: { username, deleted: false } });
        return user;
    }

    async findOneByGroupAndId(group_id: number, id: number) {
        let user = await this.usersRepository.findOne({
            where: { id, group: { id: group_id }, deleted: false, active: true },
        });
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.usersRepository.findOne({
            where: { id, deleted: false, active: true },
            select: ['id', 'full_name', 'username', 'role', 'group', 'createdAt', 'updatedAt', 'deleted', 'deletedAt'],
        });

        Object.assign(user, updateUserDto);

        await this.usersRepository.save(user);

        return user;
    }

    async updatePassword(id: number, password: string) {
        let hashedPassword = await this.bcryptService.hashPassword(password);
        let user = await this.usersRepository.findOne({
            where: { id, deleted: false, active: true },
            select: ['id', 'full_name', 'username', 'role', 'group', 'createdAt', 'updatedAt', 'deleted', 'deletedAt'],
        });

        user.password = hashedPassword;

        await this.usersRepository.save(user);

        return user;
    }

    async remove(id: number) {
        let user = await this.usersRepository.findOne({
            where: { id, deleted: false, active: true },
            select: ['id', 'full_name', 'username', 'role', 'group', 'createdAt', 'updatedAt', 'deleted', 'deletedAt'],
        });

        user.deleted = true;
        user.deletedAt = new Date();

        await this.usersRepository.save(user);

        return user;
    }

    async updateRefreshToken(id: number, refreshToken: string) {
        let user = await this.usersRepository.findOne({
            where: { id, deleted: false, active: true },
            select: ['id', 'full_name', 'username', 'role', 'group', 'createdAt', 'updatedAt', 'deleted', 'deletedAt'],
        });
        user.refresh_token = refreshToken;
        await this.usersRepository.save(user);
        return user;
    }
}
