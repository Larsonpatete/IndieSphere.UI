import React, { useEffect } from 'react';
import { SpotifyService } from '../api/SpotifyService';

const spotifyService = new SpotifyService();

export const LoginSuccessPage: React.FC = () => {
  useEffect(() => {
    // Handle the redirect on component mount
    spotifyService.handleLoginSuccess();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Logging you in...</h1>
        <p>Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
};