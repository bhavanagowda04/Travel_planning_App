import { useState } from "react";
import { TravelPlannerForm } from "./components/TravelPlannerForm";
import { TravelResults } from "./components/TravelResults";
import { ChatInterface } from "./components/ChatInterface";
import { Card, CardContent } from "./components/ui/card";
import { Plane } from "lucide-react";

export default function App() {
  const [planData, setPlanData] = useState(null);

  const handleCreatePlan = (data: any) => {
    setPlanData(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <Card className="mx-4 mt-4 shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Plan Your Perfect Journey
            </h1>
          </div>
          <p className="text-muted-foreground">Create personalized travel plans tailored to your preferences</p>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 p-4">
        {/* Planning Form */}
        <div className="lg:w-1/2">
          <TravelPlannerForm onCreatePlan={handleCreatePlan} />
        </div>

        {/* Results */}
        <div className="lg:w-1/2">
          {planData ? (
            <TravelResults planData={planData} onBack={() => setPlanData(null)} />
          ) : (
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  <Plane className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <h3 className="mb-2">Your Travel Plan Will Appear Here</h3>
                  <p>Fill out the form on the left to generate your personalized travel plan</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* AI Chat Interface - Always Available */}
      <ChatInterface />
    </div>
  );
}