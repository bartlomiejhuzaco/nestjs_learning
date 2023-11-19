/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserEntity, UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import UserDTO from 'src/dto/user.dto';
import { TUserSearchingCriteria } from './types/users.types';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[] | null> {
    try {
      return this.usersRepository.find();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async createOne(data: UserDTO): Promise<UserEntity | null> {
    try {
      const user = await this.usersRepository.create({
        fullname: data.fullname,
        email: data.email,
        password: data.password,
        birthday: new Date(data.birthday),
        balance: data.balance,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return await this.usersRepository.save(user);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async findOne(criteria: TUserSearchingCriteria): Promise<UserEntity | null> {
    try {
      if (!criteria.id && typeof criteria.email === 'string') {
        const result = await this.usersRepository.findOneBy({
          email: criteria.email,
        });
        return result;
      } else if (!criteria.email && typeof criteria.id === 'number') {
        const result = await this.usersRepository.findOneBy({
          id: criteria.id,
        });
        return result;
      } else return null;
    } catch (err) {
      console.error(err);
      return null;
    }
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
    const user = await this.findOne({ id });

    if (user === null) return null;

    const removedUser = await this.usersRepository.remove(user);

    return removedUser;
  }
}
