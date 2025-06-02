import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function CollapsibleLink({ href, title, setShowSidebar }) {
  return (
    <a
      href={href}
      onClick={() => setShowSidebar(false)}
      className="flex items-center justify-between pl-8 pr-4 hover:bg-slate-900 transition-all duration-300 py-2 rounded-md"
    >
      <span className="text-sm">{title}</span>
      <PlusCircle className="w-4 h-4" />
    </a>
  );
}
