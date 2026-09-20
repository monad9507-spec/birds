# INKBIRDS — Vercel

Сайт адаптовано до звичайного Next.js App Router. Cloudflare, Vinext і Sites для запуску не потрібні.

## Завантаження на Vercel

1. Розпакуйте ZIP.
2. Завантажте вміст папки INKBIRDS-Vercel у GitHub-репозиторій. У корені мають бути package.json, app і vercel.json.
3. У Vercel оберіть Add New → Project та імпортуйте цей репозиторій.
4. Framework Preset: Next.js. Node.js: 22.x. Root Directory: папка з package.json (якщо файли в корені репозиторію — залиште стандартне значення).
5. Build Command та Install Command уже задані у vercel.json. Output Directory не змінюйте.
6. Натисніть Deploy.

## Адреси без .html

- / — мінт
- /my-birds — NFT вашого гаманця
- /gallery — загальна галерея, без підключення гаманця
- /grid-builder — конструктор колажів

Ці маршрути відкриваються напряму і після оновлення сторінки. Адреси з .html перенаправляються на версію без розширення.

## Локальний запуск

Потрібні Node.js 22.x та pnpm версії з package.json.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Відкрийте http://localhost:3000.

```sh
pnpm build
pnpm start
```

## Гаманець та контракт

Ink mainnet, chain ID 57073.
Контракт: 0x41715938926CDd0D822F4727Db8F6a2a18E1A605.
Публічний Reown Project ID збережений у lib/wallet.ts. Якщо в Reown увімкнений список дозволених доменів, додайте свій домен Vercel та власний домен у налаштуваннях цього проєкту.
Приватний ключ або seed-фраза для сайту не потрібні. Мінт підтверджує користувач у своєму гаманці.

## Експорт колажів

PNG 2400 × 2700, сітки на 4/9/16/25 NFT. Серверний маршрут /api/bird-image виконується як Node.js-функція Vercel та завантажує тільки зображення цієї колекції. API-маршрути потрібні — не перемикайте проєкт у статичний HTML export.

Реальний платний мінт і повний сценарій із підключеним гаманцем не виконувалися під час підготовки ZIP.

Документація розгортання: https://vercel.com/docs/frameworks/full-stack/nextjs
