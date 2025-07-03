import React, { useState } from 'react';
import { Search, ArrowLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I complete a quest?",
    answer: "Tap on an active quest to view its details. Complete the described task, then tap 'Complete Quest'. Some quests require photo evidence of completion.",
    category: "Quests"
  },
  {
    question: "What happens if I miss a day?",
    answer: "Missing a day won't delete your progress. Your streak counter will reset, but you can continue from where you left off.",
    category: "Streaks & Progress"
  },
  {
    question: "How do I change my theme?",
    answer: "Go to your Profile page and tap 'Theme Settings'. You can select from Discipline, Focus, Resilience, or Wildcards.",
    category: "Customization"
  },
  {
    question: "Can I use the app offline?",
    answer: "Yes, most features work offline. Your data will sync when you're back online.",
    category: "General"
  },
  {
    question: "How does the AI Coach work?",
    answer: "The AI Coach provides personalized guidance based on your goals and theme. Just type your question or challenge, and it will respond with tailored advice.",
    category: "AI Coach"
  },
  {
    question: "How do I reset my progress?",
    answer: "Go to Profile > Settings > Reset Progress. Note that this action cannot be undone.",
    category: "General"
  },
  {
    question: "How do I track my mood?",
    answer: "On the Home screen, find the Mood Section and select your current mood. This helps track your emotional patterns over time.",
    category: "Features"
  },
  {
    question: "Can I customize my notifications?",
    answer: "Yes, go to Profile > Settings > Notifications to choose which alerts you receive and when.",
    category: "Customization"
  },
  {
    question: "What are XP points for?",
    answer: "XP (Experience Points) track your progress and help you level up. Each level unlocks new features and customization options.",
    category: "Streaks & Progress"
  },
  {
    question: "How do I join the community?",
    answer: "Tap the Community tab in the navigation bar. You'll need to create a profile if you haven't already.",
    category: "Community"
  }
];

export const Help = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "General": true,
    "Quests": false,
    "Streaks & Progress": false,
    "AI Coach": false,
    "Customization": false,
    "Features": false,
    "Community": false
  });
  
  // Group FAQs by category
  const faqsByCategory: Record<string, FAQItem[]> = {};
  faqs.forEach(faq => {
    if (!faqsByCategory[faq.category]) {
      faqsByCategory[faq.category] = [];
    }
    faqsByCategory[faq.category].push(faq);
  });
  
  // Filter FAQs based on search
  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  const toggleCategory = (category: string) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
  };
  
  return (
    <div className="min-h-screen bg-black text-white pb-20">
      
      <div className="px-4 pt-8 pb-20 max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Help & Support</h1>
        </div>
        
        <div className="relative mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help topics..."
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-white/40"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
        </div>
        
        {searchQuery ? (
          <div>
            <h2 className="text-lg font-medium mb-4">Search Results</h2>
            
            {filteredFaqs.length > 0 ? (
              <div className="space-y-3">
                {filteredFaqs.map((faq, index) => (
                  <SearchResult key={index} faq={faq} searchQuery={searchQuery} />
                ))}
              </div>
            ) : (
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-white/50">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(faqsByCategory).map(([category, categoryFaqs]) => (
              <div key={category} className="bg-white/5 rounded-lg overflow-hidden">
                <button
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                  onClick={() => toggleCategory(category)}
                >
                  <span className="font-medium">{category}</span>
                  {expandedCategories[category] ? (
                    <ChevronUp size={18} className="text-white/70" />
                  ) : (
                    <ChevronDown size={18} className="text-white/70" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedCategories[category] && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-4 pb-3 space-y-3">
                        {categoryFaqs.map((faq, index) => (
                          <FAQItem key={index} faq={faq} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FAQItem = ({ faq }: { faq: FAQItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
      <button 
        className="w-full text-left flex items-start justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium text-white/90">{faq.question}</span>
        <ChevronRight size={16} className={`mt-1 text-white/50 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="mt-2 text-white/70 text-sm">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SearchResult = ({ faq, searchQuery }: { faq: FAQItem; searchQuery: string }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const highlightText = (text: string) => {
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === searchQuery.toLowerCase() 
            ? <span key={i} className="bg-white/20 text-white">{part}</span> 
            : part
        )}
      </>
    );
  };
  
  return (
    <div className="bg-white/5 rounded-lg p-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium text-white/90">{highlightText(faq.question)}</div>
          <div className="text-xs text-white/50 mb-1">Category: {faq.category}</div>
        </div>
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <ChevronUp size={16} className="text-white/50" />
          ) : (
            <ChevronDown size={16} className="text-white/50" />
          )}
        </button>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <p className="text-white/70 text-sm">{highlightText(faq.answer)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
