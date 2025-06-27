import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  
  // Add this handler to clear results when clicking Home
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Navigate to root with clearResults flag
    navigate('/', { state: { clearResults: true } });
  };
  
  return (
    <footer className="bg-gray-900 bg-opacity-70 backdrop-blur-sm text-gray-300 py-6 border-t-0">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold text-blue-400 mb-2">Indie Sphere</h3>
            <p className="text-sm">Discover the indie music universe</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12 mb-4 md:mb-0">
            <div>
              <h4 className="text-white font-medium mb-2">Navigate</h4>
              <ul className="space-y-2">
                {/* Replace the regular Link with a custom link that clears results */}
                <li>
                  <a 
                    href="/" 
                    onClick={handleHomeClick}
                    className="hover:text-blue-400 transition"
                  >
                    Home
                  </a>
                </li>
                <li><Link to="/discover" className="hover:text-blue-400 transition">Discover</Link></li>
                <li><Link to="/about" className="hover:text-blue-400 transition">About</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2">Resources</h4>
              <ul className="space-y-2">
                <li><a href="https://developer.spotify.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">Spotify API</a></li>
                <li><a href="https://www.last.fm/api" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">Last.fm API</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-2 md:mb-0">© {currentYear} Indie Sphere. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-400 transition">Terms</a>
            <a href="#" className="hover:text-blue-400 transition">Privacy</a>
            <a href="https://github.com/Larsonpatete/IndieSphere.UI" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};