'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function FixDataPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [unassignLoading, setUnassignLoading] = useState(false);
  const [unassignResult, setUnassignResult] = useState(null);

  const fixItemLocations = async () => {
    if (!confirm('This will update all items to have the correct location status. Continue?')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items/fix-locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        toast.success('Data fixed successfully!');
      } else {
        toast.error('Failed to fix data: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while fixing data');
    } finally {
      setLoading(false);
    }
  };

  const unassignItemsWithoutRecords = async () => {
    if (!confirm('This will unassign all items that don\'t have proper assignment records in the TransferStockAdjustment table. This is useful if items were bulk imported as "assigned" but without proper tracking records. Continue?')) {
      return;
    }

    setUnassignLoading(true);
    setUnassignResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items/unassign-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setUnassignResult(data);
        toast.success('Items unassigned successfully!');
        // Reload the page after a short delay to refresh all data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error('Failed to unassign items: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while unassigning items');
    } finally {
      setUnassignLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Data Fix Utilities</h1>

      {/* Fix Item Locations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Fix Item Locations</h2>

        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold text-yellow-800 mb-2">What does this do?</h3>
          <p className="text-yellow-700 text-sm">
            This will fix all items in your database to have the correct location status:
          </p>
          <ul className="list-disc list-inside text-yellow-700 text-sm mt-2 ml-2">
            <li>Items with an assigned person → marked as <code>person</code></li>
            <li>Items without an assigned person → marked as <code>warehouse</code></li>
          </ul>
        </div>

        <button
          onClick={fixItemLocations}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Fixing...' : 'Fix Item Locations'}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="font-semibold text-green-800 mb-2">✅ Fix Completed!</h3>
            <div className="text-green-700 text-sm space-y-1">
              <p><strong>Total Items:</strong> {result.stats.totalItems}</p>
              <p><strong>Items Fixed:</strong> {result.stats.itemsFixed}</p>
              <p><strong>Already Correct:</strong> {result.stats.alreadyCorrect}</p>
            </div>
            <p className="mt-3 text-green-600 text-sm">
              You can now go back to the assignment form and you should see all available items!
            </p>
          </div>
        )}
      </div>

      {/* Unassign Items Without Records */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Unassign Items Without Assignment Records</h2>

        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="font-semibold text-red-800 mb-2">⚠️ What does this do?</h3>
          <p className="text-red-700 text-sm mb-3">
            This will find all items that are marked as "assigned" but don't have proper assignment records in the TransferStockAdjustment table, and unassign them.
          </p>
          <p className="text-red-700 text-sm font-semibold mb-2">Use this when:</p>
          <ul className="list-disc list-inside text-red-700 text-sm ml-2 space-y-1">
            <li>Items were bulk imported with assignment data</li>
            <li>Items show as "Assigned" but no assignment records exist</li>
            <li>You want to reset all improperly assigned items to "In Store"</li>
          </ul>
          <p className="text-red-700 text-sm font-semibold mt-3">This will:</p>
          <ul className="list-disc list-inside text-red-700 text-sm ml-2 space-y-1">
            <li>Set currentLocationType to "warehouse" for affected items</li>
            <li>Clear assignedToPersonId for affected items</li>
            <li>Update warehouse and person stock counts</li>
          </ul>
        </div>

        <button
          onClick={unassignItemsWithoutRecords}
          disabled={unassignLoading}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {unassignLoading ? 'Unassigning...' : 'Unassign Items Without Records'}
        </button>

        {unassignResult && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="font-semibold text-green-800 mb-2">✅ Unassignment Completed!</h3>
            <div className="text-green-700 text-sm space-y-1">
              <p><strong>Total Assigned Items:</strong> {unassignResult.stats.totalAssignedItems}</p>
              <p><strong>Items With Transfer Records:</strong> {unassignResult.stats.itemsWithTransferRecords}</p>
              <p><strong>Items Unassigned:</strong> {unassignResult.stats.itemsUnassigned}</p>
              <p><strong>People Updated:</strong> {unassignResult.stats.peopleUpdated}</p>
              <p><strong>Warehouses Updated:</strong> {unassignResult.stats.warehousesUpdated}</p>
            </div>
            <p className="mt-3 text-green-600 text-sm font-semibold">
              Page will reload automatically to show updated data...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
