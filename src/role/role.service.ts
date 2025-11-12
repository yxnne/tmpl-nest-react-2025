import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private readonly repo: Repository<Role>) {}

  create(dto: CreateRoleDto) {
    const role = this.repo.create(dto);
    return this.repo.save(role);
  }

  async findAll(page = 1, pageSize = 15, q?: { id?: number; name?: string; description?: string }) {
    const take = Math.max(1, pageSize);
    const current = Math.max(1, page);
    const skip = (current - 1) * take;
    const qb = this.repo.createQueryBuilder('role');
    if (q?.id) qb.andWhere('role.id = :id', { id: q.id });
    if (q?.name) qb.andWhere('role.name LIKE :name', { name: `%${q.name}%` });
    if (q?.description) qb.andWhere('role.description LIKE :description', { description: `%${q.description}%` });
    qb.skip(skip).take(take);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page: current, pageSize: take };
  }

  async findOne(id: number) {
    const role = await this.repo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(id: number, dto: UpdateRoleDto) {
    const role = await this.findOne(id);
    Object.assign(role, dto);
    return this.repo.save(role);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    await this.repo.remove(role);
    return { success: true };
  }
}
