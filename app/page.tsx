'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Music, Headphones, Users, Zap, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const [email, setEmail] = useState('')

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50">
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Heart className="w-20 h-20 text-red-500 animate-pulse" />
              </motion.div>
              <motion.h1
                className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Share the Love of Music
              </motion.h1>
              <motion.p
                className="max-w-2xl text-gray-700 md:text-lg dark:text-gray-400"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Connect hearts through melodies. Join our warm, vibrant community today and let the music bring us together.
              </motion.p>
              <motion.form
                className="flex flex-wrap items-center justify-center space-x-3"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                onSubmit={(e) => {
                  e.preventDefault()
                  alert(`Welcome to our musical family, ${email}! 🎵❤️`)
                }}
              >
                <Input
                  className="flex-1 max-w-lg"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white">
                  Join the Harmony
                </Button>
              </motion.form>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Start your musical journey. No strings attached, just pure melody.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 bg-gradient-to-r from-yellow-100 via-white to-pink-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-center mb-12 text-gray-800">
              Spread the Joy of Music
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {[
                {
                  icon: Music,
                  title: "Heartfelt Sharing",
                  description: "Share the songs that touch your soul with just a heartbeat.",
                  color: "text-red-500",
                },
                {
                  icon: Users,
                  title: "Melodic Community",
                  description: "Connect with fellow music lovers and discover new soundscapes together.",
                  color: "text-orange-500",
                },
                {
                  icon: Headphones,
                  title: "Immersive Listening",
                  description: "Experience crystal-clear, emotion-rich music streaming anytime, anywhere.",
                  color: "text-yellow-500",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center p-6 space-y-4 bg-white shadow-lg rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <feature.icon className={`h-12 w-12 ${feature.color}`} />
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm text-gray-600 text-center">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-16 bg-gradient-to-r from-red-500 to-yellow-500 text-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-center mb-12">
              Choose Your Melody
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {[
                {
                  name: "Harmony",
                  price: "$0",
                  features: ["Basic music sharing", "Community access", "Ad-supported listening"],
                },
                {
                  name: "Rhythm",
                  price: "$9.99",
                  features: ["Unlimited music sharing", "50GB personal mixtape storage", "Ad-free immersive experience", "Priority support"],
                  highlight: true,
                },
                {
                  name: "Crescendo",
                  price: "$19.99",
                  features: ["All Rhythm features", "Unlimited storage", "Advanced playlist analytics", "Artist collaboration tools"],
                },
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  className={`flex flex-col p-6 rounded-lg shadow-lg ${
                    plan.highlight
                      ? "bg-gradient-to-r from-pink-600 to-orange-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-2xl font-bold text-center mb-4">{plan.name}</h3>
                  <p className="text-4xl font-bold text-center mb-4">
                    {plan.price}
                    <span className="text-sm font-normal">/month</span>
                  </p>
                  <ul className="mb-6 space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="text-green-500 h-5 w-5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`${plan.highlight ? "bg-white text-black" : "bg-red-500 text-white"} mt-auto hover:scale-105 transition-transform duration-300`}>
                    {plan.highlight ? "Join the Band" : "Start Jamming"}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

