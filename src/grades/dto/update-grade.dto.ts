import { PartialType } from '@nestjs/mapped-types';
import { CreateGradeDto } from './create-grade.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGradeDto extends PartialType(CreateGradeDto) {
    @ApiProperty({
        description: 'The updated numeric grade value',
        type: Number,
        example: 90,
    })
    grade: number;

    @ApiProperty({
        description: 'The updated ID of the user to whom the grade belongs',
        type: Number,
        example: 2,
    })
    user_id: number;

    @ApiProperty({
        description: 'The updated ID of the subject for which the grade is assigned',
        type: Number,
        example: 456,
    })
    subject_id: number;
}
