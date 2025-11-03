'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/garden';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Load user from localStorage only on the client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = mockUsers.find((u) => u.email === email);
    console.log(password);
    if (foundUser) {
      setUser(foundUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
      }
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, password: string, role: UserRole): boolean => {
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) return false;
 console.log(password);
    const newUser: User = {
      id: `u${mockUsers.length + 1}`,
      name,
      email,
      role,
      avatar: name.split(' ').map((n) => n[0]).join('').toUpperCase(),
    };

    mockUsers.push(newUser);
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
