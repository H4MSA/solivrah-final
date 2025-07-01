
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/context/AppContext";

export const ThemeSelect = () => {
  const { selectedTheme, setSelectedTheme } = useApp();

  return (
    <Select value={selectedTheme} onValueChange={setSelectedTheme}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="productivity">Productivity</SelectItem>
        <SelectItem value="mindfulness">Mindfulness</SelectItem>
        <SelectItem value="fitness">Fitness</SelectItem>
        <SelectItem value="creativity">Creativity</SelectItem>
        <SelectItem value="learning">Learning</SelectItem>
      </SelectContent>
    </Select>
  );
};
