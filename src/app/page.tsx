'use client';

import { useState } from 'react';
import { useCompletion } from 'ai/react'; // We're using a new hook here!

export default function HomePage() {
  // State to hold the content of the uploaded file
  const [fileContent, setFileContent] = useState<string>('');

  // The useCompletion hook from the Vercel AI SDK!
  const { completion, complete, isLoading } = useCompletion({
    // This is the API endpoint we just created
    api: '/api/generate',
  });

  // Function to handle the file upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      const text = await file.text();
      setFileContent(text);
    }
  };

  // This function is now very simple. It just calls the 'complete' function from our hook.
  const handleGenerateDocs = () => {
    if (fileContent) {
      complete(fileContent); // We pass the code content to our hook
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section (no changes here) */}
      <header className="bg-gray-900 p-4 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-center text-white">
          CodeScribe <span className="text-blue-400">AI</span>
        </h1>
        <p className="text-center text-gray-400 mt-1">
          Upload a code file and get professionally written documentation instantly.
        </p>
      </header>

      {/* Main Content (no changes here) */}
      <main className="flex-grow p-6 flex flex-col">
        {/* Controls Section (no changes here) */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <input
            type="file"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            onClick={handleGenerateDocs}
            disabled={!fileContent || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-full"
          >
            {isLoading ? 'Generating...' : 'Generate Docs'}
          </button>
        </div>

        {/* Code and Docs Display Section (small changes here) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Code Editor Box */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-300">Your Code</h2>
            <pre className="bg-gray-900 p-4 rounded-md overflow-auto h-full min-h-[50vh] text-sm text-gray-300">
              <code>
                {fileContent || "Upload a file to see its content here."}
              </code>
            </pre>
          </div>

          {/* Documentation Box - NOW POWERED BY OUR HOOK */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-300">Generated Documentation</h2>
            <div className="bg-gray-900 p-4 rounded-md overflow-auto h-full min-h-[50vh] text-sm text-white prose prose-invert">
              {/* This 'completion' variable comes directly from the useCompletion hook */}
              {completion || "Your generated documentation will appear here..."}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}