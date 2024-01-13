import { ApiProperty } from "@nestjs/swagger";


export class LoginDto {
    @ApiProperty({
        description: 'The username of the user',
        minLength: 3,
        maxLength: 255,
    })
    username: string;

    @ApiProperty({
        description: 'The password of the user',
        minLength: 6,
    })
    password: string;
}