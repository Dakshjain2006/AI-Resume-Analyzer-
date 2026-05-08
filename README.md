# 📄 ResumeIQ — AI-Powered Resume Analyzer

<div align="center">

**Upload your resume and get instant AI-powered feedback — ATS scores, improvement tips, and professional review.**

🌐 **[Live Demo](https://resume-analyzer.onrender.com)** · 📦 **[GitHub Repo](https://github.com/Dakshjain2006/resume-analyzer)**

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude_AI-Powered-D97706?style=for-the-badge&logo=anthropic&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

</div>

---

## ✨ Features

| Mode | Description |
|------|-------------|
| 📊 **Review** | Overall score with section-by-section breakdown (formatting, experience, skills, education, impact) |
| 🤖 **ATS Scan** | ATS compatibility score, keyword analysis, formatting checks, and parsing issue detection |
| ✨ **Improve** | Before/after bullet rewrites, power words, missing sections, and action items |

### Additional Highlights

- 📎 **PDF Upload** — Drag & drop or browse for PDF/TXT resume files
- 🎯 **Job Matching** — Paste a job description for tailored, role-specific feedback
- 🎨 **Premium Dark UI** — Emerald glassmorphism design with ambient animations
- ⌨️ **Keyboard Shortcut** — `Ctrl + Enter` to instantly analyze
- 🔒 **Secure** — API key stays on the server, never exposed to the client
- 📊 **Visual Scores** — Animated score rings and meter bars for easy reading

---

## 📁 Project Structure

```
resume-analyzer/
├── public/
│   ├── index.html          # Main HTML page
│   ├── style.css           # Emerald glassmorphism design system
│   └── script.js           # Client-side JavaScript
├── server.js               # Express.js API proxy server
├── package.json            # Dependencies and scripts
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── LICENSE                 # MIT License
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- An [Anthropic API key](https://console.anthropic.com/) (for Claude AI)

### 1. Clone the Repository

```bash
git clone https://github.com/Dakshjain2006/resume-analyzer.git
cd resume-analyzer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Open `.env` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
PORT=3000
```

### 4. Run the App

```bash
# Production
npm start

# Development (auto-restarts on file changes)
npm run dev
```

### 5. Open in Browser

Navigate to **[http://localhost:3000](http://localhost:3000)** 🎉

---

## 🌍 Deploy to the Web (Free)

### Deploy on Render (Recommended)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repo `Dakshjain2006/resume-analyzer`
4. Configure:
   | Setting | Value |
   |---------|-------|
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Environment** | `Node` |
5. Add environment variable: `ANTHROPIC_API_KEY` = your API key
6. Click **Deploy** → Live at `https://resume-analyzer.onrender.com` 🚀

### Other Hosting Options

| Platform | Free Tier | Link |
|----------|-----------|------|
| **Render** | ✅ Yes | [render.com](https://render.com) |
| **Railway** | ✅ Yes | [railway.app](https://railway.app) |
| **Vercel** | ✅ Yes | [vercel.com](https://vercel.com) |

---

## 🖥️ Usage

1. **Upload** a PDF or **paste** your resume text
2. *(Optional)* Paste a **job description** for tailored analysis
3. **Choose a mode**: Review, ATS Scan, or Improve
4. **Click "Analyze Resume"** (or press `Ctrl + Enter`)
5. View your **scores, feedback, and improved bullet points**

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **AI Engine** | Anthropic Claude API |
| **PDF Parsing** | PDF.js (client-side) |
| **Fonts** | Inter, JetBrains Mono (Google Fonts) |
| **Design** | Dark Emerald Glassmorphism |

---

## 🛡️ Security

- API key stored **server-side only** in `.env`
- `.env` excluded from Git via `.gitignore`
- All API requests proxied through Express server

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Daksh Jain**

---

<div align="center">
  <sub>Built with ❤️ and Claude AI</sub>
</div>
