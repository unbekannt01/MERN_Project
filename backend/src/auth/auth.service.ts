/* eslint-disable prettier/prettier */
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string, name: string): Promise<void> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userRepository.save({
        email,
        password: hashedPassword,
        name,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error during signup:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async signIn(email: string, password: string): Promise<{ accessToken: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { email: user.email, sub: user.id };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error('Error during signin:', error);
      throw error;
    }
  }
}
