import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class SchedulesService {

    constructor(
        @InjectRepository(Schedule)
        private readonly schedulesRepository: Repository<Schedule>
    ) { }

    async create(createScheduleDto: CreateScheduleDto) {
        let schedule = this.schedulesRepository.create(createScheduleDto);
        await this.schedulesRepository.save(schedule);
        return schedule
    }

    async findAll() {
        let schedules = await this.schedulesRepository.find({
            where: { deleted: false, active: true },
            relations: ['teacher', 'group', 'subject'],
        });
        return schedules ? schedules : [];
    }

    async findAllByTeacherId(teacher_id: number) {
        let schedules = await this.schedulesRepository.find({
            where: { teacher_id, deleted: false, active: true },
            relations: ['teacher', 'group', 'subject'],
        });
        return schedules ? schedules : [];
    }

    async findAllByGroupId(group_id: number) {
        let schedules = await this.schedulesRepository.find({
            where: { group_id, deleted: false, active: true },
            relations: ['teacher', 'group', 'subject'],
        });
        return schedules ? schedules : [];
    }

    async findOne(id: number) {
        return this.schedulesRepository.findOne({
            where: { id, deleted: false, active: true },
            relations: ['teacher', 'group', 'subject'],
        });
    }

    async findOneByIdAndTeacherId(id: number, teacher_id: number) {
        return this.schedulesRepository.findOne({
            where: { id, teacher_id, deleted: false, active: true },
            relations: ['teacher', 'group', 'subject'],
        });
    }

    async update(id: number, updateScheduleDto: UpdateScheduleDto) {
        const schedule = await this.schedulesRepository.findOne({
            where: { id, deleted: false, active: true },
        });

        Object.assign(schedule, updateScheduleDto);

        this.schedulesRepository.save(schedule);

        return schedule
    }

    async remove(id: number) {
        const schedule = await this.schedulesRepository.findOne({
            where: { id, deleted: false, active: true },
        });

        schedule.deleted = true;
        schedule.deletedAt = new Date();

        this.schedulesRepository.save(schedule);

        return schedule
    }
}
