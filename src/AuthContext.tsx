import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthResponse, AuthUserDTO } from './types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (payload: any) => Promise<AuthResponse>;
  signUp: (payload: AuthUserDTO) => Promise<AuthResponse>;
  signOut: () => void;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (token: string, password: string) => Promise<AuthResponse>;
  confirmAuth: (code: string) => Promise<AuthResponse>;
  resendAuthCode: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadAuthState = useCallback(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadAuthState();
  }, [loadAuthState]);

  const saveAuthData = (data: { accessToken: string; refreshToken?: string; user: User }) => {
    localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const signIn = async (payload: any): Promise<AuthResponse> => {
    // Mocking API call as per instructions to build real logic but we don't have a real backend yet
    // In a real app, this would be a fetch call to /api/auth/login
    console.log('Signing in with:', payload);
    
    // Simulating API response based on documentation
    return new Promise((resolve) => {
      setTimeout(() => {
        if (payload.email === 'error@test.com') {
          resolve({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Email ou senha inválidos' } });
        } else {
          const mockData = {
            accessToken: 'mock_token_' + Math.random(),
            user: {
              id: 'user-123',
              email: payload.email,
              name: 'Operador Um',
              username: 'operador1',
              company: 'Empresa X',
              role: 'operator',
              permissions: ['query_pf', 'query_pj'],
              blocked: false,
              twoFactorEnabled: false
            }
          };
          saveAuthData(mockData);
          resolve({ success: true, data: mockData });
        }
      }, 1000);
    });
  };

  const signUp = async (payload: AuthUserDTO): Promise<AuthResponse> => {
    console.log('Signing up with:', payload);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  const signOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionId');
    setUser(null);
    setIsAuthenticated(false);
  };

  const forgotPassword = async (email: string) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 1000);
    });
  };

  const resetPassword = async (token: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 1000);
    });
  };

  const confirmAuth = async (code: string): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = {
          accessToken: 'mock_token_' + Math.random(),
          user: {
            id: 'user-123',
            email: 'user@test.com',
            name: 'Operador Um',
            username: 'operador1',
            role: 'operator',
            permissions: [],
            blocked: false,
            twoFactorEnabled: true
          }
        };
        saveAuthData(mockData);
        resolve({ success: true, data: mockData });
      }, 1000);
    });
  };

  const resendAuthCode = async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 1000);
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      signIn, 
      signUp, 
      signOut, 
      forgotPassword, 
      resetPassword, 
      confirmAuth, 
      resendAuthCode 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
