import React, { useState, useEffect, MouseEvent, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
  ArrowLeft,
  Files,
  FolderTree,
  ChevronRight,
  Terminal,
  FileCode2,
  FileText,
} from 'lucide-react';
import { WorkflowVisualizer } from '../components/WorkflowVisualizer';
import { ChatInterface } from '../components/ChatInterface';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  icon?: React.ElementType;
  content?: string;
  items?: FileItem[];
}

function sortFileItems(items: FileItem[]): FileItem[] {
  const sorted = [...items].sort((a, b) => {
    // folders first
    if (a.type === 'folder' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'folder') return 1;
    // then alphabetical
    return a.name.localeCompare(b.name);
  });

  sorted.forEach((item) => {
    if (item.type === 'folder' && item.items) {
      item.items = sortFileItems(item.items);
    }
  });
  return sorted;
}

function FileExplorer({
  fileStructure,
  onFileItemClick,
  onFileItemContextMenu,
}: {
  fileStructure: FileItem[];
  onFileItemClick: (item: FileItem) => void;
  onFileItemContextMenu: (e: MouseEvent<HTMLDivElement>, item: FileItem) => void;
}) {
  function renderFileItems(items: FileItem[], indent = 0) {
    const sorted = sortFileItems(items);
    return sorted.map((item, idx) => {
      if (item.type === 'folder') {
        return (
          <div key={idx} className="mb-2">
            <div
              className="flex items-center gap-1 px-2 py-1 text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
              style={{ marginLeft: indent }}
              onClick={() => onFileItemClick(item)}
              onContextMenu={(e) => onFileItemContextMenu(e, item)}
            >
              <ChevronRight className="w-4 h-4" />
              {item.icon && (
  <item.icon
    className="text-gray-500"
    style={{ width: '16px', height: '16px', transform: 'scale(0.9)' }}
    strokeWidth={1.25}
  />
)}
              <span className="text-sm truncate">{item.name}</span>
            </div>
            {item.items && item.items.length > 0 && (
              <div>{renderFileItems(item.items, indent + 16)}</div>
            )}
          </div>
        );
      } else {
        return (
          <div
            key={idx}
            className="flex items-center gap-1 px-2 py-1 text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
            style={{ marginLeft: indent }}
            onClick={() => onFileItemClick(item)}
            onContextMenu={(e) => onFileItemContextMenu(e, item)}
          >
            {/* invisible chevron to align text */}
            <ChevronRight className="w-4 h-4 invisible" />
            {item.icon && <item.icon className="w-4 h-4 text-gray-500" />}
            <span className="text-sm truncate">{item.name}</span>
          </div>
        );
      }
    });
  }

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden relative">
      {renderFileItems(fileStructure)}
    </div>
  );
}

export function WorkflowPage() {
  const raw_html = `<!DOCTYPE html>
<html>
<head>
    <title>Resume Screening Results</title>
    <!-- Tailwind CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-white min-h-screen font-sans">
    <!-- Outer Container with Off-White/Gray-ish Background for Contrast -->
    <div class="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-lg p-8 m-4">
        
        <h1 class="text-4xl font-bold mb-8 text-gray-800">Resume Screening Results</h1>

        <!-- Summary Card -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
            <h2 class="text-xl font-semibold mb-4">Summary</h2>
            <p class="text-gray-700">
                Total Resumes: 7<br>
                Qualified Candidates: 4<br>
                Success Rate: 57.1%
            </p>
        </div>

        <!-- Results Container -->
        <div class="space-y-6">

            <!-- 1. Dave Van Veen -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-2">resumes/cv_dave_van_veen - Dave Van Veen.pdf</h3>
                <p class="text-green-600 font-medium mb-4">Qualified</p>
                <h4 class="font-medium mb-2">Reasoning:</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Possesses a Ph.D. in Electrical Engineering from Stanford University, specializing in large language models, machine learning, and computational imaging, exceeding the advanced degree requirement.</li>
                    <li>Has extensive experience developing and deploying AI-driven solutions, including working with large language models, unsupervised learning, and real-time AI applications in healthcare and other domains.</li>
                    <li>Demonstrates strong research contributions with numerous publications in top-tier AI and medical imaging conferences and journals, showcasing expertise in cutting-edge AI techniques.</li>
                    <li>Brings interdisciplinary expertise, integrating AI with medical imaging, neuroscience, and human-centered applications, aligning with the preferred qualifications.</li>
                    <li>Has led AI research projects and teams, securing grants and delivering innovative solutions, demonstrating the ability to drive AI initiatives in an enterprise setting.</li>
                </ul>
            </div>

            <!-- 2. Niel Ok -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-2">resumes/Niel Ok Resume - Niel Ok.pdf</h3>
                <p class="text-green-600 font-medium mb-4">Qualified</p>
                <h4 class="font-medium mb-2">Reasoning:</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Significant academic training in AI/ML (Electrical Engineering degree from Stanford with 4.052 GPA)</li>
                    <li>Hands-on experience developing CNN models (brain tumor classification project with 99.04% accuracy)</li>
                    <li>Proficiency with ML frameworks like TensorFlow (used in personal projects)</li>
                    <li>Innovative work on multimodal AI pipelines (leading this work at stealth startup Primafy)</li>
                    <li>Experience with training pipelines, automation, and building AI infrastructure</li>
                    <li>Involvement in cutting-edge AI research (quantum computing, simulations) demonstrating passion for the field</li>
                    <li>Interdisciplinary expertise integrating AI with neuroscience and novel applications</li>
                    <li>Leadership and collaboration skills (founding teams, organizing work across functions)</li>
                </ul>
            </div>

            <!-- 3. Tenzin Dolkar -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-2">resumes/Final resume.docx - Tenzin Dolkar.pdf</h3>
                <p class="text-green-600 font-medium mb-4">Qualified</p>
                <h4 class="font-medium mb-2">Reasoning:</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Extensive technical projects demonstrating hands-on experience with AI/ML, full-stack web development, algorithms, and mobile apps</li>
                    <li>Relevant coursework in AI, HCI, data structures, algorithms, and machine learning aligns well with job requirements</li>
                    <li>Practical experience as a full-stack developer on a HIPAA-compliant health app shows ability to develop and deploy production applications</li>
                    <li>Teaching assistant role for AI for Social Good course demonstrates passion for AI and aptitude for working with the latest NLP/ML advances</li>
                    <li>Participation in Women in Computer Science workshops involving cybersecurity, data science, algorithms and building GPT projects</li>
                    <li>Proficiency in key programming languages (Python, JavaScript, C++), frameworks (React Native, REST API) and tools (NodeJS, MongoDB, Figma) needed for the role</li>
                </ul>
            </div>

            <!-- 4. Sidharth Gopisetty -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-2">resumes/Sidharth_Gopisetty Resume - Sidharth Gopisetty.pdf</h3>
                <p class="text-red-600 font-medium mb-4">Not Qualified</p>
                <h4 class="font-medium mb-2">Reasoning:</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-700">
                    <li>While the candidate has a strong academic background in Electrical Engineering and some coding experience, they lack the significant academic training or professional experience in Artificial Intelligence, Machine Learning or related fields that is required for the role.</li>
                    <li>The candidate does not demonstrate the required 2+ years of experience working on AI-related projects, including developing or deploying machine learning models in production.</li>
                    <li>The resume does not indicate hands-on proficiency with AI/ML tools and frameworks such as TensorFlow, PyTorch, or similar ML libraries, which is a key requirement for the position.</li>
                    <li>The candidate's experience seems to be more focused on areas like sustainability, fashion, and education rather than innovative AI solutions like working with LLMs, multimodal AI systems, or reinforcement learning.</li>
                    <li>The resume does not highlight any experience in developing scalable, production-ready AI systems and pipelines, which is an important aspect of the Software Engineer role at SAP Business AI.</li>
                </ul>
            </div>

            <!-- 5. Mathias Becerra -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-2">resumes/Becerra_Mathias_Resume 2024 - Mathias Becerra.pdf</h3>
                <p class="text-red-600 font-medium mb-4">Not Qualified</p>
                <h4 class="font-medium mb-2">Reasoning:</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-700">
                    <li>While the candidate has impressive academic achievements and a strong interest in AI, they appear to still be an undergraduate student and lack the 2+ years of professional experience working on AI projects that the role requires.</li>
                    <li>The candidate's experience seems to be more focused on research, language studies, and community initiatives rather than hands-on software engineering and deploying machine learning models in production environments.</li>
                    <li>The resume does not clearly demonstrate proficiency with specific ML frameworks like TensorFlow or PyTorch, experience building scalable AI pipelines, or direct work with large language models which are desired qualifications for this role.</li>
                </ul>
            </div>

            <!-- 6. Addison Reese Jadwin -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-2">resumes/JadwinCVMay2024 - Addison Reese Jadwin.pdf</h3>
                <p class="text-green-600 font-medium mb-4">Qualified</p>
                <h4 class="font-medium mb-2">Reasoning:</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Candidate has an advanced degree (M.S.) in Computer Science with a focus on Artificial Intelligence, fulfilling the preferred qualification</li>
                    <li>Possesses 2+ years of experience working on AI-related projects, as demonstrated by internships and research positions</li>
                    <li>Demonstrates hands-on proficiency with AI/ML frameworks such as PyTorch, as evident in listed technical skills and projects</li>
                    <li>Has contributed to innovative AI solutions, such as LLM-powered interfaces and multimodal AI pipelines (e.g., AI Knowledge Navigator project)</li>
                    <li>Shows experience in developing scalable AI systems and pipelines, as seen in the NIO internship and various projects</li>
                    <li>Brings interdisciplinary expertise, integrating AI with neuroscience and cognitive science through relevant coursework and research</li>
                </ul>
            </div>

            <!-- 7. Ishita Gupta -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-2">resumes/CS Resume - Ishita Gupta.pdf</h3>
                <p class="text-red-600 font-medium mb-4">Not Qualified</p>
                <h4 class="font-medium mb-2">Reasoning:</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Lacks 2+ years of professional experience working on AI-related projects and deploying ML models in production</li>
                    <li>Demonstrates proficiency with Python and C++, but no evidence of experience with ML frameworks like TensorFlow or PyTorch</li>
                    <li>Research experience is relevant but limited and lacks peer-reviewed papers or conference presentations</li>
                    <li>M.S. in Computer Science with AI specialization is prospective, not yet completed</li>
                    <li>Projects show solid programming foundations but are not specifically AI/ML focused and do not involve LLMs or multimodal AI pipelines</li>
                </ul>
            </div>

        </div>
    </div>
</body>
</html>`;
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileStructure, setFileStructure] = useState<FileItem[]>([]);

  // For typed-out code
  const [displayedCode, setDisplayedCode] = useState('');
  const [targetCode, setTargetCode] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  const [renderHtmlMode, setRenderHtmlMode] = useState(false);

  // Context menu
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    folder: FileItem | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    folder: null,
  });

  // Hidden input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Terminal state
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const terminalWindowRef = useRef<HTMLDivElement | null>(null);

  // Typewriter effect
  useEffect(() => {
    if (charIndex < targetCode.length) {
      const timer = setTimeout(() => {
        setDisplayedCode((prev) => prev + targetCode[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 0.01);
      return () => clearTimeout(timer);
    }
  }, [charIndex, targetCode]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalWindowRef.current) {
      terminalWindowRef.current.scrollTop = terminalWindowRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const exampleWorkflow = {
    nodes: [
      { id: '1', type: 'llm' as const, label: 'Parse Input', position: { x: 150, y: 150 } },
      { id: '2', type: 'flow' as const, label: 'Process Data', position: { x: 350, y: 150 } },
    ],
    actions: [{ from: '1', to: '2', label: 'Send parsed data' }],
  };

  // Helpers
  function removeItem(list: FileItem[], itemToRemove: FileItem): FileItem[] {
    return list
      .filter((i) => i !== itemToRemove)
      .map((i) => {
        if (i.type === 'folder' && i.items) {
          return { ...i, items: removeItem(i.items, itemToRemove) };
        }
        return i;
      });
  }

  function doesItemExistInStructure(structure: FileItem[], item: FileItem): boolean {
    for (let i of structure) {
      if (i === item) return true;
      if (i.type === 'folder' && i.items) {
        if (doesItemExistInStructure(i.items, item)) return true;
      }
    }
    return false;
  }

  // Chat -> code update
  const handleCodeUpdate = (newCode: string) => {
    const newFS = [...fileStructure];
    // Ensure main.py
    let mainPy = newFS.find((f) => f.name === 'main.py');
    if (!mainPy) {
      newFS.push({
        name: 'main.py',
        type: 'file',
        icon: FileCode2,
        content: newCode,
      });
      mainPy = newFS.find((f) => f.name === 'main.py');
    } else {
      mainPy.content = newCode;
    }

    // Ensure resumes folder
    let docFolder = newFS.find((f) => f.name === 'resumes');
    if (!docFolder) {
      docFolder = {
        name: 'resumes',
        type: 'folder',
        icon: FolderTree,
        items: [],
      };
      newFS.push(docFolder);
    }

    setFileStructure(newFS);
    setSelectedFile(mainPy || null);

    // Trigger typed effect
    setTargetCode(newCode);
    setDisplayedCode('');
    setCharIndex(0);
  };

  // Explorer interactions
  const handleFileItemClick = (item: FileItem) => {
    setSelectedFile(item);
    if (item.type === 'file' && item.name.toLowerCase().endsWith('.html')) {
      // no typewriting for HTML
      setDisplayedCode(item.content || '');
      setTargetCode('');
      setCharIndex(0);
      setRenderHtmlMode(false);
    } else if (item.type === 'file') {
      // typed-out effect
      setTargetCode(item.content || '');
      setDisplayedCode('');
      setCharIndex(0);
    }
  };

  const handleFileItemContextMenu = (
    e: MouseEvent<HTMLDivElement>,
    item: FileItem
  ) => {
    e.preventDefault();
    if (item.type === 'folder') {
      setContextMenu({ visible: true, x: e.pageX, y: e.pageY, folder: item });
    }
  };

  const handleFileInputChange = () => {
    if (!contextMenu.folder) return;
    const folder = contextMenu.folder;
    folder.items = folder.items || [];
    // Hard-coded example PDFs
    folder.items.push(
      { name: 'Becerra_Mathias_Resume 2024 ', type: 'file', icon: FileText },
      { name: 'Niel Ok Resume - Niel Ok.pdf', type: 'file', icon: FileText },
      { name: 'CS Resume - Ishita Gupta.pdf', type: 'file', icon: FileText },
      { name: 'Sidharth_Gopisetty Resume - ', type: 'file', icon: FileText },
      { name: 'Final resume.docx - Tenzin D', type: 'file', icon: FileText },
      { name: 'cv_dave_van_veen - Dave Van ', type: 'file', icon: FileText },
      { name: 'JadwinCVMay2024 - Addison R', type: 'file', icon: FileText }
    );
    
    setFileStructure([...fileStructure]);
    setContextMenu({ visible: false, x: 0, y: 0, folder: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadPDFs = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteFolder = () => {
    if (!contextMenu.folder) return;
    const newFS = removeItem(fileStructure, contextMenu.folder);
    setFileStructure(newFS);

    // If we had a selectedFile inside the deleted folder, reset
    if (selectedFile && !doesItemExistInStructure(newFS, selectedFile)) {
      setSelectedFile(null);
      setDisplayedCode('');
      setTargetCode('');
      setCharIndex(0);
    }
    setContextMenu({ visible: false, x: 0, y: 0, folder: null });
  };

  // Terminal
  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const command = currentCommand.trim();
      if (!command) return;
      setTerminalLines((prev) => [...prev, `$ ${command}`]);
      setCurrentCommand('');
      runPythonMainPy();
    }
  };

  const runPythonMainPy = () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setTerminalLines((prev) => [...prev, 'Starting workflow execution...']);

    setTimeout(() => {
      setTerminalLines((prev) => [...prev, 'Workflow completed successfully.']);
      setIsExecuting(false);

      // Example: create a results.html
      const newFile: FileItem = {
        name: 'results.html',
        type: 'file',
        icon: FileCode2,
        content: raw_html,
      };
      setFileStructure((prev) => [...prev, newFile]);
    }, 1000);
  };

  const isHtmlFile = selectedFile?.name.toLowerCase().endsWith('.html');

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Hidden input for PDF */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Top Nav */}
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

      {/* Main Row: left icons + explorer + editor + right panel */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Icons */}
        <div className="w-12 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-4 gap-4 flex-shrink-0">
          <button className="p-2 rounded-lg bg-white shadow-sm">
            <Files className="w-5 h-5" />
          </button>
        </div>

        {/* File Explorer */}
        <div className="w-48 border-r border-gray-200 bg-white flex-shrink-0 flex flex-col min-h-0 overflow-hidden">
          <div className="p-4 flex-shrink-0">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Explorer
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <FileExplorer
              fileStructure={fileStructure}
              onFileItemClick={handleFileItemClick}
              onFileItemContextMenu={handleFileItemContextMenu}
            />
          </div>
        </div>

        {/* Middle Editor Panel */}
        <div className="flex-1 w-0 flex flex-col overflow-hidden bg-white">
          {/* Tab / filename */}
          <div className="border-b border-gray-200 bg-white flex-shrink-0 h-10 flex items-center px-4">
            {selectedFile ? (
              <button className="px-4 py-2 text-sm font-medium text-gray-900 border-b-2 border-gray-900">
                {selectedFile.name}
              </button>
            ) : (
              <span className="text-sm text-gray-400">No file selected</span>
            )}
          </div>

          {/* Editor area */}
          {selectedFile ? (
            isHtmlFile ? (
              <>
                {/* Toggle row (sticky so it won't scroll away) */}
                <div className="sticky top-0 z-10 flex items-center justify-end p-2 border-b border-gray-200 bg-white">
                  <button
                    onClick={() => setRenderHtmlMode(!renderHtmlMode)}
                    className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md"
                  >
                    {renderHtmlMode ? 'View Code' : 'Render HTML'}
                  </button>
                </div>
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                  {renderHtmlMode ? (
                    <div
                      className="p-4 min-h-full"
                      dangerouslySetInnerHTML={{ __html: selectedFile.content || '' }}
                    />
                  ) : (
                    <SyntaxHighlighter
                      language="html"
                      style={atomOneLight}
                      showLineNumbers
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        minHeight: '100%',
                        fontSize: '0.8rem', // smaller font
                      }}
                    >
                      {displayedCode}
                    </SyntaxHighlighter>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-x-auto overflow-y-auto">
                <SyntaxHighlighter
                  language="python"
                  style={atomOneLight}
                  showLineNumbers
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    minHeight: '100%',
                    fontSize: '0.8rem', // smaller font
                  }}
                >
                  {displayedCode}
                </SyntaxHighlighter>
              </div>
            )
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400 text-xl">
                Select or create a file to view its contents.
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - made wider */}
        <div className="w-[40rem] flex-shrink-0 border-l border-gray-200">
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

      {/* Bottom Terminal */}
      <div className="h-48 border-t border-gray-200 bg-white flex-shrink-0 flex flex-col">
        <div className="flex items-center px-4 py-2 border-b border-gray-200">
          <Terminal className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm font-medium text-gray-700">Terminal</span>
        </div>
        <div
          className="flex-1 p-2 font-mono text-sm text-gray-700 overflow-auto"
          ref={terminalWindowRef}
        >
          {terminalLines.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}

          {!isExecuting && (
            <div className="flex">
              <span className="text-gray-500 mr-1">$</span>
              <input
                className="flex-1 bg-transparent outline-none text-gray-700"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleTerminalKeyDown}
                placeholder="type a command..."
              />
            </div>
          )}
        </div>
      </div>

      {/* Folder context menu */}
      {contextMenu.visible && contextMenu.folder && (
        <div
          className="fixed z-50 bg-white border border-gray-200 shadow-lg rounded text-sm text-gray-700"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={handleUploadPDFs}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Upload PDF Files
          </button>
          <button
            onClick={handleDeleteFolder}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
