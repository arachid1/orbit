import { useAuth } from "../lib/auth/AuthProvider"
import { useState } from "react"

export default function SignInForm() {
    const { signIn } = useAuth()
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const username = formData.get("username") as string
        const password = formData.get("password") as string
        try {
            await signIn(username, password)
        } catch (err) {
            setError((err as Error).message || "Invalid credentials")
        }
    }

    const inputClass =
        "p-2 rounded text-white bg-white/5 border border-[#FFD700]/30 placeholder-white/50 focus:border-[#FFD700] outline-none"

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input name="username" placeholder="Username" className={inputClass} onInput={() => setError(null)} />
            <input type="password" name="password" placeholder="Password" className={inputClass} onInput={() => setError(null)} />
            {error && (
                <p className="text-red-400 text-sm -mt-2">{error}</p>
            )}
            <button type="submit" className="bg-[#FFD700] text-black py-2 rounded">Sign In</button>
        </form>
    )
}
