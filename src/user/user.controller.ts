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

@Controller('users')
export class UserController {
  constructor(private usersService: UserService) {}

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
  finOne(@Res() response, @Param('id') params: string) {
    console.log(params);

    return response.send({
      id: params,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  updateOne(@Res() response, @Param('id') params: string) {
    console.log(params);

    return response.send({
      id: params,
      name: 'UPDATE',
    });
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  deleteOne(@Res() response, @Param('id') params: string) {
    console.log(params);

    return response.send({
      id: params,
      name: 'DELETE',
    });
  }
}
