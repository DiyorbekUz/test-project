import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
    @ApiProperty({
        description: 'The name of the subject',
        minLength: 3,
        maxLength: 255,
    })
    name: string;

    @ApiProperty({
        description: 'A flag indicating whether the subject is active or not',
        default: true,
    })
    active: boolean;
}
