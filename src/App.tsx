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


// Create a NavbarWithLogo component that has access to useNavigate

export default function App() {
  return (
    <ThemeProvider>
      <div className="background">
        <BrowserRouter>
          <NavbarWithLogo />
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/search/:type/:query" element={<SearchPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/songdetails/:id" element={<SongDetails />} />
            {/* Other routes... */}
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}
