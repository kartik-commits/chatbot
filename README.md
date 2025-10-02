# AI Chatbot

A modern, multi-chat AI assistant built with React and TypeScript. Supports Markdown, LaTeX math, file uploads, and a sleek dark/light UI. Powered by a local AI backend.

---

## Features

- **Multi-Chat Sessions:** Create, switch, and delete chats for different topics
- **AI-Powered Responses:** Connects to an AI model for smart conversations (default: deepseek-r1-distill-qwen-7b)
- **Markdown & Math:** Renders rich Markdown and LaTeX formulas in chat
- **File Uploads:** Attach documents to each chat and view their names in history
- **Dark/Light Mode:** Toggle between beautiful dark and light themes
- **Animated UI:** Smooth transitions for sidebar, messages, and more
- **Error Handling:** Friendly error messages when something goes wrong

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

- Start a new chat session from the sidebar
- Type your message and hit enter (or click Send)
- Upload documents to the current chat with the upload button
- Toggle dark/light mode from the top bar
- Delete chats from the sidebar as needed

---

## Configuration

**Backend Model:**  
Default is `deepseek-r1-distill-qwen-7b`.  
Change the model, endpoint, or parameters in `src/App.tsx` under the `payload` object.

**Styling:**  
Uses [Tailwind CSS](https://tailwindcss.com/) for rapid UI development.

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

---

## Contributing

Pull requests and issues welcome!  

---

## Authors

[Kartik Lashkare](https://github.com/kartik-commits)

[Chaitanya Otari](https://github.com/WhoHeRemains)
