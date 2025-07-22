import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Baby, BarChart3, Search, FileText } from 'lucide-react'
import FormularioRN from './components/FormularioRN'
import Dashboard from './components/Dashboard'
import Pesquisa from './components/Pesquisa'
import EditarFormularioRN from './components/EditarFormularioRN'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('formulario')

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-primary text-primary-foreground shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Baby className="h-8 w-8" />
              Formulário de Recém-Nascidos
            </h1>
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

export default App

