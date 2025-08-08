"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ChatInterface } from "@/components/dashboard/chat-interface"
import { UserProfile } from "@/components/dashboard/user-profile"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PanelLeft, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DecisionSession {
  id: string
  title: string
  timestamp: Date
  messages: Array<{
    id: string
    type: "question" | "response"
    content: string
    context?: string
  }>
}

const mockSessions: DecisionSession[] = []


export default function DashboardPage() {
  const [sessions, setSessions] = useState<DecisionSession[]>(mockSessions)
  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0]?.id || "")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const activeSession = sessions.find((s) => s.id === activeSessionId)

  const generateTitleFromQuestion = (question: string): string => {
    const cleanQuestion = question
      .replace(/^(should i|can i|how do i|what should i|when should i|where should i|why should i)/i, "")
      .replace(/\?+$/, "")
      .trim()

    const title = cleanQuestion.charAt(0).toUpperCase() + cleanQuestion.slice(1)
    return title.length > 50 ? title.substring(0, 50) + "..." : title
  }

  const createNewSession = () => {
    const newSession: DecisionSession = {
      id: Date.now().toString(),
      title: "New Decision",
      timestamp: new Date(),
      messages: [],
    }
    setSessions([newSession, ...sessions])
    setActiveSessionId(newSession.id)
  }

  const updateSession = (sessionId: string, updates: Partial<DecisionSession>) => {
    setSessions(sessions.map((session) => (session.id === sessionId ? { ...session, ...updates } : session)))
  }

  const deleteSession = (sessionId: string) => {
    const filteredSessions = sessions.filter((session) => session.id !== sessionId)
    setSessions(filteredSessions)
    if (activeSessionId === sessionId && filteredSessions.length > 0) {
      setActiveSessionId(filteredSessions[0].id)
    }
  }

  const renameSession = (sessionId: string, newTitle: string) => {
    updateSession(sessionId, { title: newTitle })
  }

  const handleQuestionSubmit = (question: string, context: string) => {
    if (!activeSession) return

    if (activeSession.title === "New Decision" && question.trim()) {
      const newTitle = generateTitleFromQuestion(question)
      updateSession(activeSession.id, { title: newTitle })
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar - Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:w-0",
        )}
      >
        <div
          className={cn(
            "h-full w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:transition-all lg:duration-300",
            !sidebarOpen && "lg:w-0 lg:overflow-hidden",
          )}
        >
          <DashboardSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSessionSelect={setActiveSessionId}
            onNewSession={createNewSession}
            onDeleteSession={deleteSession}
            onRenameSession={renameSession}
          />
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={toggleSidebar} />}

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 px-4 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {sidebarOpen ? <PanelLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center justify-between w-full min-w-0">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                {activeSession?.title || "New Decision"}
              </h1>
              {activeSession && (
                <span className="hidden sm:inline-flex text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full whitespace-nowrap">
                  {activeSession.messages.length} messages
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <ThemeToggle />
              <UserProfile showName={false} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <ChatInterface
            session={activeSession}
            onUpdateSession={(updates) => activeSession && updateSession(activeSession.id, updates)}
            onQuestionSubmit={handleQuestionSubmit}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
          />
        </main>
      </div>
    </div>
  )
}
