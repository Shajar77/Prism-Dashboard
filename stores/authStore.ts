import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  name: string
  email: string
}

export interface RegisteredUser {
  name: string
  email: string
  passwordHash: string // Simple string comparison for demo/prototype purposes
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  registeredUsers: RegisteredUser[]
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string }
  login: (email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
}

// Cookie Helper Functions for client-side execution
function setSessionCookie(token: string) {
  if (typeof document !== "undefined") {
    // Set cookie valid for 1 day, accessible across the site, lax same-site restriction
    document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`
  }
}

function clearSessionCookie() {
  if (typeof document !== "undefined") {
    // Delete cookie by setting max-age to 0
    document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax"
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      registeredUsers: [],

      signup: (name, email, password) => {
        const { registeredUsers } = get()
        const normalizedEmail = email.trim().toLowerCase()

        if (registeredUsers.some((u) => u.email === normalizedEmail)) {
          return { success: false, error: "This email address is already registered." }
        }

        const newUser: RegisteredUser = {
          name: name.trim(),
          email: normalizedEmail,
          passwordHash: password, // Store plain/simulated hash for mock DB
        }

        set({ registeredUsers: [...registeredUsers, newUser] })
        return { success: true }
      },

      login: (email, password) => {
        const { registeredUsers } = get()
        const normalizedEmail = email.trim().toLowerCase()

        const userRecord = registeredUsers.find(
          (u) => u.email === normalizedEmail && u.passwordHash === password
        )

        if (!userRecord) {
          return { success: false, error: "Invalid email address or password." }
        }

        const activeUser: User = {
          name: userRecord.name,
          email: userRecord.email,
        }

        // Write authentication cookie for Next.js Middleware to read on server side
        const mockToken = btoa(JSON.stringify({ email: activeUser.email, timestamp: Date.now() }))
        setSessionCookie(mockToken)

        set({ user: activeUser, isAuthenticated: true })
        return { success: true }
      },

      logout: () => {
        clearSessionCookie()
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: "dashboard_auth",
      // Persist user and database to localStorage so registrations/sessions survive reload
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        registeredUsers: state.registeredUsers,
      }),
    }
  )
)
