/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';
import UserDTO from 'src/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const result = await this.usersService.findOne({ email });

    if (!result) return null;

    const hashedPassword: boolean = await bcrypt.compare(
      password,
      result.password,
    );

    if (hashedPassword) {
      const { password, ...data } = result;
      return data;
    }
    return null;
  }

  async hashingPassword(password: string): Promise<string> {
    const saltRound: number = 10;

    const salt = bcrypt.genSaltSync(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  async signIn(user: UserEntity | null, password: string): Promise<string> {
    if (user === null) {
      throw new UnauthorizedException();
    }

    const hashedPassword: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!hashedPassword) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      email: user.email,
      created_at: user.created_at,
    };

    const access_token: string = await this.jwtService.signAsync(payload);

    return access_token;
  }

  async signUp(newUser: UserDTO): Promise<string | null> {
    const hashedPassword: string = await this.hashingPassword(newUser.password);

    const createdUser: UserDTO = {
      ...newUser,
      password: hashedPassword,
    };

    const user = await this.usersService.createOne(createdUser);

    if (user === null) {
      return null;
    }

    const payload = {
      sub: user.id,
      email: user.email,
      created_at: user.created_at,
    };

    const access_token: string = await this.jwtService.signAsync(payload);

    return access_token;
  }

  async checkUserEmailIsExists(email: string): Promise<boolean> {
    const user = await this.usersService.findOne({ email });

    if (user !== null) {
      return true; // FIND USER
    }
    return false;
  }
}
