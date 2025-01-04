/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { IsString, IsDate, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '../../entities/task.entity';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete project' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Need to finish the project documentation' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2024-01-30' })
  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.MEDIUM })
  @IsEnum(TaskPriority)
  priority: TaskPriority;
}

export class UpdateTaskDto extends CreateTaskDto {}

export class UpdateTaskStatusDto {
  @ApiProperty({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  status: TaskStatus;
}