
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useApp } from "@/context/AppContext";
import { FiUser, FiEdit, FiX, FiCheck, FiImage } from "react-icons/fi";

export const ProfileEditor: React.FC = () => {
  const { user, updateUserProfile, themeColors } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, bio });
    setEditing(false);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, you would upload this to a storage service
    // For now, just create a local URL
    const reader = new FileReader();
    reader.onloadend = () => {
      updateUserProfile({ avatarUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="rounded-xl p-4 backdrop-blur-sm border animate-fade-in"
      style={{ 
        backgroundColor: `${themeColors.card}`,
        borderColor: `${themeColors.cardBorder}`
      }}
    >
      {!editing ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Profile</h2>
            <button 
              onClick={() => setEditing(true)}
              className="p-2 rounded-full bg-[#222222] hover:bg-[#333333] text-white transition-all"
            >
              <FiEdit size={16} />
            </button>
          </div>
          
          <div className="flex space-x-4 items-center">
            <Avatar className="w-16 h-16 border-2 border-white/20">
              {user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-[#222222] text-white">
                  <FiUser size={24} />
                </AvatarFallback>
              )}
            </Avatar>
            
            <div>
              <h3 className="text-lg font-medium text-white">{user?.name || "Guest User"}</h3>
              <p className="text-[#AAAAAA] text-sm">
                {bio || "No bio yet. Click edit to add one."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Edit Profile</h2>
            <button 
              type="button"
              onClick={() => setEditing(false)}
              className="p-2 rounded-full bg-[#222222] hover:bg-[#333333] text-white transition-all"
            >
              <FiX size={16} />
            </button>
          </div>
          
          <div className="flex space-x-4 items-center">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-white/20">
                {user?.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-[#222222] text-white">
                    <FiUser size={24} />
                  </AvatarFallback>
                )}
              </Avatar>
              
              <label htmlFor="avatar-upload" className="absolute -right-1 -bottom-1 w-8 h-8 flex items-center justify-center rounded-full bg-[#222222] border border-[#333333] text-white cursor-pointer hover:bg-[#333333] transition-all">
                <FiImage size={14} />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-[#222222] border border-[#333333] rounded-lg px-3 py-2 text-white placeholder:text-[#888888] focus:outline-none focus:border-[#444444] transition-all"
                required
              />
              
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio..."
                rows={2}
                className="w-full bg-[#222222] border border-[#333333] rounded-lg px-3 py-2 text-white placeholder:text-[#888888] focus:outline-none focus:border-[#444444] transition-all resize-none"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all"
              style={{ backgroundColor: themeColors.gradientStart }}
            >
              <FiCheck size={16} />
              <span>Save</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
