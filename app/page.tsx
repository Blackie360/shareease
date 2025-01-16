import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Share2, Users, Zap, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-b from-purple-50 via-white to-pink-50">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                Share Your Music with the World
              </h1>
              <p className="max-w-2xl text-gray-700 md:text-lg dark:text-gray-500">
                Discover, share, and connect through music. Join our vibrant community today.
              </p>
              <form className="flex flex-wrap items-center justify-center space-x-3">
                <Input
                  className="flex-1 max-w-lg"
                  placeholder="Enter your email"
                  type="email"
                />
                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                  Get Started
                </Button>
              </form>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Start your free trial. No credit card required.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 bg-gradient-to-r from-yellow-50 via-white to-indigo-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-center mb-12 text-gray-800">
              Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {[
                {
                  icon: Share2,
                  title: "Easy Sharing",
                  description: "Share your favorite tracks and playlists with just a click.",
                  color: "text-purple-500",
                },
                {
                  icon: Users,
                  title: "Community",
                  description: "Connect with other music enthusiasts and discover new artists.",
                  color: "text-indigo-500",
                },
                {
                  icon: Zap,
                  title: "Instant Streaming",
                  description: "High-quality, lag-free music streaming anytime, anywhere.",
                  color: "text-pink-500",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-6 space-y-4 bg-white shadow-lg rounded-xl hover:shadow-2xl transition-transform transform hover:scale-105"
                >
                  <feature.icon className={`h-12 w-12 ${feature.color}`} />
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-16 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-center mb-12">
              Pricing Plans
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {[
                {
                  name: "Free",
                  price: "$0",
                  features: ["Basic music sharing", "Limited storage", "Ad-supported"],
                },
                {
                  name: "Pro",
                  price: "$9.99",
                  features: ["Unlimited music sharing", "50GB storage", "Ad-free experience", "Priority support"],
                  highlight: true,
                },
                {
                  name: "Artist",
                  price: "$19.99",
                  features: ["All Pro features", "Unlimited storage", "Advanced analytics", "Promotional tools"],
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`flex flex-col p-6 rounded-lg shadow-lg ${
                    plan.highlight
                      ? "bg-gradient-to-r from-indigo-700 to-pink-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
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
                  <Button className={`${plan.highlight ? "bg-white text-black" : "bg-indigo-500 text-white"} mt-auto`}>
                    {plan.highlight ? "Subscribe Now" : "Get Started"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
