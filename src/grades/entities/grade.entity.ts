import { Subject } from 'src/subjects/entities/subject.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'grades' })
export class Grade {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', default: 5 })
    grade: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;

    @Column({ nullable: false })
    user_id: number;

    @ManyToOne(() => User, user => user.grades)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @Column({ nullable: false })
    subject_id: number;

    @ManyToOne(() => Subject, subject => subject.grades)
    @JoinColumn({ name: 'subject_id', referencedColumnName: 'id' })
    subject: Subject;
}
