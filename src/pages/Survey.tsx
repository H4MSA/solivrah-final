
import React, { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Survey = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    theme: "Discipline",
    goal: "",
    struggle: "",
    timeCommitment: "30"
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Survey submitted:", formData);
    // In a real app, this would send data to the backend
    navigate("/quests");
  };
  
  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gradient">Let's Get Started</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <GlassCard>
            <label className="block mb-2 font-medium">Theme</label>
            <select
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full p-3 rounded-xl glass text-white bg-transparent"
            >
              <option value="Discipline">Discipline</option>
              <option value="Focus">Focus</option>
              <option value="Resilience">Resilience</option>
              <option value="Wildcards">Wildcards</option>
            </select>
          </GlassCard>
          
          <GlassCard>
            <label className="block mb-2 font-medium">Goal</label>
            <input
              type="text"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="e.g., Build habits"
              className="w-full p-3 rounded-xl glass text-white bg-transparent"
            />
          </GlassCard>
          
          <GlassCard>
            <label className="block mb-2 font-medium">Struggle</label>
            <input
              type="text"
              name="struggle"
              value={formData.struggle}
              onChange={handleChange}
              placeholder="e.g., Procrastination"
              className="w-full p-3 rounded-xl glass text-white bg-transparent"
            />
          </GlassCard>
          
          <GlassCard>
            <label className="block mb-2 font-medium">Time (minutes per day)</label>
            <input
              type="number"
              name="timeCommitment"
              value={formData.timeCommitment}
              onChange={handleChange}
              min="5"
              max="120"
              className="w-full p-3 rounded-xl glass text-white bg-transparent"
            />
          </GlassCard>
          
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            Generate Roadmap <FiArrowRight />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Survey;
