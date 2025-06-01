'use client';
import {
  AlignJustify,
  Bell,
  ChevronDown,
  History,
  LayoutGrid,
  Plus,
  Settings,
  Users2,
  User,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import React, { useState } from 'react';
import SearchInput from './SearchInput';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { generateInitials } from '@/lib/generateInitials';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header({ setShowSidebar }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3); // Example notification count

  if (status === 'loading') {
    return (
      <div className="bg-white dark:bg-gray-900 h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Loading User...
          </span>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
  }

  const username = session?.user?.name.split(' ')[0] ?? '';
  const initials = generateInitials(session?.user?.name);

  function handleClick() {
    setShowSidebar(true);
  }

  return (
    <header
      className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md h-16 
                      flex items-center justify-between px-4 lg:px-8 
                      border-b border-gray-200 dark:border-gray-700 shadow-sm"
    >
      {/* Left Section - Mobile Menu & Actions */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 
                     transition-colors duration-200 group"
          onClick={handleClick}
        >
          <AlignJustify
            className="w-5 h-5 text-gray-700 dark:text-gray-300 
                                   group-hover:text-gray-900 dark:group-hover:text-gray-100"
          />
        </button>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Recent Activities */}
          <button
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 
                           transition-all duration-200 group relative"
          >
            <History
              className="w-5 h-5 text-gray-600 dark:text-gray-400 
                               group-hover:text-blue-600 dark:group-hover:text-blue-400"
            />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>

          {/* Search Input */}
          <div className="ml-4">
            <SearchInput />
          </div>
        </div>
      </div>

      {/* Mobile Search - Only visible on mobile */}
      <div className="flex-1 mx-4 lg:hidden">
        <SearchInput />
      </div>

      {/* Right Section - User Actions */}
      <div className="flex items-center space-x-2 lg:space-x-4">
        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center space-x-1">
          {/* Quick Actions Group */}
          <div className="flex items-center space-x-1 pr-4 border-r border-gray-200 dark:border-gray-700">
            {/* Add Button */}
            <button
              className="p-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                             rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 
                             transition-all duration-200 group"
            >
              <Plus className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>

          {/* Utility Buttons Group */}
          <div className="flex items-center space-x-1 pr-4 border-r border-gray-200 dark:border-gray-700">
            {/* Users */}
            <button
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 
                             transition-all duration-200 group relative"
            >
              <Users2
                className="w-4 h-4 text-gray-600 dark:text-gray-400 
                                group-hover:text-blue-600 dark:group-hover:text-blue-400"
              />
            </button>

            {/* Notifications */}
            <button
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 
                             transition-all duration-200 group relative"
            >
              <Bell
                className="w-4 h-4 text-gray-600 dark:text-gray-400 
                              group-hover:text-blue-600 dark:group-hover:text-blue-400"
              />
              {notifications > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center 
                               w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full 
                               animate-pulse"
                >
                  {notifications}
                </span>
              )}
            </button>

            {/* Settings */}
            <button
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 
                             transition-all duration-200 group"
            >
              <Settings
                className="w-4 h-4 text-gray-600 dark:text-gray-400 
                                 group-hover:text-blue-600 dark:group-hover:text-blue-400 
                                 group-hover:rotate-90 transition-transform duration-200"
              />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 
                       transition-all duration-200 group"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400" />
              ) : (
                <Moon
                  className="w-4 h-4 text-gray-600 dark:text-gray-400 
                               group-hover:text-blue-600 dark:group-hover:text-blue-400"
                />
              )}
            </button>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center space-x-3">
            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl 
                                 hover:bg-gray-100 dark:hover:bg-gray-800 
                                 transition-all duration-200 group"
                >
                  <span
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 
                                 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                  >
                    {username}
                  </span>
                  <ChevronDown
                    className="w-3 h-3 text-gray-500 dark:text-gray-400 
                                        group-hover:text-gray-700 dark:group-hover:text-gray-300
                                        group-hover:rotate-180 transition-transform duration-200"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-semibold">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
                  <LogOut className="w-4 h-4 mr-2" />
                  <button onClick={() => signOut()}>Sign Out</button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Avatar */}
            <div className="relative">
              {session.user?.image ? (
                <Image
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600 
                           hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200
                           shadow-md hover:shadow-lg"
                  alt="User Avatar"
                  src={session.user?.image}
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600 
                              bg-gradient-to-br from-blue-500 to-purple-600 
                              flex items-center justify-center text-white font-semibold text-sm
                              hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200
                              shadow-md hover:shadow-lg"
                >
                  {initials}
                </div>
              )}
              {/* Online Status Indicator */}
              <div
                className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-900 
                            rounded-full"
              ></div>
            </div>

            {/* App Grid */}
            <button
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 
                             transition-all duration-200 group"
            >
              <LayoutGrid
                className="w-5 h-5 text-gray-600 dark:text-gray-400 
                                   group-hover:text-blue-600 dark:group-hover:text-blue-400"
              />
            </button>
          </div>
        </div>

        {/* Mobile User Avatar */}
        <div className="lg:hidden relative">
          {session.user?.image ? (
            <Image
              width={36}
              height={36}
              className="w-9 h-9 rounded-full border-2 border-gray-200 dark:border-gray-600 
                       shadow-md"
              alt="User Avatar"
              src={session.user?.image}
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full border-2 border-gray-200 dark:border-gray-600 
                          bg-gradient-to-br from-blue-500 to-purple-600 
                          flex items-center justify-center text-white font-semibold text-sm
                          shadow-md"
            >
              {initials}
            </div>
          )}
          {/* Mobile notification badge */}
          {notifications > 0 && (
            <div
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs 
                          font-bold rounded-full flex items-center justify-center animate-pulse"
            >
              {notifications}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
