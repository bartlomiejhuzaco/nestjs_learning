import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserEntity, UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import UserDTO from 'src/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async createOne(data: UserDTO): Promise<UserEntity> {
    const user = this.usersRepository.create({
      fullname: data.fullname,
      email: data.email,
      password: data.password,
      birthday: new Date(data.birthday),
      balance: 0,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return this.usersRepository.save(user);
  }

  async findOne(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async updateOne(
    id: number,
    data: UpdateUserEntity,
  ): Promise<UserEntity | null> {
    const user = await this.usersRepository.findOneBy({ id });

    if (user === null) return null;

    return await this.usersRepository.save({
      ...user,
      ...data,
    });
  }

  async removeOne(id: number): Promise<UserEntity | null> {
    const user = await this.findOne(id);

    if (user === null) return null;

    const removedUser = await this.usersRepository.remove(user);

    return removedUser;
  }
}
