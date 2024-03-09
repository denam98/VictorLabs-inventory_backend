/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { User } from 'src/common/interfaces/user.interface';

@Injectable()
export class UserService {
  users: User[] = [
    {
      id: 'U0001',
      username: 'user1',
      email: 'user1@example.com',
      role: 'admin',
      password: '$2a$12$zWOn9nh7.wnDw5EtjKYc4em07Oo1S/g9E2ZMhfbAm/t8WKHxl5Lv2',
    },
    {
      id: 'U0002',
      username: 'user2',
      email: 'user2@example.com',
      role: 'admin',
      password: '$2a$12$zWOn9nh7.wnDw5EtjKYc4em07Oo1S/g9E2ZMhfbAm/t8WKHxl5Lv2',
    },
    {
      id: 'U0003',
      username: 'user3',
      email: 'user3@example.com',
      role: 'admin',
      password: '123abc',
    },
  ];

  async findUserByUsername(username: string) {
    return this.users.find((user: User) => user.username === username);
  }

  async getAllUsers() {
    return this.users;
  }
}
