/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { Task, TaskStatus, TaskPriority } from '../entities/task.entity';
  import { TasksService } from './tasks.service';
  import { User } from '../entities/user.entity';
  import { GetUser } from 'src/decorators/get-user.decorator'; // Adjust the path as needed
  
  @Controller('tasks')
  @UseGuards(AuthGuard())
  export class TasksController {
    constructor(private tasksService: TasksService) {}
  
    @Post()
    createTask(
      @Body()
      createTaskDto: {
        title: string;
        description: string;
        dueDate: Date;
        priority: TaskPriority;
      },
      @GetUser() user: User,
    ): Promise<Task> {
      return this.tasksService.createTask(
        createTaskDto.title,
        createTaskDto.description,
        createTaskDto.dueDate,
        createTaskDto.priority,
        user,
      );
    }
  
    @Get()
    getTasks(
      @Query('page') page: number,
      @Query('limit') limit: number,
      @GetUser() user: User,
    ): Promise<{ tasks: Task[]; total: number }> {
      return this.tasksService.getTasks(page, limit, user);
    }
  
    @Get(':id')
    getTaskById(@Param('id') id: number, @GetUser() user: User): Promise<Task> {
      return this.tasksService.getTaskById(id, user);
    }
  
    @Put(':id')
    updateTask(
      @Param('id') id: number,
      @Body()
      updateTaskDto: {
        title: string;
        description: string;
        dueDate: Date;
        priority: TaskPriority;
      },
      @GetUser() user: User,
    ): Promise<Task> {
      return this.tasksService.updateTask(
        id,
        updateTaskDto.title,
        updateTaskDto.description,
        updateTaskDto.dueDate,
        updateTaskDto.priority,
        user,
      );
    }
  
    @Delete(':id')
    deleteTask(@Param('id') id: number, @GetUser() user: User): Promise<void> {
      return this.tasksService.deleteTask(id, user);
    }
  
    @Patch(':id/status')
    updateTaskStatus(
      @Param('id') id: number,
      @Body('status') status: TaskStatus,
      @GetUser() user: User,
    ): Promise<Task> {
      return this.tasksService.updateTaskStatus(id, status, user);
    }
  }