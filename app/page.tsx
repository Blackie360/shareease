import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Headphones, Heart, Music, Search, Share2, Users } from 'lucide-react'
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Amplify Your Music Journey
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-700 md:text-xl dark:text-gray-300">
                  Dive into a vibrant world of melodies, rhythms, and harmonies. Connect, share, and groove with fellow music enthusiasts!
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Unleash the Power of Music</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center">
                <Share2 className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold">Easy Sharing</h3>
                <p className="text-gray-500 dark:text-gray-400">Share your favorite tracks and playlists with just a click.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Users className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold">Community</h3>
                <p className="text-gray-500 dark:text-gray-400">Connect with other music enthusiasts and artists.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Headphones className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold">High-Quality Streaming</h3>
                <p className="text-gray-500 dark:text-gray-400">Enjoy crystal-clear audio streaming of your favorite music.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Search className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold">Discover New Music</h3>
                <p className="text-gray-500 dark:text-gray-400">Find new tracks and artists based on your preferences.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Heart className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold">Create Playlists</h3>
                <p className="text-gray-500 dark:text-gray-400">Curate and share your perfect playlists for any mood or occasion.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Music className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold">Artist Profiles</h3>
                <p className="text-gray-500 dark:text-gray-400">Showcase your music and connect with fans as an artist.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Join the Musical Revolution</h2>
                <p className="max-w-[600px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                  Be part of a dynamic community where melodies meet, genres blend, and musical magic happens. Sign up now and let your musical journey begin!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" />
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">Sign Up</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 MusicShare. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

