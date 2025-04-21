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
} from 'lucide-react';
import React from 'react';
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
  if (status === 'loading') {
    return <p>Loading User...</p>;
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
    <div className="bg-gray-100 h-12 flex items-center justify-between px-8 border-b border-slate-200">
      <button className="lg:hidden" onClick={handleClick}>
        <AlignJustify className="w-6 h-6" />
      </button>
      <div className="flex gap-3">
        {/* Recent Activities  */}
        <button className="hidden lg:block">
          <History className="w-6 h-6" />
        </button>

        {/* Search  */}
        <SearchInput />
      </div>
      <div className="items-center gap-3 hidden lg:flex">
        {/* PlusIcon  */}
        <div className="pr-2 border-r border-gray-300">
          <button className="p-1 bg-blue-600 rounded-lg">
            <Plus className="text-slate-50 w-4 h-4" />
          </button>
        </div>
        <div className="flex border-r border-gray-300 space-x-2">
          <button className="p-1 rounded-lg hover:bg-slate-200">
            <Users2 className="text-slate-900 w-4 h-4" />
          </button>

          <button className="p-1 rounded-lg hover:bg-slate-200">
            <Bell className="text-slate-900 w-4 h-4" />
          </button>

          <button className="p-1 rounded-lg hover:bg-slate-200">
            <Settings className="text-slate-900 w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="flex items-center">
                <span>{username}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button onClick={() => signOut()}>Logout</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button>
            {session.user?.image ? (
              <Image
                width={96}
                height={96}
                className="w-8 h-8 rounded-full border border-gray-800"
                alt="user-image"
                src={session.user?.image}
              />
            ) : (
              <div className="w-8 h-8 rounded-full border border-gray-800 bg-white">
                {initials}
              </div>
            )}
          </button>
          <button>
            <LayoutGrid className="w-6 h-6 text-slate-900" />
          </button>
        </div>
      </div>
      <button className="lg:hidden">
        {session.user?.image ? (
          <Image
            width={96}
            height={96}
            className="w-8 h-8 rounded-full border border-gray-800"
            alt="user-image"
            src={session.user?.image}
          />
        ) : (
          <div className="w-8 h-8 rounded-full border border-gray-800 bg-white">
            {initials}
          </div>
        )}
      </button>
    </div>
  );
}
