import React from "react";
import SpotifyLogo from '../Assets/Full_Logo_Black_CMYK.svg';
import { Song } from '../domain/Song';

interface SongItemProps {
  song: Song;
}


export const SongItem: React.FC<SongItemProps> = ({ song }) => {
  console.log('Rendering song:', song);
  return (
    <div 
      className="relative p-4 bg-gray-300 hover:bg-gray-400 rounded shadow hover:shadow-lg transition flex flex-col items-center max-h-lg max-w-xs"
      style={{ minHeight: '200px' }}
    >
      {song.albumImageUrl && (
        <img
          src={song.albumImageUrl}
          alt={song.title}
          className="h-70 object-cover rounded mb-2"
        />
      )}
      
      <h3 className="text-lg font-semibold truncate w-full text-center">
        {song.title}
        {song.isExplicit && (
          <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
            E
          </span>
        )}
      </h3>
      
      {song.album && (
        <h4 className="text-md text-gray-600 truncate w-full text-center">
          {song.album}
        </h4>
      )}
      
      <p className="text-sm text-gray-700 truncate w-full text-center">
        <a
          href={song.artist.url || `https://musicbrainz.org/artist/${song.artist.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {song.artist.name}
        </a>
      </p>
      
      {song.genres.length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-1">
          {song.genres.map(genre => (
            <span 
              key={genre.id} 
              className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              {genre.name}
            </span>
          ))}
        </div>
      )}
      
      {song.trackUrl && (
        <a
          href={song.trackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-sm text-green-600 hover:underline"
        >
          View Track
        </a>
      )}
    </div>
  );
};

// export const SongItem: React.FC<SongItemProps> = ({ songs }) => (
//   <>
//     {songs.map((song, idx) => {
//       console.log('Rendering song:', song);
//       return (
//       <div
//         key={idx}
//         className="relative p-4 bg-gray-300 hover:bg-gray-400 rounded shadow hover:shadow-lg transition flex flex-col items-center max-h-lg max-w-xs"
//         style={{ minHeight: '200px' }}
//       >
//         {song.albumImageUrl && (
//           <img
//             src={song.albumImageUrl}
//             alt={song.title}
//             className="h-70 object-cover rounded mb-2"
//           />
//         )}
//         <h3 className="text-lg font-semibold">{song.title}</h3>
//         <h4 className="text-md text-gray-600">{song.albumName}</h4>
//         <p className="text-sm text-gray-700">
//           <a
//             href={song.artistUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-500 hover:underline"
//           >
//             {song.artist}
//           </a>
//         </p>
//         {song.trackUrl && (
//           <a
//             href={song.trackUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="block mt-2 text-sm text-green-600 hover:underline"
//           >
//             Listen on Spotify
//           </a>
//         )}
//         <img
//           src={SpotifyLogo}
//           alt="Logo"
//           className="w-12 h-12 absolute bottom-2 right-2 opacity-80 pointer-events-none"
//           style={{ zIndex: 1 }}
//         />
//       </div>
//     )})}
//   </>
// );