"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/actions"
import { MenuIcon, XIcon } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Don't show navbar on auth pages or landing page
  if (pathname.startsWith("/auth") || pathname === "/") {
    return null
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/create-bill", label: "Create Bill" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
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
            <span className="hidden font-bold sm:inline-block">ShareEase</span>
          </Link>

          <nav className="hidden md:flex md:gap-4 md:ml-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <form action={signOut}>
            <Button variant="outline" size="sm" className="hidden md:inline-flex">
              Sign Out
            </Button>
          </form>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="container md:hidden">
          <nav className="flex flex-col space-y-3 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <form action={signOut}>
              <Button variant="outline" size="sm" className="w-full">
                Sign Out
              </Button>
            </form>
          </nav>
        </div>
      )}
    </header>
  )
}
