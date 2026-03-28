import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserProfile } from '../types';

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  signIn: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const USER_STORAGE_KEY = '@nutritrack:user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  async function loadStoredUser() {
    try {
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore storage errors on load
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(userData: User) {
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  }

  async function signOut() {
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }

  async function updateProfile(profile: UserProfile) {
    if (!user) return;
    const updated = { ...user, profile };
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    setUser(updated);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
