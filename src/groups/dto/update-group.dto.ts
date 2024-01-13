import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
    @ApiProperty({
        description: 'The name of the group',
        minLength: 3,
        maxLength: 255,
    })
    name: string;

    @ApiProperty({
        description: 'A flag indicating whether the group is active or not',
        default: true,
        required: false,
    })
    active: boolean;
}
