import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(input.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 bg-white rounded-full shadow-md">
      <input
        type="text"
        className="flex-grow px-4 py-2 rounded-full outline-none text-lg"
        placeholder="Search..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full"
      >
        Search
      </button>
    </form>
  );
}
