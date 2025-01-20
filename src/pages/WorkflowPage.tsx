import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
  ArrowLeft,
  Files,
  FolderTree,
  ChevronRight,
  FileCode2,
  FileJson,
  Terminal,
} from 'lucide-react';
import { WorkflowVisualizer } from '../components/WorkflowVisualizer';
import { ChatInterface } from '../components/ChatInterface';

export function WorkflowPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Keep track of which tab is selected
  const [selectedTab, setSelectedTab] = useState<'python' | 'typescript'>('python');
  
  // This will store the code after we "type" it out character by character
  const [displayedCode, setDisplayedCode] = useState<string>('');
  // We'll also track our current index in the string we are typing
  const [charIndex, setCharIndex] = useState<number>(0);

  // Full code for each tab
  const generatedCode = {
    python: `from typing import Dict, Any
import asyncio
from langchain import LLMChain
from langchain.llms import OpenAI

async def parse_input(data: Dict[str, Any]) -> Dict[str, Any]:
    llm = OpenAI()
    chain = LLMChain(llm=llm, prompt=parse_prompt)
    result = await chain.arun(data)
    return result

async def process_data(parsed_data: Dict[str, Any]) -> tuple[Dict[str, Any], Dict[str, Any]]:
    # Process data and split into batch and async tasks
    batch_data = {"items": parsed_data["batch_items"]}
    async_data = {"tasks": parsed_data["async_tasks"]}
    return batch_data, async_data

async def batch_analysis(data: Dict[str, Any]) -> Dict[str, Any]:
    results = []
    for item in data["items"]:
        # Process each item in the batch
        results.append({"id": item["id"], "result": "processed"})
    return {"results": results}

async def async_tasks(data: Dict[str, Any]) -> None:
    for task in data["tasks"]:
        # Schedule async task
        asyncio.create_task(process_async_task(task))

async def main():
    input_data = {"raw_data": "user input"}
    parsed_data = await parse_input(input_data)
    batch_data, async_data = await process_data(parsed_data)
    
    # Run batch analysis
    analysis_results = await batch_analysis(batch_data)
    
    # Schedule async tasks
    await async_tasks(async_data)
    
    return analysis_results
`,
    typescript: `import { OpenAI } from 'langchain/llms/openai';
import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';

interface WorkflowData {
  rawData: string;
  batchItems: Array<any>;
  asyncTasks: Array<any>;
}

async function parseInput(data: { rawData: string }): Promise<WorkflowData> {
  const llm = new OpenAI();
  const chain = new LLMChain({ llm, prompt: parsePrompt });
  const result = await chain.call(data);
  return result;
}

async function processData(parsedData: WorkflowData) {
  // Process data and split into batch and async tasks
  const batchData = { items: parsedData.batchItems };
  const asyncData = { tasks: parsedData.asyncTasks };
  return { batchData, asyncData };
}

async function batchAnalysis(data: { items: Array<any> }) {
  const results = await Promise.all(
    data.items.map(async (item) => ({
      id: item.id,
      result: 'processed',
    }))
  );
  return { results };
}

async function asyncTasks(data: { tasks: Array<any> }) {
  data.tasks.forEach((task) => {
    // Schedule async task
    processAsyncTask(task);
  });
}

async function main() {
  const inputData = { rawData: 'user input' };
  const parsedData = await parseInput(inputData);
  const { batchData, asyncData } = await processData(parsedData);
  
  // Run batch analysis
  const analysisResults = await batchAnalysis(batchData);
  
  // Schedule async tasks
  await asyncTasks(asyncData);
  
  return analysisResults;
}
`,
  };

  // Whenever the tab changes, reset the typed code and index
  useEffect(() => {
    setDisplayedCode('');
    setCharIndex(0);
  }, [selectedTab]);

  // Typewriter effect: each time `charIndex` changes, add one character
  useEffect(() => {
    const activeCode = generatedCode[selectedTab];
    if (charIndex < activeCode.length) {
      const timeoutId = setTimeout(() => {
        // Add next character
        setDisplayedCode((prev) => prev + activeCode[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 1); // Adjust typing speed as desired
      return () => clearTimeout(timeoutId);
    }
  }, [charIndex, selectedTab, generatedCode]);

  // Example data for workflow visualization and file explorer
  const exampleWorkflow = {
    nodes: [
      { id: '1', type: 'llm' as const, label: 'Parse Input', position: { x: 150, y: 150 } },
      { id: '2', type: 'flow' as const, label: 'Process Data', position: { x: 350, y: 150 } },
      { id: '3', type: 'batch' as const, label: 'Batch Analysis', position: { x: 550, y: 150 } },
      { id: '4', type: 'async' as const, label: 'Async Tasks', position: { x: 350, y: 300 } },
    ],
    actions: [
      { from: '1', to: '2', label: 'Send parsed data' },
      { from: '2', to: '3', label: 'Process batch' },
      { from: '2', to: '4', label: 'Trigger async' },
    ],
  };

  const fileStructure = [
    {
      name: 'src',
      type: 'folder',
      items: [
        { name: 'main.py', type: 'file', icon: FileCode2 },
        { name: 'config.json', type: 'file', icon: FileJson },
        { name: 'utils.py', type: 'file', icon: FileCode2 },
      ],
    },
    {
      name: 'tests',
      type: 'folder',
      items: [{ name: 'test_main.py', type: 'file', icon: FileCode2 }],
    },
  ];

  const handleCodeUpdate = (newCode: string) => {
    console.log('Code updated:', newCode);
  };

  const FileExplorer = () => (
    <div className="h-full overflow-auto">
      {fileStructure.map((item, index) => (
        <div key={index} className="mb-2">
          <div className="flex items-center gap-1 px-2 py-1 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
            <ChevronRight className="w-4 h-4" />
            <FolderTree className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{item.name}</span>
          </div>
          <div className="ml-4">
            {item.items.map((subItem, subIndex) => (
              <div
                key={subIndex}
                className="flex items-center gap-1 px-2 py-1 text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
              >
                <subItem.icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{subItem.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 h-12 flex items-center px-4 flex-shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="flex-1 flex justify-end gap-4">
          <button className="h-8 px-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-300">
            Export
          </button>
          <button className="h-8 px-4 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-900 transition-colors duration-300">
            Deploy
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar */}
        <div className="w-12 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-4 gap-4 flex-shrink-0">
          <button className="p-2 rounded-lg bg-white shadow-sm">
            <Files className="w-5 h-5" />
          </button>
        </div>

        {/* File Explorer (thinner now) */}
        <div className="w-48 border-r border-gray-200 bg-white flex-shrink-0 flex flex-col min-h-0">
          <div className="p-4 flex-shrink-0">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Explorer</h2>
          </div>
          <div className="flex-1 overflow-auto px-4">
            <FileExplorer />
          </div>
        </div>

        {/* Main Content (Code Editor) - slightly wider because Explorer is narrower */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center px-4">
              <div className="flex">
                <button
                  onClick={() => setSelectedTab('python')}
                  className={`px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                    selectedTab === 'python'
                      ? 'text-gray-900 border-b-2 border-gray-900'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  main.py
                </button>
                <button
                  onClick={() => setSelectedTab('typescript')}
                  className={`px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                    selectedTab === 'typescript'
                      ? 'text-gray-900 border-b-2 border-gray-900'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  test_main.py
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-white">
            <SyntaxHighlighter
              language={selectedTab === 'python' ? 'python' : 'typescript'}
              style={atomOneLight}
              showLineNumbers
              customStyle={{ margin: 0, padding: '1rem', minHeight: '100%' }}
            >
              {displayedCode}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* Right Panel - Chat Interface + Workflow Visualization (wider now) */}
        <div className="w-[30rem] border-l border-gray-200">
          <ChatInterface
            onUpdateCode={handleCodeUpdate}
            workflowVisualization={
              <WorkflowVisualizer
                nodes={exampleWorkflow.nodes}
                actions={exampleWorkflow.actions}
                description="A sample workflow"
              />
            }
          />
        </div>
      </div>

      {/* Bottom Panel (Terminal) */}
      <div className="h-32 border-t border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center px-4 py-2 border-b border-gray-200">
          <Terminal className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm font-medium text-gray-700">Terminal</span>
        </div>
        <div className="p-4 font-mono text-sm text-gray-700 overflow-auto h-[calc(100%-2.5rem)]">
          <div className="text-gray-500">$ python main.py</div>
          <div>Starting workflow execution...</div>
          <div className="text-green-600">✓ Workflow completed successfully</div>
        </div>
      </div>
    </div>
  );
}
