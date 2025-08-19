// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { SpotifyService, SpotifyUser } from '../api/SpotifyService';
import { Console } from 'console';

// 1. Define the shape of your context data
interface AuthContextType {
  user: SpotifyUser | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>; // Ensure checkAuth is part of the type definition
  logout: () => void; // Add this line
}

// 2. Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const spotifyService = new SpotifyService();

// 3. Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 4. Define the checkAuth function
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    // If there's no token, we know the user isn't logged in.
    // No need to make an API call that we know will fail.
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    // If there is a token, try to validate it by fetching the user.
    try {
      const currentUser = await spotifyService.getCurrentUser();
      console.log("Current user from checkAuth:", currentUser);
      setUser(currentUser);
    } catch (error) {
      console.error("Authentication check failed, token may be invalid.", error);
      // The API call failed, so the token is likely bad.
      // Clear the bad token and user state.
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      // This will run after the check on app load
      setIsLoading(false);
    }
  }, []);

  // 2. Create the new logout function
  const logout = () => {
    // Call the service to clear tokens and handle backend redirect
    spotifyService.logout();
    // Immediately clear the user state for an instant UI update
    setUser(null);
  };

  // Run the check once when the app loads
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 5. Provide the user, loading state, AND checkAuth function in the context value
  const value = { user, isLoading, checkAuth, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 6. Create the custom hook to consume the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};