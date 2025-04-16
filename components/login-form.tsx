"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signIn } from "@/lib/actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full h-11 bg-brand-500 hover:bg-brand-600">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  )
}

interface LoginFormProps {
  initialError?: string | null
}

export default function LoginForm({ initialError = null }: LoginFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(initialError)
  const [success, setSuccess] = useState<boolean>(false)

  // Handle form submission
  const handleSubmit = async (formData: FormData) => {
    setError(null)
    try {
      const result = await signIn(null, formData)
      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        setSuccess(true)
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
    }
  }

  // Handle successful login by redirecting
  useEffect(() => {
    if (success) {
      router.push("/dashboard")
    }
  }, [success, router])

  return (
    <Card className="w-full max-w-md border-none shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required className="h-11" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Link href="#" className="text-sm text-brand-500 hover:text-brand-600">
                Forgot password?
              </Link>
            </div>
            <Input id="password" name="password" type="password" required className="h-11" />
          </div>

          <Button type="submit" className="w-full h-11 bg-brand-500 hover:bg-brand-600">
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="mt-2 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/auth/sign-up" className="text-brand-500 hover:text-brand-600 font-medium">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
