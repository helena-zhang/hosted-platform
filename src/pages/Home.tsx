import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Example icons from react-icons/fa
import {
  FaMailBulk,
  FaDatabase,
  FaCalendarAlt,
  FaHeadset,
  FaFileAlt,
  FaFunnelDollar,
} from 'react-icons/fa';

export function Home() {
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isDesigning, setIsDesigning] = useState(false);
  const navigate = useNavigate();

  const handleCreateWorkflow = () => {
    if (workflowDescription.trim()) {
      // Show the "Designing your workflow..." overlay
      setIsDesigning(true);

      // Simulate a delay of 3 seconds before navigating
      setTimeout(() => {
        const workflowId = Math.random().toString(36).substr(2, 9);
        navigate(`/workflow/${workflowId}`, { 
          state: { description: workflowDescription } 
        });
      }, 3000);
    }
  };

  // Here we store both icon and label in the same object,
  // so we can easily render them together.
  const actionOptions = [
    { icon: <FaMailBulk />, label: "Email automation" },
    { icon: <FaDatabase />, label: "Data processing" },
    { icon: <FaCalendarAlt />, label: "Social media scheduler" },
    { icon: <FaHeadset />, label: "Customer support" },
    { icon: <FaFileAlt />, label: "Document summarization" },
    { icon: <FaFunnelDollar />, label: "Sales funnel automation" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative">
      {/* Full-screen overlay if isDesigning is true */}
      {isDesigning && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          {/* Spinner (You can make your own or use any library spinner) */}
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
          <p className="text-white text-xl sm:text-2xl font-semibold">
            Designing your workflow...
          </p>
        </div>
      )}

      <div className="max-w-3xl w-full mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-gray-800 whitespace-nowrap">
            What do you want to automate?
          </h1>
          <p className="text-lg sm:text-xl font-light text-gray-500">
            Create, test, and deploy AI workflows with AI assistance.
          </p>
        </div>

        {/* Workflow Description Card */}
        <div className="class-card question-border p-3 rounded-2xl mb-6 sm:mb-12 mx-auto max-w-2xl">
          <div className="relative">
          <textarea
              className="
                w-full 
                bg-transparent 
                text-sm sm:text-base 
                placeholder-gray-400 
                outline-none 
                resize-none 
                py-4 px-5
              "
              placeholder="Tell me about the AI workflow you want to create"
              rows={5}
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
            />
            <div className="absolute bottom-3 right-3">
              {/* Subtle Dark Green Gradient Button */}
              <button 
                className="
                  flex items-center gap-2
                  px-3 py-1
                  bg-gradient-to-r from-green-800 to-green-700
                  text-white text-xs sm:text-sm
                  font-semibold rounded-lg shadow-md
                  hover:opacity-90 hover:shadow-lg
                  active:scale-95
                  transition-all duration-300
                "
                onClick={handleCreateWorkflow}
              >
                Create Workflow
              </button>
            </div>
          </div>
        </div>

        {/* Action Cards: up to 3 columns & icons on the left */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 px-6 sm:px-8">
          {actionOptions.map(({ icon, label }) => (
            <button
              key={label}
              className="
                class-card
                border border-gray-300 
                p-1
                rounded-sm
                text-center
                text-gray-700 
                text-xs sm:text-sm font-normal 
                hover:bg-black/5 
                transition-all duration-300
                flex items-center justify-center gap-2
              "
            >
              <span className="text-base sm:text-lg">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
