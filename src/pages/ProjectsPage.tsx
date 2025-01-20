import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Plus } from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  lastRun: string;
  status: 'success' | 'failed' | 'running' | 'idle';
}

export function ProjectsPage() {
  const navigate = useNavigate();

  const workflows: Workflow[] = [
    {
      id: '1',
      name: 'Customer Data Processing',
      description: 'Process and analyze customer data from multiple sources',
      lastRun: '2 hours ago',
      status: 'success'
    },
    {
      id: '2',
      name: 'Email Automation',
      description: 'Automated email responses based on customer inquiries',
      lastRun: '30 minutes ago',
      status: 'running'
    }
  ];

  const getStatusColor = (status: Workflow['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 text-green-700 ring-green-600/20';
      case 'failed':
        return 'bg-red-50 text-red-700 ring-red-600/20';
      case 'running':
        return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'idle':
        return 'bg-gray-50 text-gray-600 ring-gray-500/20';
    }
  };

  const getStatusIcon = (status: Workflow['status']) => {
    switch (status) {
      case 'success':
      case 'failed':
      case 'idle':
        return <Clock className="w-4 h-4" />;
      case 'running':
        return <Play className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Workflows</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and monitor your automated workflows
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New Workflow</span>
          </button>
        </div>

        <div className="space-y-4">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              onClick={() => navigate(`/workflow/${workflow.id}`)}
              className="group relative bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1">
                    <h2 className="text-base font-semibold text-gray-900 group-hover:text-gray-700">
                      {workflow.name}
                    </h2>
                    <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(workflow.status)} w-fit`}>
                      {getStatusIcon(workflow.status)}
                      <span className="capitalize">{workflow.status}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {workflow.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Last run {workflow.lastRun}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle run workflow
                  }}
                  className="sm:ml-4 p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Play className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}