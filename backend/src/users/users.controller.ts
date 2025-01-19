import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post()
    async createUser(@Body() user: CreateUserDto) {
        try {
            return await this.usersService.addUser(user);
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    @Get('validate-username')
    async validateUsername(@Query('username') username: string) {
        return await this.usersService.validateUsername(username);
    }
}
