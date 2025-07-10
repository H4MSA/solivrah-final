import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppSound } from "@/context/SoundContext";
import { HeaderSection } from "@/components/composite/HeaderSection";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Share2, MoreHorizontal, Filter, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Post interface
interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  content: string;
  image?: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  isLiked: boolean;
}

// Sample posts data
const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    author: {
      id: "user1",
      name: "Emma Johnson",
      avatar: "/placeholder.svg",
      isVerified: true,
    },
    content: "Just completed my 30-day meditation challenge! 🧘‍♀️ The mental clarity I've gained is incredible. Anyone else tried this?",
    image: "/lovable-uploads/038bdabb-7c03-4472-8960-1570ffc24f9f.png",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    likes: 42,
    comments: 7,
    shares: 3,
    tags: ["meditation", "wellness", "30daychallenge"],
    isLiked: false,
  },
  {
    id: "2",
    author: {
      id: "user2",
      name: "Marcus Chen",
      avatar: "/placeholder.svg",
    },
    content: "Morning run by the lake today. Starting the day with exercise really sets a positive tone for everything else. What's your morning routine?",
    image: "/lovable-uploads/0701039a-55df-4138-b784-8d9952f8cded.png",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: 28,
    comments: 12,
    shares: 1,
    tags: ["fitness", "morningroutine", "wellness"],
    isLiked: true,
  },
  {
    id: "3",
    author: {
      id: "user3",
      name: "Sophia Williams",
      avatar: "/placeholder.svg",
      isVerified: true,
    },
    content: "I've been struggling with anxiety lately and found that journaling before bed has been helping tremendously. Writing down my thoughts helps clear my mind. Anyone else use journaling as a coping mechanism?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    likes: 76,
    comments: 23,
    shares: 8,
    tags: ["mentalhealth", "anxiety", "journaling", "selfcare"],
    isLiked: false,
  },
  {
    id: "4",
    author: {
      id: "user4",
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg",
    },
    content: "Just tried a new healthy recipe - quinoa bowl with roasted vegetables and tahini dressing. Simple, nutritious, and delicious! Let me know if you want the recipe.",
    image: "/lovable-uploads/3175d335-84c5-4f7a-954e-9795d0e93059.png",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    likes: 34,
    comments: 15,
    shares: 5,
    tags: ["nutrition", "healthyeating", "recipe"],
    isLiked: false,
  },
];

// Popular tags
const POPULAR_TAGS = [
  "wellness",
  "meditation",
  "fitness",
  "mentalhealth",
  "nutrition",
  "selfcare",
  "mindfulness",
  "yoga",
  "gratitude",
];

export function CommunityPage() {
  const { playWithHaptics } = useAppSound();
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Format timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return diffDay === 1 ? "1 day ago" : `${diffDay} days ago`;
    } else if (diffHour > 0) {
      return diffHour === 1 ? "1 hour ago" : `${diffHour} hours ago`;
    } else if (diffMin > 0) {
      return diffMin === 1 ? "1 minute ago" : `${diffMin} minutes ago`;
    } else {
      return "Just now";
    }
  };
  
  // Handle like post
  const handleLikePost = (postId: string) => {
    playWithHaptics("button-tap");
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked, 
              likes: post.isLiked ? post.likes - 1 : post.likes + 1 
            } 
          : post
      )
    );
  };
  
  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    playWithHaptics("button-tap");
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  // Filter posts by selected tags
  const filteredPosts = selectedTags.length > 0 
    ? posts.filter(post => 
        selectedTags.some(tag => post.tags.includes(tag))
      )
    : posts;
  
  // Filter posts by tab
  const tabFilteredPosts = activeTab === "all" 
    ? filteredPosts 
    : activeTab === "following" 
      ? filteredPosts.filter(post => post.author.isVerified) 
      : filteredPosts.filter(post => post.isLiked);
  
  return (
    <div className="flex flex-col h-screen">
      <HeaderSection 
        title="Community" 
        showSearch={true}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="px-4 pt-2">
          <Tabs 
            defaultValue="all" 
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              playWithHaptics("button-tap");
            }}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="liked">Liked</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Tags filter */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <span className="text-sm font-medium">Filter by tags</span>
            </div>
            {selectedTags.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedTags([]);
                  playWithHaptics("button-tap");
                }}
              >
                Clear all
              </Button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {POPULAR_TAGS.map((tag) => (
              <Badge 
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagSelect(tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* Posts feed */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* New post button */}
          <GlassCard className="p-4 flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="Your avatar" />
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>
            <div 
              className="flex-1 bg-white/5 rounded-full px-4 py-2 text-muted-foreground cursor-pointer"
              onClick={() => playWithHaptics("button-tap")}
            >
              Share something with the community...
            </div>
            <Button size="icon" variant="default">
              <Plus size={18} />
            </Button>
          </GlassCard>
          
          {tabFilteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-muted-foreground mb-2">No posts found</p>
              <p className="text-sm text-muted-foreground">Try selecting different tags or check back later</p>
            </div>
          ) : (
            tabFilteredPosts.map((post) => (
              <GlassCard key={post.id} className="p-4 space-y-3">
                {/* Post header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback>{post.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{post.author.name}</span>
                        {post.author.isVerified && (
                          <Badge variant="outline" className="h-5 px-1">
                            <span className="text-xs">✓</span>
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{formatTimestamp(post.timestamp)}</p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => playWithHaptics("button-tap")}>
                        Save post
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => playWithHaptics("button-tap")}>
                        Report
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => playWithHaptics("button-tap")}>
                        Hide
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Post content */}
                <div>
                  <p className="text-sm">{post.content}</p>
                </div>
                
                {/* Post image */}
                {post.image && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={post.image} 
                      alt="Post image" 
                      className="w-full h-auto object-cover"
                      style={{ maxHeight: "300px" }}
                    />
                  </div>
                )}
                
                {/* Post tags */}
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="text-xs cursor-pointer"
                      onClick={() => handleTagSelect(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Post stats */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-6">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1 px-2"
                      onClick={() => handleLikePost(post.id)}
                    >
                      <Heart 
                        size={16} 
                        className={post.isLiked ? "fill-red-500 text-red-500" : ""} 
                      />
                      <span>{post.likes}</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1 px-2"
                      onClick={() => playWithHaptics("button-tap")}
                    >
                      <MessageSquare size={16} />
                      <span>{post.comments}</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1 px-2"
                      onClick={() => playWithHaptics("button-tap")}
                    >
                      <Share2 size={16} />
                      <span>{post.shares}</span>
                    </Button>
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