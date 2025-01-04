/* eslint-disable prettier/prettier */
// src/config/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Task } from '../entities/task.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root', // Update with your MySQL username
  password: '', // Update with your MySQL password
  database: 'task_management',
  entities: [User, Task],
  synchronize: true, // Set to false in production
};