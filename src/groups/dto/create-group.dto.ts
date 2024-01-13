import { ApiProperty } from "@nestjs/swagger";

export class CreateGroupDto {
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
