import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { CreateRelationDto } from './dtos/create-relation.dto';

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

    @Get()
    async getUserByUsername(@Query('username') username: string) {
        return await this.usersService.getUserByUsername(username);
    }

    @Get('validate-username')
    async validateUsername(@Query('username') username: string) {
        return await this.usersService.validateUsername(username);
    }

    @Get('user-token')
    async getUserByToken(@Request() req: Request & { user: { id: string; email: string } }) {
        return {
            user: await this.usersService.getUserById(req.user.id),
        };
    }

    // relation Api
    @Get(':id/followers')
    async getUserFollowers(
        @Param('id') id: string,
        @Query('page') page: number,
        @Query('searchString') searchString: string,
        @Query('currentUserId') currentUserId: string,
    ) {
        if (!page) throw new BadRequestException('Page is required');
        if (page < 1) throw new BadRequestException('Page must be greater than 0');

        return await this.usersService.getUsersRelation(id, page, searchString, currentUserId, 'followers');
    }

    @Get(':id/following')
    async getUserFollowing(
        @Param('id') id: string,
        @Query('page') page: number,
        @Query('searchString') searchString: string,
        @Query('currentUserId') currentUserId: string,
    ) {
        if (!page) throw new BadRequestException('Page is required');
        if (page < 1) throw new BadRequestException('Page must be greater than 0');

        return await this.usersService.getUsersRelation(id, page, searchString, currentUserId, 'following');
    }

    @Post('relation')
    async addRelation(@Body() { currentUserId, otherUserId }: CreateRelationDto) {
        return await this.usersService.addRelation(currentUserId, otherUserId);
    }

    @Delete('relation')
    async removeRelation(@Query() { currentUserId, otherUserId }: CreateRelationDto) {
        return await this.usersService.removeRelation(currentUserId, otherUserId);
    }

    @Get('check-relation')
    async checkRelation(@Query() { currentUserId, otherUserId }: CreateRelationDto) {
        return await this.usersService.checkRelation(currentUserId, otherUserId);
    }

    @Get('search')
    async searchUsers(@Query('searchString') searchString: string) {
        return this.usersService.searchUsers(searchString);
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
