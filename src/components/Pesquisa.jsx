import { useState, useEffect } from 'react'
import { Search, User, Calendar, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Pesquisa = () => {
  const [registros, setRegistros] = useState([])
  const [termoPesquisa, setTermoPesquisa] = useState('')
  const [resultados, setResultados] = useState([])
  const [registroSelecionado, setRegistroSelecionado] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('registros_rn') || '[]')
    setRegistros(dados)
  }, [])

  useEffect(() => {
    if (termoPesquisa.trim() === '') {
      setResultados([])
      return
    }

    const resultadosFiltrados = registros.filter(registro =>
      registro.nome_bebe.toLowerCase().includes(termoPesquisa.toLowerCase())
    )
    setResultados(resultadosFiltrados)
  }, [termoPesquisa, registros])

  const handlePesquisa = (e) => {
    setTermoPesquisa(e.target.value)
  }

  const selecionarRegistro = (registro) => {
    setRegistroSelecionado(registro)
  }

  const formatarData = (data) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
  }

  const formatarTipoTermo = (tipo) => {
    const tipos = {
      'pre_termo': 'Pré termo',
      'a_termo': 'A termo',
      'pos_termo': 'Pós termo'
    }
    return tipos[tipo] || tipo
  }

  const formatarGenero = (genero) => {
    const generos = {
      'masculino': 'Masculino',
      'feminino': 'Feminino',
      'outro': 'Outro'
    }
    return generos[genero] || genero
  }

  const indicadoresAleitamento = [
    { key: 'amamentado_diretamente_seio', label: 'Amamentado diretamente pelo seio materno' },
    { key: 'amamentado_leite_sonda_dedo', label: 'Amamentado com leite materno por sonda-dedo' },
    { key: 'amamentado_leite_mamadeira', label: 'Amamentado com leite materno através de mamadeira' },
    { key: 'amamentado_leite_copinho', label: 'Amamentado com leite materno através de copinho' },
    { key: 'em_relactacao', label: 'Em relactação' },
    { key: 'em_livre_demanda', label: 'Em livre demanda' },
    { key: 'aleitamento_exclusivo', label: 'Em aleitamento materno exclusivo' },
    { key: 'aleitamento_predominante', label: 'Em aleitamento materno predominante' },
    { key: 'aleitamento_parcial', label: 'Em aleitamento materno parcial' },
    { key: 'uso_formula', label: 'Em uso de fórmula' },
    { key: 'uso_formula_sonda_dedo', label: 'Em uso de fórmula por sonda-dedo' },
    { key: 'uso_formula_mamadeira', label: 'Em uso de fórmula através de mamadeira' },
    { key: 'uso_formula_copinho', label: 'Em uso de fórmula através de copinho' },
    { key: 'em_translactacao', label: 'Em translactação' },
  ]

  const indicadoresMae = [
    { key: 'mae_amamentando_sem_intercorrencias', label: 'Conseguindo amamentar sem intercorrências' },
    { key: 'mae_amamentando_com_dor', label: 'Conseguindo amamentar com dor' },
    { key: 'mae_nao_conseguindo_amamentar', label: 'Não está conseguindo amamentar' },
    { key: 'mae_impossibilitada_amamentar', label: 'Impossibilitada de amamentar' },
    { key: 'mae_fissura_mamilar', label: 'Apresenta fissura mamilar' },
    { key: 'mae_ingurgitamento_mamario', label: 'Apresenta ingurgitamento mamário' },
    { key: 'mae_mastite', label: 'Apresenta mastite' },
    { key: 'mae_outra_alteracao_mama', label: 'Apresenta outra alteração na mama' },
    { key: 'mae_nao_deseja_amamentar', label: 'Não apresenta desejo em amamentar' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Pesquisa de Registros</h2>

      {/* Campo de pesquisa */}
      <div className="bg-card rounded-lg shadow p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Digite o nome do bebê para pesquisar..."
            value={termoPesquisa}
            onChange={handlePesquisa}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-lg"
          />
        </div>
      </div>

      {/* Resultados da pesquisa */}
      {termoPesquisa && (
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Resultados da Pesquisa ({resultados.length})
          </h3>
          {resultados.length === 0 ? (
            <p className="text-muted-foreground">Nenhum registro encontrado.</p>
          ) : (
            <div className="space-y-3">
              {resultados.map((registro) => (
                <div
                  key={registro.id}
                  className="border border-border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => selecionarRegistro(registro)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-semibold text-foreground">{registro.nome_bebe}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatarGenero(registro.genero)} • {formatarTipoTermo(registro.tipo_termo)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatarData(registro.data_cadastro)}
                    </div>
                    {/* Botões de ação */}
                    <div className="flex gap-2 ml-4">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/editar/${registro.id}`)
                        }}
                      >Editar</button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={e => {
                          e.stopPropagation();
                          if (window.confirm('Tem certeza que deseja deletar este registro?')) {
                            const novosRegistros = registros.filter(r => r.id !== registro.id)
                            localStorage.setItem('registros_rn', JSON.stringify(novosRegistros))
                            setRegistros(novosRegistros)
                            setResultados(resultados.filter(r => r.id !== registro.id))
                            if (registroSelecionado && registroSelecionado.id === registro.id) {
                              setRegistroSelecionado(null)
                            }
                          }
                        }}
                      >Deletar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ficha detalhada */}
      {registroSelecionado && (
        <div className="bg-card rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Ficha Completa</h3>
          </div>

          {/* Dados básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-accent rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Nome do Bebê</h4>
              <p className="text-lg">{registroSelecionado.nome_bebe}</p>
            </div>
            <div className="bg-accent rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Data de Cadastro</h4>
              <p className="text-lg">{formatarData(registroSelecionado.data_cadastro)}</p>
            </div>
            <div className="bg-accent rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Gênero</h4>
              <p className="text-lg">{formatarGenero(registroSelecionado.genero)}</p>
            </div>
            <div className="bg-accent rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Tipo de Termo</h4>
              <p className="text-lg">{formatarTipoTermo(registroSelecionado.tipo_termo)}</p>
            </div>
          </div>

          {/* Indicadores de aleitamento */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-foreground mb-4">Indicadores de Aleitamento</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {indicadoresAleitamento.map((indicador) => (
                <div
                  key={indicador.key}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    registroSelecionado[indicador.key] 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${
                    registroSelecionado[indicador.key] ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <span className="text-sm">{indicador.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Situação da mãe */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Situação da Mãe</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {indicadoresMae.map((indicador) => (
                <div
                  key={indicador.key}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    registroSelecionado[indicador.key] 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${
                    registroSelecionado[indicador.key] ? 'bg-blue-500' : 'bg-gray-400'
                  }`} />
                  <span className="text-sm">{indicador.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pesquisa

