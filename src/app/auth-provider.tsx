import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const AUTH_PASSWORD = 'claw2026'

export default function App({ Component, pageProps }: any) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const auth = sessionStorage.getItem('taskboard_auth')
    if (auth === AUTH_PASSWORD) {
      setIsAuthenticated(true)
    }
  }, [])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === AUTH_PASSWORD) {
      sessionStorage.setItem('taskboard_auth', AUTH_PASSWORD)
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Invalid password')
      setPassword('')
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('taskboard_auth')
    setIsAuthenticated(false)
    router.push('/')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">📋 OpenClaw Task Board</h1>
            <p className="text-gray-400">Enter password to access</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Access Task Board
            </button>
          </form>
          
          <p className="text-gray-500 text-xs text-center mt-4">
            🔒 Gated access - authorized personnel only
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <nav className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold">📋 OpenClaw Task Board</h1>
          <button
            onClick={handleLogout}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
          >
            🔒 Logout
          </button>
        </div>
      </nav>
      <Component {...pageProps} />
    </>
  )
}
