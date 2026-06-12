# 📊 Dashify: Modern AI-Powered Analytics Studio

Dashify is a premium, responsive web application that transforms raw CSV and Excel data into interactive visual dashboards and AI-generated insights. Built with React, Tailwind CSS, Recharts, and Supabase, it features an intelligent AI Data Analyst helper powered by OpenRouter to analyze and summarize spreadsheets.

---

## 🚀 Key Features

- **📂 Multi-Format File Support**: Drag and drop CSV or Excel (`.xlsx`, `.xls`, `.xlsm`) files. Automatically parses sheets and offers a 5-row preview.
- **🗺️ Interactive Column Mapper**: Map spreadsheet headers dynamically to custom visual dimensions before importing.
- **📈 Real-Time Charts**: Customizable Bar, Line, and Pie charts powered by **Recharts**.
  - Adjust X-axis dimension, Y-axis metric, and aggregation types (Count, Sum, Avg, Min, Max) on the fly.
  - Automatic warning indicators prevent invalid aggregations (e.g., trying to sum text columns).
- **🤖 AI Data Analyst**: An interactive AI chat box that accepts questions, analyzes the entire dataset, and replies with formatted Markdown charts and statistics.
- **📁 Dataset History**: View and switch between recently uploaded files stored securely in your dashboard.
- **🔐 User Authentication**: Secure Login and Registration flow powered by Supabase with protected routes.
- **🌐 Local Fallback Mode**: Dev-friendly offline capability that switches storage to `localStorage` and in-memory caches if Supabase configuration is missing or offline.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19 (Hooks, Context API, Refs), React Router v7
- **Styling**: Tailwind CSS, Lucide Icons
- **Data Visualization**: Recharts (Responsive SVG charts)
- **Data Parsing**: 
  - [SheetJS (xlsx)](https://sheetjs.com/) for reading Excel binaries
  - [PapaParse](https://www.papaparse.com/) for fast CSV parsing
- **Database & Storage**: Supabase (Auth, DB Tables, Storage Buckets)
- **AI Integrations**: OpenRouter API (utilizing Llama 3 & Gemma 2 free models with automatic fallbacks)

---

## ⚙️ Environment Configuration

To run the application, create a `.env.local` file in the root directory and configure the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key

# OpenRouter AI Configuration
VITE_OPENROUTER_API_KEY=your_openrouter_api_key

# EmailJS Configuration (Optional for Contact Form)
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

---

## 📦 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/yourusername/dashify.git
cd dashify
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```
Open `http://localhost:5173` in your browser. If Supabase is unconfigured, the app automatically switches to **Demo Mode** using mock test users and local storage.

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, fonts, and local assets
│   ├── components/
│   │   ├── auth/           # Login & Registration components
│   │   ├── charts/         # Bar, Line, Pie, and ChartContainer components
│   │   ├── common/         # Button, Input, Modal, Navbar, and Loader
│   │   └── csv/            # CSV/Excel Uploader and Column Mapper
│   ├── context/            # Auth and CSV React contexts
│   ├── hooks/              # Custom React hooks (useAuth, useCSV)
│   ├── lib/                # Supabase client and CSV/Excel parsing engine
│   ├── pages/              # Routing pages (Landing, About, Blog, Dashboard)
│   ├── routes/             # App routing configuration
│   └── services/           # AI completions and CSV uploads managers
├── index.html              # HTML entrypoint
├── package.json            # Node.js dependencies
└── vite.config.js          # Vite compilation settings
```

---

## 📄 License

This project is licensed under the MIT License. Feel free to use and modify it for your portfolio!
