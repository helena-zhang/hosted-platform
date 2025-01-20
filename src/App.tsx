import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, Folders, User, Github, X, Menu } from 'lucide-react';
import { Home as HomePage } from './pages/Home';
import { WorkflowPage } from './pages/WorkflowPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { WorkspacePage } from './pages/WorkspacePage';

function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
        className="block p-3 hover:bg-white/10 rounded-xl transition-all duration-300 cursor-pointer"
        onClick={onClick}
      >
        <Icon className="w-6 h-6 text-white/80" />
      </div>
      <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 z-50">
        {label}
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
}

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden">
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-4">
          <Link to="/" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg" onClick={onClose}>
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link to="/projects" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg" onClick={onClose}>
            <Folders className="w-5 h-5" />
            <span>Projects</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

function Sidebar() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-16 sidebar-gradient lg:flex lg:flex-col lg:items-center lg:py-8">
        <nav className="flex flex-col items-center gap-8">
          <SidebarIcon icon={Home} label="Home" to="/" />
          <SidebarIcon icon={Folders} label="Projects" to="/projects" />
          <SidebarIcon icon={Menu} label="Workspace" to="/workspace" />
        </nav>
        <div className="mt-auto">
          <SidebarIcon 
            icon={User} 
            label="Sign In" 
            onClick={() => setShowAuthModal(true)}
          />
        </div>
      </div>

      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex bg-white">
        <Sidebar />
        <main className="flex-1 lg:ml-16 pt-16 lg:pt-0 main-gradient">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/workflow/:id" element={<WorkflowPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;