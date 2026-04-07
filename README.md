# Sorted

**Your money, sorted.** Free AI-powered financial navigator for Australians.

Answer a few questions about your situation. Get a personalised report covering tax obligations, BAS/GST guidance, deductions you might be missing, debt strategy, and government benefits you could be eligible for.

## Why Sorted?

Millions of Australians fall in the "missing middle" - earning too much for free government help, too little for professional financial advice. Sorted bridges that gap.

- **Free forever.** No signup, no fees, no premium tier.
- **No data stored.** Your answers are processed and forgotten. Nothing is saved.
- **Open source.** MIT licensed. Audit the code yourself.
- **Australian-specific.** Built for ATO rules, Medicare, HECS, BAS, and state-specific benefits.

## Tech Stack

- [Next.js](https://nextjs.org/) + TypeScript + Tailwind CSS
- [Claude API](https://anthropic.com/) for AI-powered report generation
- Deployed on [Vercel](https://vercel.com/)

## Getting Started

```bash
git clone https://github.com/apappas57/sorted.git
cd sorted
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

## Contributing

Sorted is open source and contributions are welcome. Please open an issue first to discuss what you'd like to change.

## License

MIT
