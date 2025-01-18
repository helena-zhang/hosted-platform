import React from 'react';
import { 
  Settings2, Globe, Key, Bell, Shield, Database, Workflow, Zap,
  Cloud, GitBranch, Package, Terminal, Cpu, Keyboard
} from 'lucide-react';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

export function SettingsPage() {
  const sections: SettingSection[] = [
    {
      id: 'general',
      title: 'General',
      icon: Settings2,
      description: 'Manage your workspace preferences and account settings'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: Zap,
      description: 'Connect with external services and APIs'
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      description: 'Configure security settings and access controls'
    },
    {
      id: 'environment',
      title: 'Environment',
      icon: Cloud,
      description: 'Manage runtime environment and configurations'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your workflow environment and preferences
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Settings Panel */}
          <div className="col-span-2 space-y-6">
            {/* General Settings */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-gray-500" />
                  <h2 className="font-medium text-gray-900">General Settings</h2>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Workspace Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      defaultValue="My Workflow Space"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Default Language</label>
                    <select className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black">
                      <option>Python</option>
                      <option>TypeScript</option>
                      <option>JavaScript</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Environment Settings */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-gray-500" />
                  <h2 className="font-medium text-gray-900">Runtime Environment</h2>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Node.js Version</label>
                    <select className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black">
                      <option>20.x (Latest)</option>
                      <option>18.x (LTS)</option>
                      <option>16.x</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Python Version</label>
                    <select className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black">
                      <option>3.11</option>
                      <option>3.10</option>
                      <option>3.9</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* API Keys */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-gray-500" />
                  <h2 className="font-medium text-gray-900">API Keys</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">OpenAI API Key</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="password"
                      className="flex-1 rounded-l-md border border-r-0 border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      defaultValue="sk-..."
                    />
                    <button className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Settings Navigation */}
          <div className="space-y-4">
            {sections.map((section) => (
              <button
                key={section.id}
                className="w-full bg-white p-4 rounded-lg border border-gray-200 text-left hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <section.icon className="w-5 h-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{section.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}