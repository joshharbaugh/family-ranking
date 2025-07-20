[![Unit & Integration Tests](https://github.com/joshharbaugh/family-ranking/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/joshharbaugh/family-ranking/actions/workflows/unit-tests.yml)

[![E2E Tests](https://github.com/joshharbaugh/family-ranking/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/joshharbaugh/family-ranking/actions/workflows/e2e-tests.yml)

# Family Ranking App

A modern, full-stack family media ranking application built with Next.js, Firebase, Zustand, and Tailwind CSS.

## Features

- User authentication (Firebase: email/password & Google)
- Family and user management
- Media rankings (movies, TV, books, games)
- Responsive UI with Tailwind CSS
- Theme toggle (light/dark, persisted, and synced with Firebase)
- Skeleton loaders for smooth UX
- Tooltips with animated open/close
- State management with Zustand
- Modular service and store architecture
- Prettier and ESLint for code quality
- Storybook for UI development

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router, TypeScript)
- [Firebase](https://firebase.google.com/) (Auth, Firestore)
- [Zustand](https://zustand-demo.pmnd.rs/) (state management)
- [Tailwind CSS](https://tailwindcss.com/) (utility-first styling)
- [Radix UI](https://www.radix-ui.com/) (accessible UI primitives)
- [Lucide Icons](https://lucide.dev/)
- [Prettier](https://prettier.io/) & [ESLint](https://eslint.org/)
- [Storybook](https://storybook.js.org/)

## Fonts

- Uses [Inter](https://fonts.google.com/specimen/Inter) font family
  - **Headings:** Inter ExtraBold (900)
  - **Body:** Inter Regular (400)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or yarn, pnpm, bun
   ```
2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your Firebase credentials.
3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

- `dev` - Start the Next.js development server
- `build` - Build for production
- `start` - Start the production server
- `lint` - Run ESLint
- `format` - Run Prettier on the codebase
- `storybook` - Start Storybook for UI development
- `build-storybook` - Build Storybook static site

## Formatting & Linting

- **Prettier**: Configured via `.prettierrc` and `.prettierignore`
- **ESLint**: Configured via `eslint.config.mjs`
- **EditorConfig**: See `.editorconfig` for basic editor settings

## Project Structure

```
family-ranking/
  src/
    app/            # App-specific components and modules
      ui/           # UI components (skeletons, modals, navigation, etc.)
      services/     # Business logic (user, ranking, family services)
      store/        # Zustand stores (theme, user, family)
      hooks/        # Custom React hooks
      ...           # Pages, providers, API routes
    lib/
      firebase.ts   # Firebase config
      utils.ts      # Utility functions
      definitions/  # TypeScript types
      ui/           # Component Library
  public/           # Static assets
  .prettierrc       # Prettier config
  .prettierignore   # Prettier ignore
  .editorconfig     # Editor config
  package.json      # Scripts and dependencies
  ...
```

## License

MIT
