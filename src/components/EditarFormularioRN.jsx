import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { Save, Calendar, User, Users } from 'lucide-react'

const EditarFormularioRN = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const registros = JSON.parse(localStorage.getItem('registros_rn') || '[]')
    const registro = registros.find(r => r.id === id)
    if (registro) {
      setFormData(registro)
    }
    setCarregando(false)
  }, [id])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.nome_bebe.trim()) {
      alert('Por favor, informe o nome do bebê.')
      return
    }
    if (!formData.genero) {
      alert('Por favor, selecione o gênero.')
      return
    }
    if (!formData.tipo_termo) {
      alert('Por favor, selecione o tipo de termo.')
      return
    }
    // Atualizar registro no localStorage
    const registros = JSON.parse(localStorage.getItem('registros_rn') || '[]')
    const novosRegistros = registros.map(r => r.id === id ? formData : r)
    localStorage.setItem('registros_rn', JSON.stringify(novosRegistros))
    alert('Registro atualizado com sucesso!')
    navigate('/pesquisa')
  }

  const CheckboxGroup = ({ title, items }) => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => (
          <label key={item.name} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name={item.name}
              checked={!!formData[item.name]}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="text-sm text-foreground">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  )

  const aleitamentoItems = [
    { name: 'amamentado_diretamente_seio', label: 'RN está sendo amamentado diretamente pelo seio materno' },
    { name: 'amamentado_leite_sonda_dedo', label: 'RN está sendo amamentado com leite materno por sonda-dedo' },
    { name: 'amamentado_leite_mamadeira', label: 'RN está sendo amamentado com leite materno através de mamadeira' },
    { name: 'amamentado_leite_copinho', label: 'RN está sendo amamentado com leite materno através de copinho' },
    { name: 'em_relactacao', label: 'RN está em relactação' },
    { name: 'em_livre_demanda', label: 'RN está em livre demanda' },
    { name: 'aleitamento_exclusivo', label: 'RN está em aleitamento materno exclusivo' },
    { name: 'aleitamento_predominante', label: 'RN está em aleitamento materno predominante' },
    { name: 'aleitamento_parcial', label: 'RN está em aleitamento materno parcial' },
    { name: 'uso_formula', label: 'RN está em uso de fórmula' },
    { name: 'uso_formula_sonda_dedo', label: 'RN está em uso de fórmula por sonda-dedo' },
    { name: 'uso_formula_mamadeira', label: 'RN está em uso de fórmula através de mamadeira' },
    { name: 'uso_formula_copinho', label: 'RN está em uso de fórmula através de copinho' },
    { name: 'em_translactacao', label: 'RN está em translactação' },
  ]

  const maeItems = [
    { name: 'mae_amamentando_sem_intercorrencias', label: 'Mãe está conseguindo amamentar sem intercorrências' },
    { name: 'mae_amamentando_com_dor', label: 'Mãe está conseguindo amamentar com dor' },
    { name: 'mae_nao_conseguindo_amamentar', label: 'Mãe não está conseguindo amamentar' },
    { name: 'mae_impossibilitada_amamentar', label: 'Mãe está impossibilitada de amamentar' },
    { name: 'mae_fissura_mamilar', label: 'Mãe apresenta fissura mamilar' },
    { name: 'mae_ingurgitamento_mamario', label: 'Mãe apresenta ingurgitamento mamário' },
    { name: 'mae_mastite', label: 'Mãe apresenta mastite' },
    { name: 'mae_outra_alteracao_mama', label: 'Mãe apresenta outra alteração na mama' },
    { name: 'mae_nao_deseja_amamentar', label: 'Mãe não apresenta desejo em amamentar' },
  ]

  if (carregando) return <div>Carregando...</div>
  if (!formData) return <div>Registro não encontrado.</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Editar Indicadores de Aleitamento Materno
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dados básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Data
              </label>
              <input
                type="date"
                name="data_cadastro"
                value={formData.data_cadastro}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Nome do Bebê
              </label>
              <input
                type="text"
                name="nome_bebe"
                value={formData.nome_bebe}
                onChange={handleInputChange}
                placeholder="Digite o nome do bebê"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Users className="h-4 w-4 inline mr-1" />
                Gênero
              </label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Idade Gestacional
              </label>
              <select
                name="tipo_termo"
                value={formData.tipo_termo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Selecione</option>
                <option value="pre_termo">Pré termo</option>
                <option value="a_termo">A termo</option>
                <option value="pos_termo">Pós termo</option>
              </select>
            </div>
          </div>
          {/* Checkboxes de aleitamento */}
          <CheckboxGroup title="Indicadores de Aleitamento" items={aleitamentoItems} />
          {/* Checkboxes da mãe */}
          <CheckboxGroup title="Situação da Mãe" items={maeItems} />
          {/* Botão de envio */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
            >
              <Save className="h-4 w-4" />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditarFormularioRN 