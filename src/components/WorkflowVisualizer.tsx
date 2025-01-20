import React, { useState, useRef, useEffect } from 'react';
import { Circle, ArrowRight, Box, GitBranch, Clock } from 'lucide-react';

interface Node {
  id: string;
  type: 'llm' | 'flow' | 'batch' | 'async';
  label: string;
  position: { x: number; y: number };
}

interface Action {
  from: string;
  to: string;
  label: string;
}

interface WorkflowVisualizerProps {
  nodes: Node[];
  actions: Action[];
  description: string;
}

export function WorkflowVisualizer({ nodes: initialNodes, actions, description }: WorkflowVisualizerProps) {
  const [nodes, setNodes] = useState(initialNodes);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    setDraggingNode(nodeId);
    setOffset({
      x: e.clientX - (rect.left + node.position.x),
      y: e.clientY - (rect.top + node.position.y)
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingNode || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - offset.x;
    const y = e.clientY - rect.top - offset.y;

    setNodes(nodes.map(node =>
      node.id === draggingNode
        ? { ...node, position: { x, y } }
        : node
    ));
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  useEffect(() => {
    if (draggingNode) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingNode]);

  const icons = {
    llm: Circle,
    flow: GitBranch,
    batch: Box,
    async: Clock,
  };

  const colors = {
    llm: 'bg-blue-50 text-blue-900 border-blue-200',
    flow: 'bg-purple-50 text-purple-900 border-purple-200',
    batch: 'bg-orange-50 text-orange-900 border-orange-200',
    async: 'bg-green-50 text-green-900 border-green-200',
  };

  return 
  (
    <div>
      {/* Main Container */}
      <div 
        ref={containerRef}
        className="relative h-[300px] rounded-2xl bg-white border border-gray-100 overflow-hidden"
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(243 244 246) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Arrows */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="rgb(156 163 175)"
              />
            </marker>
          </defs>
          {actions.map((action, index) => {
            const fromNode = nodes.find(n => n.id === action.from);
            const toNode = nodes.find(n => n.id === action.to);
            
            if (!fromNode || !toNode) return null;
            
            return (
              <line
                key={index}
                x1={fromNode.position.x}
                y1={fromNode.position.y}
                x2={toNode.position.x}
                y2={toNode.position.y}
                stroke="rgb(156 163 175)"
                strokeWidth="1.5"
                markerEnd="url(#arrowhead)"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const Icon = icons[node.type];
          return (
            <div 
              key={node.id}
              className={`absolute px-4 py-2 rounded-xl ${colors[node.type]} border cursor-move transition-transform duration-200 hover:scale-105`}
              style={{ 
                left: node.position.x, 
                top: node.position.y,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseDown={(e) => handleMouseDown(node.id, e)}
            >
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{node.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
