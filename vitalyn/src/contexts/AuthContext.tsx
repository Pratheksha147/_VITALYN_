import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole, identifier: string) => Promise<boolean>;
  signup: (email: string, password: string, role: UserRole, name?: string, wardName?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'vitalyn_user';
const USERS_KEY = 'vitalyn_users';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole, identifier: string): Promise<boolean> => {
    const users: (User & { password: string })[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Find user matching email, password, role, and identifier (name for doctor, wardName for nurse)
    const found = users.find(u => {
      if (u.email !== email || u.password !== password || u.role !== role) return false;
      if (role === 'doctor') {
        return u.name?.toLowerCase() === identifier.toLowerCase();
      } else {
        return u.wardName?.toLowerCase() === identifier.toLowerCase();
      }
    });
    
    if (found) {
      const { password: _, ...userWithoutPassword } = found;
      setUser(userWithoutPassword);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, role: UserRole, name?: string, wardName?: string): Promise<boolean> => {
    const users: (User & { password: string })[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Check if exact combination already exists
    const exists = users.some(u => {
      if (u.email !== email || u.role !== role) return false;
      if (role === 'doctor') {
        return u.name?.toLowerCase() === name?.toLowerCase();
      } else {
        return u.wardName?.toLowerCase() === wardName?.toLowerCase();
      }
    });
    
    if (exists) {
      return false;
    }

    const newUser: User & { password: string } = {
      id: crypto.randomUUID(),
      email,
      password,
      role,
      name: role === 'doctor' ? name : undefined,
      wardName: role === 'nurse' ? wardName : undefined,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
