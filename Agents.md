# Agent Guide: Web Repository

## 🧠 Context
This is the **Frontend Web Application**, built with React, Vite, and Tailwind CSS. It focuses on a "Premium, Dark Mode" aesthetic.

## 🏗 Structure
- **`src/`**: Source code.
  - **`components/`**: Reusable UI atoms/molecules.
  - **`pages/`**: Route views (Home, Login, Room).
  - **`hooks/`**: Custom React hooks (`useAuth`, `useRoom`).
  - **`services/`**: API clients (`supabaseClient`, `apiClient`).
- **`tests/`**: Playwright E2E tests.

## 🔑 Key Facts for Agents
1.  **State**: Uses Context API for Auth and Theme.
2.  **API**: Talk to Backend API (for logic) and Supabase (for Auth/Realtime).
3.  **Styling**: Tailwind CSS + CSS Modules for complex animations.
4.  **Testing**: heavy reliance on Playwright for critical flows.

## 🛠 Common Tasks
- **Dev Server**: `npm run dev`
- **Run Tests**: `npx playwright test`
- **Build**: `npm run build`
