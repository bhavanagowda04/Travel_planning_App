import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, Clock, DollarSign, Users, RefreshCw, X } from "lucide-react";

interface TravelResultsProps {
  planData: any;
  onBack: () => void;
}

export function TravelResults({ planData, onBack }: TravelResultsProps) {
  // Use the plan data directly from the API response
  console.log("Plan data received:", planData); // Debug log
  
  // Access the plan data directly from the response structure
  const travelPlan = planData?.plan;
  
  // Debug the itinerary structure
  console.log("Travel Plan:", travelPlan);

  return (
    <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
      {/* Loading State */}
      {planData.loading && (
        <div className="flex flex-col items-center justify-center py-10">
          <RefreshCw className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <p className="text-muted-foreground">Generating your personalized travel plan...</p>
        </div>
      )}

      {/* Error State */}
      {planData.error && (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="p-3 bg-red-100 rounded-full mb-4">
            <X className="h-10 w-10 text-red-500" />
          </div>
          <p className="text-red-500 font-medium mb-2">Failed to generate travel plan</p>
          <p className="text-muted-foreground text-center">{planData.errorMessage || "Please try again later"}</p>
          <Button className="mt-4" onClick={onBack}>Try Again</Button>
        </div>
      )}

      {/* Success State */}
      {!planData.loading && !planData.error && (
        <>
      {/* Header */}
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-blue-500" />
              Your Travel Plan
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onBack}
              className="hover:bg-accent"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              New Plan
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="secondary" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              {travelPlan?.overview?.destination || planData.country}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              {travelPlan?.overview?.theme || planData.activities?.join(", ") || planData.travelType}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <DollarSign className="h-3 w-3 mr-1" />
              {travelPlan?.overview?.budget || (planData.budget >= 20000 ? "Unlimited" : `${planData.currency?.symbol}${planData.budget.toLocaleString()}`)}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {travelPlan?.overview?.duration || ""}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Travel Plan Overview */}
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Trip Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Destination:</span>
              <span className="text-sm">{travelPlan?.overview?.destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Duration:</span>
              <span className="text-sm">{travelPlan?.overview?.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Theme:</span>
              <span className="text-sm">{travelPlan?.overview?.theme || planData?.activities?.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Budget:</span>
              <span className="text-sm">{travelPlan?.overview?.budget}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-green-500" />
            Daily Itinerary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {Object.entries(travelPlan?.itinerary || {}).map(([day, details]: [string, any]) => (
            <div key={day} className="border-l-4 border-blue-500 pl-3 py-2">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-sm">{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
              </div>
              <p className="text-muted-foreground text-sm mb-2 whitespace-pre-wrap">
                {details.description}
              </p>
              {details.placesToVisit && details.placesToVisit.length > 0 && (
                <div className="mb-1">
                  <span className="text-xs font-semibold">Places to Visit:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {details.placesToVisit.map((place: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {place}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {details.activities && details.activities.length > 0 && (
                <div>
                  <span className="text-xs font-semibold">Activities:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {details.activities.map((activity: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs bg-accent/50">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Budget Breakdown */}
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="h-4 w-4 text-purple-500" />
            Budget Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm mb-1">Total Trip Budget</h4>
              <p className="text-lg font-bold text-green-600">
                {travelPlan?.budgetBreakdown?.total || (planData.budget >= 20000 ? "Unlimited" : `${planData.currency?.symbol || "$"}${planData.budget.toLocaleString()}`)}
              </p>
              <p className="text-xs text-muted-foreground">
                For {travelPlan?.overview?.duration || "your trip"} in {travelPlan?.overview?.destination || planData.country}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Budget Breakdown:</h4>
              <ul className="space-y-1 text-muted-foreground text-xs">
                {Object.entries(travelPlan?.budgetBreakdown || {})
                  .filter(([key]) => key !== 'total')
                  .map(([category, amount], index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      <span className="capitalize">{category}:</span> {String(amount)}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Practical Information */}
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Practical Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {Object.entries(travelPlan?.practicalInfo || {}).map(([category, info], index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                <p className="text-muted-foreground text-xs"><span className="font-semibold capitalize">{category}:</span> {String(info)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
    )}
  </div>
  );
}