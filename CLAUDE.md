# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- **Development server**: `npm run dev` - Starts Vite dev server with HMR
- **Build**: `npm run build` - Creates production build in `dist/`
- **Lint**: `npm run lint` - Runs ESLint on all JS/JSX files
- **Preview**: `npm run preview` - Preview production build locally

## Architecture

This is a React + Vite application for Seamless Restoration business. Currently in initial state with default Vite template.

**Tech Stack:**
- React 19 with JSX
- Vite 6 for build tooling and dev server
- ESLint with React hooks and refresh plugins

**Project Structure:**
- `src/` - Source code with React components
- `public/` - Static assets served directly
- Entry point: `src/main.jsx` renders `App.jsx` into `#root`

**ESLint Configuration:**
- Uses flat config format with recommended rules
- Enforces React Hooks rules and component refresh patterns
- Ignores unused vars with uppercase/underscore prefix pattern