import React, { useState, useEffect } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import TaskList from './pages/TaskList'
import TaskForm from './pages/TaskForm'
import TaskDetails from './pages/TaskDetails'
import Users from './pages/Users'
import './index.css'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'))
  const [route, setRoute] = useState('tasks')
  const [editTaskId, setEditTaskId] = useState(null)
  const [viewTaskId, setViewTaskId] = useState(null)

  useEffect(() => {
    localStorage.setItem('token', token || '')
  }, [token])

  const onLogin = (tok, usr) => {
    setToken(tok)
    setUser(usr)
    localStorage.setItem('token', tok)
    localStorage.setItem('user', JSON.stringify(usr))
    setRoute('tasks')
  }

  const onLogout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setRoute('login')
  }

  const navigateTo = (routeName) => {
    setRoute(routeName)
    if (routeName === 'tasks') {
      setViewTaskId(null)
      setEditTaskId(null)
    }
    if (routeName === 'create') {
      setEditTaskId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header className="bg-white border-b border-[#E8E8E8]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-[#2D2D2D]">KartavyaBook</h1>
          </div>

          <nav className="flex items-center gap-1">
            {token ? (
              <>
                <button
                  onClick={() => navigateTo('tasks')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    route === 'tasks'
                      ? 'bg-[#5A67D8] text-white'
                      : 'text-[#666666] hover:bg-[#F2F2F7]'
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => navigateTo('create')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    route === 'create'
                      ? 'bg-[#5A67D8] text-white'
                      : 'text-[#666666] hover:bg-[#F2F2F7]'
                  }`}
                >
                  Create
                </button>
                {user && user.isAdmin && (
                  <button
                    onClick={() => navigateTo('users')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      route === 'users'
                        ? 'bg-[#5A67D8] text-white'
                        : 'text-[#666666] hover:bg-[#F2F2F7]'
                    }`}
                  >
                    Users
                  </button>
                )}
                <div className="w-px h-6 bg-[#E8E8E8] mx-3"></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F2F2F7] rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-[#5A67D8]">
                      {user ? user.name.charAt(0).toUpperCase() : ''}
                    </span>
                  </div>
                  <span className="text-sm text-[#2D2D2D] font-medium">
                    {user ? user.name : ''}
                  </span>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 text-sm font-medium text-[#E05353] hover:bg-red-50 rounded-lg transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigateTo('login')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    route === 'login'
                      ? 'bg-[#5A67D8] text-white'
                      : 'text-[#666666] hover:bg-[#F2F2F7]'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => navigateTo('register')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    route === 'register'
                      ? 'bg-[#5A67D8] text-white'
                      : 'text-[#666666] hover:bg-[#F2F2F7]'
                  }`}
                >
                  Register
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
        {!token && route === 'login' && (
          <Login onLogin={onLogin} onSwitch={() => navigateTo('register')} />
        )}
        {!token && route === 'register' && (
          <Register onLogin={onLogin} onSwitch={() => navigateTo('login')} />
        )}

        {token && route === 'tasks' && (
          <TaskList
            token={token}
            onEdit={(id) => {
              setEditTaskId(id)
              setRoute('edit')
            }}
            onView={(id) => {
              setViewTaskId(id)
              setRoute('view')
            }}
          />
        )}

        {token && (route === 'create' || route === 'edit') && (
          <TaskForm
            token={token}
            taskId={editTaskId}
            onSaved={() => setRoute('tasks')}
          />
        )}

        {token && route === 'view' && viewTaskId && (
          <TaskDetails
            token={token}
            taskId={viewTaskId}
            onBack={() => setRoute('tasks')}
            onEdit={(id) => {
              setEditTaskId(id)
              setRoute('edit')
            }}
          />
        )}

        {token && route === 'users' && <Users token={token} />}
      </main>

      <footer className="border-t border-[#E8E8E8] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <p className="text-center text-sm text-[#9A9A9A]">KartavyaBook</p>
        </div>
      </footer>
    </div>
  )
}