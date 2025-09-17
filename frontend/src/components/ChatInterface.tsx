import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { MessageCircle, Send, X, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  loading?: boolean;
  error?: boolean;
  sources?: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
}

export function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI travel assistant. I can help you with questions about transportation, food recommendations, additional destinations, and more. What would you like to know?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");

  const quickQuestions = [
    "Local cuisine recommendations",
    "Transportation options",
    "Weather and packing tips",
    "Cultural customs",
    "Budget planning help"
  ];

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");

    // Add loading message
    const loadingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: loadingId,
      text: "Searching for information...",
      sender: "ai",
      timestamp: new Date(),
      loading: true
    }]);

    try {
      // Call backend API
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: userMessage.text }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get search results');
      }
      
      // Remove loading message and add actual response
      setMessages(prev => prev.filter(msg => msg.id !== loadingId));
      
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: data.results.answer,
        sender: "ai",
        timestamp: new Date(),
        sources: data.results.sources
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting search results:', error);
      
      // Remove loading message and add error message
      setMessages(prev => prev.filter(msg => msg.id !== loadingId));
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "Sorry, I couldn't find an answer to your question. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
        error: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const generateAIResponse = (question: string) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes("restaurant") || lowerQuestion.includes("food")) {
      return "🍽️ I can help you find great dining options! What type of cuisine are you interested in, and what's your preferred price range? I can suggest local specialties and popular dining areas based on your preferences.";
    } else if (lowerQuestion.includes("train") || lowerQuestion.includes("transport")) {
      return "🚂 I can assist with transportation options! What's your departure and destination? I can help you find the best routes, schedules, and ticket options for your journey.";
    } else if (lowerQuestion.includes("weather")) {
      return "🌤️ I can provide weather guidance! Which destination and dates are you planning for? This will help me give you accurate weather information and packing suggestions.";
    } else if (lowerQuestion.includes("culture") || lowerQuestion.includes("etiquette")) {
      return "🙏 Cultural information is important for a great trip! Which country or region are you visiting? I can provide specific cultural tips, customs, and etiquette guidelines for your destination.";
    } else if (lowerQuestion.includes("budget") || lowerQuestion.includes("cost")) {
      return "💰 I can help with budget planning! What's your destination and travel style? I can provide cost estimates for different activities, accommodation types, and dining options.";
    } else {
      return "✨ I'm here to help with your travel questions! I can assist with transportation, accommodations, activities, local customs, weather, budget planning, and much more. What specific information do you need?";
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
    handleSendMessage();
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 shadow-xl hover:shadow-2xl transition-all duration-300"
              size="lg"
            >
              <MessageCircle className="h-6 w-6 text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[500px]"
          >
            <Card className="h-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">AI Travel Assistant</CardTitle>
                      <p className="text-sm opacity-90">Online • Ready to help</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col h-[calc(100%-120px)] p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.sender === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        message.sender === "user" 
                          ? "bg-blue-500" 
                          : "bg-gradient-to-r from-green-500 to-blue-500"
                      }`}>
                        {message.sender === "user" ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Sparkles className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          message.sender === "user"
                            ? "bg-blue-500 text-white rounded-br-md"
                            : message.error
                              ? "bg-red-100 text-gray-900 rounded-bl-md"
                            : "bg-gray-100 text-gray-900 rounded-bl-md"
                        }`}
                      >
                        {message.loading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                            <p className="text-sm">{message.text}</p>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm">{message.text}</p>
                            {message.sources && message.sources.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">Sources:</p>
                                {message.sources.map((source, index) => (
                                  <a 
                                    key={index}
                                    href={source.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-xs text-blue-600 hover:underline mb-1"
                                  >
                                    {source.title}
                                  </a>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                        <p className={`text-xs mt-1 opacity-70 ${
                          message.sender === "user" ? "text-blue-100" : "text-gray-500"
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Questions */}
                {messages.length === 1 && (
                  <div className="px-4 py-2 border-t bg-gray-50">
                    <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                    <div className="flex flex-wrap gap-1">
                      {quickQuestions.map((question, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-accent text-xs"
                          onClick={() => handleQuickQuestion(question)}
                        >
                          {question}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t bg-white">
                  <div className="flex gap-2">
                    <Input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ask me anything about your trip..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 bg-gray-50 border-gray-200"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim()}
                      className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}