
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development fallback when Supabase isn't available
const MOCK_USERS: UserProfile[] = [
  { id: '1', name: 'John Doe', email: 'user@example.com', role: 'customer' },
  { id: '2', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
];

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();
  
  // Check for existing session on mount
  useEffect(() => {
    // First check for Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user);
      } else {
        // Fallback to stored user for development
        const storedUser = localStorage.getItem('makers_tech_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    });

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      // Fetch the user's profile from our profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      // Create a UserProfile object
      const userProfile: UserProfile = {
        id: authUser.id,
        name: authUser.user_metadata.name || authUser.email?.split('@')[0] || 'User',
        email: authUser.email || '',
        role: data?.role || 'customer',
      };

      setUser(userProfile);
      localStorage.setItem('makers_tech_user', JSON.stringify(userProfile));
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };
  
  const signup = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            name: email.split('@')[0] || 'User',
          }
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        toast({
          title: 'Signup failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }

      if (data.user) {
        // Create a user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            { 
              id: data.user.id, 
              role: role 
            }
          ]);

        if (profileError) {
          console.error('Profile creation error:', profileError.message);
          toast({
            title: 'Profile creation failed',
            description: profileError.message,
            variant: 'destructive',
          });
          return false;
        }

        toast({
          title: 'Signup successful',
          description: 'Welcome to Makers Tech! You can now log in.',
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup error',
        description: 'An unexpected error occurred during signup.',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Try Supabase authentication first
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.log('Supabase auth error, falling back to mock users:', error.message);
        // Fall back to mock users for development
        const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('makers_tech_user', JSON.stringify(foundUser));
          toast({
            title: "Login successful",
            description: "Welcome back! Using mock user for development.",
          });
          return true;
        }
        
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred during login.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      // Also clear local storage
      localStorage.removeItem('makers_tech_user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
