import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'The full name of the user',
        minLength: 3,
        maxLength: 255,
    })
    full_name: string;

    @ApiProperty({
        description: 'The username of the user',
        minLength: 4,
        maxLength: 20,
    })
    username: string;

    @ApiProperty({
        description: 'The password of the user',
        minLength: 6,
    })
    password: string;

    @ApiProperty({
        description: 'The role of the user',
        enum: ['student', 'teacher', 'director'],
    })
    role: string;

    @ApiProperty({
        description: 'The ID of the group to which the user belongs',
    })
    group_id: number;
}
