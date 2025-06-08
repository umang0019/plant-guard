import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'admin@plantguard.com',
    role: 'admin',
    location: 'Agricultural Research Center'
  },
  {
    id: '2',
    name: 'Mark Chen',
    email: 'approver@plantguard.com',
    role: 'approver',
    location: 'Regional Extension Office'
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    email: 'dataentry@plantguard.com',
    role: 'data_entry',
    location: 'Field Station Alpha'
  },
  {
    id: '4',
    name: 'John Farmer',
    email: 'user@plantguard.com',
    role: 'basic_user',
    location: 'Green Valley Farm'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}