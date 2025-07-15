import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';

interface PremiumFeature {
  icon: string;
  title: string;
  description: string;
  highlight?: boolean;
}

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  onUpgrade?: () => void;
}

const premiumFeatures: PremiumFeature[] = [
  {
    icon: '🎯',
    title: 'Unlimited Quests',
    description: 'Access to all premium quests and challenges',
    highlight: true
  },
  {
    icon: '🤖',
    title: 'AI Wellness Coach',
    description: 'Personalized guidance and recommendations',
    highlight: true
  },
  {
    icon: '📊',
    title: 'Advanced Analytics',
    description: 'Detailed insights into your wellness journey'
  },
  {
    icon: '🎨',
    title: 'Custom Themes',
    description: 'Personalize your app with beautiful themes'
  },
  {
    icon: '🔔',
    title: 'Smart Notifications',
    description: 'Intelligent reminders based on your habits'
  },
  {
    icon: '☁️',
    title: 'Cloud Sync',
    description: 'Access your data across all devices'
  },
  {
    icon: '🏆',
    title: 'Exclusive Badges',
    description: 'Unlock special achievements and rewards'
  },
  {
    icon: '📱',
    title: 'Priority Support',
    description: '24/7 premium customer support'
  }
];

const pricingPlans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$9.99',
    period: '/month',
    savings: null,
    popular: false
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '$79.99',
    period: '/year',
    savings: 'Save 33%',
    popular: true
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '$199.99',
    period: 'one-time',
    savings: 'Best Value',
    popular: false
  }
];

export const PremiumModal = ({ 
  isOpen, 
  onClose, 
  feature,
  onUpgrade 
}: PremiumModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isLoading, setIsLoading] = useState(false);
  const { isPremiumUser } = useApp();

  const handleUpgrade = async () => {
    setIsLoading(true);
    
    // Simulate upgrade process
    setTimeout(() => {
      onUpgrade?.();
      setIsLoading(false);
      onClose();
    }, 2000);
  };

  if (isPremiumUser) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              onClick={onClose}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="p-8 text-center">
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-gradient flex items-center justify-center text-4xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
              >
                ✨
              </motion.div>
              
              <motion.h2
                className="text-3xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Unlock Premium Features
              </motion.h2>
              
              <motion.p
                className="text-gray-300 text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {feature 
                  ? `Upgrade to access ${feature} and more premium features`
                  : 'Take your wellness journey to the next level'
                }
              </motion.p>
            </div>

            {/* Features Grid */}
            <div className="px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {premiumFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className={`p-4 rounded-xl border transition-all ${
                      feature.highlight 
                        ? 'bg-gold-500/10 border-gold-500/30' 
                        : 'bg-white/5 border-white/10'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{feature.icon}</div>
                      <div>
                        <h3 className={`font-semibold mb-1 ${
                          feature.highlight ? 'text-gold-400' : 'text-white'
                        }`}>
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pricing Plans */}
              <motion.div
                className="space-y-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-xl font-semibold text-white text-center mb-6">
                  Choose Your Plan
                </h3>
                
                <div className="space-y-3">
                  {pricingPlans.map((plan) => (
                    <motion.button
                      key={plan.id}
                      className={`w-full p-4 rounded-xl border-2 transition-all relative overflow-hidden ${
                        selectedPlan === plan.id
                          ? 'border-calm-500 bg-calm-500/10'
                          : 'border-white/20 bg-white/5 hover:border-white/30'
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Popular badge */}
                      {plan.popular && (
                        <div className="absolute top-0 right-4 bg-gold-gradient text-white text-xs font-bold px-3 py-1 rounded-b-lg">
                          Most Popular
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-semibold text-white">{plan.name}</div>
                          {plan.savings && (
                            <div className="text-sm text-green-400">{plan.savings}</div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            {plan.price}
                          </div>
                          <div className="text-sm text-gray-400">
                            {plan.period}
                          </div>
                        </div>
                        
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPlan === plan.id
                            ? 'border-calm-500 bg-calm-500'
                            : 'border-white/30'
                        }`}>
                          {selectedPlan === plan.id && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.button
                className="w-full btn-gold py-4 text-lg font-semibold relative overflow-hidden"
                onClick={handleUpgrade}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="loading-spinner w-5 h-5" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Upgrade to Premium - ${pricingPlans.find(p => p.id === selectedPlan)?.price}`
                )}
                
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-100, 300] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.button>

              {/* Trust indicators */}
              <motion.div
                className="mt-6 text-center space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>7-day free trial</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secure payment</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500">
                  Join thousands of users who've transformed their wellness journey
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PremiumModal;
