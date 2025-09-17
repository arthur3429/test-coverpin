# Mini Seller Console

A modern, high-performance lead management dashboard built with React, TypeScript, and Vite. Features advanced UI patterns, drag-and-drop functionality, and persistent local state management for optimal user experience.

## ✨ Key Features

### 🎯 Lead Management
- **Virtualized Lead Lists**: High-performance rendering of large datasets using `react-window`
- **Advanced Filtering & Sorting**: Real-time search, status filtering, and multi-field sorting
- **Lead Scoring System**: Built-in lead qualification scoring with visual indicators
- **Lead-to-Opportunity Conversion**: Seamless conversion workflow with data preservation

### 📊 Dual Opportunity Views
- **Kanban Board**: Interactive drag-and-drop pipeline management with `@dnd-kit`
  - Stage-based columns (Prospecting → Closed Won/Lost)
  - Visual priority indicators and probability tracking
  - Per-column pagination with "Load More" functionality
- **Table View**: Traditional table layout with sorting and filtering capabilities

### 💾 Persistent State Management
- **Local Storage Integration**: User preferences, filters, and kanban state persist across sessions
- **Local-First Architecture**: All data operations are localStorage-based with API-ready structure
- **Optimistic Updates**: Instant UI feedback with realistic loading states

### ⚡ Performance Optimizations
- **Smart Memoization**: Expensive filtering operations are cached
- **Component Virtualization**: Handles thousands of leads without performance degradation
- **Lazy Loading**: Progressive data loading in kanban columns
- **Optimized Bundles**: Tree-shaking and code splitting with Vite

### 🛠️ Technical Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Radix UI + Tailwind CSS
- **Drag & Drop**: @dnd-kit/core with custom implementations
- **State Management**: Custom hooks with localStorage persistence
- **Icons**: Lucide React
- **Build Tool**: Vite with optimized development experience

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (port 8080)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Architecture Highlights

- **Feature-Grouped Components**: Related components organized in feature directories
- **Custom Hooks**: Reusable logic for data management and localStorage persistence
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures
- **Modular Design**: Clean separation of concerns with single-responsibility components


## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS