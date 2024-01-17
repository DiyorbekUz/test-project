import { ApiProperty } from '@nestjs/swagger';
import { Subject } from 'src/subjects/entities/subject.entity';

export class CreateGradeDto {
    @ApiProperty({
        description: 'grade',
        minimum: 2,
        maximum: 5
    })
    grade: number;

    @ApiProperty({
        description: 'subject',
        minimum: 1,
        type: 'number'
    })
    subject_id: string;
    subject: Subject;
}
