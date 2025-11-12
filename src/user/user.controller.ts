import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SetRoleDto } from './dto/set-role.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('id') id?: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('roleId') roleId?: number,
    @Query('phone') phone?: string,
  ) {
    const p = Number(page) || 1;
    const s = Number(pageSize) || 15;
    const q = {
      id: id !== undefined ? Number(id) : undefined,
      name: name || undefined,
      email: email || undefined,
      roleId: roleId !== undefined ? Number(roleId) : undefined,
      phone: phone || undefined,
    };
    return this.service.findAll(p, s, q);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新用户' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: '设置用户角色' })
  setRole(@Param('id', ParseIntPipe) id: number, @Body() dto: SetRoleDto) {
    return this.service.setRole(id, dto);
  }
}
