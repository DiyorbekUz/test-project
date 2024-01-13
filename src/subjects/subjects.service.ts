import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectsService {
    constructor(
        @InjectRepository(Subject)
        private readonly subjectsRepository: Repository<Subject>
    ) { }
    async create(createSubjectDto: CreateSubjectDto) {
        let subject = this.subjectsRepository.create(createSubjectDto);
        await this.subjectsRepository.save(subject);
        return subject
    }

    async findAll() {
        let subjects = await this.subjectsRepository.find({
            where: { deleted: false, active: true },
        });
        return subjects ? subjects : [];
    }

    async findOne(id: number) {
        return this.subjectsRepository.findOne({
            where: { id, deleted: false, active: true },
        });
    }

    async update(id: number, updateSubjectDto: UpdateSubjectDto) {
        const subject = await this.subjectsRepository.findOne({
            where: { id, deleted: false, active: true },
        });

        Object.assign(subject, updateSubjectDto);

        this.subjectsRepository.save(subject);

        return subject
    }

    async remove(id: number) {
        const subject = await this.subjectsRepository.findOne({
            where: { id, deleted: false, active: true },
        });

        subject.deleted = true;
        subject.deletedAt = new Date();

        this.subjectsRepository.save(subject);

        return subject
    }
}
