
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Try to get user profile from our User table
      const { data: userProfile, error } = await supabase
        .from('User')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (userProfile) {
        setUser({
          id: userProfile.id,
          name: userProfile.name || supabaseUser.email?.split('@')[0] || '',
          email: userProfile.email,
          role: userProfile.role as "user" | "admin",
          avatarUrl: userProfile.image || undefined,
          createdAt: userProfile.createdAt,
        });
      } else {
        // Create user profile if it doesn't exist
        const newUser = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
          email: supabaseUser.email!,
          role: 'user' as const,
          password: '', // This will be handled by Supabase Auth
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const { error: insertError } = await supabase
          .from('User')
          .insert([newUser]);

        if (insertError) {
          console.error('Error creating user profile:', insertError);
        } else {
          setUser({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt,
          });
        }
      }
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat login");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat registrasi");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    }
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('User')
        .update({
          name: data.name,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memperbarui profil");
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
