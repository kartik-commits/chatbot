# AI Chatbot

A modern, multi-chat AI assistant built with React and TypeScript. Supports Markdown, LaTeX math, file uploads, and a sleek dark/light UI. Powered by a local AI backend.

---

## Features

- **Multi-Chat Sessions:** Create, switch, and delete chats for different topics
- **AI-Powered Responses:** Connects to an AI model for smart conversations (default: deepseek-r1-distill-qwen-7b)
- **Markdown & Math:** Renders rich Markdown and LaTeX formulas in chat
- **File Uploads:** Attach documents to each chat with validation (10MB limit, .pdf, .txt, .doc, .docx, .md)
- **Dark/Light Mode:** Toggle between beautiful dark and light themes (preference saved)
- **Animated UI:** Smooth transitions for sidebar, messages, and more
- **Error Handling:** Friendly error messages with helpful context
- **Chat History:** All chats automatically saved to browser localStorage
- **Auto-Generated Titles:** Chat titles created from first message
- **Copy Messages:** Easily copy any message to clipboard
- **Accessibility:** Full keyboard navigation and ARIA labels
- **Input Validation:** Safe input handling with 5000 character limit

---

## Getting Started

### Prerequisites

- Node.js & npm
- Local AI backend (default endpoint: `http://localhost:1234/v1/chat/completions`)

### Installation

```bash
git clone https://github.com/kartik-commits/chatbot.git
cd chatbot
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Usage

- **Start a new chat:** Click the "New Chat" button in the sidebar
- **Send messages:** Type your message and hit Enter (or click Send button)
- **Upload documents:** Click the upload button to attach files (.pdf, .txt, .doc, .docx, .md up to 10MB)
- **Copy messages:** Click the copy icon on any message to copy its content
- **Toggle theme:** Use the theme button in the header to switch between dark/light mode
- **Delete chats:** Hover over a chat in the sidebar and click the trash icon
- **Navigate with keyboard:** All interactive elements support keyboard navigation

---

## Configuration

**Backend Model:**  
Default is `deepseek-r1-distill-qwen-7b`.  
Change the model, endpoint, or parameters in `src/App.tsx` under the `payload` object.

**Styling:**  
Uses [Tailwind CSS](https://tailwindcss.com/) for rapid UI development.

**Data Persistence:**  
All chats, settings, and preferences are automatically saved to browser localStorage.

**Performance:**  
Code splitting is configured to optimize bundle size and loading times.

---

## Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (fast, modern dev server)
- [Tailwind CSS](https://tailwindcss.com/)
- [lucide-react](https://lucide.dev/) (icons)
- [react-markdown](https://github.com/remarkjs/react-markdown), [remark-math](https://github.com/remarkjs/remark-math), [rehype-katex](https://github.com/rehypejs/rehype-katex) (Markdown/LaTeX rendering)
- [framer-motion](https://www.framer.com/motion/) (animations)

---

## Customization

- Swap out the AI backend/model by editing the fetch call in `src/App.tsx`
- Adjust theme colors or add more UI polish via Tailwind CSS
- Extend document upload to handle file contents or previews
- Modify file upload limits and allowed extensions in `handleFileUpload` function
- Adjust input character limit (default: 5000) in the `handleSubmit` function
- Configure code splitting chunks in `vite.config.ts`

---

## Contributing

Pull requests and issues welcome!  

---

## Authors

[Kartik Lashkare](https://github.com/kartik-commits)

[Chaitanya Otari](https://github.com/WhoHeRemains)
