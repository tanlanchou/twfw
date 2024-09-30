import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity as User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    // 创建用户
    async createUser(user: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create(user);
        return await this.userRepository.save(newUser);
    }

    // 查找所有用户
    async findAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    // 根据ID查找用户
    async findUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    // 更新用户
    async updateUser(id: number, user: Partial<User>): Promise<User> {
        await this.findUserById(id); // 确保用户存在
        await this.userRepository.update(id, user);
        return this.findUserById(id);
    }

    // 删除用户
    async deleteUser(id: number): Promise<void> {
        await this.findUserById(id); // 确保用户存在
        await this.userRepository.delete(id);
    }
}