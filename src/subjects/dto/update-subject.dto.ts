import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectDto } from './create-subject.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
    @ApiProperty({
        description: 'The updated name of the subject',
        type: String,
        example: 'Updated Subject Name',
    })
    name: string;

    @ApiProperty({
        description: 'The updated status indicating whether the subject is active',
        type: Boolean,
        example: true,
    })
    active: boolean;
}
