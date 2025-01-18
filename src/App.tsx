import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, Folders, Settings, User, Github, X } from 'lucide-react';
import { Home as HomePage } from './pages/Home';
import { WorkflowPage } from './pages/WorkflowPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SettingsPage } from './pages/SettingsPage';

function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Workflows</h2>
          <p className="text-gray-500">Sign in to create and manage your workflows</p>
        </div>

        <button 
          className="w-full flex items-center justify-center gap-3 bg-black text-white rounded-lg px-4 py-3 font-medium hover:bg-gray-900 transition-colors"
          onClick={() => {
            // In a real app, this would trigger GitHub OAuth
            console.log('Connecting to GitHub...');
          }}
        >
          <Github className="w-5 h-5" />
          Continue with GitHub
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

function SidebarIcon({ icon: Icon, label, to, onClick }: { 
  icon: React.ElementType; 
  label: string; 
  to?: string; 
  onClick?: () => void;
}) {
  const content = (
    <div className="relative group">
      <div 
        className="block p-3 hover:bg-white/30 rounded-xl transition-all duration-300 cursor-pointer"
        onClick={onClick}
      >
        <Icon className="w-6 h-6 text-gray-600" />
      </div>
      <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300">
        {label}
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
}

function Sidebar() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <div className="fixed left-0 top-0 h-screen w-16 bg-[#C0FFC1] flex flex-col items-center py-8 shadow-sm">
        <nav className="flex flex-col items-center gap-8">
          <SidebarIcon icon={Home} label="Home" to="/" />
          <SidebarIcon icon={Folders} label="Projects" to="/projects" />
          <SidebarIcon icon={Settings} label="Settings" to="/settings" />
        </nav>
        <div className="mt-auto">
          <SidebarIcon 
            icon={User} 
            label="Sign In" 
            onClick={() => setShowAuthModal(true)}
          />
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex bg-white">
        <Sidebar />
        <main className="flex-1 ml-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/workflow/:id" element={<WorkflowPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;