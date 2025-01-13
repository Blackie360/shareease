import Link from "next/link"
import { Music } from 'lucide-react'
import { buttonVariants } from "./ui/button"

export function Navbar() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
      <Link className="flex items-center justify-center" href="#">
        <Music className="h-6 w-6" />
        <span className="ml-2 text-2xl font-bold">MusicShare</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
          Features
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
          Pricing
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
          About
        </Link>
        <Link href="/sign-in" className={buttonVariants()}>
          Sign In
        </Link>
      </nav>
    </header>
  )
}

