import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  height?: string;
}

export function SearchBar({ height }: SearchBarProps) {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(input.trim()) {
      navigate(`/search/${encodeURIComponent(input.trim())}`);
    }
    // onSearch(input.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-2 p-2 bg-gray-300 rounded-full shadow-md ${height ?? ""}`}>
      <input
        type="text"
        className="flex-grow px-4 py-2 rounded-full outline-none text-lg bg-gray-300 text-black"
        placeholder="Search..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 text-white bg-[rgb(211,0,247)] hover:bg-blue-700 rounded-full"
      >
        Search
      </button>
    </form>
  );
}
