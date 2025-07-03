import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { QRScanner } from "@/components/common/QRScanner";
import { CameraUpload } from "@/components/CameraUpload";
import { ThemeBackground } from "@/components/layouts/ThemeBackground";
import { DailyAffirmation } from "@/components/DailyAffirmation";
import { QuickGuide } from "@/components/QuickGuide";
import { FeatureHighlight } from "@/components/FeatureHighlight";
import { HeaderSection } from "@/components/features/home/HeaderSection";
import { SearchBar } from "@/components/features/home/SearchBar";
import { QuestCard } from "@/components/features/home/QuestCard";
import { MoodSection } from "@/components/features/home/MoodSection";
import { CollapsibleSection } from "@/components/features/home/CollapsibleSection";
import { DailyQuestHero } from "@/components/ui/daily-quest-hero";
import { StatsDisplay } from "@/components/ui/stats-display";
import { QuickActionGrid } from "@/components/ui/quick-action-grid";

const Home = () => {
// ... existing code ...

}