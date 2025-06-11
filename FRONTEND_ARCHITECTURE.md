
# Solivrah Frontend Architecture Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Design System](#design-system)
5. [Application Pages](#application-pages)
6. [Component Library](#component-library)
7. [State Management](#state-management)
8. [Routing & Navigation](#routing--navigation)
9. [Authentication System](#authentication-system)
10. [Database Integration](#database-integration)
11. [AI Integration](#ai-integration)
12. [Mobile Optimization](#mobile-optimization)
13. [Performance](#performance)
14. [Development Workflow](#development-workflow)

---

## Project Overview

Solivrah is a personal development and habit tracking Progressive Web Application (PWA) built with React and TypeScript. The app focuses on helping users build better habits through gamification, AI coaching, and community features.

### Core Features
- **Habit Tracking**: Daily quest completion with streak tracking
- **AI Coach**: Personalized guidance and affirmations
- **Gamification**: XP system, levels, badges, and achievements
- **Community**: Social features for motivation and support
- **Themes**: Discipline, Focus, Resilience, and Wisdom themed experiences
- **PWA**: Offline support and mobile-optimized experience

---

## Technology Stack

### Core Technologies
```json
{
  "framework": "React 18.3.1",
  "language": "TypeScript",
  "build": "Vite",
  "styling": "Tailwind CSS",
  "ui": "Shadcn/ui + Radix UI",
  "animations": "Framer Motion 12.7.4",
  "backend": "Supabase",
  "state": "React Context + TanStack Query",
  "routing": "React Router DOM 6.26.2"
}
```

### Key Dependencies
- **@supabase/supabase-js**: Backend integration
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animations and transitions
- **lucide-react**: Icon library
- **recharts**: Data visualization
- **react-hook-form**: Form management
- **date-fns**: Date utilities

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast development and building

---

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── home/            # Home page specific components
│   └── coach/           # Coach page specific components
├── pages/               # Route components
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── services/            # API and external service integrations
├── integrations/        # Third-party integrations
│   └── supabase/        # Supabase client and types
├── lib/                 # Utility functions
└── main.tsx            # Application entry point
```

### Component Organization
- **Pages**: Top-level route components
- **Components**: Reusable UI components
- **UI**: Base design system components
- **Feature Components**: Page-specific functionality

---

## Design System

### Color Palette
```css
/* Primary Theme Colors */
:root {
  --background: 0 0% 0%;           /* Pure black background */
  --foreground: 0 0% 100%;         /* White text */
  --muted: 0 0% 6%;               /* Dark gray for cards */
  --border: 0 0% 15%;             /* Border color */
  --accent: 0 0% 10%;             /* Accent background */
}

/* Theme-specific Colors */
.discipline {
  --theme-primary: 0 84% 60%;     /* Red theme */
  --theme-secondary: 0 84% 40%;
}

.focus {
  --theme-primary: 271 91% 65%;   /* Purple theme */
  --theme-secondary: 271 91% 45%;
}

.resilience {
  --theme-primary: 142 76% 36%;   /* Green theme */
  --theme-secondary: 142 76% 26%;
}

.wisdom {
  --theme-primary: 45 93% 47%;    /* Amber theme */
  --theme-secondary: 45 93% 37%;
}
```

### Typography
```css
/* Font Family */
font-family: 'Inter', sans-serif;

/* Text Scales */
.text-xs { font-size: 0.75rem; }    /* 12px */
.text-sm { font-size: 0.875rem; }   /* 14px */
.text-base { font-size: 1rem; }     /* 16px */
.text-lg { font-size: 1.125rem; }   /* 18px */
.text-xl { font-size: 1.25rem; }    /* 20px */
.text-2xl { font-size: 1.5rem; }    /* 24px */
.text-3xl { font-size: 1.875rem; }  /* 30px */
```

### Component Variants

#### PremiumCard Component
```typescript
interface PremiumCardProps {
  variant?: "default" | "subtle" | "accent";
  className?: string;
  children: React.ReactNode;
}

// Variants:
// default: Glassmorphism with white/10 border
// subtle: Reduced opacity for secondary content
// accent: Enhanced visibility for important content
```

#### Button Variants
```typescript
interface ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}
```

### Spacing System
```css
/* Tailwind Spacing Scale */
.p-1 { padding: 0.25rem; }    /* 4px */
.p-2 { padding: 0.5rem; }     /* 8px */
.p-3 { padding: 0.75rem; }    /* 12px */
.p-4 { padding: 1rem; }       /* 16px */
.p-5 { padding: 1.25rem; }    /* 20px */
.p-6 { padding: 1.5rem; }     /* 24px */
```

### Animation System
```typescript
// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};
```

---

## Application Pages

### 1. Landing Page (`/`)
**Purpose**: App introduction and theme selection
**Components**:
- `Logo`: Animated logo with text
- `ThemeBackground`: Dynamic gradient backgrounds
- Theme selection cards with animations
- Call-to-action buttons

**Key Features**:
- Theme preview with real-time background changes
- Smooth transitions between themes
- Mobile-optimized layout
- Progressive disclosure of features

### 2. Authentication Page (`/auth`)
**Purpose**: User login and registration
**Components**:
- `Auth`: Main authentication component
- Email/password forms
- Social login options (if configured)
- Form validation with react-hook-form

**Key Features**:
- Supabase authentication integration
- Form validation and error handling
- Responsive design
- Smooth transitions

### 3. Survey Page (`/survey`)
**Purpose**: Initial user onboarding questionnaire
**Components**:
- Multi-step survey flow
- Progress indicators
- Theme-specific styling
- Results processing

**Key Features**:
- Progressive form completion
- Data persistence to Supabase
- Theme customization based on responses
- Mobile-friendly interface

### 4. Home Page (`/home`)
**Purpose**: Main dashboard and daily overview
**Components**:
```typescript
// Key Components
- HeaderSection: User greeting and theme display
- ProgressCard: Streak, XP, and level information
- MoodSection: Daily mood tracking
- QuestCard: Active and available quests
- QuickActionSection: Fast access to features
- DailyAffirmation: AI-generated motivational content
```

**Layout Structure**:
```jsx
<Home>
  <ThemeBackground />
  <HeaderSection />
  <ProgressCard />
  <MoodSection />
  <QuestCard />
  <QuickActionSection />
  <DailyAffirmation />
  <TabNavigation />
</Home>
```

**Key Features**:
- Real-time data updates
- Gesture-based interactions
- Contextual help system
- Offline support

### 5. Quests Page (`/quests`)
**Purpose**: Quest browsing and management
**Components**:
- `VirtualizedQuestList`: Performance-optimized quest rendering
- Quest filtering and search
- Quest completion modals
- Progress tracking

**Quest Types**:
```typescript
interface Quest {
  id: string;
  title: string;
  description: string;
  category: "daily" | "weekly" | "monthly" | "special";
  difficulty: "easy" | "medium" | "hard";
  xp_reward: number;
  theme: "discipline" | "focus" | "resilience" | "wisdom";
  requirements?: string[];
  time_estimate?: number;
}
```

### 6. Community Page (`/community`)
**Purpose**: Social features and user interaction
**Components**:
- User leaderboards
- Achievement sharing
- Community challenges
- Social feed (future implementation)

**Key Features**:
- Real-time leaderboard updates
- Achievement badges
- Community events
- Social sharing capabilities

### 7. Coach Page (`/coach`)
**Purpose**: AI-powered personal coaching
**Components**:
```typescript
// AI Coach Components
- ChatInterface: Main conversation interface
- ChatHistoryDrawer: Previous conversations
- AIService: OpenAI integration
- ContextHelp: Guided assistance
```

**AI Features**:
- Personalized coaching based on user data
- Conversation history persistence
- Context-aware responses
- Motivational content generation

### 8. Profile Page (`/profile`)
**Purpose**: User settings and progress overview
**Components**:
```typescript
// Profile Tabs
- ProfileOverview: Stats and achievements summary
- ProfileAchievements: Badge and achievement system
- ProfileSettings: App configuration and preferences
- ProfileReset: Progress reset functionality
```

**Key Features**:
- Profile image and banner uploads
- Achievement badge system
- Settings management
- Data export/import options

---

## Component Library

### Core UI Components (`src/components/ui/`)

#### Card System
```typescript
// Card.tsx - Base card component
interface CardProps {
  className?: string;
  children: React.ReactNode;
}

// PremiumCard.tsx - Enhanced card with glassmorphism
interface PremiumCardProps extends CardProps {
  variant?: "default" | "subtle" | "accent";
}
```

#### Navigation Components
```typescript
// TabNavigation.tsx - Bottom navigation
interface TabNavigationProps {
  activeTab?: string;
}

// Navigation items configuration
const navTabs = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/quests", icon: Award, label: "Quests" },
  { to: "/coach", icon: MessageCircle, label: "Coach" },
  { to: "/community", icon: Users, label: "Community" },
  { to: "/profile", icon: User, label: "Profile" }
];
```

#### Form Components
```typescript
// Button variants and sizes
interface ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

// Input components with validation
interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}
```

### Feature-Specific Components

#### Home Page Components
```typescript
// ProgressCard.tsx - User progress display
interface ProgressCardProps {
  streak: number;
  xp: number;
  level: number;
  completedQuests: number;
}

// MoodSection.tsx - Daily mood tracking
interface MoodSectionProps {
  onMoodSelect: (mood: string) => void;
  selectedMood?: string;
}

// QuestCard.tsx - Quest display and interaction
interface QuestCardProps {
  quest: Quest;
  onComplete: (questId: string) => void;
  isCompleted?: boolean;
}
```

#### Profile Components
```typescript
// ProfileTabs.tsx - Tab navigation for profile sections
interface ProfileTabsProps {
  defaultTab?: string;
}

// ProfileStats.tsx - User statistics with charts
interface ProfileStatsProps {
  userData: UserProfile;
  chartData: ChartData[];
}

// ProfileAchievements.tsx - Achievement display
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
}
```

### Utility Components

#### Camera and Media
```typescript
// CameraUpload.tsx - Photo capture functionality
interface CameraUploadProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  aspectRatio?: "1:1" | "16:9";
}

// OptimizedImage.tsx - Performance-optimized image loading
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}
```

#### Icons and Branding
```typescript
// SolivrahIcons.tsx - Custom icon library
export const SolivrahBrandIcon: React.FC<{ size?: number }>;
export const IconButton: React.FC<IconButtonProps>;

// Available custom icons:
- TriangleIcon, CircleIcon, PersonIcon
- TargetIcon, SliderIcon, SunIcon
- ToggleIcon, CloudIcon, HeartIcon
- DiamondIcon, GridIcon, LineIcon
```

---

## State Management

### React Context Architecture

#### AppContext (`src/context/AppContext.tsx`)
```typescript
interface AppContextType {
  // User Management
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;

  // App State
  streak: number;
  xp: number;
  completedQuests: number;
  selectedTheme: Theme;
  setSelectedTheme: (theme: Theme) => void;

  // Quest Management
  availableQuests: Quest[];
  completeQuest: (questId: string) => Promise<void>;
  
  // Settings
  resetProgress: () => Promise<void>;
}

// Theme Types
type Theme = "Discipline" | "Focus" | "Resilience" | "Wisdom";
```

### TanStack Query Integration
```typescript
// Query configuration for server state
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Example query usage
const { data: quests, isLoading } = useQuery({
  queryKey: ['quests', userId],
  queryFn: () => fetchUserQuests(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Mutation example
const completeMutation = useMutation({
  mutationFn: completeQuest,
  onSuccess: () => {
    queryClient.invalidateQueries(['quests']);
    queryClient.invalidateQueries(['userProfile']);
  },
});
```

### Local State Patterns
```typescript
// Component-level state management
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// Form state with react-hook-form
const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

// Animation state with framer-motion
const [isVisible, setIsVisible] = useState(false);
const controls = useAnimation();
```

---

## Routing & Navigation

### Route Configuration
```typescript
// App.tsx - Main route configuration
const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/auth", element: <Auth /> },
  { path: "/survey", element: <Survey /> },
  {
    path: "/home",
    element: <ProtectedRoute><Home /></ProtectedRoute>
  },
  {
    path: "/quests",
    element: <ProtectedRoute><Quests /></ProtectedRoute>
  },
  {
    path: "/coach",
    element: <ProtectedRoute><Coach /></ProtectedRoute>
  },
  {
    path: "/community",
    element: <ProtectedRoute><Community /></ProtectedRoute>
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  { path: "/help", element: <Help /> },
  { path: "*", element: <NotFound /> }
]);
```

### Protected Routes
```typescript
// ProtectedRoute component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useApp();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth" replace />;
  
  return <>{children}</>;
};
```

### Navigation Patterns
```typescript
// TabNavigation - Bottom navigation bar
const TabNavigation: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  
  // Auto-hide on non-main pages
  const shouldShow = ['/home', '/quests', '/coach', '/community', '/profile']
    .includes(location.pathname);
    
  if (!shouldShow) return null;
  
  return (
    <motion.div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Navigation content */}
    </motion.div>
  );
};
```

---

## Authentication System

### Supabase Authentication
```typescript
// AuthService.ts - Authentication methods
export class AuthService {
  static async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
}
```

### User Profile Management
```typescript
// User profile structure
interface UserProfile {
  id: string;
  email: string;
  streak: number;
  xp: number;
  theme: Theme;
  created_at: string;
  updated_at: string;
  role?: 'user' | 'admin';
}

// Profile operations
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### Authentication States
```typescript
// Authentication flow states
type AuthState = 
  | 'loading'           // Initial app load
  | 'unauthenticated'  // No user session
  | 'authenticated'    // Valid user session
  | 'error';           // Authentication error

// Session management
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

---

## Database Integration

### Supabase Schema

#### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  streak INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  theme TEXT DEFAULT 'Discipline',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT DEFAULT 'user'
);
```

#### Quests Table
```sql
CREATE TABLE quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 100,
  theme TEXT,
  requirements JSONB,
  time_estimate INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### User Quests (Completion Tracking)
```sql
CREATE TABLE user_quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  photo_url TEXT,
  UNIQUE(user_id, quest_id)
);
```

#### Chat History
```sql
CREATE TABLE chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Survey Responses
```sql
CREATE TABLE survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  responses JSONB NOT NULL,
  theme_recommendation TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Database Operations

#### Quest Management
```typescript
// Fetch available quests
export const fetchQuests = async (): Promise<Quest[]> => {
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

// Complete a quest
export const completeQuest = async (questId: string, userId: string, photoUrl?: string) => {
  const { data, error } = await supabase
    .from('user_quests')
    .insert({
      user_id: userId,
      quest_id: questId,
      photo_url: photoUrl
    });
    
  if (error) throw error;
  
  // Update user XP
  await updateUserXP(userId, questXP);
  
  return data;
};
```

#### Real-time Subscriptions
```typescript
// Real-time updates for user profile
useEffect(() => {
  if (!user) return;
  
  const channel = supabase
    .channel('profile-changes')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'profiles',
      filter: `id=eq.${user.id}`
    }, (payload) => {
      setUserProfile(payload.new as UserProfile);
    })
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
}, [user]);
```

### Storage Integration
```typescript
// File upload to Supabase Storage
export const uploadProfileImage = async (userId: string, file: File): Promise<string> => {
  const filePath = `${userId}/profile`;
  
  const { error: uploadError } = await supabase.storage
    .from('profile-images')
    .upload(filePath, file, { upsert: true });
    
  if (uploadError) throw uploadError;
  
  const { data } = supabase.storage
    .from('profile-images')
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};
```

---

## AI Integration

### OpenAI Service Configuration
```typescript
// AIService.ts - OpenAI integration
export class AIService {
  private static openai = new OpenAI({
    apiKey: process.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  static async generateCoachResponse(
    message: string, 
    userContext: UserContext
  ): Promise<string> {
    const systemPrompt = `You are Solivrah, a personal development coach. 
    User theme: ${userContext.theme}
    User level: ${Math.floor(userContext.xp / 1000) + 1}
    Current streak: ${userContext.streak} days
    
    Provide encouraging, personalized guidance based on their ${userContext.theme} theme.`;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    return completion.choices[0]?.message?.content || "I'm here to help you grow!";
  }

  static async generateDailyAffirmation(theme: Theme): Promise<string> {
    const prompts = {
      Discipline: "Generate a motivating affirmation about self-discipline and consistency.",
      Focus: "Create an inspiring message about maintaining focus and clarity.",
      Resilience: "Craft an empowering affirmation about resilience and overcoming challenges.",
      Wisdom: "Provide a thoughtful affirmation about gaining wisdom and making good decisions."
    };

    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompts[theme] }],
      max_tokens: 100,
      temperature: 0.8
    });

    return completion.choices[0]?.message?.content || "You have the power to create positive change.";
  }
}
```

### AI Knowledge Base
```typescript
// AIKnowledgeBase.ts - Contextual responses
export class AIKnowledgeBase {
  static getThemeGuidance(theme: Theme): string {
    const guidance = {
      Discipline: "Focus on building consistent daily habits. Small actions compound into major results.",
      Focus: "Eliminate distractions and prioritize what truly matters. Deep work creates extraordinary outcomes.",
      Resilience: "Embrace challenges as growth opportunities. Your ability to bounce back defines your success.",
      Wisdom: "Seek to understand before being understood. Make decisions based on principles, not emotions."
    };
    
    return guidance[theme];
  }

  static getQuestRecommendations(userLevel: number, theme: Theme): Quest[] {
    // Return curated quests based on user progress and theme
    return questDatabase.filter(quest => 
      quest.theme === theme && 
      quest.recommended_level <= userLevel
    );
  }
}
```

### Chat Interface Implementation
```typescript
// Coach page chat implementation
const Coach: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, selectedTheme, streak, xp } = useApp();

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await AIService.generateCoachResponse(input, {
        theme: selectedTheme,
        streak,
        xp,
        userId: user?.id
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Save to chat history
      await saveChatHistory(user?.id, input, response);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHistory messages={messages} />
      <ChatInput 
        value={input}
        onChange={setInput}
        onSend={sendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};
```

---

## Mobile Optimization

### Progressive Web App (PWA) Configuration

#### Manifest (`public/manifest.json`)
```json
{
  "name": "Solivrah",
  "short_name": "Solivrah",
  "description": "Personal development coach and habit tracker",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/lovable-uploads/3175d335-84c5-4f7a-954e-9795d0e93059.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

#### Service Worker (`public/sw.js`)
```javascript
// Basic service worker for offline support
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('solivrah-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/static/js/bundle.js',
        '/static/css/main.css',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

### iOS Safe Area Handling
```css
/* Safe area support for iOS devices */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Bottom navigation safe area */
.pb-safe {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}

/* Dynamic Island and notch support */
@supports (padding: max(0px)) {
  .safe-area-top {
    padding-top: max(1rem, env(safe-area-inset-top));
  }
}
```

### Touch Optimization
```css
/* Touch target sizes (minimum 44px) */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Touch feedback */
.touch-feedback {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0.1);
  touch-action: manipulation;
}

/* Scroll optimization */
.scroll-smooth {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}
```

### Responsive Breakpoints
```css
/* Mobile-first responsive design */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }

/* Mobile-specific styles */
@media (max-width: 639px) {
  .mobile-only { display: block; }
  .desktop-only { display: none; }
}
```

### Gesture Support
```typescript
// Touch gesture handling with framer-motion
const gestureConfig = {
  drag: true,
  dragConstraints: { left: 0, right: 0, top: 0, bottom: 100 },
  dragElastic: 0.2,
  onDragEnd: (event, info) => {
    if (info.offset.y > 50) {
      onSwipeDown();
    }
  }
};

// Pull-to-refresh implementation
const [refreshing, setRefreshing] = useState(false);

const handleRefresh = async () => {
  setRefreshing(true);
  await refetchData();
  setRefreshing(false);
};
```

---

## Performance

### Code Splitting
```typescript
// Route-based code splitting
const Home = lazy(() => import('./pages/Home'));
const Quests = lazy(() => import('./pages/Quests'));
const Coach = lazy(() => import('./pages/Coach'));

// Component with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Home />
</Suspense>
```

### Image Optimization
```typescript
// OptimizedImage component
const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className,
  fallback = '/placeholder.svg'
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={error ? fallback : src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
```

### Virtual Scrolling
```typescript
// VirtualizedQuestList for large datasets
export const VirtualizedQuestList: React.FC<VirtualizedQuestListProps> = ({ 
  quests,
  onQuestComplete 
}) => {
  const [containerRef, { height }] = useMeasure();
  const itemHeight = 120;
  const overscan = 5;

  const { virtualItems, totalSize } = useVirtual({
    size: quests.length,
    parentRef: containerRef,
    estimateSize: () => itemHeight,
    overscan
  });

  return (
    <div ref={containerRef} className="h-full overflow-auto">
      <div style={{ height: totalSize }}>
        {virtualItems.map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: virtualRow.start,
              left: 0,
              width: '100%',
              height: virtualRow.size
            }}
          >
            <QuestCard
              quest={quests[virtualRow.index]}
              onComplete={onQuestComplete}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Memoization Strategies
```typescript
// Custom hook for expensive calculations
export const useMemoized = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  return useMemo(factory, deps);
};

// Component memoization
export const QuestCard = memo<QuestCardProps>(({ quest, onComplete }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.quest.id === nextProps.quest.id &&
         prevProps.quest.completed === nextProps.quest.completed;
});
```

### Bundle Optimization
```typescript
// Vite configuration for optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs'],
          charts: ['recharts'],
          motion: ['framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

---

## Development Workflow

### Code Standards

#### TypeScript Configuration
```json
// tsconfig.json key settings
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

#### ESLint Rules
```json
// .eslintrc.js essential rules
{
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

### Component Development Patterns

#### Component Structure Template
```typescript
// ComponentName.tsx template
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ComponentNameProps {
  // Props interface
  className?: string;
  children?: React.ReactNode;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  className,
  children,
  ...props
}) => {
  // Hooks
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // Handlers
  const handleAction = () => {
    // Event handling
  };

  // Render
  return (
    <motion.div
      className={cn("base-classes", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

ComponentName.displayName = 'ComponentName';
```

#### Custom Hook Pattern
```typescript
// useCustomHook.ts template
import { useState, useEffect, useCallback } from 'react';

interface UseCustomHookOptions {
  // Options interface
}

interface UseCustomHookReturn {
  // Return value interface
}

export const useCustomHook = (
  options: UseCustomHookOptions
): UseCustomHookReturn => {
  // Hook implementation
  
  return {
    // Return values
  };
};
```

### Testing Strategy

#### Component Testing
```typescript
// Component.test.tsx template
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle interactions', () => {
    const handleClick = jest.fn();
    render(<ComponentName onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Build and Deployment

#### Build Configuration
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

#### Environment Variables
```bash
# .env.example
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### Accessibility Guidelines

#### WCAG AA Compliance
```typescript
// Accessibility requirements
const accessibilityChecklist = {
  colorContrast: 'Minimum 4.5:1 ratio',
  focusIndicators: 'Visible focus states for all interactive elements',
  keyboardNavigation: 'Full keyboard accessibility',
  screenReaderSupport: 'Proper ARIA labels and semantic HTML',
  touchTargets: 'Minimum 44px touch targets',
  textScaling: 'Support up to 200% zoom'
};

// Implementation example
<button
  aria-label="Complete quest"
  className="min-h-[44px] min-w-[44px] focus:ring-2 focus:ring-white/30"
  onClick={handleComplete}
>
  <Check size={20} />
</button>
```

---

## Implementation Checklist

### Phase 1: Core Setup ✅
- [x] Project structure and dependencies
- [x] Design system and theming
- [x] Authentication system
- [x] Database schema
- [x] Basic routing

### Phase 2: Core Features ✅
- [x] User onboarding flow
- [x] Home dashboard
- [x] Quest system
- [x] Profile management
- [x] Basic AI integration

### Phase 3: Advanced Features ✅
- [x] Community features
- [x] Achievement system
- [x] Advanced AI coaching
- [x] Mobile optimization
- [x] PWA capabilities

### Phase 4: Polish & Performance 🔄
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Advanced animations
- [ ] Error boundary implementation
- [ ] Comprehensive testing

### Phase 5: Future Enhancements 📋
- [ ] Push notifications
- [ ] Social sharing
- [ ] Advanced analytics
- [ ] Offline sync
- [ ] Multi-language support

---

## Key Files Reference

### Critical Configuration Files
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main app component and routing
- `src/context/AppContext.tsx` - Global state management
- `src/integrations/supabase/client.ts` - Database client
- `tailwind.config.ts` - Design system configuration
- `index.html` - PWA configuration

### Core Component Files
- `src/components/TabNavigation.tsx` - Main navigation
- `src/components/PremiumCard.tsx` - Base card component
- `src/components/ThemeBackground.tsx` - Dynamic backgrounds
- `src/pages/Home.tsx` - Main dashboard
- `src/pages/Profile.tsx` - User profile and settings

### Integration Files
- `src/services/AIService.ts` - OpenAI integration
- `src/services/AuthService.ts` - Authentication logic
- `src/services/SupabaseService.ts` - Database operations

---

## Conclusion

This comprehensive architecture document provides a complete blueprint for the Solivrah frontend application. The system is designed to be:

- **Scalable**: Modular component architecture supports growth
- **Maintainable**: Clear separation of concerns and documented patterns
- **Performant**: Optimized for mobile and web platforms
- **Accessible**: WCAG AA compliant design system
- **Modern**: Built with current best practices and technologies

The architecture supports the core mission of helping users build better habits through gamification, AI coaching, and community engagement, while providing a smooth, engaging user experience across all devices.

For implementation questions or clarifications, refer to the specific component documentation and code examples provided throughout this document.
