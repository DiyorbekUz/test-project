import { Injectable } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from './entities/grade.entity';

@Injectable()
export class GradesService {
    constructor(
        @InjectRepository(Grade)
        private readonly gradesRepository: Repository<Grade>
    ) { }
    async create(createGradeDto: CreateGradeDto) {
        let grade = this.gradesRepository.create(createGradeDto);
        await this.gradesRepository.save(grade);
        return grade
    }

    async findAll() {
        let grades = await this.gradesRepository.find({
            where: { deleted: false },
            relations: ['user', 'subject'],
        });
        return grades ? grades : [];
    }

    async findAllByGroupId(group_id: number) {
        let grades = await this.gradesRepository.find({
            where: { deleted: false },
            relations: ['user', 'subject'],
        });

        grades = grades.filter(grade => grade.user.group_id === group_id);

        return grades ? grades : [];
    }

    async findAllByUserId(user_id: number) {
        let grades = await this.gradesRepository.find({
            where: { user_id, deleted: false },
            relations: ['user', 'subject'],
        });
        return grades ? grades : [];
    }

    async findAllByUserAndGroupId(user_id: number, group_id: number) {
        let grades = await this.gradesRepository.find({
            where: { user_id, deleted: false },
            relations: ['user', 'subject'],
        });

        grades = grades.filter(grade => grade.user.group_id === group_id);

        return grades ? grades : [];
    }

    async findOne(id: number) {
        let grade = await this.gradesRepository.findOne({
            where: { id, deleted: false },
        })

        return grade
    }

    async update(id: number, updateGradeDto: UpdateGradeDto) {
        const grade = await this.gradesRepository.findOne({
            where: { id, deleted: false },
        });

        Object.assign(grade, updateGradeDto);

        this.gradesRepository.save(grade);

        return grade
    }

    async remove(id: number) {
        const grade = await this.gradesRepository.findOne({
            where: { id, deleted: false },
        });

        grade.deleted = true;
        grade.deletedAt = new Date();

        this.gradesRepository.save(grade);

        return grade
    }
}
