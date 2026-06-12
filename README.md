  # 📊 Dashify: Modern AI-Powered Analytics Studio

  Dashify is a premium, highly responsive web application designed to transform raw spreadsheet data (CSV, Excel) into interactive, publication-ready visual dashboards and intelligent AI-generated insights. Built with React 19, Tailwind CSS, Recharts, and Supabase, it incorporates a conversational AI Data Analyst powered by OpenRouter to analyze datasets and recommend visualizations automatically.

  ---

  ## 🗺️ System Architecture

  The following diagram illustrates how raw spreadsheets flow through parsing, visual mapping, state management, visualization rendering, and AI analytics.

  ```mermaid
  flowchart TD
      A[User Spreadsheet: CSV / XLSX] --> B[Spreadsheet Parser: PapaParse / SheetJS]
      B --> C[Visual Schema Mapper: ColumnMapper]
      C --> D[CSVContext: Global State]
      
      subgraph Frontend Logic Layer
          D --> E[Recharts Visualization Sandbox]
          D --> F[AI Data Analyst Chat Box]
          D --> G[Recommendation Engine: Chart Recommendations]
      end

      subgraph Service Integrations
          F -->|Prompt + Context| H[OpenRouter API]
          G -->|Metadata Analysis| H
          H -->|Cascading Fallback Models| I[Gemini 2.5 Flash / Llama 3 / Gemma 2]
      end

      subgraph Storage & Security Layer
          D -->|Persist Upload Metadata| J{Supabase Status?}
          J -->|Online| K[Supabase Database & Storage]
          J -->|Offline / Unconfigured| L[Local Storage & Cache fallback]
      end
  ```

  ---

  ## 🚀 Key Features

  ### 📂 Multi-Format File Upload & Auto-Parsing
  * **Drag-and-Drop Uploader**: Supported by `react-dropzone` with instant file-type validation.
  * **Fast Engine Parsers**:
    * [PapaParse](https://www.papaparse.com/) parses large CSV records on the client side efficiently.
    * [SheetJS (xlsx)](https://sheetjs.com/) processes binary Excel file sheets (`.xlsx`, `.xls`, `.xlsm`) and allows users to pick individual tabs for visualization.
  * **Instant Preview**: Displays a clean 5-row spreadsheet-style tabular view to preview headers and record layout immediately.

  ### 🗺️ Visual Schema & Column Mapping
  * **Dynamic Mapping Interface**: Map your columns to coordinate schemas (`X-Axis` dimension and `Y-Axis` metrics) before database uploads or visualization rendering.
  * **Data Type Profiling**: The mapper analyzes and flags column data types (Numerical, Categorical, Date, Text) to ensure valid data mapping.

  ### 📈 Interactive Recharts Analytics Sandbox
  * **Real-Time Visual Sandbox**: Adjust the chart type, axis columns, and aggregations on the fly.
  * **Robust Aggregation Engine**:
    * Supports `Count`, `Sum`, `Average`, `Minimum`, and `Maximum` aggregations.
    * Grouping and aggregation are handled automatically on the client side using optimized Javascript groupers.
  * **Safety Warnings**: Detects and displays warnings when trying to execute numerical operations (e.g. `Sum` or `Average`) on string/text columns.
  * **Diverse Visualization Styles**: Render standard **Bar Charts**, **Line Graphs**, **Pie Charts**, **Scatter Plots**, or **Area Charts** styled with glassmorphism.

  ### 🤖 Conversational AI Data Analyst
  * **Context-Aware Chat Assistant**: Communicates with the user using a contextual prompt containing the column headers, record count, and sample data.
  * **OpenRouter Model Cascades**:
    * Utilizes `google/gemini-2.5-flash` and fallbacks like `meta-llama/llama-3-8b-instruct:free`, `google/gemma-2-9b-it:free`, and `openrouter/free`.
    * Cascades automatically to alternative models if the primary service experiences rate limits or network issues.
  * **Structured Markdown Output**: AI responses render styled statistics, bold highlights, tables, and bullet points.

  ### 🧠 Intelligent Chart Recommendation Engine
  * **Automatic Layout Recommendations**: Sends dataset metadata (row counts, column details, correlations, unique percentages) to the AI to obtain recommended charts in structured JSON.
  * **Rule-Based Fallbacks**: If API limits are reached, a client-side heuristic engine analyzes date, numerical, and categorical structures to build instant, relevant chart configurations.

  ### 🔐 Hybrid Authentication & Persistence Engine
  * **Supabase Integration**: Handles secure login, registration, and persistent dataset indexing.
  * **Local Fallback Mode**: If Supabase credentials are not provided or the network is unreachable, Dashify runs seamlessly in **Demo Mode**, using `localStorage` caching and mock data to guarantee operational capability.

  ---

  ## 🛠️ Technology Stack & Dependencies

  | Dependency | Purpose | Details |
  | :--- | :--- | :--- |
  | **React 19 & React DOM** | UI Framework | Utilizes modern React hooks (`useState`, `useEffect`, `useContext`, `useRef`, `useMemo`) for reactive UI states. |
  | **Vite 8** | Build Tooling | Provides fast HMR (Hot Module Replacement) and optimized production bundles. |
  | **Tailwind CSS v4** | UI Styling | Standardized utility class styles, glassmorphism filters, and clean dark mode styles. |
  | **Recharts** | Data Visualizations | Renders responsive, animated SVG graphics for charts. |
  | **Lucide React** | Icons | Consistent and modern SVG icons. |
  | **@supabase/supabase-js** | Database Backend | Connects to remote PostgreSQL tables and manages user sessions. |
  | **PapaParse** | CSV Engine | Performance-oriented client-side CSV parsing. |
  | **XLSX (SheetJS)** | Excel Engine | Sheet processing and cell binary reading. |
  | **React Router DOM v7** | Routing | Manages application routes (Landing page, About, Contact, Dashboard, and Auth routes). |
  | **@emailjs/browser** | Contact Forms | Sends contact submissions directly to a specified inbox. |
  | **React Hot Toast** | Notifications | Toast notifications for user feedback. |

  ---

  ## ⚙️ Environment Configuration

  To configure Dashify, create a `.env.local` file in the root directory and set the variables below:

  ```bash
  # Supabase Backend Configuration
  VITE_SUPABASE_URL=https://your-project-id.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

  # OpenRouter AI API Key
  VITE_OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key

  # EmailJS Configuration (Optional for contact forms)
  VITE_EMAILJS_SERVICE_ID=service_your_id
  VITE_EMAILJS_TEMPLATE_ID=template_your_id
  VITE_EMAILJS_PUBLIC_KEY=your_public_key
  ```

  > [!NOTE]
  > If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not set or are invalid, the application will automatically enter **Demo Mode**. You can still test file uploads, chart recommendations, and visual modifications offline.

  ---

  ## 📦 Getting Started

  ### 1. Clone the Repository
  ```bash
  git clone https://github.com/yourusername/dashify.git
  cd dashify
  ```

  ### 2. Install Project Dependencies
  ```bash
  npm install
  ```

  ### 3. Run the Development Server
  ```bash
  npm run dev
  ```
  Open `http://localhost:5173` in your browser.

  ### 4. Build and Preview for Production
  ```bash
  npm run build
  npm run preview
  ```

  ---

  ## 📂 Project Structure

  ```
  ├── public/                 # Static public assets
  ├── src/
  │   ├── assets/             # Images, graphics, and fonts
  │   ├── components/         # Reusable UI component architecture
  │   │   ├── auth/           # Login, registration, and guard logic
  │   │   ├── charts/         # Bar, Line, Pie, and multi-functional ChartContainer
  │   │   ├── common/         # Buttons, Inputs, Loaders, Modals, and Navigation
  │   │   ├── csv/            # Dropzones, tabular CSV previews, and header mapping
  │   │   └── dashboard/      # Sidebar drawers, statistics cards, and layouts
  │   ├── context/            # React Context Providers for app-wide state
  │   │   ├── AuthContext.jsx # Manages Supabase user state and auth fallbacks
  │   │   └── CSVContext.jsx  # Manages parsed spreadsheets, active metadata, and charts
  │   ├── hooks/              # Custom React Hooks
  │   │   ├── useAuth.js      # Consumes AuthContext safely
  │   │   └── useCSV.js       # Consumes CSVContext safely
  │   ├── lib/                # Client configurations and utility wrappers
  │   │   ├── csvParser.js    # Standardizes CSV and Excel processing to structured JSON
  │   │   └── supabaseClient.js # Connects to Supabase Database with fallback checkers
  │   ├── pages/              # Routed pages
  │   │   ├── LandingPage.jsx # Product introduction with scroll animations
  │   │   ├── AboutPage.jsx   # Project history and details
  │   │   ├── ContactPage.jsx # Dynamic form integrating EmailJS
  │   │   ├── DashboardPage.jsx # Core analytics workspace
  │   │   └── LoginPage.jsx   # Access entry point
  │   ├── routes/             # App routing configuration
  │   │   └── AppRouter.jsx   # Declares public and protected route mappings
  │   ├── services/           # External API controllers
  │   │   ├── aiService.js    # Connects to OpenRouter for interactive analysis
  │   │   ├── authService.js  # Wraps Supabase Auth actions
  │   │   ├── chartRecommendationService.js # AI-driven and rule-based chart recommender
  │   │   ├── chartService.js # Manages saved visual configurations
  │   │   └── csvService.js   # Handles dataset storage and file uploads
  │   ├── utils/              # Pure Javascript utility functions
  │   │   ├── formatters.js   # Number and date string formats
  │   │   └── validators.js   # Verifies data integrity and headers
  │   ├── App.jsx             # Main application container
  │   ├── index.css           # Global CSS and Tailwind definitions
  │   └── main.jsx            # DOM mounting point
  ├── eslint.config.js        # Code quality rule declarations
  ├── package.json            # Manifest file for scripts and dependencies
  ├── tailwind.config.js      # Tailwind framework setup
  └── vite.config.js          # Vite configuration
  ```

  ---

  ## 💡 Advanced Usage Guides

  ### How the Recommendation Engine Works
  The recommendation engine analyzes the structure of your dataset via two distinct paths:

  1. **AI Path (`generateChartRecommendations`)**:
    * It builds a metadata summary consisting of file name, row count, column counts, column types, min/max values, unique categorization count, and correlations.
    * Sends this metadata to OpenRouter under a strict system prompt instructing it to return an array of recommendation objects.
    * Enhances the returned JSON with fallback properties to ensure Recharts can render it.
  2. **Rule-Based Path (`generateFallbackRecommendations`)**:
    * If the user doesn't have an OpenRouter key or the API rate limits them, the engine immediately profiles the columns.
    * If date columns and numeric columns exist, it structures a Time Series Line Chart.
    * If category columns and numeric columns exist, it builds a categorical comparison Bar Chart.
    * If category values are under 10, it recommends a Pie Chart.
    * If two numeric columns exist, it recommends a Correlation Scatter Plot.

  ### Custom React Hook Usage Example
  To access the active file data or trigger a dashboard modification inside any nested component, use the custom `useCSV` hook:

  ```javascript
  import { useCSV } from '../hooks/useCSV';

  const MyCustomComponent = () => {
    const { csvData, mappedHeaders, updateChartConfig } = useCSV();

    return (
      <div>
        <p>Loaded Row Count: {csvData ? csvData.length : 0}</p>
        <button onClick={() => updateChartConfig('type', 'line')}>
          Switch to Line Graph
        </button>
      </div>
    );
  };
  ```

  ---

  ## 🤝 Contributing

  We welcome contributions to Dashify! If you would like to contribute:
  1. **Fork** the repository.
  2. Create a new **feature branch**: `git checkout -b feature/your-awesome-feature`.
  3. **Commit** your changes: `git commit -m "Add some awesome feature"`.
  4. **Push** to the branch: `git push origin feature/your-awesome-feature`.
  5. Open a **Pull Request**.

  ---

  ## 📄 License

  This project is licensed under the MIT License - see the LICENSE file for details. Feel free to use and modify it for your personal portfolios or client dashboards!
