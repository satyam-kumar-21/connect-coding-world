# Coding World Connect - Frontend

A modern, dark-themed developer social and collaboration platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🌐 **Developer Social Network** - Connect with developers, share posts, and build your network
- 💻 **Coding Problems** - Solve coding challenges and earn XP
- 🏆 **Leaderboard** - Compete with developers globally, weekly, and monthly
- 🔴 **Live Collaboration** - Find developers who are available for real-time collaboration
- 💬 **Real-time Messaging** - Chat with connections using Socket.IO
- 📊 **Developer Profiles** - Showcase your skills, achievements, and coding statistics
- 🔔 **Notifications** - Stay updated with real-time notifications
- 🎯 **XP & Ranking System** - Earn points and climb the leaderboard

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Real-time**: Socket.IO Client
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (main)/            # Main app routes
│   │   ├── page.tsx       # Home/Feed
│   │   ├── problems/      # Coding problems
│   │   ├── leaderboard/   # Leaderboard
│   │   ├── live/          # Live developers
│   │   ├── connections/   # Connections management
│   │   ├── messages/      # Messaging
│   │   ├── profile/       # User profiles
│   │   └── settings/      # Settings
│   └── auth/              # Authentication pages
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── features/         # Feature-specific components
│   ├── ui/               # Base UI components
│   └── skeletons/        # Loading skeletons
├── services/             # API service layer
├── stores/               # Zustand stores
├── types/                # TypeScript types
├── lib/                  # Utilities and config
└── public/               # Static assets
```

## Features Overview

### Authentication
- Login and Registration with validation
- Password strength indicator
- JWT-based authentication
- Protected routes

### Home Feed
- Create posts with different visibility levels
- React to posts (Like, Love, Helpful, Celebrate, Interesting)
- Comment and reply system
- Save posts for later

### Problems
- Browse coding problems by category and difficulty
- Filter problems (DSA, JavaScript, React, Python, etc.)
- Track solved problems
- Earn XP for solving problems

### Live Developers
- See developers who are currently available
- Send collaboration requests with optional messages
- Real-time status updates

### Messaging
- Real-time chat with connections
- Conversation list with unread counts
- Online/offline status indicators
- Message read receipts

### Leaderboard
- Global, weekly, and monthly rankings
- Display XP, problems solved, streak, and acceptance rate
- Highlighted ranks for top 3 developers

### Profile
- Customizable developer profile
- Display skills, XP, rank, and statistics
- Social links (GitHub, LinkedIn, Website)
- Activity timeline

### Settings
- Account management
- Profile customization
- Privacy controls
- Availability settings
- Notification preferences

## Design System

The application uses a dark-first design with:

- **Primary Color**: Purple (#8B5CF6)
- **Background**: Dark slate (#0F172A)
- **Cards**: Slightly lighter dark (#1E293B)
- **Borders**: Subtle dark borders
- **Typography**: Clean, modern font stack

## API Integration

All API calls are abstracted through service modules in the `services/` directory:

- `auth.service.ts` - Authentication
- `users.service.ts` - User operations
- `posts.service.ts` - Post operations
- `problems.service.ts` - Problem operations
- `connections.service.ts` - Connection management
- `messages.service.ts` - Messaging
- `notifications.service.ts` - Notifications
- `leaderboard.service.ts` - Leaderboard data
- `live.service.ts` - Live developer features

## Real-time Features

Socket.IO integration provides real-time updates for:

- New messages
- User online/offline status
- Connection requests
- Notifications
- Collaboration invitations
- Typing indicators

## Responsive Design

The application is fully responsive with:

- Desktop: Full layout with sidebar
- Tablet: Adjusted layout
- Mobile: Bottom navigation and drawer menus

## Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatible

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_SOCKET_URL` - Socket.IO server URL

## Production Deployment

1. Update environment variables for production
2. Build the application: `npm run build`
3. Start production server: `npm start`

Or deploy to Vercel with one click.

## Contributing

This is a private project for Coding World.

## License

Proprietary - All rights reserved
