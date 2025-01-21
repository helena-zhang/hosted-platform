import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { MermaidRenderer } from './MermaidRenderer';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  onUpdateCode: (newCode: string) => void;
  workflowVisualization?: React.ReactNode;
}

export function ChatInterface({ onUpdateCode, workflowVisualization }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `
1. High-level Flow

\`\`\`mermaid
graph
    E[LoadRequirements] --> A[LoadPDF]
    A --> B[ExtractText]
    B --> C[MatchRequirements]
    C --> D[GenerateReasoning]
    D --> F[GenerateReport]
\`\`\`


2. Flow Components
- LoadRequirements: Loads job requirements text.
- BatchResumeFlow: Processes multiple resumes in parallel.
- LoadPDF: Opens the PDF file.
- ExtractText: Extracts text content.
- MatchRequirements: Compares against job requirements.
- GenerateReasoning: Provides detailed reasoning.
- GenerateReport: Creates the final HTML report.

3. Shared Memory Structure

shared = {
    "requirements": str,  # Job requirements text
    "results": {
        "filename.pdf": {
            "text": str,           # Extracted text
            "qualified": bool,     # Whether qualified
            "reasoning": List[str] # List of reasoning points
        }
    }
}

4. Additional Details
- We can use Bootstrap CSS for a clean, professional report layout.
- Each component can be implemented with error handling and retries as needed.

Would you like me to proceed with the implementation?`
    },
  ]);

  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    // User message
    const userMessage: ChatMessage = { role: 'user', content: input };

    // Assistant’s response (placeholder)
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: `I'll implement the code based on the design we discussed. Here's how to use it:
1. Create a directory called resumes and put all PDF resumes there
2. Create a job_requirements.txt file with the job requirements
3. Run \`python main.py\``
    };

    const newMessages = [...messages, userMessage, assistantMessage];
    setMessages(newMessages);
    setInput('');

    // (Optional) Update code in the parent
    const demoPythonCode = `import fitz  # PyMuPDF
import os
from typing import List, Dict
from openai import OpenAI
from pocketflow import Node, Flow, BatchFlow

# Basic nodes
class LoadRequirements(Node):
    def prep(self, shared):
        return shared.get("requirements_path")
        
    def exec(self, req_path):
        with open(req_path, 'r') as f:
            requirements = f.read()
        return requirements
        
    def post(self, shared, prep_res, exec_res):
        shared["requirements"] = exec_res
        return "default"

class ExtractResume(Node):
    def prep(self, shared):
        return self.params.get("filename")
        
    def exec(self, filename):
        doc = fitz.open(filename)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text
        
    def post(self, shared, prep_res, exec_res):
        filename = prep_res
        if "results" not in shared:
            shared["results"] = {}
        shared["results"][filename] = {"text": exec_res}
        return "default"

class MatchRequirements(Node):
    def prep(self, shared):
        filename = self.params.get("filename")
        return {
            "resume": shared["results"][filename]["text"],
            "requirements": shared["requirements"]
        }
        
    def exec(self, inputs):
        prompt = f"""
Given the following job requirements and resume, determine if the candidate qualifies.
Output in YAML format with qualification status and reasoning points.

Job Requirements:
{inputs['requirements']}

Resume:
{inputs['resume']}

Output format:
\`\`\`yaml
qualified: true/false
reasoning:
  - point 1
  - point 2
  - point 3
\`\`\`
"""
        response = call_llm(prompt)
        yaml_str = response.split("\`\`\`yaml")[1].split("\`\`\`")[0].strip()
        import yaml
        result = yaml.safe_load(yaml_str)
        
        # Validate response
        assert isinstance(result, dict)
        assert "qualified" in result
        assert "reasoning" in result
        assert isinstance(result["qualified"], bool)
        assert isinstance(result["reasoning"], list)
        
        return result
        
    def post(self, shared, prep_res, exec_res):
        filename = self.params.get("filename")
        shared["results"][filename].update({
            "qualified": exec_res["qualified"],
            "reasoning": exec_res["reasoning"]
        })
        return "default"

class GenerateReport(Node):
    def prep(self, shared):
        return shared["results"]
        
    def exec(self, results):
        qualified_count = sum(1 for r in results.values() if r["qualified"])
        total_count = len(results)
        
        html = f"""
<!DOCTYPE html>
<html>
<head>
    <title>Resume Screening Results</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-8 text-gray-800">Resume Screening Results</h1>
        
        <div class="bg-white rounded-lg shadow p-6 mb-8">
            <h2 class="text-xl font-semibold mb-4">Summary</h2>
            <p class="text-gray-700">
                Total Resumes: {total_count}<br>
                Qualified Candidates: {qualified_count}<br>
                Success Rate: {(qualified_count/total_count*100):.1f}%
            </p>
        </div>

        <div class="space-y-6">
"""
        
        for filename, result in results.items():
            status_color = "green" if result["qualified"] else "red"
            status_text = "Qualified" if result["qualified"] else "Not Qualified"
            
            html += f"""
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-2">{filename}</h3>
                <p class="text-{status_color}-600 font-medium mb-4">{status_text}</p>
                <h4 class="font-medium mb-2">Reasoning:</h4>
                <ul class="list-disc pl-5 space-y-1">
                    {"".join(f'<li class="text-gray-700">{point}</li>' for point in result["reasoning"])}
                </ul>
            </div>
"""
        
        html += """
        </div>
    </div>
</body>
</html>
"""
        return html
        
    def post(self, shared, prep_res, exec_res):
        shared["report"] = exec_res
        with open("resume_screening_results.html", "w") as f:
            f.write(exec_res)
        return "default"

# Batch processing for resumes
class BatchResumeFlow(BatchFlow):
    def prep(self, shared):
        resume_dir = shared.get("resume_dir", ".")
        files = [f for f in os.listdir(resume_dir) if f.endswith('.pdf')]
        return [{"filename": os.path.join(resume_dir, f)} for f in files]

# Create the processing flow for a single resume
extract = ExtractResume()
match = MatchRequirements()
extract >> match
process_one = Flow(start=extract)

# Create the main flow
requirements = LoadRequirements()
batch_process = BatchResumeFlow(start=process_one)
report = GenerateReport()

requirements >> batch_process >> report
main_flow = Flow(start=requirements)

if __name__ == "__main__":
    shared = {
        "requirements_path": "job_requirements.txt",
        "resume_dir": "resumes"
    }
    main_flow.run(shared)
    print(f"Report generated: resume_screening_results.html")
`;
setTimeout(() => {
  onUpdateCode(demoPythonCode);
}, 1000);
  };

  // A helper function to detect mermaid code blocks
  const renderMessageContent = (message: ChatMessage) => {
    const mermaidPattern = /```mermaid([\s\S]*?)```/;
    const match = message.content.match(mermaidPattern);

    if (match) {
      const mermaidCode = match[1].trim();
      const parts = message.content.split(mermaidPattern);
      const textBefore = parts[0]?.trim();
      const textAfter = parts[2]?.trim();

      return (
        <div>
          {textBefore && <p style={{ whiteSpace: 'pre-wrap' }}>{textBefore}</p>}
          <MermaidRenderer code={mermaidCode} />
          {textAfter && <p style={{ whiteSpace: 'pre-wrap' }}>{textAfter}</p>}
        </div>
      );
    }

    // Default: show raw text with line breaks preserved
    return (
      <p style={{ whiteSpace: 'pre-wrap' }}>
        {message.content}
      </p>
    );
  };

  return (
    <div className="bg-white overflow-hidden border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-900">Chat</h2>
      </div>

      {workflowVisualization && (
        <div className="p-4 border-b border-gray-100">
          {workflowVisualization}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm ${
                message.role === 'user'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {renderMessageContent(message)}
            </div>
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me to write some code..."
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
