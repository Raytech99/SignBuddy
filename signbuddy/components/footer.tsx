import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-pink-300">SignKids</h2>
            <p className="text-gray-400">Making sign language fun for everyone!</p>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-300">Learn</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/learn" className="text-gray-400 hover:text-pink-300">
                    Alphabet
                  </Link>
                </li>
                <li>
                  <Link href="/learn/numbers" className="text-gray-400 hover:text-pink-300">
                    Numbers
                  </Link>
                </li>
                <li>
                  <Link href="/learn/common-phrases" className="text-gray-400 hover:text-pink-300">
                    Common Phrases
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-green-300">Practice</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/practice" className="text-gray-400 hover:text-pink-300">
                    Camera Practice
                  </Link>
                </li>
                <li>
                  <Link href="/quiz" className="text-gray-400 hover:text-pink-300">
                    Quiz
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-800 text-center text-gray-500">
          <p>© {new Date().getFullYear()} SignKids. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

