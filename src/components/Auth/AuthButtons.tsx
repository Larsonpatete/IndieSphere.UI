// src/components/AuthButton.tsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { SpotifyService } from '../../api/SpotifyService';
import { Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useTheme } from '../../context/ThemeContext';

const spotifyService = new SpotifyService();

export const AuthButton: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (isLoading) {
    return (
      <Button 
        isLoading 
        size="sm" 
        variant="flat" 
        className={isDark ? "bg-gray-800" : "bg-gray-100"}
      >
        Loading
      </Button>
    );
  }

  if (user) {
    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <div className="flex items-center cursor-pointer">
            {user?.images?.[0] ? (
              <img 
                src={user.images[0].url} 
                alt={user.name} 
                className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-sm" 
              />
            ) : (
              <Avatar
                name={user.name?.charAt(0) || "U"}
                size="lg"
                className="bg-indie-purple text-white"
              />
            )}
            <span className="ml-3 mr-2 hidden md:inline font-medium">
              {user.name}
            </span>
          </div>
        </DropdownTrigger>
        <DropdownMenu 
          aria-label="User Actions"
          className={`border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} rounded-lg shadow-lg`}
        >
          <DropdownItem key="header" className={`h-14 gap-2 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`} isReadOnly>
            <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Signed in as</p>
            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name || user.email}</p>
          </DropdownItem>
          
          <DropdownItem key="divider" className={`h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} aria-hidden="true" />
          
          <DropdownItem 
            key="logout" 
            color="danger" 
            onClick={() => spotifyService.logout()}
            className={`rounded-md ${isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <Button 
      size="md" 
      color={isDark ? "primary" : "success"}
      variant={isDark ? "solid" : "flat"}
      onClick={() => spotifyService.login()}
      className={`flex items-center px-4 mr-4 ${isDark ? 'bg-green-700 hover:bg-green-800 text-white' : ''}`}
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
      <span className={isDark ? 'text-white' : ''}>Login with Spotify</span>
    </Button>
  );
};