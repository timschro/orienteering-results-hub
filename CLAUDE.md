# CLAUDE.md - Guide for the Orienteering Results Hub

## Build Commands
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linting

## Code Style Guidelines
- **Framework**: Next.js with TypeScript
- **Components**: Use shadcn/ui component library based on Radix UI
- **Styling**: Tailwind CSS with className patterns (no inline styles)
- **Naming**: 
  - React components: PascalCase
  - Functions/hooks: camelCase with use prefix for hooks
  - Files containing components: kebab-case.tsx
- **Imports**: Group by external, then internal, then relative
- **Types**: Use TypeScript interfaces/types for all props and state
- **Error Handling**: Use try/catch with appropriate user feedback
- **State Management**: React hooks for local state

## Project Structure
- `/app`: Next.js app router pages
- `/components`: Reusable UI components
- `/lib`: Utility functions and shared code
- `/public`: Static assets
- `/styles`: Global styles