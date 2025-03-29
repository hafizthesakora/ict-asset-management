'use client';

import React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import CollapsibleLink from './CollapsibleLink';
import { BaggageClaim } from 'lucide-react';

export default function SidebarDropdownLink({ title, items, icon }) {
  const Icon = icon;
  return (
    <Collapsible>
      <CollapsibleTrigger className="p-2 flex items-center space-x-2">
        <Icon className="w-4 h-4" />
        <span>{title}</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {items.map((link, index) => (
          <CollapsibleLink key={index} href={link.href} title={link.title} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
