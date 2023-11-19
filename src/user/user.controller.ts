import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import UserDTO from 'src/dto/user.dto';
import { UserService } from './user.service';
import { UpdateUserEntity } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private usersService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Res() response) {
    try {
      const result = await this.usersService.findAll();

      return response.send({
        users: result,
        status: HttpStatus.OK,
      });
    } catch (err) {
      return response.send({
        error: err,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createUser(@Body() data: UserDTO, @Res() response) {
    try {
      const result = await this.usersService.createOne(data);

      return response.send({
        status: HttpStatus.CREATED,
        user: result,
      });
    } catch (err) {
      return response.send({
        error: err,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Get('/:id')
  async finOne(@Res() response, @Param('id') id: number) {
    try {
      const user = await this.usersService.findOne(id);

      return response.send({
        status: HttpStatus.OK,
        user: user,
      });
    } catch (err) {
      return response.send({
        status: HttpStatus.BAD_REQUEST,
        error: err,
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  async updateOne(
    @Res() response,
    @Param('id') id: number,
    @Body() data: UpdateUserEntity,
  ) {
    try {
      const updatedUser = await this.usersService.updateOne(id, data);

      return response.send({
        status: HttpStatus.OK,
        user: updatedUser,
      });
    } catch (err) {
      return response.send({
        status: HttpStatus.BAD_REQUEST,
        error: err,
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  async removeOne(@Res() response, @Param('id') id: number) {
    try {
      const removingUser = await this.usersService.removeOne(id);

      return response.send({
        user: removingUser,
        status: HttpStatus.OK,
      });
    } catch (err) {
      return response.send({
        error: err,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
