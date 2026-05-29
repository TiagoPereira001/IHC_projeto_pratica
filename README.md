# 🎷 GenJazz UI

Interface mobile simulada para a aplicação **Generative Jazz** — geração automática de progressões harmónicas de jazz.

Desenvolvido no âmbito da UC **Interação Humana com o Computador** (2025/2026)
Universidade da Beira Interior — Faculdade de Engenharia, Departamento de Informática.

---

## 👥 Grupo

| Nº Aluno | Nome |
|----------|------|
| 53394    | Felipe Fogaça   |
| 55019    | Tiago Pereira   |
| 55047    | Afonso Esteves  |

---

## 🛠️ Tecnologias

- [React](https://reactjs.org/) — framework de UI
- [Clerk](https://clerk.com/) — autenticação de utilizadores
- [React Router DOM](https://reactrouter.com/) — navegação entre rotas
- [GenJazz API](https://genjazz-api.fly.dev) — backend de geração de progressões

---

## 📁 Estrutura do Projeto

A estrutura foi modularizada para separar componentes visuais da lógica de estado, garantindo um código mais limpo e escalável:

```text
genjazzui/
│
├── src/
│   │
│   ├── assets/                     # Imagens e recursos estáticos
│   │   ├── bg-jazz.png             # Fundo estilo Glassmorphism
│   │   └── Status_bar.png          # Barra de status do iOS
│   │
│   ├── components/                 # Componentes de interface reutilizáveis
│   │   ├── SmartphoneFrame.js      # Simula a moldura física do telemóvel
│   │   └── LibraryFilters.js       # Modal (Bottom Sheet) de filtragem da biblioteca
│   │
│   ├── screens/                    # Ecrãs principais da aplicação (Tabs)
│   │   ├── HomeScreen.js           # Tab Início: roda de tonalidades e geração
│   │   ├── ProgressionsScreen.js   # Tab Progressões: player e progressão atual
│   │   └── LibraryScreen.js        # Tab Biblioteca: listagem de progressões guardadas
│   │
│   ├── cores.js                    # Sistema de cores (Design System) e estilos globais
│   ├── App.js                      # Ficheiro principal e definição de rotas
│   ├── AppScreens.js               # Navegação interna (tabs dentro do SmartphoneFrame)
│   ├── SignInPage.js               # Ecrã de autenticação via Clerk
│   ├── WebserviceTest.js           # Lógica central da API e gestão de estados
│   └── index.js                    # Ponto de entrada — inicializa o ClerkProvider
│
├── package.json                    # Dependências e scripts do projeto
└── README.md                       # Documentação do projeto
```

---

## 🚀 Como correr localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- npm (incluído com o Node.js)

---

### 🐧 Linux (Arch)

**1. Instalar o Node.js**
```bash
sudo pacman -S nodejs npm
```

**2. Clonar e instalar**
```bash
git clone https://github.com/TiagoPereira001/IHC_projeto_pratica.git
cd IHC_projeto_pratica
npm install
npm install @clerk/clerk-react react-router-dom
```

**3. Correr**
```bash
npm start
```

---

### 🍎 macOS

**1. Instalar o Node.js**

Usando Homebrew (recomendado):
```bash
brew install node
```
Ou descarrega o instalador `.pkg` em [nodejs.org](https://nodejs.org/).

Verifica a instalação:
```bash
node -v
npm -v
```

**2. Clonar e instalar**
```bash
git clone https://github.com/TiagoPereira001/IHC_projeto_pratica.git
cd IHC_projeto_pratica
npm install
npm install @clerk/clerk-react react-router-dom
```

**3. Correr**
```bash
npm start
```

---

### 🪟 Windows

**1. Instalar o Node.js**

Descarrega e instala o instalador `.msi` em [nodejs.org](https://nodejs.org/).

Verifica a instalação no **Command Prompt** ou **PowerShell**:
```cmd
node -v
npm -v
```

**2. Clonar e instalar**
```cmd
git clone https://github.com/TiagoPereira001/IHC_projeto_pratica.git
cd IHC_projeto_pratica
npm install
npm install @clerk/clerk-react react-router-dom
```

**3. Correr**
```cmd
npm start
```

A app abre automaticamente em `http://localhost:3000`.

---

## 🔑 Autenticação

A autenticação é gerida pela plataforma **Clerk**.

- Fazer login com conta **Microsoft da UBI** (@ubi.pt)
- **Não** criar contas com Sign Up
- **Não** usar contas Google

---

## 🌐 API — Endpoints utilizados

Base URL: `https://genjazz-api.fly.dev`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/keys` | Lista de tonalidades disponíveis |
| GET | `/api/structures` | Lista de estruturas formais |
| GET | `/api/modulations` | Lista de tipos de modulação |
| GET | `/api/generate/:key/:structure/:modulation` | Gera progressão harmónica |
| GET | `/api/chords2mp3/:progression` | Converte progressão em MP3 |
| GET | `/audio/:filename` | Acede ao ficheiro MP3 |
| POST | `/api/chords/:email/:chords/:key/:structure/:modulation` | Guarda progressão |
| GET | `/api/chords/user/:email` | Lista progressões guardadas |
| DELETE | `/api/chords/:email/:id` | Apaga progressão guardada |

---

## 📱 Funcionalidades

- [x] Autenticação com conta institucional (Clerk + Microsoft)
- [x] Geração de progressões de jazz (tonalidade, estrutura, modulação)
- [x] Reprodução de áudio (MP3) da progressão gerada
- [x] Guardar progressões
- [x] Listar progressões guardadas
- [x] Apagar progressões guardadas
- [x] Interface mobile simulada (SmartphoneFrame 360×720px)

---

## 🤖 AI Disclaimer

1. Ferramentas de IA utilizadas:
Claude (modelo de linguagem da Anthropic).

2. De que forma essas ferramentas foram utilizadas:
A IA foi utilizada exclusivamente como assistente de apoio ao desenvolvimento. Respondendo a dúvidas, sugerindo correções e explicando conceitos. Todo o raciocínio, decisões de design, estrutura do projeto e implementação foram conduzidos pela equipa.

3. Em que partes específicas do projeto essas ferramentas tiveram intervenção:
Estrutura e navegação: A equipa pediu apoio na organização dos ecrãs e na integração com o Clerk.
Componente visual — Roda das Tonalidades: foi consultada para apoiar os cálculos matemáticos dos segmentos SVG do componente da roda das tonalidades.
Depuração: A IA foi consultada para identificar erros de sintaxe JSX e problemas de estrutura de componentes.

---

## 📝 Alterações ao protótipo (Parte 1)

## 🎨 Alterações face ao Protótipo (Figma)

Durante o desenvolvimento em React, foram feitas algumas adaptações em relação ao design inicial planeado no Figma, visando melhorar a usabilidade e a performance da aplicação:

- **Leitor de Áudio Partilhado:** Inicialmente, o reprodutor de áudio foi idealizado de forma isolada. Na implementação, optou-se por uma função `openInPlayer` que permite clicar numa música da biblioteca e transitar automaticamente o utilizador para a aba de Progressões, reaproveitando o leitor visual avançado para todas as faixas guardadas.

- **Segmented Control nos Filtros:** Para os filtros, substituiu-se o uso de caixas de seleção (checkboxes) antiquadas por um sistema de *Tabs* no topo (Segmented Control) e botões *Pill/Toggle* amplos. Isto maximiza a área tátil e oferece um aspeto muito mais natural para dispositivos *touch*.

- **Ajuste de Contrastes:** Algumas tonalidades de verde utilizadas no Figma foram ligeiramente escurecidas no código (CSS) para garantir que a tipografia a branco passa nos testes básicos de rácio de contraste (Acessibilidade W3C).

- **Simplificação da Barra Superior (*Topbar*):** O design original do protótipo contemplava uma *topbar* com um layout gráfico mais denso e rígido. Durante o desenvolvimento em React, optou-se por simplificar este componente arquitetural. Esta adaptação garantiu que a integração do botão flutuante de perfil (gerido pelo sistema Clerk) e a navegação entre secções tivessem um comportamento perfeitamente responsivo, priorizando o espaço para o conteúdo da aplicação.

- **Barra de Filtros vs. *Bottom Sheet*:** No protótipo estático do Figma, os filtros encontravam-se numa barra ou painel permanentemente exposto no ecrã da Biblioteca. Na versão final programada, essa barra fixa foi removida e substituída por um botão minimalista ("Filtros") que invoca um *Bottom Sheet Modal*. Esta alteração drástica reduz a carga cognitiva inicial (Heurística do Design Estético e Minimalista) e maximiza a área útil do ecrã (*Screen Real Estate*) para a visualização dos cartões das músicas guardadas.

---

## 📦 Entrega

Ficheiro: `IHC_Proj_P2_53394_55019_55047.zip`
Prazo: **31 de maio de 2026, 23:59**
