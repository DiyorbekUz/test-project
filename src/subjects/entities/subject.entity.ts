import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeUpdate } from 'typeorm';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { Grade } from 'src/grades/entities/grade.entity';

@Entity({ name: 'subjects' })
export class Subject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'boolean', default: true })
    active: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;

    @OneToMany(() => Schedule, schedule => schedule.subject)
    schedules: Schedule[];

    @OneToMany(() => Grade, grade => grade.subject)
    grades: Grade[];

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date();
    }
}
