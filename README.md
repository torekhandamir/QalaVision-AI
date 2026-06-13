# QalaVision AI

**Hackathon track:** Track 3 — City Safety & Social Services

QalaVision AI is an AI-ready GovTech MVP for Almaty. Citizens submit photo evidence of urban issues, and the platform turns each report into explainable prioritization for akimat teams: urgency, social impact, relevance for city services, estimated repair budget, recommended deadline and a full operational report.

## MVP Flow

- `/` — single-page vertical product flow: landing, citizen submission, akimat dashboard and risk map.
- Submit section — photo upload, phone camera capture, preview, district selection, geolocation, manual address and description.
- Dashboard section — KPI cards, readable Recharts charts, filters, issue table and priority queue.
- Risk map section — real Leaflet/OpenStreetMap map of Almaty with colored issue markers and popups.
- `/admin/issues/[id]` — full issue details page for city staff.

## Why It Matters

City services receive many reports, but dispatch teams need to know what should be fixed first. QalaVision AI helps by:

- structuring citizen reports into operational data;
- prioritizing critical safety issues;
- estimating repair budget before dispatch;
- showing social impact and relevance for akimat decisions;
- giving transparent scoring instead of black-box ranking;
- preparing a workflow that can later connect to real computer vision or OpenAI API.

## AI-Ready Architecture

The analysis module is isolated in:

```txt
lib/ai-analysis.ts
```

Main function:

```ts
analyzeIssue(image, formData)
```

Input:

- image file
- district
- geolocation
- manual address
- citizen description
- selected problem type

Output:

- `detectedProblem`
- `confidence`
- `urgencyScore`
- `akimatRelevanceScore`
- `socialImpactScore`
- `estimatedRepairCostKZT`
- `repairDeadline`
- `aiGeneratedDescription`
- `fullReportForAkimat`
- `explanation`
- `repairRecommendation`

To connect a real model later, replace the internal implementation of `analyzeIssue()` with:

- OpenAI API vision/text analysis;
- custom computer vision API;
- YOLO object detection endpoint;
- municipal data service.

The UI and dashboard do not need to be rewritten.

## Scoring Methodology

Urgency score:

```txt
urgencyScore =
problemSeverity * 0.4 +
locationRisk * 0.25 +
socialImpactScore * 0.2 +
photoConfidence * 0.15
```

Where:

- `problemSeverity` — base hazard of the detected issue category.
- `locationRisk` — district risk, road load and proximity to public infrastructure.
- `socialImpactScore` — expected effect on pedestrians, drivers, schools, hospitals and vulnerable groups.
- `photoConfidence` — stronger when photo evidence is attached.

Akimat relevance also considers:

- urgency;
- similar complaints in the district;
- risk to people;
- proximity to schools, hospitals and roads;
- district context.

Repair cost rules:

- pothole: 7000 KZT per m2
- broken sidewalk: 12000 KZT per m2
- trash: 15000 KZT fixed
- streetlight: 45000 KZT fixed
- road crack: 5000 KZT per m2
- flooding: 80000 KZT fixed
- damaged sign: 35000 KZT fixed

Deadline rules:

- Critical: 24 hours
- High: 3 days
- Medium: 7 days
- Low: 30 days

## Data

The project includes 12 demo issues across Almaty districts:

- Алмалинский
- Алатауский
- Ауэзовский
- Бостандыкский
- Жетысуский
- Медеуский
- Наурызбайский
- Турксибский

New submissions are stored in browser `localStorage`, so the MVP works without a backend.

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Leaflet + OpenStreetMap
- Manrope font via `@fontsource/manrope`
- Lucide React icons

## Run Locally

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

## Environment Variables For Future OpenAI Integration

Do not put API keys into client components, `.env`, GitHub commits or browser code.

For local development, create `.env.local`:

```txt
OPENAI_API_KEY=your_key_here
```

For Vercel, add the key only as a server-side environment variable in the project dashboard:

```txt
OPENAI_API_KEY
```

Use it only inside server code, for example:

- Next.js Route Handler: `app/api/analyze/route.ts`
- Server Action
- backend API endpoint

Never expose it with `NEXT_PUBLIC_`. Variables with that prefix are bundled into browser JavaScript.

## Project Structure

```txt
app/                       Next.js routes
app/page.tsx               Single-page citizen + akimat flow
app/admin/issues/[id]      Admin issue details
components/                UI components and page content
lib/ai-analysis.ts         AI-ready analysis module
lib/demo-data.ts           Demo issues and issue creation helper
lib/i18n.ts                EN / RU / KZ interface copy
public/images/             Local visual assets
```

## Hackathon Criteria Coverage

- Relevance: real urban safety and repair prioritization problem.
- Innovation: AI prioritization, cost estimation, social impact and explainable scoring.
- Technical: photo upload/camera capture, AI-ready module, map, dashboard and admin details.
- Practicality: workflow is directly usable by akimat teams for triage.
- Data/methodology: transparent scoring formula and repair cost rules.
- Documentation: setup, architecture, methodology and deployment guidance are included here.
