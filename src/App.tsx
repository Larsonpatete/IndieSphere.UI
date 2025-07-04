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
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Footer } from './components/Footer';
import { AboutPage } from './components/AboutPage';
import { ThemeProvider } from './context/ThemeContext';
import { NavbarWithLogo } from './components/NavbarWithLogo';
import { SearchProvider } from './context/SearchContext';
import { ArtistDetails } from './components/ArtistDetails';


// Create a NavbarWithLogo component that has access to useNavigate

export default function App() {
  return (
    <ThemeProvider>
      <div className="background">
        <BrowserRouter>
          <SearchProvider>
            <NavbarWithLogo />
            <Routes>
              <Route path="/song/:id" element={<SongDetails />} />
              <Route path="/artist/:id" element={<ArtistDetails />} />
              <Route path="/search/:type/:query" element={<SearchPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/" element={<SearchPage />} />
            </Routes>
            <Footer />
          </SearchProvider>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}
