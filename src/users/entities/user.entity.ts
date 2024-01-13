import { PrimaryGeneratedColumn, Column, ManyToOne, Entity, JoinColumn, OneToMany, BeforeUpdate } from 'typeorm';
import { Group } from 'src/groups/entities/group.entity';
import { Grade } from 'src/grades/entities/grade.entity';
import { Schedule } from 'src/schedules/entities/schedule.entity';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    full_name: string;

    @Column({ type: 'varchar', unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ type: 'boolean', default: true })
    active: boolean;

    @Column({ type: 'varchar', default: 'student' })
    role: string;

    @Column({ type: 'varchar', nullable: true })
    refresh_token: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;

    @Column({ nullable: true })
    group_id: number;

    @ManyToOne(() => Group, group => group.users)
    @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
    group: Group;

    @OneToMany(() => Grade, grade => grade.user)
    grades: Grade[];

    @OneToMany(() => Schedule, schedule => schedule.teacher)
    schedules: Schedule[];

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date();
    }
}
