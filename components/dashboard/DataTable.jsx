// components/dashboard/DataTable.jsx
'use client';

import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import get from 'lodash.get';
import {
  Pencil,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import Link from 'next/link';
import DeleteBtn from './DeleteBtn';

function prepareExcelData(data, columns) {
  return data.map((item) => {
    const row = {};
    columns.forEach((col) => {
      let value = get(item, col);
      // match your table's date formatting
      if (col === 'createdAt' || col === 'updatedAt') {
        value = new Date(value).toLocaleDateString();
      }
      row[col] = value;
    });
    return row;
  });
}

export default function DataTable({ data = [], columns = [], resourceTitle }) {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const lower = searchTerm.toLowerCase();
    return data.filter((item) => {
      return columns.some((col) => {
        let rawValue = get(item, col);

        if (col === 'createdAt' || col === 'updatedAt') {
          rawValue = new Date(rawValue).toLocaleDateString();
        }

        if (rawValue !== null && rawValue !== undefined) {
          return String(rawValue).toLowerCase().includes(lower);
        }
        return false;
      });
    });
  }, [searchTerm, data, columns]);

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Generate page numbers for pagination display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter(
      (item, index, arr) => arr.indexOf(item) === index && item !== currentPage
    );
  };

  const handleDownloadExcel = async () => {
    let allData = data;

    try {
      const res = await fetch(`/api/${resourceTitle}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      allData = await res.json();
    } catch (err) {
      console.warn(
        'Could not fetch full dataset, falling back to current table data:',
        err
      );
    }

    const excelData = prepareExcelData(allData, columns);
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, resourceTitle || 'Sheet1');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(
      new Blob([buf], { type: 'application/octet-stream' }),
      `${resourceTitle || 'data'}.xlsx`
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden w-full max-w-full">
      {/* ================= HEADER SECTION ================= */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-6 py-5 border-b border-gray-200 dark:border-gray-600">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Section */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search across all columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition duration-200 ease-in-out shadow-sm hover:shadow-md"
              />
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Found {filteredData.length} result
                {filteredData.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="itemsPerPage"
              className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap"
            >
              Show:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Export Button */}
          <div className="flex-shrink-0">
            <button
              onClick={handleDownloadExcel}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 
                       hover:from-emerald-700 hover:to-emerald-800 text-white font-medium rounded-lg
                       shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <Download className="w-5 h-5 mr-2" />
              Export to Excel
            </button>
          </div>
        </div>
      </div>

      {/* ================= TABLE SECTION ================= */}
      {currentData.length > 0 ? (
        <div
          className="overflow-x-auto"
          style={{ maxWidth: '100%', width: '100%' }}
        >
          <table
            className="w-full"
            style={{
              minWidth: `${Math.max(columns.length * 180 + 144, 800)}px`,
              width:
                columns.length <= 4
                  ? '100%'
                  : `${columns.length * 180 + 144}px`,
            }}
          >
            <thead>
              <tr className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 
                             uppercase tracking-wider border-b border-gray-200 dark:border-gray-600 whitespace-nowrap"
                    style={{
                      width:
                        columns.length <= 4
                          ? `${100 / (columns.length + 1)}%`
                          : '180px',
                      minWidth: '180px',
                    }}
                  >
                    {col
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())}
                  </th>
                ))}
                <th
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 
                             uppercase tracking-wider border-b border-gray-200 dark:border-gray-600 whitespace-nowrap"
                  style={{
                    width:
                      columns.length <= 4
                        ? `${100 / (columns.length + 1)}%`
                        : '144px',
                    minWidth: '144px',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentData.map((item, i) => (
                <tr
                  key={i}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 
                           transition-colors duration-150 ease-in-out group"
                >
                  {columns.map((col, j) => {
                    const cellValue = get(item, col);
                    if (col === 'createdAt' || col === 'updatedAt') {
                      return (
                        <td
                          key={j}
                          className="px-6 py-4 whitespace-nowrap"
                          style={{
                            width:
                              columns.length <= 4
                                ? `${100 / (columns.length + 1)}%`
                                : '180px',
                            minWidth: '180px',
                          }}
                        >
                          <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                            {new Date(cellValue).toLocaleDateString()}
                          </span>
                        </td>
                      );
                    }
                    return (
                      <td
                        key={j}
                        className="px-6 py-4"
                        style={{
                          width:
                            columns.length <= 4
                              ? `${100 / (columns.length + 1)}%`
                              : '180px',
                          minWidth: '180px',
                        }}
                      >
                        <div className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate">
                          {cellValue}
                        </div>
                      </td>
                    );
                  })}

                  <td
                    className="px-6 py-4 whitespace-nowrap text-right"
                    style={{
                      width:
                        columns.length <= 4
                          ? `${100 / (columns.length + 1)}%`
                          : '144px',
                      minWidth: '144px',
                    }}
                  >
                    <div className="flex items-center justify-end space-x-3">
                      {!resourceTitle.includes('adjustments/') && (
                        <Link
                          href={`/dashboard/inventory/${resourceTitle}/update/${item.id}`}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 
                                   bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40
                                   border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700
                                   transition-all duration-200 ease-in-out transform hover:scale-105 group-hover:shadow-md"
                        >
                          <Pencil className="w-4 h-4 mr-1.5" />
                          Edit
                        </Link>
                      )}
                      <div className="transform transition-all duration-200 ease-in-out hover:scale-105">
                        <DeleteBtn id={item.id} endpoint={resourceTitle} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 px-6">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
            <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {searchTerm ? 'No results found' : 'No data available'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {searchTerm
              ? `No records match your search for "${searchTerm}". Try adjusting your search terms.`
              : 'There are no records to display at this time.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400
                       hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* ================= PAGINATION SECTION ================= */}
      {totalPages > 1 && (
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Results info */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{' '}
              {totalItems} results
              {searchTerm && ` (filtered from ${data.length} total records)`}
            </div>

            {/* Pagination controls */}
            <div className="flex items-center space-x-1">
              {/* First page */}
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 
                         text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                         hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Previous page */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 
                         text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                         hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {/* Current page */}
                <button
                  className="px-3 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm
                           shadow-md hover:bg-blue-700 transition-colors duration-200"
                >
                  {currentPage}
                </button>

                {/* Other page numbers */}
                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className="px-2 py-2 text-gray-500 dark:text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => goToPage(page)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm
                                 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500
                                 transition-colors duration-200"
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Next page */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 
                         text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                         hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last page */}
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 
                         text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                         hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
