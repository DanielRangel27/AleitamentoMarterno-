import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Baby, BarChart3, Search, FileText, LogOut } from 'lucide-react'
import { AuthProvider, useAuth } from './context/AuthContext'
import FormularioRN from './components/FormularioRN'
import Dashboard from './components/Dashboard'
import Pesquisa from './components/Pesquisa'
import EditarFormularioRN from './components/EditarFormularioRN'
import Login from './components/Login'
import './App.css'

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showLogin, setShowLogin] = useState(false)
  const { isAuthenticated, user, logout, loading } = useAuth()

  // Fechar tela de login quando o usuário se autenticar
  useEffect(() => {
    if (isAuthenticated && showLogin) {
      setShowLogin(false)
    }
  }, [isAuthenticated, showLogin])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Baby className="h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (showLogin) {
    return <Login />
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-primary text-primary-foreground shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Baby className="h-8 w-8" />
              Sistema de Aleitamento Materno
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Dashboard 
            showLoginButton={true} 
            onLoginClick={() => setShowLogin(true)} 
          />
        </main>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-primary text-primary-foreground shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Baby className="h-8 w-8" />
                Sistema de Aleitamento Materno
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-sm">Olá, {user?.name}</span>
                <button
                  onClick={logout}
                  className="bg-primary-foreground text-primary px-3 py-1 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-secondary border-b">
          <div className="container mx-auto px-4">
            <div className="flex space-x-8">
              <Link
                to="/"
                className={`flex items-center gap-2 px-3 py-4 text-sm font-medium transition-colors hover:text-primary ${
                  activeTab === 'formulario' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                }`}
                onClick={() => setActiveTab('formulario')}
              >
                <FileText className="h-4 w-4" />
                Formulário
              </Link>
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-3 py-4 text-sm font-medium transition-colors hover:text-primary ${
                  activeTab === 'dashboard' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                }`}
                onClick={() => setActiveTab('dashboard')}
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/pesquisa"
                className={`flex items-center gap-2 px-3 py-4 text-sm font-medium transition-colors hover:text-primary ${
                  activeTab === 'pesquisa' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                }`}
                onClick={() => setActiveTab('pesquisa')}
              >
                <Search className="h-4 w-4" />
                Pesquisa
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<FormularioRN />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pesquisa" element={<Pesquisa />} />
            <Route path="/editar/:id" element={<EditarFormularioRN />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

