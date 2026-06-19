export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role?: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
}
