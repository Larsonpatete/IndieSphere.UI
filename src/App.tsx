import React from 'react';
import { SearchPage } from './components/SearchPage'
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
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// export const AcmeLogo = () => {
//   return (
//     <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
//       {/* <path
//         clipRule="evenodd"
//         d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
//         fill="currentColor"
//         fillRule="evenodd"
//       /> */}
//     </svg>
//   );
// };

type SearchIconProps = {
  size?: number;
  strokeWidth?: number;
  width?: number;
  height?: number;
  [key: string]: any;
};

export const SearchIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}: SearchIconProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={height || size}
      role="presentation"
      viewBox="0 0 24 24"
      width={width || size}
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
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
      <Navbar isBordered>
        <NavbarContent justify="start">
          <NavbarBrand className="mr-4">
            <Link to={"/"} className="flex items-center gap-2 text-inherit no-underline">
              <img src={Globe} className="h-16"></img>
              <p className="hidden sm:block font-bold text-inherit text-[rgb(211,0,247)]">Indie Sphere</p>
            </Link>
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
          {/* <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">zoey@example.com</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown> */}
        </NavbarContent>
      </Navbar>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/search/:query" element={<SearchPage />} />
        <Route path="/features" element={<div>Features Page</div>} />
        <Route path="/customers" element={<div>Customers Page</div>} />
        <Route path="/integrations" element={<div>Integrations Page</div>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

// export default function App() {
//   return (
//     <main className="flex flex-col justify-center min-h-screen bg-gray-100">
//       <SearchPage />
//     </main>
//   );
// }
