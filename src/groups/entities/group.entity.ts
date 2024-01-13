import { User } from 'src/users/entities/user.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeUpdate } from 'typeorm';

@Entity({ name: 'groups' })
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'boolean', default: true })
    active: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;

    @OneToMany(() => User, user => user.group)
    users: User[];

    @OneToMany(() => Schedule, schedule => schedule.group)
    schedules: Schedule[];

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date();
    }    
}
