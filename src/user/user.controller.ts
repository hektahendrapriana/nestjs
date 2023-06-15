import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './user.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  async addMultiple(@Body() createUserDto: CreateUserDto[]): Promise<User[]> {
    const newUsers = await this.usersService.createMany(createUserDto);
    return newUsers
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) Uid: number): Promise<User> {
    return this.usersService.findOne(Uid);
  }

  @Delete(':id')
  async remove(@Param('id') Uid: string): Promise<void> {
    return this.usersService.remove(Uid);
  }
}
