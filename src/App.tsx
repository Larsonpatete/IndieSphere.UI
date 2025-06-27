import React, { useCallback } from 'react';
import { SearchPage} from './components/SearchPage'
import { SongDetails } from './components/SongDetails';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import Globe from './Assets/globe.svg'
import { SearchBar } from './components/SearchBar';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Footer } from './components/Footer';
import { AboutPage } from './components/AboutPage';

// Create a NavbarWithLogo component that has access to useNavigate
const NavbarWithLogo = () => {
  const navigate = useNavigate();
  
  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // This will clear the search results by navigating to root
    // with a state flag that tells SearchPage to clear results
    navigate('/', { state: { clearResults: true } });
  }, [navigate]);

  return (
    <Navbar isBordered>
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <a 
            href="/" 
            onClick={handleLogoClick}
            className="flex items-center gap-2 text-inherit no-underline"
          >
            <img src={Globe} className="h-16" alt="Indie Sphere" />
            <p className="hidden sm:block font-bold text-inherit text-[rgb(211,0,247)]">Indie Sphere</p>
          </a>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-9">
          <NavbarItem>
            <Link to="/features" className="text-inherit">Genres</Link>
          </NavbarItem>
          <NavbarItem>
            <Link to="/customers" className="text-inherit">Periods</Link>
          </NavbarItem>
          <NavbarItem>
            <Link to="/integrations" className="text-inherit">Playlists</Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>
      <NavbarContent as="div" className="items-center" justify="end">
        <SearchBar height='h-12'/>
        {/* Dropdown menu code... */}
      </NavbarContent>
    </Navbar>
  );
};

export default function App() {
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // You can add additional logic here to handle the search query
  };

  return (
    <div className="background">
      <BrowserRouter>
        <NavbarWithLogo />
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/search/:query" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/songdetails/:id" element={<SongDetails />} />
          {/* Other routes... */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
