# Emmanuel Olaniyi Assessment Project

A modern Next.js application built with React 19, TypeScript, and Tailwind CSS. This project uses Next.js 16.2.6 with the App Router for server-side capabilities and client-side interactivity.

## 🚀 Live Demo

Check out the live application here: **[https://emmanuel-olaniyi-assessment.vercel.app/dashboard/products](https://emmanuel-olaniyi-assessment.vercel.app/dashboard/products)**

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Development](#development)
- [API & Data Management](#api--data-management)
- [Scripts Reference](#scripts-reference)


## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0 or higher (recommended: latest LTS)
- **npm**: v9+ or **yarn/pnpm/bun** as alternatives
- **Git**: for version control

To check your versions:
```bash
node --version
npm --version
```

## Project Structure

```
pmd/
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   ├── components/       # Reusable React components
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utility functions and helpers
├── public/               # Static assets
├── node_modules/         # Dependencies (auto-generated)
├── .next/                # Next.js build output (auto-generated)
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── eslint.config.mjs     # ESLint configuration
```

## Setup & Installation

### 1. Clone or Navigate to the Project

```bash
cd "path/to/Company Project/pmd"
```

### 2. Install Dependencies

```bash
npm install
```

Or with other package managers:
```bash
yarn install
# or
pnpm install
# or
bun install
```

### 3. Verify Installation

```bash
npm run lint
```

This ensures all dependencies are properly installed and the project is ready for development.

## Development

### Start the Development Server

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000).

**Features:**
- Hot module replacement (HMR) - changes auto-reload in the browser
- Fast refresh for React components
- TypeScript type checking in real-time

### Making Changes

1. **Pages**: Edit files in `src/app/` to create or modify pages
2. **Components**: Create or edit components in `src/components/`
3. **Styles**: Modify Tailwind CSS classes directly in JSX or `tailwind.config.ts`
4. **Logic**: Add custom hooks in `src/hooks/` and utilities in `src/lib/`

Changes will automatically reflect in your browser.

### Linting

Check and fix code quality:

```bash
npm run lint
```

The project uses ESLint v9 with Next.js-specific rules.

## API & Data Management

### Simulated API Calls (Instead of Mock API Services)

This project uses **simulated API calls** rather than traditional mock API services (like MockAPI.io) for the following reasons:

#### Why Not Use MockAPI Services?

Mock API services have limitations that make them unsuitable for full CRUD operations:
- **Limited or No Delete Support**: Most mock services don't reliably support DELETE operations or don't persist the deletion state
- **No Real Data Updates**: UPDATE operations often don't properly modify stored data in a predictable way
- **Inconsistent Create Operations**: CREATE operations may not validate or persist data correctly
- **State Management Issues**: Data changes aren't reliably reflected across subsequent API calls

#### My Approach: Simulated API

Instead, we simulate API calls client-side using:
- **In-memory state management** with TanStack React Query
- **Custom hooks** that mimic real API behavior
- **Optimistic updates** to provide instant user feedback
- **Proper CRUD operation handling** (Create, Read, Update, Delete)

#### Benefits

- ✅ **Full CRUD Support**: Complete control over Create, Read, Update, and Delete operations
- ✅ **Predictable Behavior**: Consistent state management across all operations
- ✅ **No External Dependencies**: No reliance on third-party mock services
- ✅ **Easy Transition**: When connecting to a real backend API, simply replace the simulated calls with actual HTTP requests


### Build the Application

```bash
npm run build
```

This command:
- Compiles TypeScript
- Bundles the application
- Optimizes assets for production
- Outputs to the `.next/` directory

**Build time**: ~30-60 seconds (depending on project size)

### Preview Production Build Locally

After building, run the production server:

```bash
npm start
```

This serves your optimized production build on [http://localhost:3000](http://localhost:3000).

**Note**: This is for testing only. Use Vercel or your hosting provider for actual production deployment.



## Scripts Reference

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |


## Tech Stack

### Core Framework
- **Next.js 16.2.6**: React meta-framework for production
- **React 19.2.4**: UI library
- **React DOM 19.2.4**: DOM rendering

### State Management & Data Fetching
- **TanStack React Query**: Server state management and caching

### Forms & Validation
- **React Hook Form**: Performant form state management
- **Zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Form validation integration

### UI & Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible UI components
- **shadcn**: Pre-built component library
- **Lucide React**: Icon library
- **Sonner**: Toast notifications

### Development Tools
- **TypeScript 5**: Static type checking
- **ESLint 9**: Code quality
- **PostCSS 4**: CSS processing

## Troubleshooting

### Port 3000 Already in Use

If port 3000 is taken, specify a different port:

```bash
npm run dev -- -p 3001
```

### Dependencies Not Installing

Clear cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors on Start

Rebuild TypeScript cache:

```bash
npx tsc --noEmit
```

### Build Fails

1. Clear the `.next` directory:
   ```bash
   rm -rf .next
   ```

2. Rebuild:
   ```bash
   npm run build
   ```

3. Check for TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

