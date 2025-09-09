import '../styles/SearchPage.css';
import { useTheme } from '../context/ThemeContext';
import { useSearch } from '../context/SearchContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { AuthButton } from '../components/Auth/AuthButtons'; // Add this import
import Globe from '../Assets/globe.svg'
import { SearchBar } from '../components/SearchBar';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import React, { useCallback, useState } from 'react';

export const NavbarWithLogo = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { resetSearchState } = useSearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle logo click to reset search state and navigate home
  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    resetSearchState();
    navigate('/');
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [resetSearchState, navigate, isMenuOpen]);

  const handleLinkClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} className={theme === 'light' ? 'bg-white bg-opacity-90' : 'bg-gray-900 bg-opacity-90'}>
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className={`sm:hidden ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}
        />
        <NavbarBrand className="mr-4">
          <a 
            href="/" 
            onClick={handleLogoClick}
            className="flex items-center gap-2 no-underline"
          >
            <img src={Globe} className="h-12 sm:h-16" alt="Indie Sphere" />
            <p className="hidden sm:block font-bold text-indie-purple text-xl">
              Indie Sphere
            </p>
          </a>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-9">
          <NavbarItem>
            <Link 
              to="/about" 
              className={`${theme === 'light' ? 'text-gray-800' : 'text-white'} ${theme === 'light' ? 'hover:text-purple-700' : 'hover:text-purple-400'}`}
            >
              About
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link 
              to="/recomendations" 
              className={`${theme === 'light' ? 'text-gray-800' : 'text-white'} ${theme === 'light' ? 'hover:text-purple-700' : 'hover:text-purple-400'}`}
            >
              Recomendations
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>
      <NavbarContent as="div" className="items-center" justify="end">
        <div className="flex items-center gap-2 sm:gap-4">
          <AuthButton />
          <ThemeToggle />
        </div>
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem>
          <Link
            className="w-full"
            to="#"
            onClick={() => handleLinkClick('/about')}
          >
            About
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full"
            to="#"
            onClick={() => handleLinkClick('/recomendations')}
          >
            Recomendations
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};
