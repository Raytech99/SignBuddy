import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-pink-300 mb-8">Learn Sign Language!</h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12">
            Welcome to our fun sign language learning adventure! Learn to communicate with your hands and make new
            friends.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/learn">
              <Button
                size="lg"
                className="text-lg bg-green-800 hover:bg-green-700 text-green-200 px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105 border border-green-700"
              >
                Learn the Alphabet
              </Button>
            </Link>
            <Link href="/practice">
              <Button
                size="lg"
                className="text-lg bg-blue-800 hover:bg-blue-700 text-blue-200 px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105 border border-blue-700"
              >
                Practice with Camera
              </Button>
            </Link>
          </div>

          <div className="p-8 bg-gray-800 rounded-xl shadow-md border border-gray-700">
            <h2 className="text-3xl font-bold text-purple-300 mb-6">Why Learn Sign Language?</h2>
            <ul className="text-left text-lg space-y-4 max-w-2xl mx-auto">
              <li className="flex items-start">
                <span className="text-green-300 mr-3 text-xl">✓</span>
                <span className="text-gray-300">Communicate with friends who are deaf or hard of hearing</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-300 mr-3 text-xl">✓</span>
                <span className="text-gray-300">Learn a new language in a fun, visual way</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-300 mr-3 text-xl">✓</span>
                <span className="text-gray-300">Improve your memory and coordination</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-300 mr-3 text-xl">✓</span>
                <span className="text-gray-300">Share a secret language with your friends!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

