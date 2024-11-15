// import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// @Entity('taskList')
// export class TaskList {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column()
//     userId: number;

//     @Column({ length: 300 })
//     feed: string;

//     @Column({ default: 1 })
//     type: number;

//     @Column({ default: 0 })
//     hasUpdate: boolean;

//     @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//     lastFetchTime: Date;

//     @Column({ type: 'enum', enum: ['normal', 'disabled'], default: 'normal' })
//     status: 'normal' | 'disabled';

//     @Column({ type: 'enum', enum: ['not_started', 'success', 'failure'], default: 'not_started' })
//     smsNotificationStatus: 'not_started' | 'success' | 'failure';

//     @Column({ type: 'enum', enum: ['not_started', 'success', 'failure'], default: 'not_started' })
//     emailNotificationStatus: 'not_started' | 'success' | 'failure';

//     @Column({ type: 'enum', enum: ['not_started', 'success', 'failure'], default: 'not_started' })
//     pushNotificationStatus: 'not_started' | 'success' | 'failure';

//     @Column({ type: 'enum', enum: ['normal', 'failure'], default: 'normal' })
//     feedStatus: 'normal' | 'failure';
// }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskList } from './entity';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskList)
        private taskRepository: Repository<TaskList>,
    ) {}

    // Create a new task
    async createTask(taskData: Partial<TaskList>): Promise<TaskList> {
        const taskEntry = this.taskRepository.create(taskData);
        return await this.taskRepository.save(taskEntry);
    }

    // Retrieve a task by ID
    async getTaskById(id: number): Promise<TaskList | undefined> {
        return await this.taskRepository.findOne({ where: { id } });
    }

    // Update a task
    async updateTask(id: number, taskData: Partial<TaskList>): Promise<TaskList | undefined> {
        await this.taskRepository.update(id, taskData);
        return this.getTaskById(id);
    }

    // Delete tasks older than a specified number of days
    async deleteTaskById(id: number): Promise<void> {
        await this.taskRepository.delete(id);
    }

    async deleteTasksByIds(ids: number[]): Promise<void> {
        await this.taskRepository.delete(ids);
    }

    // Retrieve tasks with pagination
    async getTasks(page: number, pageSize: number): Promise<[TaskList[], number]> {
        const [result, total] = await this.taskRepository.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return [result, total];
    }
}
