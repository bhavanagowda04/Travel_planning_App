import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { MapPin, DollarSign, Sparkles, Activity, Calendar as CalendarIcon } from "lucide-react"; // 👈 renamed to CalendarIcon
import { Input } from "./ui/input";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface TravelPlannerFormProps {
  onCreatePlan: (planData: any) => void;
}

interface TravelPlanResponse {
  plan?: any;
  error?: string;
}

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "CAD", symbol: "C$" },
  { code: "AUD", symbol: "A$" },
  { code: "INR", symbol: "₹" },
  { code: "CNY", symbol: "¥" }
];

const interestOptions = [
  "Adventure Sports", "Museums", "Food Tours", "Hiking", "Beach", "Shopping", 
  "Nightlife", "Cultural Sites", "Photography", "Wildlife", "Art Galleries", 
  "Local Markets", "Architecture", "Festivals", "Music", "Spa & Wellness",
  "Water Sports", "Mountain Climbing", "Historical Tours", "Street Food"
];

const travelTypeOptions = [
  { value: "solo", label: "Solo Travel" },
  { value: "family", label: "Family" },
  { value: "couple", label: "Couple" },
  { value: "friends", label: "Friends" }
];

export function TravelPlannerForm({ onCreatePlan }: TravelPlannerFormProps) {
  const [customCountry, setCustomCountry] = useState("");
  const [customState, setCustomState] = useState("");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [budget, setBudget] = useState([5000]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [travelType, setTravelType] = useState("");

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleCreatePlan = async () => {
    const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);
    const planData = {
      country: customCountry,
      state: customState,
      fromDate,
      toDate,
      budget: budget[0],
      currency: selectedCurrencyData,
      activities: selectedInterests,
      travelType: travelTypeOptions.find(t => t.value === travelType)?.label || travelType,
      createdAt: new Date().toISOString()
    };
    
    try {
      onCreatePlan({ ...planData, loading: true });
      
      // Use relative URL to work with Vite proxy configuration
      const response = await fetch("/api/travel-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planData),
      });

      const data: TravelPlanResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate travel plan");
      }
      
      console.log("API Response:", data); // Debug log
      // Pass the backend response with loading state set to false
      // Make sure we're passing the exact structure expected by TravelResults
      console.log("Raw API response:", data);
      // Pass the exact structure from the example
      onCreatePlan({ 
        loading: false, 
        error: false,
        ok: true,
        plan: {
          overview: {
            destination: data.plan?.overview?.destination || `${planData.country}${planData.state ? `, ${planData.state}` : ''}`,
            duration: data.plan?.overview?.duration || `${fromDate && toDate ? Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) : 0} days`,
            theme: data.plan?.overview?.theme || planData.activities?.join(", "),
            budget: data.plan?.overview?.budget || `${planData.currency?.symbol}${planData.budget}`
          },
          itinerary: data.plan?.itinerary || {},
          practicalInfo: data.plan?.practicalInfo || {},
          budgetBreakdown: data.plan?.budgetBreakdown || {}
        }
      });
    } catch (error) {
      console.error("Error generating travel plan:", error);
      onCreatePlan({ 
        ...planData, 
        error: true, 
        errorMessage: error instanceof Error ? error.message : "Failed to generate travel plan" 
      });
    }
  };

  const formatBudget = (value: number) => {
    const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);
    const symbol = selectedCurrencyData?.symbol || "$";
    if (value >= 20000) return "Unlimited";
    return `${symbol}${value.toLocaleString()}`;
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          Travel Preferences
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Destination Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            <Label>Destination</Label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input value={customCountry} onChange={(e) => setCustomCountry(e.target.value)} placeholder="Country" />
            <Input value={customState} onChange={(e) => setCustomState(e.target.value)} placeholder="State/City" />
          </div>
        </div>

        {/* Date Selection & Travel Type */}
        <div className="grid grid-cols-3 gap-3 items-end">
          {/* From Date */}
          <div className="space-y-2">
            <Label className="text-sm">From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" /> {/* 👈 fixed name */}
                  {formatDate(fromDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* To Date */}
          <div className="space-y-2">
            <Label className="text-sm">To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" /> {/* 👈 fixed name */}
                  {formatDate(toDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent mode="single" selected={toDate} onSelect={setToDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Travel Type */}
          <div className="space-y-2">
            <Label className="text-sm">Travel Type</Label>
            <Select value={travelType} onValueChange={setTravelType}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {travelTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Budget Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <Label>Budget</Label>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency.code} value={currency.code}>{currency.symbol}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex-1 space-y-2">
              <div className="text-center">
                <span className="text-lg font-semibold text-green-600">
                  {formatBudget(budget[0])}
                </span>
              </div>
              <Slider value={budget} onValueChange={setBudget} max={25000} min={1000} step={500} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{currencies.find(c => c.code === selectedCurrency)?.symbol}1,000</span>
                <span>Unlimited</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-orange-500" />
            <Label>What interests you?</Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map(interest => (
              <Badge
                key={interest}
                variant={selectedInterests.includes(interest) ? "default" : "outline"}
                className={`px-3 py-1 cursor-pointer text-xs ${
                  selectedInterests.includes(interest)
                    ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                    : "hover:bg-accent"
                }`}
                onClick={() => handleInterestToggle(interest)}
              >
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {/* Generate Plan */}
        <Button
          onClick={handleCreatePlan}
          disabled={!customCountry || !travelType || selectedInterests.length === 0}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white"
          size="lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Travel Plan
        </Button>
      </CardContent>
    </Card>
  );
}
