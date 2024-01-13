import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, IsNull, Not, Repository } from 'typeorm';
import { BcryptService } from 'src/utils/bcrypt.util';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly bcryptService: BcryptService
    ) { }

    async create(createUserDto: CreateUserDto) {
        let hashedPassword = await this.bcryptService.hashPassword(createUserDto.password);
        createUserDto.password = hashedPassword;

        const user = this.usersRepository.create(createUserDto);
        await this.usersRepository.save(user);
        return user;
    }

    async findAll() {
        const users = await this.usersRepository.find({
            where: { deleted: false, active: true },
            relations: ['group'],
            select: ['id', 'full_name', 'username', 'role', 'group', 'createdAt', 'updatedAt', 'deleted', 'deletedAt'],
        });

        return users ? users : [];
    }

    async findAllByRoleAndGroup(role: string, group_id: number) {
        let users = await this.usersRepository.find({
            where: { role, group: { id: group_id }, deleted: false, active: true },
            select: ['id', 'full_name', 'username', 'role', 'group', 'createdAt', 'updatedAt', 'deleted', 'deletedAt'],
        });
        return users ? users : [];
    }

    async findOne(id: number) {
        let user = await this.usersRepository.findOne({
            where: { id, deleted: false, active: true },
            relations: ['group'],
            select: ['id', 'full_name', 'username', 'role', 'group', 'createdAt', 'updatedAt', 'deleted', 'deletedAt'],
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
