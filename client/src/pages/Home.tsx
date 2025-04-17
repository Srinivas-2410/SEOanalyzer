import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SEOAnalysis } from "@shared/schema";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import URLInputForm from "@/components/URLInputForm";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorDisplay from "@/components/ErrorDisplay";
import SEODashboard from "@/components/SEODashboard";

export default function Home() {
  const [analysisResults, setAnalysisResults] = useState<SEOAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeWebsite = useMutation({
    mutationFn: async (url: string) => {
      const res = await apiRequest("POST", "/api/analyze", { url });
      return res.json() as Promise<SEOAnalysis>;
    },
    onSuccess: (data) => {
      setAnalysisResults(data);
      // Scroll to results
      setTimeout(() => {
        document.getElementById("results-container")?.scrollIntoView({ 
          behavior: "smooth",
          block: "start"
        });
      }, 100);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error analyzing website",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    },
  });

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-blue-50 to-white py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <URLInputForm
              onAnalyze={(url) => analyzeWebsite.mutate(url)}
              isLoading={analyzeWebsite.isPending}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {analyzeWebsite.isPending && <LoadingIndicator />}

          {analyzeWebsite.isError && (
            <ErrorDisplay
              message={
                analyzeWebsite.error instanceof Error
                  ? analyzeWebsite.error.message
                  : "An error occurred while analyzing the website."
              }
            />
          )}

          {analysisResults && !analyzeWebsite.isPending && (
            <div id="results-container" className="bg-white shadow-sm rounded-xl p-6 mb-8">
              <SEODashboard analysis={analysisResults} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
