"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function AuthPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSignUp = async (formData: FormData) => {
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      const fullName = formData.get("fullName") as string
      const username = formData.get("username") as string

      // Step 1: Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username,
          },
        },
      })

      if (authError) {
        throw authError
      }

      // Step 2: Create profile record (only if auth was successful)
      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id, // Use the auth user's ID
          username: username,
          full_name: fullName,
          avatar_url: null,
        })

        if (profileError) {
          throw profileError
        }
      }

      setMessage("Account created successfully! Check your email to verify.")
    } catch (error: any) {
      setError(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
      <form action={handleSignUp} className="space-y-4 max-w-md mx-auto p-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {message && <div className="p-3 rounded-md bg-green-100 text-green-700">{message}</div>}

        {error && <div className="p-3 rounded-md bg-red-100 text-red-700">{error}</div>}
      </form>
    </div>
  )
}
