import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/auth.guard';

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

    @UseGuards(JwtGuard)
    @Get('user-token')
    async getUserByToken(@Request() req: Request & { user: { id: string; email: string } }) {
        return {
            user: await this.usersService.getUserById(req.user.id),
        };
    }

    @UseGuards(JwtGuard)
    @Get(':id/posts')
    async getUserPosts(@Param('id') id: string) {
        return await this.usersService.getUserPosts(id);
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return await this.usersService.getUserById(id);
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() user: Partial<CreateUserDto>) {
        return await this.usersService.updateUserById(id, user);
    }
}
