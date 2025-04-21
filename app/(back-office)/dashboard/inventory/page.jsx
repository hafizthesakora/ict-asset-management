'use client';
import FixedHeader from '@/components/dashboard/FixedHeader';
import OptionCard from '@/components/dashboard/OptionCard';
import {
  Boxes,
  Component,
  Computer,
  Diff,
  Factory,
  Monitor,
  PersonStanding,
  ScrollText,
  Shirt,
  Slack,
  Warehouse,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Inventory() {
  const optionCards = [
    {
      title: 'Items',
      description: 'Manage items in the inventory',
      link: '/dashboard/inventory/items/new',
      linkTitle: 'New Item',
      enabled: true,
      icon: Monitor,
    },
    {
      title: 'Categories',
      description: 'Categories of items',
      link: '/dashboard/inventory/categories/new',
      linkTitle: 'New Categories',
      enabled: true,
      icon: Boxes,
    },
    {
      title: 'Brands',
      description: 'Brands of items',
      link: '/dashboard/inventory/brands/new',
      linkTitle: 'New Brand',
      enabled: true,
      icon: Slack,
    },
    {
      title: 'Warehouse',
      description: 'Store items in different locations',
      link: '/dashboard/inventory/warehouse/new',
      linkTitle: 'New Warehouse',
      enabled: true,
      icon: Warehouse,
    },
    {
      title: 'Units',
      description: 'Unit of measurement for items',
      link: '/dashboard/inventory/units/new',
      linkTitle: 'New Unit',
      enabled: true,
      icon: Component,
    },
    {
      title: 'Asset Assignments',
      description: 'Assign items to employees',
      link: '/dashboard/inventory/adjustments/new',
      linkTitle: 'New Asset Assignment',
      enabled: true,
      icon: Diff,
    },
    {
      title: 'Suppliers',
      description: 'Manage suppliers of items',
      link: '/dashboard/inventory/suppliers/new',
      linkTitle: 'New Supplier',
      enabled: true,
      icon: Factory,
    },
    {
      title: 'People',
      description: 'Manage people in the inventory',
      link: '/dashboard/inventory/people/new',
      linkTitle: 'New Personnel',
      enabled: true,
      icon: PersonStanding,
    },
  ];
  return (
    <div>
      <FixedHeader title="All Items" newLink="/dashboard/inventory/items/new" />
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 py-8 px-16 gap-6">
        {optionCards.map((option, index) => (
          <OptionCard key={index} optionData={option} />
        ))}
      </div>
    </div>
  );
}
