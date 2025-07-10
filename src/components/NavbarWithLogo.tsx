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
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import React, { useCallback } from 'react';

export const NavbarWithLogo = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { resetSearchState } = useSearch();

  // Handle logo click to reset search state and navigate home
  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    resetSearchState();
  }, [resetSearchState]);

  return (
    <Navbar isBordered className={theme === 'light' ? 'bg-white bg-opacity-90' : 'bg-gray-900 bg-opacity-90'}>
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <a 
            href="/" 
            onClick={handleLogoClick}
            className="flex items-center gap-2 no-underline"
          >
            <img src={Globe} className="h-16" alt="Indie Sphere" />
            {/* Remove text-inherit so it doesn't inherit the parent text color */}
            <p className="hidden sm:block font-bold text-indie-purple text-xl">
              Indie Sphere
            </p>
          </a>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-9">
          <NavbarItem>
            {/* Add explicit text color for each theme instead of text-inherit */}
            <Link 
              to="/about" 
              className={`${theme === 'light' ? 'text-gray-800' : 'text-white'} ${theme === 'light' ? 'hover:text-purple-700' : 'hover:text-purple-400'}`}
            >
              About
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link 
              to="/discover" 
              className={`${theme === 'light' ? 'text-gray-800' : 'text-white'} ${theme === 'light' ? 'hover:text-purple-700' : 'hover:text-purple-400'}`}
            >
              Discover
            </Link>
          </NavbarItem>
          {/* Other navbar items */}
        </NavbarContent>
      </NavbarContent>
      <NavbarContent as="div" className="items-center" justify="end">
        {/* <SearchBar height='h-12'/> */}
        <div className="ml-4">
          <AuthButton /> {/* Add the AuthButton component */}
        </div>
        <div className="ml-4">
          <ThemeToggle />
        </div>
      </NavbarContent>
    </Navbar>
  );
};
