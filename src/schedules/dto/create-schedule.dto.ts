import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
    @ApiProperty({
        description: 'The start date of the schedule',
        type: Date,
    })
    start_date: Date;

    @ApiProperty({
        description: 'The end date of the schedule',
        type: Date,
    })
    end_date: Date;

    @ApiProperty({
        description: 'The ID of the subject associated with the schedule',
        type: Number,
    })
    subject_id: number;

    @ApiProperty({
        description: 'The ID of the teacher associated with the schedule',
        type: Number,
    })
    teacher_id: number;

    @ApiProperty({
        description: 'The ID of the group associated with the schedule',
        type: Number,
    })
    group_id: number;

    @ApiProperty({
        description: 'A flag indicating whether the schedule is active or not',
        default: true,
        required: false,
    })
    active: boolean;
}
