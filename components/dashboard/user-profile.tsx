"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut, HelpCircle } from "lucide-react"

interface UserProfileProps {
  showName?: boolean
}

export function UserProfile({ showName = false }: UserProfileProps) {
  const router = useRouter()

  const [user, setUser] = useState<{
    name: string
    email: string
    avatar?: string
  } | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email || "No email",
          avatar: firebaseUser.photoURL || undefined,
        })
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/login")
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <div className="flex items-center space-x-2 sm:space-x-3">
      {showName && user && (
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          align="end"
          forceMount
        >
          {user ? (
            <>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem onClick={() => handleNavigation("/profile")} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation("/settings")} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation("/help")} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem onClick={handleLogout} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </>
          ) : (
            <div className="p-2 text-sm text-gray-500 dark:text-gray-400">Not logged in</div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
