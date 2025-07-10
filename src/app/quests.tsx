import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppSound } from "@/context/SoundContext";
import { HeaderSection } from "@/components/composite/HeaderSection";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, 
  TrendingUp, 
  Award, 
  Brain, 
  Heart, 
  Dumbbell, 
  Search, 
  Filter, 
  Clock, 
  Star, 
  X 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Quest interface
interface Quest {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  duration: string;
  points: number;
  isNew: boolean;
  isFeatured: boolean;
  isCompleted: boolean;
}

// Sample quest data
const SAMPLE_QUESTS: Quest[] = [
  {
    id: "1",
    title: "Morning Meditation",
    description: "Start your day with 5 minutes of mindful breathing",
    category: "mindfulness",
    difficulty: "easy",
    duration: "5 min",
    points: 10,
    isNew: false,
    isFeatured: true,
    isCompleted: false,
  },
  {
    id: "2",
    title: "Gratitude Journal",
    description: "Write down 3 things you're grateful for today",
    category: "wellbeing",
    difficulty: "easy",
    duration: "10 min",
    points: 15,
    isNew: true,
    isFeatured: false,
    isCompleted: false,
  },
  {
    id: "3",
    title: "Hydration Check",
    description: "Drink 8 glasses of water throughout the day",
    category: "health",
    difficulty: "medium",
    duration: "All day",
    points: 20,
    isNew: false,
    isFeatured: false,
    isCompleted: false,
  },
  {
    id: "4",
    title: "Digital Detox",
    description: "Spend 2 hours away from screens and digital devices",
    category: "mindfulness",
    difficulty: "medium",
    duration: "2 hours",
    points: 25,
    isNew: false,
    isFeatured: false,
    isCompleted: false,
  },
  {
    id: "5",
    title: "Power Walk",
    description: "Take a brisk 20-minute walk outdoors",
    category: "fitness",
    difficulty: "medium",
    duration: "20 min",
    points: 20,
    isNew: false,
    isFeatured: true,
    isCompleted: false,
  },
  {
    id: "6",
    title: "Mindful Eating",
    description: "Eat one meal without distractions, focusing on flavors and textures",
    category: "mindfulness",
    difficulty: "easy",
    duration: "15 min",
    points: 15,
    isNew: false,
    isFeatured: false,
    isCompleted: true,
  },
  {
    id: "7",
    title: "Strength Training",
    description: "Complete a 30-minute strength workout",
    category: "fitness",
    difficulty: "hard",
    duration: "30 min",
    points: 30,
    isNew: true,
    isFeatured: false,
    isCompleted: false,
  },
  {
    id: "8",
    title: "Connect with a Friend",
    description: "Reach out to a friend you haven't spoken to in a while",
    category: "wellbeing",
    difficulty: "easy",
    duration: "15 min",
    points: 15,
    isNew: false,
    isFeatured: false,
    isCompleted: false,
  },
];

// Quest categories
const CATEGORIES = [
  { id: "mindfulness", label: "Mindfulness", icon: <Sparkles size={16} /> },
  { id: "wellbeing", label: "Wellbeing", icon: <Heart size={16} /> },
  { id: "health", label: "Health", icon: <Award size={16} /> },
  { id: "fitness", label: "Fitness", icon: <Dumbbell size={16} /> },
  { id: "mental", label: "Mental", icon: <Brain size={16} /> },
];

export function QuestsPage() {
  const { playWithHaptics } = useAppSound();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle category selection
  const handleCategoryToggle = (category: string) => {
    playWithHaptics("button-tap");
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  // Handle difficulty selection
  const handleDifficultyToggle = (difficulty: string) => {
    playWithHaptics("button-tap");
    setSelectedDifficulties(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty) 
        : [...prev, difficulty]
    );
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    playWithHaptics("button-tap");
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setSearchQuery("");
  };
  
  // Handle quest click
  const handleQuestClick = (questId: string) => {
    playWithHaptics("button-tap");
    console.log("Quest clicked:", questId);
    // Navigate to quest details or start quest
  };
  
  // Filter quests based on search, tab, categories, and difficulties
  const filteredQuests = SAMPLE_QUESTS.filter(quest => {
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      quest.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      quest.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "featured" && quest.isFeatured) ||
      (activeTab === "new" && quest.isNew) ||
      (activeTab === "completed" && quest.isCompleted);
    
    // Filter by categories
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(quest.category);
    
    // Filter by difficulties
    const matchesDifficulty = selectedDifficulties.length === 0 || 
      selectedDifficulties.includes(quest.difficulty);
    
    return matchesSearch && matchesTab && matchesCategory && matchesDifficulty;
  });
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    const categoryObj = CATEGORIES.find(c => c.id === category);
    return categoryObj ? categoryObj.icon : <Sparkles size={20} />;
  };
  
  // Get category label
  const getCategoryLabel = (category: string) => {
    const categoryObj = CATEGORIES.find(c => c.id === category);
    return categoryObj ? categoryObj.label : category;
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderSection 
        title="Quests" 
        showSearch={false}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search and filter */}
        <div className="px-4 py-3 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search quests..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                onClick={() => {
                  setSearchQuery("");
                  playWithHaptics("button-tap");
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => {
                setShowFilters(!showFilters);
                playWithHaptics("button-tap");
              }}
            >
              <Filter size={14} />
              Filters
              {(selectedCategories.length > 0 || selectedDifficulties.length > 0) && (
                <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {selectedCategories.length + selectedDifficulties.length}
                </Badge>
              )}
            </Button>
            
            {(selectedCategories.length > 0 || selectedDifficulties.length > 0) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleClearFilters}
              >
                Clear All
              </Button>
            )}
          </div>
          
          {/* Filter options */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 overflow-hidden"
            >
              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <Badge 
                      key={category.id}
                      variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                      className="cursor-pointer flex items-center gap-1"
                      onClick={() => handleCategoryToggle(category.id)}
                    >
                      {category.icon}
                      {category.label}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Difficulties */}
              <div>
                <h3 className="text-sm font-medium mb-2">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={selectedDifficulties.includes("easy") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleDifficultyToggle("easy")}
                  >
                    Easy
                  </Badge>
                  <Badge 
                    variant={selectedDifficulties.includes("medium") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleDifficultyToggle("medium")}
                  >
                    Medium
                  </Badge>
                  <Badge 
                    variant={selectedDifficulties.includes("hard") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleDifficultyToggle("hard")}
                  >
                    Hard
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Tabs */}
        <div className="px-4">
          <Tabs 
            defaultValue="all" 
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              playWithHaptics("button-tap");
            }}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Quest list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {filteredQuests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Search className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-medium">No quests found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your filters or search terms
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-4"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            filteredQuests.map((quest) => (
              <GlassCard
                key={quest.id}
                className="p-4"
                tilt="subtle"
                interactive={true}
                onClick={() => handleQuestClick(quest.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {getCategoryIcon(quest.category)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{quest.title}</h3>
                        {quest.isNew && (
                          <Badge variant="default" className="text-xs">New</Badge>
                        )}
                        {quest.isFeatured && (
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <Star size={10} className="fill-current" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={12} />
                          {quest.duration}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {quest.difficulty}
                          </Badge>
                        </div>
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {quest.points} pts
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(quest.category)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 