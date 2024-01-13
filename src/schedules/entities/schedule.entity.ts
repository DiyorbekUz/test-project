import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeUpdate } from 'typeorm';
import { Group } from '../../groups/entities/group.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'schedules' })
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Group, group => group.schedules)
    @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
    group: Group;

    @ManyToOne(() => Subject, subject => subject.schedules)
    @JoinColumn({ name: 'subject_id', referencedColumnName: 'id' })
    subject: Subject;

    @ManyToOne(() => User, user => user.schedules) 
    @JoinColumn({ name: 'teacher_id', referencedColumnName: 'id' })
    teacher: User;
    @Column({ type: 'int' })
    group_id: number;

    @Column({ type: 'int' })
    subject_id: number;

    @Column({ type: 'int' })
    teacher_id: number;

    @Column({ type: 'time' })
    start_date: Date;

    @Column({ type: 'time' })
    end_date: Date;

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

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date();
    }

}
