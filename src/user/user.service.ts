import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.Username = createUserDto.Username;
    user.City = createUserDto.City;
    user.Friend = createUserDto.Friend;

    return this.usersRepository.save(user);
  }

  createMany(users: CreateUserDto[]): Promise<User[]> {
    const userList = [];
    for (const i in users) {
        const uList = new User();
        uList.Username = users[i].Username;
        uList.City = users[i].City;
        uList.Friend = users[i].Friend;
        userList.push(uList);
    }
    return this.usersRepository.save(userList);
}
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(Uid: number): Promise<User> {
    return this.usersRepository.findOneBy({ Uid: Uid });
  }

  async remove(Uid: string): Promise<void> {
    await this.usersRepository.delete(Uid);
  }
}
