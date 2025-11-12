import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SetRoleDto } from './dto/set-role.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = this.repo.create({ name: dto.name, email: dto.email, passwordHash, phone: dto.phone });
    return this.repo.save(user);
  }

  async findAll(
    page = 1,
    pageSize = 15,
    q?: { id?: number; name?: string; email?: string; roleId?: number; phone?: string },
  ) {
    const take = Math.max(1, pageSize);
    const current = Math.max(1, page);
    const skip = (current - 1) * take;
    const qb = this.repo.createQueryBuilder('user');
    if (q?.id) qb.andWhere('user.id = :id', { id: q.id });
    if (q?.name) qb.andWhere('user.name LIKE :name', { name: `%${q.name}%` });
    if (q?.email) qb.andWhere('user.email LIKE :email', { email: `%${q.email}%` });
    if (q?.roleId) qb.andWhere('user.roleId = :roleId', { roleId: q.roleId });
    if (q?.phone) qb.andWhere('user.phone LIKE :phone', { phone: `%${q.phone}%` });
    qb.skip(skip).take(take);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page: current, pageSize: take };
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.password !== undefined) user.passwordHash = await bcrypt.hash(dto.password, 12);
    if (dto.phone !== undefined) user.phone = dto.phone;
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.repo.remove(user);
    return { success: true };
  }

  async setRole(id: number, dto: SetRoleDto) {
    const user = await this.findOne(id);
    user.roleId = dto.roleId;
    return this.repo.save(user);
  }
}
