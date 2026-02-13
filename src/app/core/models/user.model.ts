export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: Omit<User, 'password'> | null;
  token: string | null;
}
