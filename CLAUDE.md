# Sorted

Free, open-source AI financial navigator for Australians.

## Stack
Next.js 16, React 19, TypeScript 5 (strict), Tailwind v4, Claude API (Sonnet), Zod v4, Vercel.

## Architecture
- App Router with src/ directory, @/* path alias
- Tailwind v4 with @theme in globals.css (no tailwind.config)
- Light theme: green #16A34A primary, white/gray backgrounds
- Fonts: DM Sans (headings), Source Sans 3 (body)
- No database, no auth, stateless
- Rate limited: 3 reports per IP per 24 hours

## Key Directories
- `src/app/` - Pages and API routes
- `src/components/` - UI, layout, questionnaire, report components
- `src/config/site.ts` - Centralized site config
- `src/data/` - Australian tax brackets, deductions, benefits, BAS dates
- `src/lib/` - AI prompt builder, Zod schema, sanitization
- `src/types/` - TypeScript types for questionnaire and report

## Pages
- `/` - Landing page
- `/get-sorted` - Questionnaire + AI-generated report

## API Routes
- `POST /api/generate-report` - Receives questionnaire answers, calls Claude Sonnet, returns structured JSON report

## Legal
Every page must show disclaimer: "General information only - not financial advice."
Never say "you should" - say "based on ATO rates, the estimated amount is."

## Commands
```bash
npm run dev     # Development server
npm run build   # Production build
npm run lint    # ESLint
npx tsc --noEmit # Type check
```
