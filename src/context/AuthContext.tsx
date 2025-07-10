// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SpotifyService, SpotifyUser } from '../api/SpotifyService';

interface AuthContextType {
  user: SpotifyUser | null;
  isLoading: boolean;
  login: (returnUrl?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const spotifyService = new SpotifyService();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      try {
        const currentUser = await spotifyService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (returnUrl?: string) => {
    spotifyService.login(returnUrl);
  };

  const logout = () => {
    spotifyService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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