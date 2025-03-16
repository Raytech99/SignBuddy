import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-pink-300">SignKids</span>
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-300 hover:text-pink-300 font-medium">
              Home
            </Link>
            <Link href="/learn" className="text-gray-300 hover:text-pink-300 font-medium">
              Learn
            </Link>
            <Link href="/practice" className="text-gray-300 hover:text-pink-300 font-medium">
              Practice
            </Link>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-pink-300">
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
                className="lucide lucide-menu"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

