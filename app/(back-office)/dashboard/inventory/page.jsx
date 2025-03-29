'use client';
import FixedHeader from '@/components/dashboard/FixedHeader';
import OptionCard from '@/components/dashboard/OptionCard';
import {
  Boxes,
  Component,
  Computer,
  Monitor,
  ScrollText,
  Shirt,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Inventory() {
  const optionCards = [
    {
      title: 'Item Groups',
      description: 'Create groups of items',
      link: '/new',
      linkTitle: 'New Item Group',
      enabled: true,
      icon: Boxes,
    },
    {
      title: 'Items',
      description: 'Create standalone items or products',
      link: '/new',
      linkTitle: 'New Item',
      enabled: true,
      icon: Monitor,
    },
    {
      title: 'Composite Items',
      description: 'Bundle different items together',
      link: '/new',
      linkTitle: 'New Composite Item',
      enabled: false,
      icon: Component,
    },
    {
      title: 'Price List',
      description: 'Price list for items',
      link: '/new',
      linkTitle: 'New Item',
      enabled: false,
      icon: ScrollText,
    },
  ];
  return (
    <div>
      <FixedHeader newLink="/dashboard/inventory/items/new" />
      <div className="grid grid-cols-1 lg:grid-cols-2 py-8 px-16 gap-6">
        {optionCards.map((option, index) => (
          <OptionCard key={index} optionData={option} />
        ))}
      </div>
    </div>
  );
}
