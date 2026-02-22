import Head from 'next/head';
import { promises as fsPromises } from 'fs';

export default function Architecture() {
  const [content, setContent] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadArchitecture();
  }, []);

  async function loadArchitecture() {
    try {
      const archPath = process.env.ARCHITECTURE_PATH || '/home/node/.openclaw/workspace/ARCHITECTURE.md';
      const data = await fsPromises.readFile(archPath, 'utf-8');
      setContent(data);
    } catch (error) {
      console.error('Failed to load architecture:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <Head>
        <title>OpenClaw Architecture</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
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

        {/* Back button */}
        <div className="mt-4">
          <a href="/" className="bg-gray-700 hover:bg-gray-600 rounded px-4 py-2 font-semibold inline-block">
            ← Back to Task Board
          </a>
        </div>
      </div>
    </div>
  );
}
