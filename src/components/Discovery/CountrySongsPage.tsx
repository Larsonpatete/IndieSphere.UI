import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SearchService } from '../../api/SearchService';
import { useSongMapper } from '../../hooks/useSongMapper';
import { SongItem } from '../../components/SongItem';

const searchService = new SearchService();

export const CountrySongsPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { mapSong } = useSongMapper();

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    setError(null);
    searchService.getTopSongsByCountry(code)
      .then(response => setSongs(response.results.map(mapSong)))
      .catch(() => setError('Could not load songs for this country.'))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Top Songs in {code}</h1>
      <div className="space-y-4">
        {songs.map((song: any) => (
          <SongItem key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
};