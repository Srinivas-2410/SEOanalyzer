import { useState } from "react";
import { SEOAnalysis } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Search, MessageSquare, Tag, Lightbulb } from "lucide-react";
import SearchPreview from "./SearchPreview";
import SocialPreview from "./SocialPreview";
import TagsPanel from "./TagsPanel";
import RecommendationsPanel from "./RecommendationsPanel";

type TabType = "search" | "social" | "tags" | "recommendations";

interface PreviewTabsProps {
  analysis: SEOAnalysis;
}

export default function PreviewTabs({ analysis }: PreviewTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("search");

  return (
    <div className="bg-white shadow rounded-lg mb-8">
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex -mb-px min-w-max">
          <TabButton 
            active={activeTab === "search"} 
            onClick={() => setActiveTab("search")}
            icon={<Search className="h-5 w-5" />}
            label="Search Preview"
          />
          <TabButton 
            active={activeTab === "social"} 
            onClick={() => setActiveTab("social")}
            icon={<MessageSquare className="h-5 w-5" />}
            label="Social Media"
          />
          <TabButton 
            active={activeTab === "tags"} 
            onClick={() => setActiveTab("tags")}
            icon={<Tag className="h-5 w-5" />}
            label="Meta Tags"
          />
          <TabButton 
            active={activeTab === "recommendations"} 
            onClick={() => setActiveTab("recommendations")}
            icon={<Lightbulb className="h-5 w-5" />}
            label="Recommendations"
          />
        </nav>
      </div>

      <div className="p-3 sm:p-6">
        {activeTab === "search" && <SearchPreview analysis={analysis} />}
        {activeTab === "social" && <SocialPreview analysis={analysis} />}
        {activeTab === "tags" && <TagsPanel analysis={analysis} />}
        {activeTab === "recommendations" && <RecommendationsPanel analysis={analysis} />}
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap flex items-center",
        active
          ? "text-primary border-primary"
          : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-transparent"
      )}
    >
      <span className="inline-block mr-1 sm:mr-2">{icon}</span>
      {label}
    </button>
  );
}
