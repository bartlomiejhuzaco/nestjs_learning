import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserEntity } from './user.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private usersService: UserService) {}

  @Get()
  async findAll(@Res() response) {
    try {
      const result = await this.usersService.findAll();

      return response.status(HttpStatus.OK).send({
        users: result,
        status: HttpStatus.OK,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        error: err,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async finOne(@Res() response, @Param('id') id: number) {
    try {
      const user = await this.usersService.findOne({ id });

      return response.status(HttpStatus.OK).send({
        status: HttpStatus.OK,
        user: user,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        status: HttpStatus.BAD_REQUEST,
        error: err,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateOne(
    @Res() response,
    @Param('id') id: number,
    @Body() data: UpdateUserEntity,
  ) {
    try {
      const updatedUser = await this.usersService.updateOne(id, data);

      return response.status(HttpStatus.OK).send({
        status: HttpStatus.OK,
        user: updatedUser,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        status: HttpStatus.BAD_REQUEST,
        error: err,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async removeOne(@Res() response, @Param('id') id: number) {
    try {
      const removingUser = await this.usersService.removeOne(id);

      return response.status(HttpStatus.OK).send({
        user: removingUser,
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
