import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const AuthProvider = dynamic(() => import('./auth-provider'), { ssr: false })

const STATUS_ICONS = {
  completed: '✅',
  in_progress: '🟡',
  blocked: '🔴',
  failed: '❌',
  pending: '⏸',
  not_started: '🔵',
};

function TaskBoardContent() {
  const [taskBoard, setTaskBoard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTaskBoard(data);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
          <p className="mt-4 text-gray-400">Loading task board...</p>
        </div>
      </div>
    );
  }

  if (!taskBoard) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-md mx-auto text-center">
          <p className="text-red-400">Failed to load tasks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
          <h1 className="text-2xl font-bold mb-2">📋 OpenClaw Task Board</h1>
          <p className="text-gray-400 text-sm">
            Last Updated: {new Date(taskBoard.lastUpdated).toLocaleString()}
          </p>
        </div>

        {/* Summary */}
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-3">📊 Summary</h2>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-green-900 rounded p-2 text-center">
              <div className="text-2xl font-bold">{taskBoard.summary.completed}</div>
              <div className="text-green-400">✅ Done</div>
            </div>
            <div className="bg-yellow-900 rounded p-2 text-center">
              <div className="text-2xl font-bold">{taskBoard.summary.in_progress}</div>
              <div className="text-yellow-400">🟡 In Progress</div>
            </div>
            <div className="bg-red-900 rounded p-2 text-center">
              <div className="text-2xl font-bold">{taskBoard.summary.blocked}</div>
              <div className="text-red-400">🔴 Blocked</div>
            </div>
            <div className="bg-red-900 rounded p-2 text-center">
              <div className="text-2xl font-bold">{taskBoard.summary.failed}</div>
              <div className="text-red-400">❌ Failed</div>
            </div>
            <div className="bg-blue-900 rounded p-2 text-center">
              <div className="text-2xl font-bold">{taskBoard.summary.pending}</div>
              <div className="text-blue-400">⏸ Pending</div>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-6">
          {taskBoard.projects.map((project: any, idx: number) => (
            <div key={idx} className="bg-gray-800 rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-semibold mb-3">{project.name}</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-2">Task</th>
                      <th className="text-center p-2">Status</th>
                      <th className="text-center p-2">Assigned</th>
                      <th className="text-left p-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.tasks.map((task: any, taskIdx: number) => (
                      <tr key={taskIdx} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="p-2">{task.name}</td>
                        <td className="p-2 text-center">
                          <span className="inline-block px-2 py-1 rounded text-xs font-semibold">
                            {STATUS_ICONS[task.status]} {task.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-2 text-center">{task.assigned}</td>
                        <td className="p-2 text-xs text-gray-400">{task.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-3">⚡ Quick Actions</h2>
          <div className="space-y-2">
            <a href="/architecture" className="block bg-blue-900 hover:bg-blue-800 rounded p-3 text-center font-semibold">
              🏗 View Architecture Diagram
            </a>
            <a href="/api/agents" className="block bg-purple-900 hover:bg-purple-800 rounded p-3 text-center font-semibold">
              👥 View Running Agents
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <TaskBoardContent />
    </AuthProvider>
  );
}
