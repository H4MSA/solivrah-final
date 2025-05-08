
import React from "react";
import { motion } from "framer-motion";
import { Clock, ChevronLeft, MessageCircle } from "lucide-react";

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  historyItems: {
    id: string;
    date: string;
    preview: string;
    unread?: boolean;
  }[];
  onSelectChat: (id: string) => void;
}

export const ChatHistoryDrawer: React.FC<ChatHistoryProps> = ({ 
  isOpen, 
  onClose, 
  historyItems,
  onSelectChat
}) => {
  return (
    <motion.div
      className={`fixed inset-y-0 left-0 z-50 w-[85%] max-w-[320px] bg-[#111111] border-r border-white/10 shadow-lg overflow-hidden
        ${isOpen ? 'flex flex-col' : 'hidden'}`}
      initial={{ x: "-100%" }}
      animate={{ x: isOpen ? 0 : "-100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold flex items-center">
          <Clock size={18} className="mr-2" /> Chat History
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {historyItems.length > 0 ? (
          historyItems.map((item) => (
            <motion.div
              key={item.id}
              className={`p-3 mb-2 rounded-lg border ${
                item.unread 
                  ? 'border-white/20 bg-white/5' 
                  : 'border-white/10 bg-[#1A1A1A]'
              } cursor-pointer hover:bg-white/5 transition-colors`}
              onClick={() => onSelectChat(item.id)}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs text-white/60">{item.date}</span>
                {item.unread && (
                  <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                )}
              </div>
              <p className="text-sm text-white/80 line-clamp-2">{item.preview}</p>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <MessageCircle size={30} className="text-white/30 mb-2" />
            <p className="text-white/50 text-sm">No chat history yet</p>
            <p className="text-white/40 text-xs mt-1">Start a new conversation to see it here</p>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition-colors"
        >
          New Conversation
        </button>
      </div>
    </motion.div>
  );
};
