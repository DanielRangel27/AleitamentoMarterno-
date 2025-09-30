import { useState, useEffect, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, Filter, Calendar, Users, Upload, LogIn } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';
import { useAuth } from '../context/AuthContext';

// Hook para detectar se é dispositivo móvel
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

const Dashboard = ({ showLoginButton = false, onLoginClick }) => {
  const [registros, setRegistros] = useState([]);
  const fileInputRef = useRef(null);
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    genero: '',
    tipoTermo: '',
  });
  
  const auth = useAuth && useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('registros_rn') || '[]');
    setRegistros(dados);
  }, []);

  const registrosFiltrados = registros.filter((registro) => {
    let incluir = true;

    if (filtros.dataInicio && registro.data_cadastro < filtros.dataInicio) {
      incluir = false;
    }
    if (filtros.dataFim && registro.data_cadastro > filtros.dataFim) {
      incluir = false;
    }
    if (filtros.genero && registro.genero !== filtros.genero) {
      incluir = false;
    }
    if (filtros.tipoTermo && registro.tipo_termo !== filtros.tipoTermo) {
      incluir = false;
    }

    return incluir;
  });

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const exportarExcel = () => {
    if (registrosFiltrados.length === 0) {
      alert('Nenhum registro para exportar.');
      return;
    }

    const dadosParaExportar = registrosFiltrados.map((registro) => ({
      ID: registro.id,
      Data: registro.data_cadastro,
      Gênero: registro.genero,
      'Tipo de Termo': registro.tipo_termo,
      'Amamentado Diretamente Seio': registro.amamentado_diretamente_seio
        ? 'Sim'
        : 'Não',
      'Amamentado Leite Sonda-Dedo': registro.amamentado_leite_sonda_dedo
        ? 'Sim'
        : 'Não',
      'Amamentado Leite Mamadeira': registro.amamentado_leite_mamadeira
        ? 'Sim'
        : 'Não',
      'Amamentado Leite Copinho': registro.amamentado_leite_copinho
        ? 'Sim'
        : 'Não',
      'Em Relactação': registro.em_relactacao ? 'Sim' : 'Não',
      'Em Livre Demanda': registro.em_livre_demanda ? 'Sim' : 'Não',
      'Aleitamento Exclusivo': registro.aleitamento_exclusivo ? 'Sim' : 'Não',
      'Aleitamento Predominante': registro.aleitamento_predominante
        ? 'Sim'
        : 'Não',
      'Aleitamento Parcial': registro.aleitamento_parcial ? 'Sim' : 'Não',
      'Uso Fórmula': registro.uso_formula ? 'Sim' : 'Não',
      'Uso Fórmula Sonda-Dedo': registro.uso_formula_sonda_dedo ? 'Sim' : 'Não',
      'Uso Fórmula Mamadeira': registro.uso_formula_mamadeira ? 'Sim' : 'Não',
      'Uso Fórmula Copinho': registro.uso_formula_copinho ? 'Sim' : 'Não',
      'Em Translactação': registro.em_translactacao ? 'Sim' : 'Não',
      'Mãe Amamentando Sem Intercorrências':
        registro.mae_amamentando_sem_intercorrencias ? 'Sim' : 'Não',
      'Mãe Amamentando Com Dor': registro.mae_amamentando_com_dor
        ? 'Sim'
        : 'Não',
      'Mãe Não Conseguindo Amamentar': registro.mae_nao_conseguindo_amamentar
        ? 'Sim'
        : 'Não',
      'Mãe Impossibilitada Amamentar': registro.mae_impossibilitada_amamentar
        ? 'Sim'
        : 'Não',
      'Mãe Fissura Mamilar': registro.mae_fissura_mamilar ? 'Sim' : 'Não',
      'Mãe Ingurgitamento Mamário': registro.mae_ingurgitamento_mamario
        ? 'Sim'
        : 'Não',
      'Mãe Mastite': registro.mae_mastite ? 'Sim' : 'Não',
      'Mãe Outra Alteração Mama': registro.mae_outra_alteracao_mama
        ? 'Sim'
        : 'Não',
      'Mãe Não Deseja Amamentar': registro.mae_nao_deseja_amamentar
        ? 'Sim'
        : 'Não',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dadosParaExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registros RN');

    const fileName = `registros_rn_${
      new Date().toISOString().split('T')[0]
    }.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const importarDados = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Converter dados importados para o formato do aplicativo
        const registrosImportados = jsonData.map((row) => ({
          id: row['ID'] || uuidv4(),
          data_cadastro: row['Data'] || new Date().toISOString().split('T')[0],
          genero: row['Gênero'] || '',
          tipo_termo: row['Tipo de Termo'] || '',
          amamentado_diretamente_seio:
            row['Amamentado Diretamente Seio'] === 'Sim',
          amamentado_leite_sonda_dedo:
            row['Amamentado Leite Sonda-Dedo'] === 'Sim',
          amamentado_leite_mamadeira:
            row['Amamentado Leite Mamadeira'] === 'Sim',
          amamentado_leite_copinho: row['Amamentado Leite Copinho'] === 'Sim',
          em_relactacao: row['Em Relactação'] === 'Sim',
          em_livre_demanda: row['Em Livre Demanda'] === 'Sim',
          aleitamento_exclusivo: row['Aleitamento Exclusivo'] === 'Sim',
          aleitamento_predominante: row['Aleitamento Predominante'] === 'Sim',
          aleitamento_parcial: row['Aleitamento Parcial'] === 'Sim',
          uso_formula: row['Uso Fórmula'] === 'Sim',
          uso_formula_sonda_dedo: row['Uso Fórmula Sonda-Dedo'] === 'Sim',
          uso_formula_mamadeira: row['Uso Fórmula Mamadeira'] === 'Sim',
          uso_formula_copinho: row['Uso Fórmula Copinho'] === 'Sim',
          em_translactacao: row['Em Translactação'] === 'Sim',
          mae_amamentando_sem_intercorrencias:
            row['Mãe Amamentando Sem Intercorrências'] === 'Sim',
          mae_amamentando_com_dor: row['Mãe Amamentando Com Dor'] === 'Sim',
          mae_nao_conseguindo_amamentar:
            row['Mãe Não Conseguindo Amamentar'] === 'Sim',
          mae_impossibilitada_amamentar:
            row['Mãe Impossibilitada Amamentar'] === 'Sim',
          mae_fissura_mamilar: row['Mãe Fissura Mamilar'] === 'Sim',
          mae_ingurgitamento_mamario:
            row['Mãe Ingurgitamento Mamário'] === 'Sim',
          mae_mastite: row['Mãe Mastite'] === 'Sim',
          mae_outra_alteracao_mama: row['Mãe Outra Alteração Mama'] === 'Sim',
          mae_nao_deseja_amamentar: row['Mãe Não Deseja Amamentar'] === 'Sim',
        }));

        // Mesclar com dados existentes
        const registrosExistentes = JSON.parse(
          localStorage.getItem('registros_rn') || '[]',
        );
        const todosRegistros = [...registrosExistentes, ...registrosImportados];
        localStorage.setItem('registros_rn', JSON.stringify(todosRegistros));
        setRegistros(todosRegistros);

        alert(
          `${registrosImportados.length} registros importados com sucesso!`,
        );

        // Limpar input
        event.target.value = '';
      } catch (error) {
        alert('Erro ao importar arquivo. Verifique se o formato está correto.');
        console.error('Erro na importação:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const exportarCSV = () => {
    if (registrosFiltrados.length === 0) {
      alert('Nenhum registro para exportar.');
      return;
    }

    const headers = [
      'ID',
      'Data',
      'Gênero',
      'Tipo de Termo',
      'Amamentado Diretamente Seio',
      'Amamentado Leite Sonda-Dedo',
      'Amamentado Leite Mamadeira',
      'Amamentado Leite Copinho',
      'Em Relactação',
      'Em Livre Demanda',
      'Aleitamento Exclusivo',
      'Aleitamento Predominante',
      'Aleitamento Parcial',
      'Uso Fórmula',
      'Uso Fórmula Sonda-Dedo',
      'Uso Fórmula Mamadeira',
      'Uso Fórmula Copinho',
      'Em Translactação',
      'Mãe Amamentando Sem Intercorrências',
      'Mãe Amamentando Com Dor',
      'Mãe Não Conseguindo Amamentar',
      'Mãe Impossibilitada Amamentar',
      'Mãe Fissura Mamilar',
      'Mãe Ingurgitamento Mamário',
      'Mãe Mastite',
      'Mãe Outra Alteração Mama',
      'Mãe Não Deseja Amamentar',
    ];

    const csvContent = [
      headers.join(','),
      ...registrosFiltrados.map((registro) =>
        [
          registro.id,
          registro.data_cadastro,
          registro.genero,
          registro.tipo_termo,
          registro.amamentado_diretamente_seio ? 'Sim' : 'Não',
          registro.amamentado_leite_sonda_dedo ? 'Sim' : 'Não',
          registro.amamentado_leite_mamadeira ? 'Sim' : 'Não',
          registro.amamentado_leite_copinho ? 'Sim' : 'Não',
          registro.em_relactacao ? 'Sim' : 'Não',
          registro.em_livre_demanda ? 'Sim' : 'Não',
          registro.aleitamento_exclusivo ? 'Sim' : 'Não',
          registro.aleitamento_predominante ? 'Sim' : 'Não',
          registro.aleitamento_parcial ? 'Sim' : 'Não',
          registro.uso_formula ? 'Sim' : 'Não',
          registro.uso_formula_sonda_dedo ? 'Sim' : 'Não',
          registro.uso_formula_mamadeira ? 'Sim' : 'Não',
          registro.uso_formula_copinho ? 'Sim' : 'Não',
          registro.em_translactacao ? 'Sim' : 'Não',
          registro.mae_amamentando_sem_intercorrencias ? 'Sim' : 'Não',
          registro.mae_amamentando_com_dor ? 'Sim' : 'Não',
          registro.mae_nao_conseguindo_amamentar ? 'Sim' : 'Não',
          registro.mae_impossibilitada_amamentar ? 'Sim' : 'Não',
          registro.mae_fissura_mamilar ? 'Sim' : 'Não',
          registro.mae_ingurgitamento_mamario ? 'Sim' : 'Não',
          registro.mae_mastite ? 'Sim' : 'Não',
          registro.mae_outra_alteracao_mama ? 'Sim' : 'Não',
          registro.mae_nao_deseja_amamentar ? 'Sim' : 'Não',
        ].join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `registros_rn_${new Date().toISOString().split('T')[0]}.csv`,
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dados para gráficos
  const indicadoresAleitamento = [
    { key: 'amamentado_diretamente_seio', nome: 'Amamentação Direta' },
    { key: 'amamentado_leite_sonda_dedo', nome: 'Leite Finger Feeding' },
    { key: 'amamentado_leite_mamadeira', nome: 'Leite Mamadeira' },
    { key: 'amamentado_leite_copinho', nome: 'Leite Copinho' },
    { key: 'em_relactacao', nome: 'Relactação' },
    { key: 'em_livre_demanda', nome: 'Livre Demanda' },
    { key: 'aleitamento_exclusivo', nome: 'Aleit. Exclusivo' },
    { key: 'aleitamento_predominante', nome: 'Aleit. Predominante' },
    { key: 'aleitamento_parcial', nome: 'Aleit. Parcial' },
    { key: 'uso_formula', nome: 'Uso de Fórmula' },
    { key: 'uso_formula_sonda_dedo', nome: 'Fórmula Finger Feeding' },
    { key: 'uso_formula_mamadeira', nome: 'Fórmula Mamadeira' },
    { key: 'uso_formula_copinho', nome: 'Fórmula Copinho' },
    { key: 'em_translactacao', nome: 'Translactação' },
  ];

  const dadosAleitamento = indicadoresAleitamento.map((indicador) => ({
    nome: indicador.nome,
    quantidade: registrosFiltrados.filter((r) => r[indicador.key]).length,
  }));

  const dadosGenero = [
    {
      nome: 'Masculino',
      quantidade: registrosFiltrados.filter((r) => r.genero === 'masculino')
        .length,
      cor: '#8884d8',
    },
    {
      nome: 'Feminino',
      quantidade: registrosFiltrados.filter((r) => r.genero === 'feminino')
        .length,
      cor: '#82ca9d',
    },
    {
      nome: 'Outro',
      quantidade: registrosFiltrados.filter((r) => r.genero === 'outro').length,
      cor: '#ffc658',
    },
  ];

  const dadosTermo = [
    {
      nome: 'Pré termo',
      quantidade: registrosFiltrados.filter((r) => r.tipo_termo === 'pre_termo')
        .length,
      cor: '#ff7300',
    },
    {
      nome: 'A termo',
      quantidade: registrosFiltrados.filter((r) => r.tipo_termo === 'a_termo')
        .length,
      cor: '#00ff00',
    },
    {
      nome: 'Pós termo',
      quantidade: registrosFiltrados.filter((r) => r.tipo_termo === 'pos_termo')
        .length,
      cor: '#ff0000',
    },
  ];

  const indicadoresMae = [
    { key: 'mae_amamentando_sem_intercorrencias', nome: 'Sem Intercorrências' },
    { key: 'mae_amamentando_com_dor', nome: 'Com Dor' },
    { key: 'mae_nao_conseguindo_amamentar', nome: 'Não Consegue Amamentar' },
    { key: 'mae_impossibilitada_amamentar', nome: 'Impossibilitada' },
    { key: 'mae_fissura_mamilar', nome: 'Fissura Mamilar' },
    { key: 'mae_ingurgitamento_mamario', nome: 'Ingurgitamento' },
    { key: 'mae_mastite', nome: 'Mastite' },
    { key: 'mae_outra_alteracao_mama', nome: 'Outras Alterações' },
    { key: 'mae_nao_deseja_amamentar', nome: 'Não Deseja Amamentar' },
  ];

  const dadosMae = indicadoresMae.map((indicador) => ({
    nome: indicador.nome,
    quantidade: registrosFiltrados.filter((r) => r[indicador.key]).length,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-primary">Quantidade: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <div className="flex gap-2">
          {showLoginButton ? (
            <button
              onClick={onLoginClick}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Fazer Login
            </button>
          ) : (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={importarDados}
                accept=".xlsx,.xls,.csv"
                style={{ display: 'none' }}
              />
              <button
                onClick={exportarExcel}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Excel
              </button>
              <button
                onClick={exportarCSV}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                CSV
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </h3>
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Data Início
            </label>
            <input
              type="date"
              name="dataInicio"
              value={filtros.dataInicio}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Data Fim
            </label>
            <input
              type="date"
              name="dataFim"
              value={filtros.dataFim}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Users className="h-4 w-4 inline mr-1" />
              Gênero
            </label>
            <select
              name="genero"
              value={filtros.genero}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todos</option>
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
              name="tipoTermo"
              value={filtros.tipoTermo}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todos</option>
              <option value="pre_termo">Pré termo</option>
              <option value="a_termo">A termo</option>
              <option value="pos_termo">Pós termo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Total de Registros
          </h3>
          <p className="text-3xl font-bold text-primary">
            {registrosFiltrados.length}
          </p>
        </div>
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Aleitamento Exclusivo
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {registrosFiltrados.filter((r) => r.aleitamento_exclusivo).length}
          </p>
        </div>
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Uso de Fórmula
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {registrosFiltrados.filter((r) => r.uso_formula).length}
          </p>
        </div>
      </div>

      {/* Gráfico principal de Aleitamento */}
      <div className="bg-card rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Indicadores de Aleitamento
        </h3>
        <ResponsiveContainer width="100%" height={isMobile ? 400 : 350}>
          <BarChart 
            data={dadosAleitamento} 
            layout="horizontal"
            margin={isMobile ? { top: 10, right: 30, left: 30, bottom: 120 } : { top: 10, right: 30, left: 30, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="nome"
              angle={isMobile ? -90 : -35}
              textAnchor="end"
              interval={0}
              height={isMobile ? 115 : 75}
              tick={{ fontSize: isMobile ? 10 : 12 }}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="quantidade" 
              fill="#8884d8"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Indicadores da Mãe */}
      <div className="bg-card rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Indicadores da Mãe
        </h3>
        <ResponsiveContainer width="100%" height={isMobile ? 400 : 350}>
          <BarChart 
            data={dadosMae} 
            layout="horizontal"
            margin={isMobile ? { top: 10, right: 30, left: 30, bottom: 120 } : { top: 10, right: 30, left: 30, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="nome"
              angle={isMobile ? -90 : -35}
              textAnchor="end"
              interval={0}
              height={isMobile ? 115 : 75}
              tick={{ fontSize: isMobile ? 10 : 12 }}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="quantidade" 
              fill="#82ca9d"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráficos de distribuição por gênero e tipo de termo */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Distribuição por Gênero
          </h3>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <PieChart>
              <Pie
                data={dadosGenero}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nome, quantidade }) => `${nome}: ${quantidade}`}
                outerRadius={isMobile ? 60 : 80}
                fill="#8884d8"
                dataKey="quantidade"
              >
                {dadosGenero.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Distribuição por Idade Gestacional
          </h3>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <PieChart>
              <Pie
                data={dadosTermo}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nome, quantidade }) => `${nome}: ${quantidade}`}
                outerRadius={isMobile ? 60 : 80}
                fill="#8884d8"
                dataKey="quantidade"
              >
                {dadosTermo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
