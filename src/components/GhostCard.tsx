import React from 'react';
import { useTheme } from '../context/ThemeContext';

const GhostCard: React.FC = () => {
    const { theme } = useTheme();
    const cardBgColor = theme === 'dark' ? 'bg-gray-800 bg-opacity-75' : 'bg-white bg-opacity-50';

    return (
        <div className={`flex flex-col items-center text-center p-4 rounded-lg ${cardBgColor} animate-pulse`}>
            <div className="w-48 h-48 bg-gray-500 rounded-lg mb-4"></div>
            <div className="h-6 w-3/4 bg-gray-500 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-500 rounded"></div>
        </div>
    );
};

export default GhostCard;
