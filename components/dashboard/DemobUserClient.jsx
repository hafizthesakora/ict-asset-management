'use client';

import React, { useState } from 'react';
import { Search, UserMinus, Download, Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function DemobUserClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a name or email to search');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/people`
      );
      const people = await response.json();

      // Filter by name or email
      const results = people.filter(
        (person) =>
          person.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          person.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(results);

      if (results.length === 0) {
        toast.error('No employees found matching your search');
      }
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Failed to search for employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPerson = async (personId) => {
    setLoading(true);

    try {
      // Fetch full person details with items and accesses
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/people/${personId}`
      );
      const personData = await response.json();

      // Check if person has contract end date
      if (!personData.contractEndDate) {
        toast.error('Cannot demobilize: Employee has no contract end date set');
        setLoading(false);
        return;
      }

      // Also fetch employee accesses
      const accessResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/employee-accesses?peopleId=${personId}&status=active`
      );
      const accesses = await accessResponse.json();

      setSelectedPerson({ ...personData, employeeAccesses: accesses });
      setShowChecklist(true);
      setSearchResults([]);
      setSearchQuery('');
    } catch (error) {
      console.error('Error fetching person details:', error);
      toast.error('Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <UserMinus className="text-red-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Demob User</h1>
            <p className="text-gray-600 mt-1">
              Demobilize an employee and create official handover document
            </p>
          </div>
        </div>

        {/* Search Bar */}
        {!showChecklist && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Employee by Name or Email
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter employee name or email..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Search size={20} />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && !showChecklist && (
          <div className="mt-4 border border-gray-200 rounded-lg divide-y">
            {searchResults.map((person) => (
              <button
                key={person.id}
                onClick={() => handleSelectPerson(person.id)}
                className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <h3 className="font-semibold text-gray-900">{person.title}</h3>
                <div className="flex gap-4 text-sm text-gray-600 mt-1">
                  {person.email && <span>{person.email}</span>}
                  {person.department && <span>• {person.department}</span>}
                  {person.aow && <span>• {person.aow}</span>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Demob Checklist */}
      {showChecklist && selectedPerson && (
        <DemobChecklist
          person={selectedPerson}
          onCancel={() => {
            setShowChecklist(false);
            setSelectedPerson(null);
          }}
        />
      )}
    </div>
  );
}

function DemobChecklist({ person, onCancel }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [checkedAccesses, setCheckedAccesses] = useState({});
  const [demobPerformedBy, setDemobPerformedBy] = useState('');
  const [demobPerformedByEmail, setDemobPerformedByEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const assignedItems = person.assignedItems || [];
  const employeeAccesses = person.employeeAccesses || [];

  const toggleItem = (itemId) => {
    setCheckedItems({
      ...checkedItems,
      [itemId]: !checkedItems[itemId],
    });
  };

  const toggleAccess = (accessId) => {
    setCheckedAccesses({
      ...checkedAccesses,
      [accessId]: !checkedAccesses[accessId],
    });
  };

  const allChecked =
    Object.keys(checkedItems).length === assignedItems.length &&
    Object.values(checkedItems).every((v) => v) &&
    Object.keys(checkedAccesses).length === employeeAccesses.length &&
    Object.values(checkedAccesses).every((v) => v);

  const handleGeneratePDF = async () => {
    if (!allChecked) {
      toast.error('Please check all items and accesses before generating PDF');
      return;
    }

    if (!demobPerformedBy || !demobPerformedByEmail) {
      toast.error('Please enter your name and email');
      return;
    }

    setLoading(true);

    try {
      // Create demob document
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/demob-documents`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            peopleId: person.id,
            demobPerformedBy,
            demobPerformedByEmail,
            itemsReturned: assignedItems.map((item) => ({
              id: item.id,
              title: item.title,
              serialNumber: item.serialNumber,
              checked: checkedItems[item.id] || false,
            })),
            accessesRevoked: employeeAccesses.map((access) => ({
              id: access.id,
              name: access.accessItem?.name || 'Unknown',
              category: access.accessItem?.category?.title || 'N/A',
              checked: checkedAccesses[access.id] || false,
            })),
          }),
        }
      );

      if (response.ok) {
        const demobDoc = await response.json();
        toast.success('Demob document created! Generating PDF...');

        // Generate PDF
        window.open(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/demob-documents/pdf?id=${demobDoc.id}`,
          '_blank'
        );

        router.push('/dashboard/inventory/people');
        router.refresh();
      } else {
        toast.error('Failed to create demob document');
      }
    } catch (error) {
      console.error('Error creating demob document:', error);
      toast.error('Failed to create demob document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Person Info */}
      <div className="mb-6 pb-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{person.title}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          {person.email && <div>Email: {person.email}</div>}
          {person.department && <div>Department: {person.department}</div>}
          {person.aow && <div>Area of Work: {person.aow}</div>}
          {person.topology && <div>Topology: {person.topology}</div>}
        </div>
      </div>

      {/* Assigned Items Checklist */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Assigned Items to Collect ({assignedItems.length})
        </h3>
        {assignedItems.length === 0 ? (
          <p className="text-gray-600 italic">No items assigned</p>
        ) : (
          <div className="space-y-2">
            {assignedItems.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checkedItems[item.id] || false}
                  onChange={() => toggleItem(item.id)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">
                    S/N: {item.serialNumber} | Category: {item.category?.title || 'N/A'}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Employee Accesses Checklist */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          System Accesses to Revoke ({employeeAccesses.length})
        </h3>
        {employeeAccesses.length === 0 ? (
          <p className="text-gray-600 italic">No active accesses</p>
        ) : (
          <div className="space-y-2">
            {employeeAccesses.map((access) => (
              <label
                key={access.id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checkedAccesses[access.id] || false}
                  onChange={() => toggleAccess(access.id)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {access.accessItem?.name || 'Unknown Access'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Category: {access.accessItem?.category?.title || 'N/A'}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Demob Performed By */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Demob Performed By</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={demobPerformedBy}
              onChange={(e) => setDemobPerformedBy(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Email *
            </label>
            <input
              type="email"
              value={demobPerformedByEmail}
              onChange={(e) => setDemobPerformedByEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleGeneratePDF}
          disabled={!allChecked || loading || !demobPerformedBy || !demobPerformedByEmail}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileText size={20} />
          {loading ? 'Generating...' : 'Generate Demob PDF'}
        </button>
      </div>
    </div>
  );
}
