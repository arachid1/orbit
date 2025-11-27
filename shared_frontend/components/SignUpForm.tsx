"use client"

import { useState } from "react"
import { useAuth } from "../lib/auth/AuthProvider"

export default function SignUpForm() {
    const { signUp } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const first_name = formData.get("first_name") as string
        const last_name = formData.get("last_name") as string
        const username = formData.get("username") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const re_password = formData.get("re_password") as string
        const date_of_birth = formData.get("date_of_birth") as string

        try {
            await signUp(first_name, last_name, username, email, password, re_password, date_of_birth)
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const inputClass =
        "p-2 rounded text-white bg-white/5 border border-[#FFD700]/30 placeholder-white/50 focus:border-[#FFD700] outline-none"

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input name="first_name" placeholder="First name" className={inputClass} />
            <input name="last_name" placeholder="Last name" className={inputClass} />
            <input name="username" placeholder="Username" className={inputClass} />
            <input name="email" placeholder="Email" className={inputClass} />

            <input
                type="date"
                name="date_of_birth"
                className={inputClass}
                max={new Date().toISOString().split("T")[0]}
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                className={inputClass}
            />
            <input
                type="password"
                name="re_password"
                placeholder="Confirm password"
                className={inputClass}
            />

            {error && (
                <p className="text-red-400 text-sm bg-red-900/40 px-3 py-2 rounded">
                    {error}
                </p>
            )}

            <button
                type="submit"
                className="bg-[#FFD700] text-black py-2 rounded hover:bg-[#e6c200] disabled:opacity-50"
                disabled={loading}
            >
                {loading ? "Signing up..." : "Sign Up"}
            </button>
        </form>
    )
}
