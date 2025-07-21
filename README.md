# Aplicativo de Formulário de Recém-Nascidos

## Descrição
Aplicativo web para registro e análise de indicadores de aleitamento materno em recém-nascidos, baseado no formulário hospitalar fornecido.

## Funcionalidades

### 📝 Formulário de Cadastro
- Campos básicos: Data, Nome do Bebê, Gênero, Tipo de Termo
- Checkboxes para todos os indicadores de aleitamento materno
- Checkboxes para situação da mãe
- Validação de campos obrigatórios
- Salvamento automático no localStorage

### 📊 Dashboard com Gráficos
- Estatísticas gerais (Total de registros, Aleitamento exclusivo, Uso de fórmula)
- Gráfico de barras para indicadores de aleitamento
- Gráficos de pizza para distribuição por gênero e tipo de termo
- Filtros por data, gênero e tipo de termo
- Tooltips interativos mostrando nomes dos bebês

### 🔍 Pesquisa de Registros
- Busca por nome do bebê
- Exibição da ficha completa do registro
- Interface visual com indicadores coloridos

### 📤 Exportação/Importação
- Exportação para CSV
- Exportação para Excel (.xlsx)
- Importação de dados de arquivos Excel/CSV
- Preservação da estrutura de dados

## Tecnologias Utilizadas
- **React 19** - Framework principal
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos interativos
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas
- **uuid** - Geração de IDs únicos
- **xlsx** - Manipulação de arquivos Excel

## Como Executar

### Pré-requisitos
- Node.js 18+
- pnpm (ou npm/yarn)

### Instalação
```bash
# Clonar o projeto
cd app-recem-nascidos

# Instalar dependências
pnpm install

# Executar em modo desenvolvimento
pnpm run dev

# Acessar no navegador
http://localhost:5173
```

### Build para Produção
```bash
pnpm run build
```

## Estrutura do Projeto
```
src/
├── components/
│   ├── FormularioRN.jsx    # Formulário de cadastro
│   ├── Dashboard.jsx       # Dashboard com gráficos
│   └── Pesquisa.jsx       # Funcionalidade de pesquisa
├── App.jsx                # Componente principal
├── App.css               # Estilos globais
└── main.jsx              # Ponto de entrada
```

## Estrutura de Dados
Cada registro de recém-nascido contém:
- **Dados básicos**: ID, data, nome, gênero, tipo de termo
- **Indicadores de aleitamento**: 14 campos boolean
- **Situação da mãe**: 9 campos boolean

## Persistência
Os dados são armazenados no localStorage do navegador, simulando um banco de dados local. Para uso em produção, recomenda-se integrar com um banco de dados real.

## Funcionalidades Futuras
- Autenticação de usuários
- Backup automático na nuvem
- Relatórios PDF
- Gráficos de tendência temporal
- Notificações e lembretes

## Autor
Desenvolvido para auxiliar profissionais de saúde no acompanhamento de indicadores de aleitamento materno.

