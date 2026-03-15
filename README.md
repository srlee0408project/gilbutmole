# 두더지 잡기 (Mole Game)

Next.js 기반 두더지 잡기 게임입니다. 이름을 입력하고 두더지가 나오는 구멍을 클릭해 빨리 잡을수록 높은 점수를 얻습니다. Supabase에 점수를 저장하고 순위표를 볼 수 있습니다.

## Supabase 설정

1. [Supabase](https://supabase.com)에서 프로젝트를 생성합니다.
2. **SQL Editor**에서 `supabase/migrations/001_create_scores.sql` 내용을 붙여 넣고 실행합니다.
3. **Settings → API**에서 Project URL과 anon public key를 복사합니다.
4. 프로젝트 루트에 `.env.local`을 만들고 아래를 채웁니다 (`.env.local.example` 참고).

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

환경 변수를 설정하지 않으면 앱은 동작하지만 점수 저장과 랭킹 조회는 되지 않습니다.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
