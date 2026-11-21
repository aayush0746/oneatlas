# OneAtlas — AI Model Discovery & Intelligence Platform

> **AI Software Engineer Internship Assignment (Role 3: Full Stack Engineer)**  
> Live Product: [https://oneatlas.dev/](https://oneatlas.dev/) • Inspired by OpenRouter, RouterPlus, and LiteLLM.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🌟 Executive Summary

**OneAtlas** is an AI model discovery and intelligence platform engineered to empower AI engineers, researchers, and tech leads to discover, evaluate, compare, and benchmark 470+ frontier foundation models across labs (OpenAI, Anthropic, DeepSeek, Google, Meta, Mistral) and inference providers (Groq, Together AI, Fireworks, OpenRouter).

Beyond simple static lists, OneAtlas includes:
1. **Live ETL Ingestion Pipeline**: Real-time normalization from OpenRouter's live API (`https://openrouter.ai/api/v1/models`).
2. **Multi-Model Side-by-Side Comparison Matrix**: Side-by-side spec comparison with a custom mathematical **SVG Radar Chart** evaluating Reasoning, Coding, Speed, Price Efficiency, and Context.
3. **Interactive TCO Token & ROI Cost Calculator**: Dynamic monthly spend simulator with prompt caching discounts.
4. **"Find My Model" AI Architect Wizard**: Interactive 4-step recommendation engine matching requirements to optimal models.
5. **Interactive Model Playground & 1-Click SDK Code Generator**: Instant integration snippets for TypeScript (Vercel AI SDK), Python (LiteLLM / OpenAI), and cURL.
6. **LMSYS Chatbot Arena & Academic Leaderboard**: Category-filterable rankings across Arena Elo, MMLU-Pro, HumanEval, and Math-500.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph ExternalSources["External Data Ingestion Sources"]
        OR["OpenRouter Public API (/api/v1/models)"]
        LMSYS["LMSYS Arena & Academic Benchmarks"]
    end

    subgraph DataPipeline["Data Ingestion & Normalization Layer (ETL)"]
        ETL["scripts/sync-openrouter.ts\n(src/lib/sync-engine.ts)"]
        Normalize["Price Normalizer ($/1M tokens)\nContext & Tokenizer Parser\nModality & Capability Classifier"]
    end

    subgraph Storage["Persistence Layer"]
        PG[("PostgreSQL Database\n(Docker / Neon / Supabase)")]
        PrismaORM["Prisma ORM 6.19\n(Relational Schema & Seed)"]
        FallbackStore["Resilient In-Memory Index\n(Zero-Failure Production Fallback)"]
    end

    subgraph BackendAPI["Next.js App Router REST API Layer"]
        ModelsAPI["GET /api/models\n(Search, Multi-Filter, Sort, Pagination)"]
        ModelDetailAPI["GET /api/models/:slug\n(Full Technical Specifications)"]
        CompareAPI["GET /api/compare?ids=...\n(Side-by-side Differential)"]
        BenchmarkAPI["GET /api/benchmarks?metric=...\n(Leaderboards & Rankings)"]
        LabsAPI["GET /api/labs & GET /api/providers"]
        SyncAPI["POST /api/sync\n(Live On-Demand ETL Trigger)"]
    end

    subgraph FrontendUI["Frontend Product Experience (Linear/Vercel Aesthetic)"]
        Nav["Global Nav & Cmd+K Command Palette"]
        Catalog["Model Discovery & Filtering Catalog"]
        DetailView["Model Detail & SDK Generator"]
        CompareView["Matrix & SVG Radar Comparison"]
        RankingsView["Rankings & Benchmark Leaderboards"]
        CalculatorView["TCO Token Cost Simulator"]
        WizardView["'Find My Model' Matcher"]
        PlaygroundView["Prompt & Latency Probe"]
    end

    OR --> ETL
    LMSYS --> ETL
    ETL --> Normalize
    Normalize --> PrismaORM
    PrismaORM --> PG
    PG -.-> FallbackStore
    PrismaORM --> BackendAPI
    FallbackStore --> BackendAPI
    BackendAPI --> FrontendUI
```

---

## 🗄️ Relational Database Schema (ERD)

```mermaid
erDiagram
    LAB ||--o{ MODEL : "trains / releases"
    PROVIDER ||--o{ MODEL_PROVIDER_PRICING : "hosts / routes"
    MODEL ||--o{ MODEL_PROVIDER_PRICING : "priced at"
    MODEL ||--o{ MODEL_BENCHMARK_SCORE : "scored in"
    BENCHMARK_METRIC ||--o{ MODEL_BENCHMARK_SCORE : "evaluates"

    LAB {
        string id PK
        string slug UK
        string name
        string websiteUrl
        string headquarters
        int foundedYear
    }

    PROVIDER {
        string id PK
        string slug UK
        string name
        string websiteUrl
        boolean isAggregator
    }

    MODEL {
        string id PK
        string slug UK
        string name
        string labId FK
        datetime releaseDate
        int contextLength
        int maxOutputTokens
        float inputPricePerMillion
        float outputPricePerMillion
        float cacheReadPricePerMillion
        string architecture
        string parameterCount
        string_array modalities
        string_array capabilities
        string licenseType
        boolean isOpenSource
        float typicalThroughputTps
        int typicalTtftMs
    }

    MODEL_PROVIDER_PRICING {
        string id PK
        string modelId FK
        string providerId FK
        float inputPricePerM
        float outputPricePerM
        float throughputTps
        int latencyMs
        boolean isAvailable
    }

    BENCHMARK_METRIC {
        string id PK
        string code UK
        string name
        string category
        string unit
        float maxScore
    }

    MODEL_BENCHMARK_SCORE {
        string id PK
        string modelId FK
        string metricId FK
        float score
        string source
    }
```

---

## 🚀 Key Feature Walkthrough

### 1. Model Discovery & Multi-Facet Filtering (`/models`)
- **Global Search**: Search models, architecture, labs, or license with instant debounce.
- **Multi-Facet Filters**: Filter by AI Lab (Anthropic, OpenAI, DeepSeek, Google, Meta, Mistral, xAI, Qwen), Modality (Text, Vision, Audio), Capability (Deep Reasoning, Coding, Function Calling, Prompt Caching), and Open-Weights licensing.
- **Dual Display Modes**: Toggle seamlessly between responsive Card Grid view and Density-Optimized Table view.
- **Multi-Attribute Sorting**: Sort by Chatbot Arena Elo, Price (ascending/descending), Context Window, Throughput (TPS), or Newest Release.

### 2. Multi-Model Comparison & SVG Radar Chart (`/compare`)
- Select 2 to 4 models to compare side-by-side.
- **Interactive SVG Radar Chart**: Custom SVG radar chart evaluating models across 5 normalized dimensions:
  1. *Reasoning* (Chatbot Arena / MMLU-Pro)
  2. *Coding* (HumanEval Pass@1)
  3. *Speed* (Tokens per Second Throughput)
  4. *Price Efficiency* (Cost per 1M tokens)
  5. *Context Window* (Total token capacity)
- **Differential Matrix**: Side-by-side specs comparison with winner highlights.

### 3. TCO & Token Cost Simulator (`/calculator`)
- Developers can slide **Monthly Input Tokens** (100k - 50M), **Output Tokens** (100k - 20M), and **Prompt Caching Ratio** (0% - 90%).
- Real-time recalculation of estimated monthly spend across all models, showing net dollar savings with prompt caching.

### 4. "Find My Model" AI Matcher Wizard (`/wizard`)
- 4-step interactive guided decision tree:
  - Engineering use-case (Autonomous Coding, Deep Math/Reasoning, Vision, High-Volume Data Extraction).
  - Context size requirement (Standard 128k vs Massive 1M-2M tokens).
  - Licensing constraint (Open-weights self-hostable vs Managed Cloud API).
  - Latency preference (Ultra-fast <300ms vs Deep Thinking / Chain-of-Thought).
- Outputs ranked match percentage, architectural rationale, and direct 1-click comparison.

### 5. Benchmark Leaderboard (`/benchmarks`)
- Track and sort models across:
  - **LMSYS Chatbot Arena Elo** (Crowdsourced human evaluation)
  - **MMLU-Pro** (Rigorous multi-discipline college-level reasoning)
  - **HumanEval** (Python pass@1 code synthesis)
  - **GSM8K & MATH-500** (Multi-step arithmetic and Olympiad math)
  - **GPQA Diamond** (Google-proof graduate-level scientific Q&A)

### 6. Interactive Model Playground & 1-Click Code Generation (`/playground`)
- Interactive playground with System Prompt, User Prompt, Temperature slider, and Max Tokens slider.
- Live token generation simulation with simulated TTFT latency.
- Instant copy-paste SDK snippets for:
  - **TypeScript** via Vercel AI SDK (`@ai-sdk/openai` + `generateText`)
  - **Python** via LiteLLM (`litellm.completion`)
  - **cURL** direct HTTP request

---

## 📡 REST API Reference

| Endpoint | Method | Description | Parameters |
|---|---|---|---|
| `/api/models` | `GET` | Search, filter, and paginate models | `search`, `lab`, `provider`, `modality`, `capability`, `openSource`, `sortBy`, `page`, `limit` |
| `/api/models/:slug` | `GET` | Get single model specifications, benchmarks, & provider pricing | `slug` (path param) |
| `/api/compare` | `GET` | Fetch side-by-side comparison data and radar scores | `ids=slug1,slug2,slug3` |
| `/api/benchmarks` | `GET` | Fetch leaderboard rankings by benchmark metric | `metric=ARENA_ELO \| MMLU_PRO \| HUMANEVAL \| MATH_500` |
| `/api/labs` | `GET` | List all AI labs with model counts | None |
| `/api/providers` | `GET` | List all inference providers | None |
| `/api/sync` | `POST` | Trigger OpenRouter live ETL pipeline | `{ "limit": 20 }` (JSON body) |

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm or pnpm
- (Optional) Docker for local PostgreSQL

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd oneatlas
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env`:
```env
DATABASE_URL="postgresql://oneatlas:password123@localhost:5432/oneatlas_db?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. (Optional) Run PostgreSQL via Docker
```bash
docker compose up -d
```
Then run migrations and seed:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

> **Note on Zero-Configuration Local Development**: If you do not have Docker or PostgreSQL installed locally, OneAtlas automatically and gracefully falls back to its indexed high-fidelity dataset with identical sorting, filtering, and schema relations. No database errors or setup hurdles!

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Live Ingestion Pipeline
To fetch live models from OpenRouter and normalize them:
```bash
npx tsx scripts/sync-openrouter.ts
```

### 6. Production Build
```bash
npm run build
npm run start
```

---

## 🎥 Loom Video Walkthrough Script (5–10 Minutes)

Use this structured script for recording your mandatory Loom video:

1. **Introduction (1 min)**:
   - Introduce yourself and mention the assignment: AI Software Engineer Internship - Role 3 (Full Stack Engineer).
   - State the problem: AI engineers struggle to evaluate cost, latency, context windows, and real benchmark performance across disparate providers.
   - Introduce OneAtlas as the unified intelligence platform.
2. **Architecture & Engineering Quality (2 mins)**:
   - Walk through the Next.js App Router architecture, TypeScript interfaces, and PostgreSQL schema with Prisma ORM.
   - Highlight the **Live Ingestion Pipeline** (`scripts/sync-openrouter.ts`): show how it fetches live models from OpenRouter's API, parses pricing per 1M tokens, and normalizes modalities.
   - Explain the dual-mode database access layer with automatic fallback for zero-downtime resiliency.
3. **Product Demonstration (4 mins)**:
   - **Model Discovery**: Search for "DeepSeek-R1", filter by "Open-Weights" and "Reasoning", toggle Grid/Table view, sort by Arena Elo.
   - **Side-by-Side Comparison**: Select Claude 3.5 Sonnet, DeepSeek-R1, and GPT-4o. Show the custom SVG Radar Chart and spec differential matrix.
   - **TCO Token Calculator**: Adjust the monthly input/output token sliders and demonstrate how prompt caching saves hundreds of dollars.
   - **Find My Model Wizard**: Walk through the 4 questions and show the 98% architectural match output.
   - **Model Detail Page & Code Export**: Open Claude 3.5 Sonnet, show latency metrics per provider, and copy the TypeScript Vercel AI SDK snippet.
4. **Technical Decisions, Challenges & Trade-offs (2 mins)**:
   - *Decision 1*: Custom zero-dependency SVG Radar Chart over heavyweight D3 bundles to maximize Lighthouse performance and avoid hydration mismatches.
   - *Decision 2*: Dual-mode data repository pattern to guarantee zero crashes during review regardless of local PostgreSQL status.
   - *Challenge*: Normalizing raw token prices (decimals like `$0.000003`) into standardized dollars per 1 million tokens without floating-point precision loss.
5. **Closing (30 sec)**:
   - Summarize ownership, production-readiness, and readiness for the internship.

---

## 📄 License
MIT License. Built for OneAtlas AI Software Engineer Internship Submission.
