"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { error } from "console"

type User = {
    id: number
    username: string
    email: string
}

type AuthContextType = {
    user: User | null
    loading: boolean
    signIn: (username: string, password: string) => Promise<void>
    signUp: (username: string, email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    console.log(API_URL)
    // 🔄 Restore session on load (reads cookies)
    useEffect(() => {
        async function checkSession() {
            try {
                const res = await fetch(`${API_URL}/api/core/me/`, {
                    credentials: "include",
                })
                if (res.ok) {
                    const data = await res.json()
                    setUser(data)
                } else {
                    setUser(null)
                }
            } catch (err) {
                console.error("Session check failed:", err)
            } finally {
                setLoading(false)
            }
        }
        checkSession()
    }, [API_URL])

    // 🧠 Sign In (sets cookies via backend)
    async function signIn(username: string, password: string) {
        const res = await fetch(`${API_URL}/api/auth/jwt/create/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: "include",
        })
        if (!res.ok) throw new Error("Invalid credentials")

        // ✅ Ask backend who we are (cookies handle auth)
        const me = await fetch(`${API_URL}/api/core/me/`, {
            credentials: "include",
        }).then((r) => (r.ok ? r.json() : null))

        if (me) {
            setUser(me)
            // router.push("/dashboard")
        } else {
            throw new Error("Failed to retrieve user after login")
        }
    }

    // ✨ Sign Up → Auto-login
    async function signUp(first_name: string, last_name: string, username: string, email: string, password: string, re_password: string, date_of_birth: string) {
        const res = await fetch(`${API_URL}/api/auth/users/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ first_name, last_name, username, email, password, re_password: re_password, date_of_birth }),
            credentials: "include",
        })

        if (!res.ok) {
            const errorData = await res.json()
            console.log(errorData)
            const msg =
                errorData?.first_name?.[0] ||
                errorData?.last_name?.[0] ||
                errorData?.username?.[0] ||
                errorData?.email?.[0] ||
                errorData?.date_of_birth?.[0] ||
                errorData?.password?.[0] ||
                errorData?.re_password?.[0] ||
                errorData?.non_field_errors?.[0] ||
                "Unable to create account."
            throw new Error(msg)
        }

        return signIn(username, password)
    }

    // 🚪 Global Sign Out (clears cookies for all subdomains)
    async function signOut() {
        try {
            await fetch(`${API_URL}/api/auth/logout/`, {
                method: "POST",
                credentials: "include",
            })
        } catch (err) {
            console.warn("Logout request failed:", err)
        } finally {
            setUser(null)
            router.push("/")
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}
