import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const AuthProvider = dynamic(() => import('../auth-provider'), { ssr: false })

function ArchitectureContent() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArchitecture();
  }, []);

  async function loadArchitecture() {
    try {
      const archPath = process.env.ARCHITECTURE_PATH || '/home/node/.openclaw/workspace/ARCHITECTURE.md';
      const response = await fetch('/api/architecture');
      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
      }
    } catch (error) {
      console.error('Failed to load architecture:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-4 mb-4 shadow-lg">
          <h1 className="text-2xl font-bold">🏗 OpenClaw Core Architecture</h1>
          <p className="text-gray-400 text-sm">
            Detailed system architecture and component relationships
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            <p className="mt-4 text-gray-400">Loading architecture...</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg overflow-x-auto">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              {content}
            </pre>
          </div>
        )}

        <div className="mt-4">
          <a href="/" className="bg-gray-700 hover:bg-gray-600 rounded px-4 py-2 font-semibold inline-block">
            ← Back to Task Board
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Architecture() {
  return (
    <AuthProvider>
      <ArchitectureContent />
    </AuthProvider>
  );
}
