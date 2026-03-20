export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  company?: string;
  role: string;
  permissions: string[];
  blocked: boolean;
  twoFactorEnabled: boolean;
  settings?: Record<string, any>;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken?: string;
    user: User;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface AuthUserDTO {
  username: string;
  email: string;
  password: string;
  name: string;
  company: string;
  agreements: boolean;
}
