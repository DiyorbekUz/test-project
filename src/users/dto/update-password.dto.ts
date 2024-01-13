import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
    @ApiProperty({
        description: 'The password of the user',
        minLength: 6,
    })
    password: string;
}
