"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, MessageSquare, Search, MoreHorizontal, Edit2, Share2, Trash2, Clock, X } from "lucide-react"
import type { DecisionSession } from "@/app/dashboard/page"
import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
  sessions: DecisionSession[]
  activeSessionId: string
  onSessionSelect: (sessionId: string) => void
  onNewSession: () => void
  onDeleteSession: (sessionId: string) => void
  onRenameSession: (sessionId: string, newTitle: string) => void
}

export function DashboardSidebar({
  sessions,
  activeSessionId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
  onRenameSession,
}: DashboardSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [renamingSession, setRenamingSession] = useState<DecisionSession | null>(null)
  const [newTitle, setNewTitle] = useState("")

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.messages.some((message) => message.content.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleRename = (session: DecisionSession) => {
    setRenamingSession(session)
    setNewTitle(session.title)
    setRenameDialogOpen(true)
  }

  const handleRenameSubmit = () => {
    if (renamingSession && newTitle.trim()) {
      onRenameSession(renamingSession.id, newTitle.trim())
      setRenameDialogOpen(false)
      setRenamingSession(null)
      setNewTitle("")
    }
  }

  const handleShare = (session: DecisionSession) => {
    const shareUrl = `${window.location.origin}/shared/${session.id}`
    navigator.clipboard.writeText(shareUrl)
    alert("Share link copied to clipboard!")
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-3 mb-4 sm:mb-6"
        >
          <motion.span
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 5,
            }}
            className="text-xl sm:text-2xl"
          >
            🧠
          </motion.span>
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Decidely
          </span>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onNewSession}
            className="w-full mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Decision
          </Button>
        </motion.div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 transition-colors text-sm"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex-1 overflow-hidden">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {searchQuery ? `Search Results` : "Recent Sessions"}
          </h3>
          {filteredSessions.length > 0 && (
            <Badge
              variant="secondary"
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {filteredSessions.length}
            </Badge>
          )}
        </div>

        <ScrollArea className="flex-1">
          <AnimatePresence>
            <div className="space-y-2">
              {filteredSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start p-3 h-auto text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 rounded-lg",
                        activeSessionId === session.id &&
                          "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/40 shadow-sm",
                      )}
                      onClick={() => onSessionSelect(session.id)}
                    >
                      <div className="flex items-start space-x-3 w-full">
                        <MessageSquare
                          className={cn(
                            "w-4 h-4 mt-1 flex-shrink-0 transition-colors",
                            activeSessionId === session.id
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-400 dark:text-gray-500",
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-sm font-medium truncate transition-colors",
                              activeSessionId === session.id
                                ? "text-blue-900 dark:text-blue-100"
                                : "text-gray-900 dark:text-gray-100",
                            )}
                          >
                            {session.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTimestamp(session.timestamp)}
                            </p>
                            {session.messages.length > 0 && (
                              <Badge
                                variant="outline"
                                className="text-xs px-1 py-0 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                              >
                                {session.messages.length}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>

                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      >
                        <DropdownMenuItem
                          onClick={() => handleRename(session)}
                          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleShare(session)}
                          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteSession(session.id)}
                          className="text-red-600 dark:text-red-400 cursor-pointer focus:text-red-600 dark:focus:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}

              {filteredSessions.length === 0 && searchQuery && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No sessions found matching "{searchQuery}"</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Clear search
                  </Button>
                </motion.div>
              )}

              {filteredSessions.length === 0 && !searchQuery && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <div className="text-4xl mb-4">💭</div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">No decision sessions yet</p>
                  <Button
                    onClick={onNewSession}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Create your first decision
                  </Button>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </ScrollArea>
      </div>

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Rename Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="session-title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Session Title
              </Label>
              <Input
                id="session-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new title..."
                className="mt-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRenameSubmit()
                  }
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setRenameDialogOpen(false)}
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRenameSubmit}
                disabled={!newTitle.trim()}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Rename
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
