/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus, TaskPriority } from '../entities/task.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTask(
    title: string,
    description: string,
    dueDate: Date,
    priority: TaskPriority,
    user: User,
  ): Promise<Task> {
    const task = this.taskRepository.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo: user,
    });
    return this.taskRepository.save(task);
  }

  async getTasks(
    page: number = 1,
    limit: number = 10,
    user: User,
  ): Promise<{ tasks: Task[]; total: number }> {
    const [tasks, total] = await this.taskRepository.findAndCount({
      where: { assignedTo: { id: user.id } },
      skip: (page - 1) * limit,
      take: limit,
      order: { dueDate: 'ASC' },
    });
    return { tasks, total };
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, assignedTo: { id: user.id } },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async updateTask(
    id: number,
    title: string,
    description: string,
    dueDate: Date,
    priority: TaskPriority,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    task.priority = priority;
    return this.taskRepository.save(task);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({
      id,
      assignedTo: { id: user.id },
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    return this.taskRepository.save(task);
  }
}