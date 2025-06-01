'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { Check, Lock } from 'lucide-react';

export default function OptionCard({ optionData }) {
  const {
    title,
    description,
    link,
    linkTitle,
    enabled,
    icon: Icon,
  } = optionData;

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl 
                 border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 
                 hover:-translate-y-2 transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>

      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        {enabled ? (
          <div
            className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 
                          rounded-full border-2 border-green-200 dark:border-green-700"
          >
            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
        ) : (
          <div
            className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700 
                          rounded-full border-2 border-gray-200 dark:border-gray-600"
          >
            <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
        )}
      </div>

      <div className="relative p-8 flex flex-col items-center text-center space-y-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          {title}
        </h2>

        {/* Icon Container */}
        <div className="relative">
          <div
            className={`p-6 rounded-3xl transition-all duration-300 ${
              enabled
                ? 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30'
                : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600'
            }`}
          >
            <Icon
              strokeWidth="1px"
              className={`w-24 h-24 transition-all duration-300 ${
                enabled
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 dark:text-gray-500'
              } ${isHovered ? 'scale-110 rotate-3' : 'scale-100 rotate-0'}`}
            />
          </div>

          {/* Decorative ring */}
          <div
            className={`absolute inset-0 rounded-3xl transition-all duration-300 ${
              isHovered
                ? 'ring-4 ring-blue-200 dark:ring-blue-800 ring-opacity-50'
                : 'ring-0'
            }`}
          ></div>
        </div>

        {/* Description */}
        <div className="min-h-[3rem] flex items-center">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm">
            {description}
          </p>
        </div>

        {/* Action Button */}
        <div className="w-full pt-2">
          {enabled ? (
            <Link
              href={link}
              className="group/btn inline-flex items-center justify-center w-full py-3 px-6 
                       bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                       text-white font-semibold rounded-xl shadow-lg hover:shadow-xl 
                       transform hover:-translate-y-0.5 transition-all duration-200 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                       dark:focus:ring-offset-gray-800"
            >
              <span className="group-hover/btn:mr-2 transition-all duration-200">
                {linkTitle}
              </span>
              <svg
                className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transform translate-x-0 
                           group-hover/btn:translate-x-1 transition-all duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ) : (
            <button
              className="group/btn inline-flex items-center justify-center w-full py-3 px-6 
                       bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 
                       text-white font-semibold rounded-xl shadow-lg hover:shadow-xl 
                       transform hover:-translate-y-0.5 transition-all duration-200 
                       focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 
                       dark:focus:ring-offset-gray-800 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Enable Feature
              </span>

              {/* Shimmer effect for disabled state */}
              <div
                className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                              transform translate-x-[-100%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"
              ></div>
            </button>
          )}
        </div>

        {/* Feature Status Badge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent 
                        opacity-20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
          style={{ color: enabled ? '#3B82F6' : '#6B7280' }}
        ></div>
      </div>

      {/* Card border glow effect */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
          isHovered && enabled
            ? 'ring-2 ring-blue-200 dark:ring-blue-800 ring-opacity-60'
            : ''
        }`}
      ></div>
    </div>
  );
}
