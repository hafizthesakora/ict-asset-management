'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

export default function SearchableSelectInput({
  label,
  name,
  value,
  onChange,
  className = 'sm:col-span-2',
  options = [],
  placeholder = 'Search and select...',
  displayKey = 'serialNumber', // What to display in the dropdown
  valueKey = 'id', // What value to return
  allowClear = true, // Allow clearing the selection
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  // Ensure options is an array
  const safeOptions = Array.isArray(options) ? options : [];

  // Filter options based on search term
  const filteredOptions = safeOptions.filter((option) => {
    const displayValue =
      option[displayKey] || option.title || option.name || '';
    return displayValue.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update selected option when value changes
  useEffect(() => {
    if (value) {
      const option = safeOptions.find((opt) => opt[valueKey] === value);
      setSelectedOption(option);
    } else {
      setSelectedOption(null);
    }
  }, [value, safeOptions, valueKey]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option[valueKey]);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedOption(null);
    onChange('');
    setSearchTerm('');
  };

  const getDisplayValue = () => {
    if (selectedOption) {
      return (
        selectedOption[displayKey] ||
        selectedOption.title ||
        selectedOption.name ||
        'Selected'
      );
    }
    return '';
  };

  return (
    <div className={className} ref={dropdownRef}>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2 relative">
        <div
          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:text-sm sm:leading-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex justify-between items-center">
            <span className={selectedOption ? '' : 'text-gray-400'}>
              {getDisplayValue() || placeholder}
            </span>
            <div className="flex items-center gap-1">
              {allowClear && selectedOption && (
                <X
                  size={16}
                  className="text-gray-400 hover:text-gray-600"
                  onClick={handleClear}
                />
              )}
              <ChevronDown
                size={16}
                className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md border border-gray-300 overflow-hidden">
            <div className="p-2 border-b">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-sm">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, i) => {
                  const displayValue =
                    option[displayKey] || option.title || option.name || '';
                  const isSelected =
                    selectedOption && selectedOption[valueKey] === option[valueKey];
                  return (
                    <div
                      key={i}
                      className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 ${
                        isSelected ? 'bg-indigo-100' : ''
                      }`}
                      onClick={() => handleSelect(option)}
                    >
                      <div className="font-medium">{displayValue}</div>
                      {option.title && option[displayKey] !== option.title && (
                        <div className="text-xs text-gray-500">
                          {option.title}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
