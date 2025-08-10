"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, User, Bot, Paperclip, Mic } from "lucide-react";
import type { DecisionSession } from "@/app/dashboard/page";

// ⬇️ Backend helper (create src/lib/api.ts as shown earlier)
import { askBackend, type ChatMessage as APIMessage } from "@/lib/api";

interface ChatInterfaceProps {
  session?: DecisionSession;
  onUpdateSession: (updates: Partial<DecisionSession>) => void;
  onQuestionSubmit?: (question: string, context: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function ChatInterface({
  session,
  onUpdateSession,
  onQuestionSubmit,
  sidebarOpen,
  onToggleSidebar,
}: ChatInterfaceProps) {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const hasMessages = session?.messages && session.messages.length > 0;
  const hasStartedChat = hasMessages || isLoading;

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLDivElement | null;
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [session?.messages, isLoading]);

  // Map your UI messages to the API shape {role, content}
  const toAPI = (msgs: { type: "question" | "response"; content: string }[]): APIMessage[] =>
    msgs.map((m) => ({
      role: m.type === "question" ? "user" : "assistant",
      content: m.content,
    }));

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!question.trim() || !session) return;

    setIsLoading(true);
    onQuestionSubmit?.(question, "");

    const newQuestionMessage = {
      id: Date.now().toString(),
      type: "question" as const,
      content: question,
    };

    const currentQuestion = question;
    setQuestion("");

    const previousMessages = toAPI(session.messages || []);
    const messagesForBackend: APIMessage[] = [
      ...previousMessages,
      { role: "user", content: currentQuestion },
    ];

    try {
      const { answer } = await askBackend(messagesForBackend);

      const newResponseMessage = {
        id: (Date.now() + 1).toString(),
        type: "response" as const,
        content: answer || "⚠️ Sorry, I couldn't find an answer.",
      };

      onUpdateSession({
        messages: [...(session.messages || []), newQuestionMessage, newResponseMessage],
      });
    } catch (err: any) {
      console.error("Error calling backend:", err);
      const errorMessage = {
        id: (Date.now() + 2).toString(),
        type: "response" as const,
        content: "⚠️ There was an error processing your request.",
      };

      onUpdateSession({
        messages: [...(session.messages || []), newQuestionMessage, errorMessage],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const suggestionQuestions = [
    "Should I change careers?",
    "Should I invest in stocks or real estate?",
    "Should I move to a new city?",
    "Should I start my own business?",
  ];

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
            className="text-6xl mb-6"
          >
            🧠
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Welcome to Decidely
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your AI-powered decision-making assistant is ready to help you think through
            important choices.
          </p>
        </motion.div>
      </div>
    );
  }

  // Centered input for new sessions
  if (!hasStartedChat) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-3xl">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                className="text-6xl mb-6"
              >
                🧠
              </motion.div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                What decision can I help you with?
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Get AI-powered analysis to make better choices
              </p>
            </div>

            {/* Main Input */}
            <div className="relative mb-8">
              <div className="relative flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                <Input
                  ref={inputRef}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about any decision you're facing..."
                  className="flex-1 border-0 bg-transparent text-lg px-6 py-4 focus:ring-0 focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <div className="flex items-center space-x-2 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <Paperclip className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <Mic className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!question.trim() || isLoading}
                    className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Suggestion Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {suggestionQuestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuestion(suggestion)}
                  className="text-sm hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-full px-4 py-2"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat view with messages and bottom input
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {session.messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                {message.type === "question" ? (
                  <div className="flex justify-end">
                    <Card className="max-w-2xl bg-blue-600 dark:bg-blue-700 text-white border-0 shadow-lg">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-1">
                            <p className="font-medium mb-2">{message.content}</p>
                            <div className="flex items-center justify-between mt-3">
                              <Badge
                                variant="secondary"
                                className="bg-blue-700 dark:bg-blue-800 text-blue-100"
                              >
                                <User className="w-3 h-3 mr-1" />
                                You
                              </Badge>
                              <span className="text-xs text-blue-200">
                                {formatTimestamp(new Date())}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <Card className="max-w-3xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-gray-900 dark:text-gray-100 flex items-center">
                            <Bot className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                            Decidely's Analysis
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                          >
                            AI Response
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none">
                          {message.content.split("\n").map((line, i) => (
                            <p
                              key={i}
                              className="mb-2 text-gray-700 dark:text-gray-300 leading-relaxed"
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                        <div className="flex justify-end mt-4">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimestamp(new Date())}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <Card className="max-w-3xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-6 h-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-gray-600 dark:text-gray-400">
                        Decidely is analyzing your decision...
                      </p>
                      <div className="flex space-x-1 mt-2">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                            className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Bottom Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a follow-up question..."
              className="flex-1 border-0 bg-transparent px-4 py-3 focus:ring-0 focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
              disabled={isLoading}
            />
            <div className="flex items-center space-x-2 px-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
              >
                <Paperclip className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!question.trim() || isLoading}
                className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-full disabled:opacity-50"
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
