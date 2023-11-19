import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import UserDTO from 'src/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UserService,
    private authService: AuthService,
  ) {}

  @Post('/sign-in')
  async signIn(
    @Res() response,
    @Body() data: { email: string; password: string },
  ) {
    try {
      const { email, password } = data;

      const user = await this.usersService.findOne({ email });

      const result = await this.authService.signIn(user, password);

      return response.send({
        access_token: result,
      });
    } catch (err) {
      return response.status(HttpStatus.UNAUTHORIZED).send({
        error: err,
        status: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  @Post('/sign-up')
  async signUp(@Res() response, @Body() data: UserDTO) {
    try {
      const userEmailIsExists = await this.authService.checkUserEmailIsExists(
        data.email,
      );

      if (userEmailIsExists) {
        return response.status(HttpStatus.BAD_REQUEST).send({
          message: 'Given email is already exist in database!',
        });
      }

      const result = await this.authService.signUp(data);

      if (result === null) {
        throw new BadRequestException();
      }

      return response.status(HttpStatus.ACCEPTED).send({
        access_token: result,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        status: HttpStatus.BAD_REQUEST,
        error: err,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('/sign-out')
  async signOut(@Res() response) {
    try {
      return response.status(HttpStatus.OK).send({
        message: 'Sign out!',
        status: HttpStatus.OK,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        error: err,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
