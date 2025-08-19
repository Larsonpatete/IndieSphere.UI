import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { SpotifyService } from '../api/SpotifyService';
import { useAuth } from '../context/AuthContext';

const spotifyService = new SpotifyService();

export const LoginSuccessPage: React.FC = () => {
  const { checkAuth } = useAuth();
  const navigate = useNavigate(); // Get the navigate function

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const handleLogin = async () => {
      if (token) {
        // This function now stores the token and returns the redirect URL
        const returnUrl = spotifyService.handleLoginSuccess(token);
        console.log("Handling login success, will return to:", returnUrl);
        
        // After storing the token, immediately re-check auth status
        await checkAuth();
        
        // Now navigate to the intended return URL
        navigate(returnUrl, { replace: true });

      } else {
        // Handle error case where no token is provided
        console.error("Login failed: No token received.");
        navigate('/', { replace: true }); // Redirect to home on error
      }
    };

    handleLogin();
  }, [checkAuth, navigate]); // Add navigate to the dependency array

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-xl">Finalizing login...</p>
    </div>
  );
};