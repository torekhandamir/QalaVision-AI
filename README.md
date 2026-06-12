# QalaVision AI

**Track 3: City Safety & Social Services**

QalaVision AI is an AI-ready GovTech / Smart City web app for Almaty. It helps citizens submit urban issues with photo and location, then turns each report into explainable repair prioritization for akimate teams.

## What It Does

- Citizens select an Almaty district, attach or capture a photo, share browser geolocation, choose a fallback problem type and add a short description.
- The app sends `image` and `formData` into `analyzeIssue(image, formData)` from [`lib/ai-analysis.ts`](./lib/ai-analysis.ts).
- The current implementation is a mock AI engine, but the interface is prepared for OpenAI API, custom computer vision, or YOLO-based detection.
- The AI result returns detected problem type, confidence, urgency score, akimate relevance score, estimated repair cost, repair deadline, explanation and generated complaint text.
- The akimate dashboard aggregates all demo and submitted issues into filters, KPI cards, Recharts charts, a map placeholder and a priority queue.

## Why It Helps

City services receive many reports, but not every issue has the same risk, cost or urgency. QalaVision AI makes reports structured and comparable:

- urgent road and safety risks rise to the top;
- citizens can submit evidence from a phone camera;
- akimate teams see budget impact before dispatch;
- every score is explainable, not a black box;
- the frontend works without backend services for hackathon demo, while the AI module can be replaced later.

## AI Scoring

Urgency is calculated with:

```txt
urgencyScore =
problemSeverity * 0.4 +
locationRisk * 0.25 +
citizenImpact * 0.2 +
photoConfidence * 0.15
```

Akimate relevance also considers urgency, similar complaints in the district, risk to people and proximity to schools, hospitals or important roads.

Repair cost mock formula:

- pothole: 7000 KZT per m2
- broken sidewalk: 12000 KZT per m2
- trash: 15000 KZT fixed
- streetlight: 45000 KZT fixed
- road crack: 5000 KZT per m2
- flooding: 80000 KZT fixed
- damaged sign: 35000 KZT fixed

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React

## Run Locally

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Project Structure

```txt
app/                    Next.js app router files
components/             UI sections and reusable components
lib/ai-analysis.ts      AI-ready mock analysis module
lib/mock-data.ts        12 demo issues for Almaty districts
lib/i18n.ts             EN / RU / KZ interface copy
public/images/          Generated hero visual asset
```

## Demo Data

The project includes 12 mock submissions across Almaty districts:

- Алмалинский
- Алатауский
- Ауэзовский
- Бостандыкский
- Жетысуский
- Медеуский
- Наурызбайский
- Турксибский

All data works locally without a backend.
