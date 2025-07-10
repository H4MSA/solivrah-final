import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppSound } from "@/context/SoundContext";
import { HeaderSection } from "@/components/composite/HeaderSection";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronRight, MessageSquare, Book, HelpCircle, LifeBuoy, Phone, Mail } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// FAQ interface
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Guide interface
interface Guide {
  id: string;
  title: string;
  description: string;
  image?: string;
  duration: string;
  category: string;
}

// Sample FAQs
const SAMPLE_FAQS: FAQ[] = [
  {
    id: "faq1",
    question: "How do I track my daily mood?",
    answer: "You can track your mood on the Home screen. Simply tap on one of the mood emojis that best represents how you're feeling today. You can update your mood multiple times throughout the day, and view your mood history in your Profile.",
    category: "general",
  },
  {
    id: "faq2",
    question: "Can I use Solivrah offline?",
    answer: "Yes, many features of Solivrah work offline. You can track your mood, view your quests, and read guides without an internet connection. However, some features like community posts and coach chat require an internet connection to function properly.",
    category: "general",
  },
  {
    id: "faq3",
    question: "How do I reset my password?",
    answer: "To reset your password, go to the Profile tab, tap on Settings, and select 'Change Password'. If you're locked out of your account, use the 'Forgot Password' option on the login screen to receive a password reset link via email.",
    category: "account",
  },
  {
    id: "faq4",
    question: "How do quests work?",
    answer: "Quests are small, achievable wellness challenges designed to improve your wellbeing. Each quest has clear instructions and a completion criteria. When you complete a quest, you earn points and badges that contribute to your wellness journey. You can find quests in the Quests tab.",
    category: "features",
  },
  {
    id: "faq5",
    question: "Is my data private?",
    answer: "Yes, we take your privacy seriously. Your personal data and health information are encrypted and stored securely. We do not share your individual data with third parties. You can review our full privacy policy in the app settings or on our website.",
    category: "privacy",
  },
  {
    id: "faq6",
    question: "How do I connect with the community?",
    answer: "The Community tab allows you to connect with other Solivrah users. You can share your experiences, ask questions, and support others on their wellness journey. You can filter posts by tags that interest you and follow specific users for regular updates.",
    category: "features",
  },
  {
    id: "faq7",
    question: "What is the AI coach?",
    answer: "The AI coach is your personal wellness assistant. It provides guidance, answers questions, and offers support tailored to your needs. You can chat with your coach anytime in the Coach tab. The more you interact with your coach, the better it understands your preferences and needs.",
    category: "features",
  },
];

// Sample guides
const SAMPLE_GUIDES: Guide[] = [
  {
    id: "guide1",
    title: "Getting Started with Solivrah",
    description: "Learn the basics of navigating the app and setting up your profile for a personalized experience.",
    image: "/lovable-uploads/c0fe3edb-79c7-443c-9af8-eb71e678615e.png",
    duration: "5 min",
    category: "beginner",
  },
  {
    id: "guide2",
    title: "Understanding Your Mood Tracking",
    description: "Discover how mood tracking works and how to use insights from your mood history.",
    image: "/lovable-uploads/7d333bac-8153-4409-a9bb-0c3d5fe35bfc.png",
    duration: "3 min",
    category: "beginner",
  },
  {
    id: "guide3",
    title: "Maximizing Your Quest Experience",
    description: "Tips and strategies for completing quests and earning rewards efficiently.",
    image: "/lovable-uploads/ea3d16ea-6637-443e-8fc3-01595780ef10.png",
    duration: "4 min",
    category: "intermediate",
  },
  {
    id: "guide4",
    title: "Making the Most of Your AI Coach",
    description: "Learn how to effectively communicate with your AI coach for personalized guidance.",
    image: "/lovable-uploads/68c40b83-f35c-4ca2-a67e-23d5ff575a28.png",
    duration: "6 min",
    category: "intermediate",
  },
  {
    id: "guide5",
    title: "Advanced Community Features",
    description: "Discover how to build connections and contribute meaningfully to the Solivrah community.",
    image: "/lovable-uploads/5ec3ceb5-2985-4182-a734-dd7cf47cc4bf.png",
    duration: "7 min",
    category: "advanced",
  },
];

// FAQ categories
const FAQ_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "general", label: "General" },
  { id: "account", label: "Account" },
  { id: "features", label: "Features" },
  { id: "privacy", label: "Privacy" },
];

// Guide categories
const GUIDE_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export function HelpPage() {
  const { playWithHaptics } = useAppSound();
  const [searchQuery, setSearchQuery] = useState("");
  const [faqCategory, setFaqCategory] = useState("all");
  const [guideCategory, setGuideCategory] = useState("all");
  
  // Filter FAQs by search query and category
  const filteredFaqs = SAMPLE_FAQS.filter(faq => {
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = faqCategory === "all" || faq.category === faqCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Filter guides by search query and category
  const filteredGuides = SAMPLE_GUIDES.filter(guide => {
    const matchesSearch = searchQuery === "" || 
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = guideCategory === "all" || guide.category === guideCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle FAQ category change
  const handleFaqCategoryChange = (category: string) => {
    playWithHaptics("button-tap");
    setFaqCategory(category);
  };
  
  // Handle guide category change
  const handleGuideCategoryChange = (category: string) => {
    playWithHaptics("button-tap");
    setGuideCategory(category);
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <div className="flex flex-col h-screen">
      <HeaderSection 
        title="Help & Support" 
        showSearch={false}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search bar */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for help topics..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="faqs" className="w-full">
            <div className="px-4">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger 
                  value="faqs"
                  onClick={() => playWithHaptics("button-tap")}
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle size={16} />
                    <span>FAQs</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="guides"
                  onClick={() => playWithHaptics("button-tap")}
                >
                  <div className="flex items-center gap-2">
                    <Book size={16} />
                    <span>Guides</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="contact"
                  onClick={() => playWithHaptics("button-tap")}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    <span>Contact</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* FAQs Tab */}
            <TabsContent value="faqs" className="mt-4">
              {/* FAQ Categories */}
              <div className="px-4 pb-2 overflow-x-auto flex gap-2 no-scrollbar">
                {FAQ_CATEGORIES.map((category) => (
                  <Badge 
                    key={category.id}
                    variant={faqCategory === category.id ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleFaqCategoryChange(category.id)}
                  >
                    {category.label}
                  </Badge>
                ))}
              </div>
              
              <Separator className="my-2" />
              
              {/* FAQ List */}
              <div className="px-4 pb-6">
                {filteredFaqs.length === 0 ? (
                  <div className="py-8 text-center">
                    <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No FAQs found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try adjusting your search or category filter
                    </p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger 
                          onClick={() => playWithHaptics("button-tap")}
                          className="text-left"
                        >
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground">
                            {faq.answer}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            </TabsContent>
            
            {/* Guides Tab */}
            <TabsContent value="guides" className="mt-4">
              {/* Guide Categories */}
              <div className="px-4 pb-2 overflow-x-auto flex gap-2 no-scrollbar">
                {GUIDE_CATEGORIES.map((category) => (
                  <Badge 
                    key={category.id}
                    variant={guideCategory === category.id ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleGuideCategoryChange(category.id)}
                  >
                    {category.label}
                  </Badge>
                ))}
              </div>
              
              <Separator className="my-2" />
              
              {/* Guide List */}
              <div className="px-4 pb-6 space-y-4">
                {filteredGuides.length === 0 ? (
                  <div className="py-8 text-center">
                    <Book className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No guides found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try adjusting your search or category filter
                    </p>
                  </div>
                ) : (
                  filteredGuides.map((guide) => (
                    <motion.div
                      key={guide.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => playWithHaptics("button-tap")}
                    >
                      <GlassCard className="p-4 cursor-pointer">
                        <div className="flex gap-3">
                          {guide.image && (
                            <div className="h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                              <img 
                                src={guide.image} 
                                alt={guide.title} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex flex-col flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">{guide.title}</h3>
                              <Badge variant="outline" className="ml-2">
                                {guide.duration}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {guide.description}
                            </p>
                            <div className="mt-auto pt-2 flex justify-between items-center">
                              <Badge variant="secondary" className="text-xs">
                                {guide.category.charAt(0).toUpperCase() + guide.category.slice(1)}
                              </Badge>
                              <ChevronRight size={16} className="text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>
            
            {/* Contact Tab */}
            <TabsContent value="contact" className="mt-4 px-4 pb-6 space-y-4">
              <h2 className="text-lg font-semibold mb-4">Contact Support</h2>
              
              <GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MessageSquare size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Chat Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Chat with our support team
                    </p>
                  </div>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => playWithHaptics("button-tap")}
                  >
                    Start Chat
                  </Button>
                </div>
              </GlassCard>
              
              <GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Email Support</h3>
                    <p className="text-sm text-muted-foreground">
                      support@solivrah.com
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => playWithHaptics("button-tap")}
                  >
                    Send Email
                  </Button>
                </div>
              </GlassCard>
              
              <GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Phone Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Available Mon-Fri, 9am-5pm
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => playWithHaptics("button-tap")}
                  >
                    Call Now
                  </Button>
                </div>
              </GlassCard>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Frequently Asked Questions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check our FAQ section for quick answers to common questions.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    playWithHaptics("button-tap");
                    document.querySelector('[data-value="faqs"]')?.dispatchEvent(
                      new MouseEvent('click', { bubbles: true })
                    );
                  }}
                >
                  View FAQs
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 