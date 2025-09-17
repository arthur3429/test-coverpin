# Copilot Instructions for Mini Seller Console

## Project Overview
Mini Seller Console is a React + TypeScript lead management dashboard built with Vite, utilizing advanced UI patterns including virtualization, drag-and-drop kanban boards, and persistent local state management.

## Architecture & Key Patterns

### Component Structure
- **Dual UI System**: Mix of custom components (`src/components/ui/custom-*`) and shadcn/ui components (`src/components/ui/*`)
- **Custom components** (Button, Card, Input, Select, SlideOver) have extended props for styling variants (size, padding, shadow, etc.)
- **shadcn components** follow standard Radix UI + Tailwind patterns with forwardRef and className merging via `cn()`

### Data Flow & State Management
- **Main data hook**: `useLeads()` handles all lead/opportunity CRUD operations and filtering logic
- **Persistent state**: `useLocalStorage()` hook for filters, sort preferences, and kanban board state
- **Local-first**: Opportunities stored in localStorage, leads loaded from static JSON (`/leads-data.json`)
- **No external APIs**: All data operations are mocked with setTimeout delays for realistic UX

### Performance Optimizations
- **Virtualization**: `VirtualizedLeadsList` uses react-window for large datasets (see `virtualized-leads/` utils)
- **Kanban pagination**: Per-column visible count limiting with "Load More" buttons
- **Memoized filtering**: `useMemo` for expensive filter/sort operations in main Index page

### Drag & Drop Implementation
- **@dnd-kit/core** for kanban boards with custom drag overlays
- **BoardState persistence**: Full kanban state (columns, cardIds, cardsById) stored in localStorage
- **Stage synchronization**: Moving cards between stage-mapped columns auto-updates opportunity.stage

## Development Conventions

### File Organization
```
src/
├── components/
│   ├── ui/custom-* (extended styling props)
│   ├── ui/* (shadcn standard)
│   ├── opportunities-kanban/ (feature-grouped)
│   └── virtualized-leads/ (feature-grouped)
├── hooks/ (custom hooks with localStorage, data fetching)
├── types/ (centralized TypeScript interfaces)
└── pages/ (route components)
```

### Styling Patterns
- **Tailwind CSS** with custom CSS variables in theme extension
- **Class variance authority** (`cva`) for component variants in shadcn components
- **Custom theme colors**: Extended palette with input-border, success, warning, error variants
- **Responsive design**: Mobile-first with `useIsMobile()` hook for conditional rendering

### Key Dependencies & Usage
- **@tanstack/react-query**: Configured in App.tsx but not actively used (prepared for future API integration)
- **react-router-dom**: Simple routing with catch-all 404 handling
- **@dnd-kit**: Drag and drop with pointer sensors and 5px activation distance
- **react-window**: List virtualization with fixed item heights (72px constant)
- **lucide-react**: Icon library used throughout UI components

### Development Scripts
```bash
npm run dev          # Start Vite dev server on port 8080
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # ESLint with React hooks plugin
npm run preview      # Preview production build
```

## Component Implementation Guidelines

### When creating new components:
1. **Feature-grouped**: Place related components in feature directories (like `opportunities-kanban/`)
2. **Custom variants**: For components needing extended styling, follow `custom-*` pattern with prop-based variants
3. **State persistence**: Use `useLocalStorage()` for user preferences and local data
4. **Performance**: Consider virtualization for lists >100 items, use `useMemo` for expensive computations
5. **Accessibility**: Follow shadcn patterns for keyboard navigation and screen readers

### When working with data:
1. **Lead/Opportunity flow**: Leads convert to Opportunities via `convertLeadToOpportunity()` in useLeads hook
2. **Filtering logic**: Centralized in `filterAndSortLeads()` method with search, status, and source filters
3. **Local storage keys**: Use descriptive prefixes like `'lead-filters'`, `'opps-kanban-v1'` for versioning

This codebase emphasizes performance, user experience, and maintainable patterns while preparing for future backend integration.