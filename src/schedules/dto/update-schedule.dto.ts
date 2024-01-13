import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
    @ApiProperty({
        description: 'The start date of the schedule',
        type: Date,
        required: false,
    })
    start_date?: Date;

    @ApiProperty({
        description: 'The end date of the schedule',
        type: Date,
        required: false,
    })
    end_date?: Date;

    @ApiProperty({
        description: 'The ID of the subject associated with the schedule',
        type: Number,
        required: false,
    })
    subject_id?: number;

    @ApiProperty({
        description: 'The ID of the teacher associated with the schedule',
        type: Number,
        required: false,
    })
    teacher_id?: number;

    @ApiProperty({
        description: 'The ID of the group associated with the schedule',
        type: Number,
        required: false,
    })
    group_id?: number;

    @ApiProperty({
        description: 'A flag indicating whether the schedule is active or not',
        required: false,
        default: true,
    })
    active?: boolean;
}
