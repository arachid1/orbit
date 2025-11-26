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

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input name="username" placeholder="Username" className="p-2 rounded bg-[#2F4F3E]" onInput={() => setError(null)} />
            <input type="password" name="password" placeholder="Password" className="p-2 rounded bg-[#2F4F3E]" onInput={() => setError(null)} />
            {error && (
                <p className="text-red-500 text-sm -mt-2">{error}</p>
            )}
            <button type="submit" className="bg-[#FFD700] text-black py-2 rounded">Sign In</button>
        </form>
    )
}
