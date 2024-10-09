import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity as User } from '../common/entity/user.entity';
import * as _ from 'lodash';

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

    async findUserByName(name: string): Promise<User> {
        const result = await this.userRepository.findOne({ where: { username: name } });
        return result;
    }

    async findUserByEmail(email: string): Promise<User> {
        const result = await this.userRepository.findOne({ where: { email } });
        return result;
    }

    /**
     * 根据手机号异步查找用户
     * 
     * 此方法通过查询数据库来查找与给定手机号关联的用户它使用了异步操作，
     * 允许在等待数据库查询结果时不阻塞执行流程这种设计模式提高了应用的响应性和性能
     * 
     * @param phone 用户的手机号，作为查询条件
     * @returns 返回一个Promise对象，该对象在查询完成后解析为User对象如果找不到用户，则可能返回undefined
     */
    async findUserByPhone(phone: string): Promise<User> {
        const result = await this.userRepository.findOne({ where: { phoneNumber: phone } });
        return result;
    }

    // 根据ID查找用户
    async findUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    // 更新用户信息
    // 此函数用于更新指定用户的部分或全部信息
    // 参数:
    //   id: 用户的唯一标识符
    //   user: 包含需要更新的用户信息的对象，可以是用户信息的任意子集
    // 返回值:
    //   返回一个Promise，该Promise解析为更新后的用户对象
    async updateUser(id: number, user: Partial<User>): Promise<User> {
        // 确保用户存在，如果不存在则可能抛出错误
        await this.findUserById(id);
        // 在数据库中更新用户的信息
        await this.userRepository.update(id, user);
        // 返回更新后的用户信息
        return this.findUserById(id);
    }

    // 删除用户
    async deleteUser(id: number): Promise<void> {
        await this.findUserById(id); // 确保用户存在
        await this.userRepository.delete(id);
    }
}