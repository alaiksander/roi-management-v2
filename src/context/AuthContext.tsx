
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
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          await fetchUserProfile(session.user);
        } else if (mounted) {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (!mounted) return;

      try {
        setLoading(true);
        
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError('Authentication error occurred');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Fetching profile for user:', supabaseUser.id);
      
      // Try to get user profile from our User table
      const { data: userProfile, error } = await supabase
        .from('User')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        // Don't throw here, just use basic user info
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
        console.log('Creating new user profile');
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
          // Still set user with basic info even if profile creation fails
          setUser({
            id: supabaseUser.id,
            name: supabaseUser.email?.split('@')[0] || '',
            email: supabaseUser.email!,
            role: 'user',
            createdAt: new Date().toISOString(),
          });
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
      // Fallback: set user with minimal info from Supabase user
      setUser({
        id: supabaseUser.id,
        name: supabaseUser.email?.split('@')[0] || '',
        email: supabaseUser.email!,
        role: 'user',
        createdAt: new Date().toISOString(),
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Auth state change will handle setting the user
    } catch (err: any) {
      const errorMessage = err.message || "Terjadi kesalahan saat login";
      setError(errorMessage);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
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
      const errorMessage = err.message || "Terjadi kesalahan saat registrasi";
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
      }
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
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
