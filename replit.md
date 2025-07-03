# Solivrah - Personal Development Coach & Habit Tracker

## Overview

Solivrah is a modern Progressive Web Application (PWA) that serves as a personal development coach and habit tracker. Built with React, TypeScript, and Node.js, it combines AI-powered coaching, gamified quest systems, and community features to help users build better habits and achieve their goals. The application is designed with a mobile-first approach and features offline support.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Animations**: Framer Motion for smooth, performant animations
- **State Management**: React Context API for global app state
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Supabase Auth for user management
- **File Storage**: Supabase Storage for user-generated content
- **AI Integration**: OpenRouter API for AI coaching functionality

### Database Schema
- **Users Table**: Basic user information and authentication
- **Profiles Table**: Extended user profiles with preferences and progress
- **Survey Responses**: Initial user onboarding data
- **Quest Completions**: User progress tracking
- **Chat History**: AI coach conversation storage

## Key Components

### Authentication System
- **Provider**: Supabase Auth with email/password and OAuth support
- **Guest Mode**: Allows users to try the app without registration
- **Session Management**: Automatic token refresh and state persistence
- **Route Protection**: Conditional access based on authentication status

### Quest System
- **Theme-Based Quests**: Four themes (Focus, Discipline, Resilience, Wildcards)
- **Progressive Unlocking**: Quests unlock sequentially as users complete them
- **Photo Verification**: Some quests require photo proof of completion
- **XP Rewards**: Gamified experience points for quest completion
- **Offline Support**: Quest completion works offline with sync when online

### AI Coach
- **Conversational Interface**: Chat-based interaction with AI coach
- **Context Awareness**: AI responses tailored to user's chosen theme and progress
- **Mood Integration**: Considers user's mood for personalized advice
- **Chat History**: Persistent conversation storage and retrieval

### Progressive Web App Features
- **Service Worker**: Offline functionality and caching
- **Manifest**: Native app-like installation and behavior
- **Responsive Design**: Mobile-first with desktop compatibility
- **Push Notifications**: (Configured but implementation pending)

## Data Flow

### User Journey
1. **Landing Page**: Introduction and authentication options
2. **Survey**: Initial onboarding to determine user goals and theme preference
3. **Home Dashboard**: Daily affirmations, current quest, mood tracking, and progress overview
4. **Quest System**: Browse, complete, and track daily challenges
5. **AI Coach**: Get personalized guidance and support
6. **Community**: View leaderboards and connect with other users
7. **Profile**: Track achievements, manage settings, and view statistics

### Data Synchronization
- **Real-time Updates**: Changes sync immediately when online
- **Offline Queue**: Operations are queued when offline and sync when connection is restored
- **Conflict Resolution**: Last-write-wins strategy for conflicting changes
- **Local Storage**: Critical data cached locally for offline access

## External Dependencies

### Core Services
- **Supabase**: Authentication, database, and file storage
- **OpenRouter**: AI model access for coaching functionality
- **Neon Database**: Serverless PostgreSQL hosting

### Development Tools
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Fast JavaScript bundling for production
- **PostCSS**: CSS processing with Tailwind CSS

### UI Libraries
- **Radix UI**: Accessible primitive components
- **Lucide React**: Icon library
- **React Hook Form**: Form validation and management
- **Recharts**: Data visualization for user statistics

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to static assets in `dist/public`
2. **Backend Build**: ESBuild bundles server code to `dist/index.js`
3. **Database Migration**: Drizzle Kit pushes schema changes to production database

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase public API key
- `OPENROUTER_API_KEY`: AI service API key
- `AI_MODEL`: Selected AI model identifier

### Production Deployment
- **Static Assets**: Served from `dist/public` directory
- **API Server**: Express.js server handling API routes and serving static files
- **Database**: Neon serverless PostgreSQL with connection pooling
- **CDN**: Static assets can be served via CDN for better performance

## Changelog

Changelog:
- July 01, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.