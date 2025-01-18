import React, { useState } from 'react';
import { Link2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const [workflowDescription, setWorkflowDescription] = useState('');
  const navigate = useNavigate();

  const handleCreateWorkflow = () => {
    if (workflowDescription.trim()) {
      // In a real app, we'd create the workflow in the backend and get an ID
      const workflowId = Math.random().toString(36).substr(2, 9);
      navigate(`/workflow/${workflowId}`, { 
        state: { description: workflowDescription } 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">
            What do you want to automate?
          </h1>
          
          <p className="text-gray-500 text-xl font-light">
            Create, test, and deploy custom workflows with AI assistance.
          </p>
        </div>

        <div className="class-card p-3 rounded-2xl mb-12">
          <div className="relative">
            <textarea 
              className="w-full bg-transparent text-lg placeholder-gray-400 outline-none resize-none py-3 px-4"
              placeholder="Tell me about the workflow you want to create"
              rows={3}
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-[#C0FFC1] text-gray-700 rounded-lg hover:bg-[#A8E5A9] transition-colors duration-300"
                onClick={handleCreateWorkflow}
              >
                Create Workflow
              </button>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {[
            "Email automation",
            "Data processing",
            "Social media scheduler",
            "Customer support"
          ].map((action) => (
            <button
              key={action}
              className="class-card p-4 rounded-xl text-left text-gray-600 hover:bg-black/5 transition-all duration-300"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}