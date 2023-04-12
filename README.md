# Stemstr Client

Web client/PWA for stemstr. Stemstr is a Nostr client that facilitates collaboration between music artists/producers.

## Contributing

Things you should become comfortable with:

1. [Next.js](https://nextjs.org/docs/getting-started)
2. [Mantine Components Framework](https://v5.mantine.dev/pages/getting-started/)

## Local environment

1. Copy .env into .env.local and set your local environment variables.

2. Install packages:

```
yarn
```

3. Start dev server:

```
yarn run dev
```

or

```
yarn run dev-https
```

if you need a secure environment.

## npm scripts

### Build and dev scripts

- `dev` – start dev server
- `build` – bundle application for production
- `export` – exports static website to `out` folder
- `analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `jest` – runs jest tests
- `jest:watch` – starts jest watch
- `test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `storybook` – starts storybook dev server
- `storybook:build` – build production storybook bundle to `storybook-static`
- `prettier:write` – formats all files with Prettier
