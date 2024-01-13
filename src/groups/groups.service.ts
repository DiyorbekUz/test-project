import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(Group)
        private readonly groupsRepository: Repository<Group>) {
    }

    async create(createGroupDto: CreateGroupDto) {
        const group = this.groupsRepository.create(createGroupDto);
        await this.groupsRepository.save(group);

        return group
    }

    async findAll() {
        let groups = await this.groupsRepository.find({
            where: { deleted: false, active: true },
        });
        return groups ? groups : [];
    }

    async findOneByName(name: string) {
        let group = await this.groupsRepository.findOne({
            where: { name, deleted: false, active: true },
        });

        return group
    }

    async findOne(id: number) {
        let group = await this.groupsRepository.findOne({
            where: { id, deleted: false, active: true },
        });

        return group
    }

    async update(id: number, updateGroupDto: UpdateGroupDto) {
        const group = await this.groupsRepository.findOne({
            where: { id, deleted: false, active: true },
        });

        Object.assign(group, updateGroupDto);

        this.groupsRepository.save(group);

        return group
    }

    async remove(id: number) {
        const group = await this.groupsRepository.findOne({
            where: { id, deleted: false, active: true },
        });

        group.deleted = true;
        group.deletedAt = new Date();

        this.groupsRepository.save(group);

        return group
    }
}