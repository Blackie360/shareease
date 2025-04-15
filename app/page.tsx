import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { isSupabaseConfigured } from "@/lib/supabase/server"

export default async function Home() {
  // If Supabase is not configured, show setup message
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4 text-white">Supabase Configuration Required</h1>
          <p className="text-gray-400 mb-6">
            Please set the NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables to connect
            to your Supabase project.
          </p>
        </div>
      </div>
    )
  }

  // Check if user is already logged in
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header */}
      <header className="container z-40">
        <div className="flex h-20 items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-brand-500 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-white"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="font-bold text-xl">ShareEase</span>
          </div>
          <nav className="hidden md:flex md:items-center md:gap-6">
            <Link href="/" className="text-sm font-medium text-white hover:text-brand-400">
              Home
            </Link>
            <Link href="#features" className="text-sm font-medium text-gray-400 hover:text-white">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-400 hover:text-white">
              Pricing
            </Link>
            <Link href="#about" className="text-sm font-medium text-gray-400 hover:text-white">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-gray-800">
                Login
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-white text-black hover:bg-gray-200">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-1 items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-20 md:py-32">
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Your <span className="text-blue-500">Financial Partner</span> for Sharing
            </h1>
            <p className="max-w-[600px] text-lg text-gray-400 md:text-xl">
              Organize your expenses, visualize payments, and unlock financial clarity with an intuitive bill-splitting
              experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg h-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-gray-900 px-8 py-6 text-lg h-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative hidden md:flex items-center justify-center">
            <div className="absolute w-[350px] h-[350px] bg-brand-500/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              {/* Floating icons */}
              <div className="absolute top-0 left-0 animate-float-slow">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-500"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
              </div>
              <div className="absolute top-20 right-0 animate-float">
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-500"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-20 animate-float-slow">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-500"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-20 right-20 animate-float">
                <div className="bg-orange-500/20 p-3 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-orange-500"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
              </div>

              {/* Central element */}
              <div className="relative w-[200px] h-[200px] rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-950 py-20">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="rounded-full bg-brand-500/20 p-3 w-fit mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand-500"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Group Expenses</h3>
              <p className="text-gray-400">
                Split bills among multiple people with customizable amounts and payment tracking.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="rounded-full bg-brand-500/20 p-3 w-fit mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand-500"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Multiple Payment Methods</h3>
              <p className="text-gray-400">Support for M-Pesa, Airtel Money, and other popular payment methods.</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="rounded-full bg-brand-500/20 p-3 w-fit mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand-500"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Track Payments</h3>
              <p className="text-gray-400">
                Keep track of who has paid and who still owes money with visual indicators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="rounded-full bg-brand-500 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-white"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <span className="font-bold">ShareEase</span>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Terms
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ShareEase. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
