import { useState } from "react";
import RTRWHLanding from "@/components/RTRWHLanding";
import AssessmentForm from "@/components/AssessmentForm";
import ResultsDashboard from "@/components/ResultsDashboard";

type AppState = "landing" | "assessment" | "results";

interface AssessmentData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  locationInfo: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: string;
  };
  propertyInfo: {
    propertyType: string;
    roofArea: string;
    roofType: string;
    dwellers: string;
    openSpace: string;
    existingStructures: string;
  };
  additionalInfo: {
    budget: string;
    purpose: string;
    notes: string;
  };
}

const Index = () => {
  const [currentView, setCurrentView] = useState<AppState>("landing");
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  const handleStartAssessment = () => {
    setCurrentView("assessment");
  };

  const handleFormSubmit = (data: AssessmentData) => {
    setAssessmentData(data);
    setCurrentView("results");
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
  };

  const handleBackToForm = () => {
    setCurrentView("assessment");
  };

  return (
    <>
      {currentView === "landing" && (
        <RTRWHLanding onStartAssessment={handleStartAssessment} />
      )}
      
      {currentView === "assessment" && (
        <AssessmentForm 
          onBack={handleBackToLanding} 
          onSubmit={handleFormSubmit} 
        />
      )}
      
      {currentView === "results" && assessmentData && (
        <ResultsDashboard 
          onBack={handleBackToForm} 
          assessmentData={assessmentData}
        />
      )}
    </>
  );
};

export default Index;
