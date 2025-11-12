import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 20, nullable: true, unique: true })
  phone?: string;

  @Column({ nullable: true })
  roleId?: number;
}