
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { ThemeBackground } from "@/components/ThemeBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ThemeBackground />
      
      <motion.div 
        className="text-center px-6 py-10 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        >
          <AlertCircle className="text-white h-10 w-10" />
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold mb-4 text-gradient"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          404
        </motion.h1>
        
        <motion.p 
          className="text-xl text-white/80 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Oops! We couldn't find that page
        </motion.p>
        
        <motion.a 
          href="/" 
          className="inline-flex items-center justify-center gap-2 bg-white text-black px-5 py-3 rounded-xl font-medium hover:opacity-90 active:scale-95 shadow-lg transition-all"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Home
        </motion.a>
      </motion.div>
    </div>
  );
};

export default NotFound;
