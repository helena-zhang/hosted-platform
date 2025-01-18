import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  onUpdateCode: (newCode: string) => void;
}

export function ChatInterface({ onUpdateCode }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: 'user', content: input },
      // In a real app, this would be an API call to get the assistant's response
      { role: 'assistant', content: 'I\'ve updated the code based on your request.' }
    ];
    setMessages(newMessages);
    setInput('');
    
    // Simulate code update - in a real app, this would come from the API
    onUpdateCode('// Updated code based on chat\n' + input);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-900">Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                message.role === 'user'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Edit the code or ask questions..."
            className="flex-1 bg-gray-50 text-gray-900 rounded-xl px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all duration-200"
          />
          <button
            onClick={handleSend}
            className="p-2.5 rounded-xl bg-black text-white hover:bg-gray-900 transition-colors duration-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}