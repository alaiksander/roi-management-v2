
import React, { createContext, useContext, useState, useEffect } from "react";
import { loadFromStorage, saveToStorage } from "@/lib/storage";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatarUrl?: string;
  company?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const savedUser = loadFromStorage<User | null>("jurnalkas_user", null);
    setUser(savedUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // For demo purposes we're using mock authentication
      // In a real app, this would be an API call
      if (email === "demo@example.com" && password === "password") {
        const user: User = {
          id: "1",
          name: "Demo User",
          email: "demo@example.com",
          role: "user",
          createdAt: new Date().toISOString(),
        };
        
        setUser(user);
        saveToStorage("jurnalkas_user", user);
        return;
      }
      
      if (email === "admin@example.com" && password === "admin") {
        const user: User = {
          id: "2",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          createdAt: new Date().toISOString(),
        };
        
        setUser(user);
        saveToStorage("jurnalkas_user", user);
        return;
      }
      
      throw new Error("Email atau password salah");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan saat login");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // For demo purposes, we'll simulate a successful registration
      // In a real app, this would be an API call
      const user: User = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        role: "user",
        createdAt: new Date().toISOString(),
      };
      
      setUser(user);
      saveToStorage("jurnalkas_user", user);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan saat registrasi");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("jurnalkas_user");
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);
      if (!user) throw new Error("User not authenticated");
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      saveToStorage("jurnalkas_user", updatedUser);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan saat memperbarui profil");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
