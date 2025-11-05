'use client';

import React, { useState } from 'react';
import {
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  PlayCircle,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function OffboardingTaskManagement({
  personId,
  person,
  tasks: initialTasks,
}) {
  const [tasks, setTasks] = useState(initialTasks || []);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const generateTasks = async () => {
    setLoading(true);
    const tasksToCreate = [];

    // Generate tasks for accesses
    const activeAccesses = person.accesses?.filter((a) => a.status === 'active') || [];
    for (const access of activeAccesses) {
      tasksToCreate.push({
        taskType: 'access_revocation',
        title: `Revoke ${access.systemName} Access`,
        description: `Revoke ${access.accessType} access for ${access.systemName}`,
        priority: 'high',
        peopleId: personId,
        accessId: access.id,
      });
    }

    // Generate tasks for assigned items
    const assignedItems = person.assignedItems || [];
    for (const item of assignedItems) {
      tasksToCreate.push({
        taskType: 'item_collection',
        title: `Collect ${item.title}`,
        description: `Collect item: ${item.serialNumber}`,
        priority: 'high',
        peopleId: personId,
        itemId: item.id,
      });
    }

    // Create all tasks
    try {
      const newTasks = [];
      for (const taskData of tasksToCreate) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/offboarding-tasks`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
          }
        );

        if (response.ok) {
          const task = await response.json();
          newTasks.push(task);
        }
      }

      setTasks([...newTasks, ...tasks]);
      toast.success(`Generated ${newTasks.length} offboarding tasks`);
      router.refresh();
    } catch (error) {
      console.error('Error generating tasks:', error);
      toast.error('Failed to generate tasks');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus, notes = '') => {
    setLoading(true);
    try {
      // Find the task to check if it's an item collection
      const task = tasks.find((t) => t.id === taskId);
      const isItemCollection = task?.taskType === 'item_collection';
      const isAssetCollected = newStatus === 'asset_collected';

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/offboarding-tasks`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: taskId,
            status: newStatus,
            notes,
            completedDate: newStatus === 'completed' ? new Date() : null,
          }),
        }
      );

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));

        // Show special message for auto-returned items
        if (isItemCollection && isAssetCollected) {
          toast.success('Asset collected! Item automatically returned to warehouse.');
        } else {
          toast.success('Task updated successfully');
        }

        router.refresh();
      } else {
        toast.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          icon: Clock,
          color: 'gray',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
        };
      case 'ticket_raised':
        return {
          label: 'Ticket Raised',
          icon: AlertCircle,
          color: 'yellow',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          icon: PlayCircle,
          color: 'blue',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
        };
      case 'revoke_granted':
        return {
          label: 'Revoke Granted',
          icon: CheckCircle,
          color: 'green',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
        };
      case 'asset_collected':
        return {
          label: 'Asset Collected',
          icon: CheckCircle,
          color: 'blue',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
        };
      case 'return_form_filled':
        return {
          label: 'Return Form Filled',
          icon: CheckCircle,
          color: 'green',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
        };
      case 'completed':
        return {
          label: 'Completed',
          icon: CheckCircle,
          color: 'green',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
        };
      default:
        return {
          label: status,
          icon: Clock,
          color: 'gray',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
        };
    }
  };

  const getNextAction = (currentStatus, taskType) => {
    // Different workflows for different task types
    if (taskType === 'access_revocation') {
      switch (currentStatus) {
        case 'pending':
          return { label: 'Raise Ticket', nextStatus: 'ticket_raised' };
        case 'ticket_raised':
          return { label: 'Mark In Progress', nextStatus: 'in_progress' };
        case 'in_progress':
          return { label: 'Revoke Granted', nextStatus: 'revoke_granted' };
        case 'revoke_granted':
          return { label: 'Complete', nextStatus: 'completed' };
        default:
          return null;
      }
    } else if (taskType === 'item_collection') {
      switch (currentStatus) {
        case 'pending':
          return { label: 'Asset Collected', nextStatus: 'asset_collected' };
        case 'asset_collected':
          return { label: 'Return Form Filled', nextStatus: 'return_form_filled' };
        case 'return_form_filled':
          return { label: 'Complete', nextStatus: 'completed' };
        default:
          return null;
      }
    }
    return null;
  };

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const hasTasksToGenerate =
    (person.accesses?.filter((a) => a.status === 'active').length > 0 ||
      person.assignedItems?.length > 0) &&
    tasks.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Offboarding Tasks
        </h3>
        {hasTasksToGenerate && (
          <button
            onClick={generateTasks}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Plus size={18} />
            {loading ? 'Generating...' : 'Generate Tasks'}
          </button>
        )}
      </div>

      {/* Pending Tasks */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock size={20} className="text-yellow-600" />
          Pending Tasks ({pendingTasks.length})
        </h4>

        {pendingTasks.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <CheckCircle size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">
              {tasks.length === 0
                ? 'No offboarding tasks yet'
                : 'All tasks completed!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingTasks.map((task) => {
              const statusInfo = getStatusInfo(task.status);
              const Icon = statusInfo.icon;
              const nextAction = getNextAction(task.status, task.taskType);

              return (
                <div
                  key={task.id}
                  className={`border ${statusInfo.borderColor} rounded-lg p-4`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 ${statusInfo.bgColor} ${statusInfo.textColor} text-xs font-medium rounded-full flex items-center gap-1`}
                        >
                          <Icon size={14} />
                          {statusInfo.label}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {task.priority?.toUpperCase()}
                        </span>
                      </div>

                      <h5 className="font-semibold text-gray-900 mb-1">
                        {task.title}
                      </h5>
                      <p className="text-sm text-gray-600 mb-2">
                        {task.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          task.taskType === 'access_revocation'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {task.taskType === 'access_revocation' ? 'Access Revocation' : 'Item Collection'}
                        </span>
                        <span>
                          Created: {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {task.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Notes:</span> {task.notes}
                          </p>
                        </div>
                      )}

                      {task.taskType === 'item_collection' && task.status === 'pending' && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-800">
                            <span className="font-semibold">Note:</span> Marking this as "Asset Collected" will automatically return the item to the warehouse and update all stock counts.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {nextAction && (
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() =>
                          updateTaskStatus(task.id, nextAction.nextStatus)
                        }
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {nextAction.label}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-green-600" />
            Completed Tasks ({completedTasks.length})
          </h4>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="border border-green-200 rounded-lg p-4 bg-green-50"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-600" />
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">{task.title}</h5>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Completed: {new Date(task.completedDate || task.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
