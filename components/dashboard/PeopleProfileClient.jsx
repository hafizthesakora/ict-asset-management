'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Building,
  Briefcase,
  MapPin,
  Calendar,
  Package,
  Shield,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  FileText,
  Download,
} from 'lucide-react';
export default function PeopleProfileClient({ person }) {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  // Calculate days until contract end
  const getDaysUntilEnd = () => {
    if (!person.contractEndDate) return null;
    const endDate = new Date(person.contractEndDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilEnd = getDaysUntilEnd();
  const isApproachingEnd = daysUntilEnd !== null && daysUntilEnd <= 30 && daysUntilEnd > 0;
  const isExpired = daysUntilEnd !== null && daysUntilEnd <= 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'items', label: 'Assigned Items', icon: Package, count: person.assignedItems?.length || 0 },
    { id: 'accesses', label: 'ICT Services Access', icon: Shield, count: person.employeeAccesses?.filter(a => a.status === 'active').length || 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back Button */}
      <button
        onClick={() => router.push('/dashboard/inventory/people')}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to People
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{person.title}</h1>
            <p className="text-gray-600 mt-1">
              {person.department || 'No department'} • {person.topology || 'No topology'}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                person.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : person.status === 'offboarding'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {person.status?.toUpperCase() || 'ACTIVE'}
            </span>
          </div>
        </div>

        {/* Demob Document Alert */}
        {person.status === 'inactive' && person.demobDocuments?.length > 0 && (
          <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
            <div className="flex items-start gap-3">
              <FileText className="text-gray-700" size={24} />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Employee Demobilized</p>
                <p className="text-sm text-gray-700 mb-3">
                  This employee has been demobilized on {new Date(person.demobDocuments[0].demobDate).toLocaleDateString()}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/api/demob-documents/pdf?id=${person.demobDocuments[0].id}`, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <Download size={16} />
                    View Demob Document
                  </button>
                </div>
                <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Demobilized by:</span> {person.demobDocuments[0].demobPerformedBy} ({person.demobDocuments[0].demobPerformedByEmail})
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-semibold">Items Returned:</span> {person.demobDocuments[0].itemsReturned?.length || 0}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Accesses Revoked:</span> {person.demobDocuments[0].accessesRevoked?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alert Banner */}
        {person.status !== 'inactive' && isExpired && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertTriangle className="text-red-600" size={24} />
            <div>
              <p className="font-semibold text-red-900">Contract Expired</p>
              <p className="text-sm text-red-700">
                This employee's contract ended {Math.abs(daysUntilEnd)} days ago.
                {person.assignedItems?.length > 0 && ` ${person.assignedItems.length} item(s) need to be collected.`}
                {person.employeeAccesses?.filter(a => a.status === 'active').length > 0 && ` ${person.employeeAccesses.filter(a => a.status === 'active').length} access(es) need to be revoked.`}
              </p>
            </div>
          </div>
        )}

        {person.status !== 'inactive' && isApproachingEnd && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
            <AlertTriangle className="text-yellow-600" size={24} />
            <div>
              <p className="font-semibold text-yellow-900">Contract Ending Soon</p>
              <p className="text-sm text-yellow-700">
                This employee's contract ends in {daysUntilEnd} days. Start offboarding process.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab person={person} />}
          {activeTab === 'items' && <AssignedItemsTab person={person} />}
          {activeTab === 'accesses' && <EmployeeAccessesTab personId={person.id} employeeAccesses={person.employeeAccesses || []} />}
        </div>
      </div>
    </div>
  );
}

function EmployeeAccessesTab({ personId, employeeAccesses }) {
  const router = useRouter();
  const activeAccesses = employeeAccesses.filter((a) => a.status === 'active');
  const revokedAccesses = employeeAccesses.filter((a) => a.status === 'revoked');

  if (activeAccesses.length === 0 && revokedAccesses.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No ICT Services Access</h3>
        <p className="text-gray-600 mt-2 mb-4">This employee doesn't have any ICT services access assigned.</p>
        <button
          onClick={() => router.push(`/dashboard/ict-services/assign/${personId}`)}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          Assign Access
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Accesses */}
      {activeAccesses.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Accesses ({activeAccesses.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeAccesses.map((access) => (
              <div
                key={access.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="px-3 py-1 bg-cyan-100 text-cyan-800 text-xs font-medium rounded-full">
                    {access.accessItem?.category?.title || 'N/A'}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    Active
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {access.accessItem?.name || 'Unknown Access'}
                </h4>
                {access.accessItem?.description && (
                  <p className="text-sm text-gray-600 mb-2">{access.accessItem.description}</p>
                )}
                <p className="text-xs text-gray-500">
                  Granted: {new Date(access.grantedDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revoked Accesses */}
      {revokedAccesses.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revoked Accesses ({revokedAccesses.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {revokedAccesses.map((access) => (
              <div
                key={access.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 opacity-75"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
                    {access.accessItem?.category?.title || 'N/A'}
                  </span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                    Revoked
                  </span>
                </div>
                <h4 className="font-semibold text-gray-700 mb-1">
                  {access.accessItem?.name || 'Unknown Access'}
                </h4>
                <p className="text-xs text-gray-500">
                  Revoked: {access.revokedDate ? new Date(access.revokedDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewTab({ person }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User size={20} />
            Personal Information
          </h3>
          <div className="space-y-3">
            <InfoRow icon={User} label="Full Name" value={person.title} />
            <InfoRow icon={MapPin} label="Topology" value={person.topology || 'Not specified'} />
            <InfoRow icon={Building} label="Department" value={person.department || 'Not specified'} />
            <InfoRow icon={Briefcase} label="Area of Work" value={person.aow || 'Not specified'} />
          </div>
        </div>

        {/* Contract Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar size={20} />
            Contract Information
          </h3>
          <div className="space-y-3">
            <InfoRow
              icon={Calendar}
              label="Contract End Date"
              value={person.contractEndDate ? new Date(person.contractEndDate).toLocaleDateString() : 'Not set'}
            />
            <InfoRow
              icon={Calendar}
              label="Created At"
              value={new Date(person.createdAt).toLocaleDateString()}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <StatCard
          label="Assigned Items"
          value={person.assignedItems?.length || 0}
          icon={Package}
          color="blue"
        />
        <StatCard
          label="Active Accesses"
          value={person.accesses?.filter(a => a.status === 'active').length || 0}
          icon={Shield}
          color="green"
        />
        <StatCard
          label="Pending Tasks"
          value={person.offboardingTasks?.filter(t => t.status !== 'completed').length || 0}
          icon={CheckCircle}
          color="yellow"
        />
      </div>
    </div>
  );
}

function AssignedItemsTab({ person }) {
  const items = person.assignedItems || [];

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No Items Assigned</h3>
        <p className="text-gray-600 mt-2">This employee doesn't have any items assigned.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Currently Assigned Items</h3>
      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Serial Number: {item.serialNumber}
                </p>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>Category: {item.category?.title || 'N/A'}</span>
                  <span>Brand: {item.brand?.title || 'N/A'}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">
                  ${(item.buyingPrice || 0).toFixed(2)}
                </p>
                {item.assetTag && (
                  <p className="text-xs text-gray-500 mt-1">{item.assetTag}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gray-100 rounded-lg">
        <Icon size={16} className="text-gray-600" />
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm font-medium mt-1">{label}</p>
        </div>
        <Icon size={32} />
      </div>
    </div>
  );
}
