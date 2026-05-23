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

```
src/
├── App.js                  # Rotas principais da app
├── AppScreens.js           # Navegação interna (dentro do SmartphoneFrame)
├── SignInPage.js           # Ecrã de autenticação (Clerk)
├── index.js                # Ponto de entrada — ClerkProvider
├── screens/
│   ├── HomeScreen.js       # Ecrã principal: gerador de progressões
│   └── LibraryScreen.js    # Ecrã de biblioteca: progressões guardadas
└── components/
    └── SmartphoneFrame.js  # Componente que simula a moldura do telemóvel
```

---

## 🚀 Como correr localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- npm (incluído com o Node.js)

### Instalação (Arch Linux)

```bash
sudo pacman -S nodejs npm
```

### Passos

```bash
# 1. Clonar / extrair o projeto
unzip IHC_Proj_P2_53394_55019_55047.zip
cd genjazzui

# 2. Instalar dependências
npm install

# 3. Instalar dependências adicionais (se necessário)
npm install @clerk/clerk-react react-router-dom

# 4. Iniciar a app
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

*(A preencher conforme o enunciado — indicar quais ferramentas de IA foram usadas, de que forma e em que partes do desenvolvimento)*

---

## 📝 Alterações ao protótipo (Parte 1)

*(A preencher — indicar as alterações efetuadas ao protótipo Figma e justificá-las)*

---

## 📦 Entrega

Ficheiro: `IHC_Proj_P2_53394_55019_55047.zip`
Prazo: **31 de maio de 2026, 23:59**
