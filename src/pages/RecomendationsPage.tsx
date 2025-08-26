import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthButton } from '../components/Auth/AuthButtons';
import { useTheme } from '../context/ThemeContext';
import { SpotifyService, TopStatsResponse } from '../api/SpotifyService';
import { Carousel } from '../components/Carousel';
import { Song } from '../domain/Song';
import { Artist } from '../domain/Artist';
import defaultAlbum from '../Assets/defaultAlbum.svg';
import GhostCard from '../components/GhostCard';

const spotifyService = new SpotifyService();

const RecomendationsPage: React.FC = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const [stats, setStats] = useState<TopStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setLoading(true);
            spotifyService.getTopStats().then(response => {
                setStats(response);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [user]);

    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const cardBgColor = theme === 'dark' ? 'bg-gray-800 bg-opacity-75' : 'bg-white bg-opacity-50';

    const handleSongClick = (song: Song) => {
        const query = `${song.title} by ${song.artist.name}`;
        navigate(`/search/similar-song/${encodeURIComponent(query)}`);
    };

    const handleArtistClick = (artist: Artist) => {
        const query = artist.name;
        navigate(`/search/similar-artist/${encodeURIComponent(query)}`);
    };

    const renderSongItem = (song: Song) => (
        <div 
            className={`flex flex-col items-center text-center p-4 rounded-lg cursor-pointer ${cardBgColor}`}
            onClick={() => handleSongClick(song)}
        >
            <img src={song.albumImageUrl || defaultAlbum} alt={song.title} className="w-48 h-48 object-cover mb-4" />
            <h3 className="font-bold">{song.title}</h3>
            <p>{song.artist.name}</p>
        </div>
    );

    const renderArtistItem = (artist: Artist) => (
        <div 
            className={`flex flex-col items-center text-center p-4 rounded-lg cursor-pointer ${cardBgColor}`}
            onClick={() => handleArtistClick(artist)}
        >
            <img src={artist.images?.[0] || defaultAlbum} alt={artist.name} className="w-48 h-48 object-cover rounded-full mb-4" />
            <h3 className="font-bold">{artist.name}</h3>
        </div>
    );

    const renderGhostCarousel = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <GhostCard key={i} />)}
        </div>
    );

    return (
        <div className={`flex-grow ${textColor}`}>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4 text-center">Recomendations</h1>
                {!user && !loading && (
                    <div className="text-center">
                        <p className="mb-4">Please log in to get recomendations.</p>
                        <AuthButton />
                    </div>
                )}
                {loading ? (
                    <div>
                        <h2 className="text-2xl font-bold my-4 text-center">Your Top Tracks</h2>
                        {renderGhostCarousel()}
                        <h2 className="text-2xl font-bold my-4 text-center">Your Top Artists</h2>
                        {renderGhostCarousel()}
                    </div>
                ) : (
                    stats && (
                        <div>
                            <p className="text-center mb-4">Here are your top tracks and artists. Click on one to get a recomendation!</p>
                            <h2 className="text-2xl font-bold my-4 text-center">Your Top Tracks</h2>
                            <Carousel items={stats.topTracks} renderItem={renderSongItem} />
                            <h2 className="text-2xl font-bold my-4 text-center">Your Top Artists</h2>
                            <Carousel items={stats.topArtists} renderItem={renderArtistItem} />
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default RecomendationsPage;