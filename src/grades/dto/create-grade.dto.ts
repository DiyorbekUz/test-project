import { ApiProperty } from "@nestjs/swagger";

export class CreateGradeDto {
    @ApiProperty({
        description: 'The numeric grade value',
        type: Number,
        example: 85,
    })
    grade: number;

    @ApiProperty({
        description: 'The ID of the user to whom the grade belongs',
        type: Number,
        example: 1,
    })
    user_id: number;

    @ApiProperty({
        description: 'The ID of the subject for which the grade is assigned',
        type: Number,
        example: 123,
    })
    subject_id: number;
}
