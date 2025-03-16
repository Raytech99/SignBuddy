"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, VolumeIcon as VolumeUp } from "lucide-react"

const alphabet = [
  { letter: "A", image: "/placeholder.svg?height=300&width=300" },
  { letter: "B", image: "/placeholder.svg?height=300&width=300" },
  { letter: "C", image: "/placeholder.svg?height=300&width=300" },
  { letter: "D", image: "/placeholder.svg?height=300&width=300" },
  { letter: "E", image: "/placeholder.svg?height=300&width=300" },
  { letter: "F", image: "/placeholder.svg?height=300&width=300" },
  { letter: "G", image: "/placeholder.svg?height=300&width=300" },
  { letter: "H", image: "/placeholder.svg?height=300&width=300" },
  { letter: "I", image: "/placeholder.svg?height=300&width=300" },
  { letter: "J", image: "/placeholder.svg?height=300&width=300" },
  { letter: "K", image: "/placeholder.svg?height=300&width=300" },
  { letter: "L", image: "/placeholder.svg?height=300&width=300" },
  { letter: "M", image: "/placeholder.svg?height=300&width=300" },
  { letter: "N", image: "/placeholder.svg?height=300&width=300" },
  { letter: "O", image: "/placeholder.svg?height=300&width=300" },
  { letter: "P", image: "/placeholder.svg?height=300&width=300" },
  { letter: "Q", image: "/placeholder.svg?height=300&width=300" },
  { letter: "R", image: "/placeholder.svg?height=300&width=300" },
  { letter: "S", image: "/placeholder.svg?height=300&width=300" },
  { letter: "T", image: "/placeholder.svg?height=300&width=300" },
  { letter: "U", image: "/placeholder.svg?height=300&width=300" },
  { letter: "V", image: "/placeholder.svg?height=300&width=300" },
  { letter: "W", image: "/placeholder.svg?height=300&width=300" },
  { letter: "X", image: "/placeholder.svg?height=300&width=300" },
  { letter: "Y", image: "/placeholder.svg?height=300&width=300" },
  { letter: "Z", image: "/placeholder.svg?height=300&width=300" },
]

export default function LearnPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [viewMode, setViewMode] = useState<"single" | "all">("single")

  const currentLetter = alphabet[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? alphabet.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === alphabet.length - 1 ? 0 : prev + 1))
  }

  const speakLetter = (letter: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(letter)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-300 mb-8">Learn Sign Language Alphabet</h1>

        <div className="flex justify-center mb-6">
          <div className="flex space-x-4">
            <Button
              onClick={() => setViewMode("single")}
              variant={viewMode === "single" ? "default" : "outline"}
              className={`rounded-full ${viewMode === "single" ? "bg-blue-800 text-blue-200 border-blue-700" : "text-gray-300 border-gray-700 hover:bg-gray-800"}`}
            >
              Learn One by One
            </Button>
            <Button
              onClick={() => setViewMode("all")}
              variant={viewMode === "all" ? "default" : "outline"}
              className={`rounded-full ${viewMode === "all" ? "bg-blue-800 text-blue-200 border-blue-700" : "text-gray-300 border-gray-700 hover:bg-gray-800"}`}
            >
              See All Letters
            </Button>
          </div>
        </div>

        {viewMode === "single" ? (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
              <CardContent className="p-0">
                <div className="flex flex-col items-center p-6">
                  <div className="text-9xl font-bold text-pink-300 mb-4">{currentLetter.letter}</div>

                  <div className="relative mb-6">
                    <img
                      src={currentLetter.image || "/placeholder.svg"}
                      alt={`Sign for letter ${currentLetter.letter}`}
                      className="rounded-lg shadow-md"
                    />
                  </div>

                  <Button
                    onClick={() => speakLetter(currentLetter.letter)}
                    className="mb-4 bg-purple-800 hover:bg-purple-700 text-purple-200 border border-purple-700"
                  >
                    <VolumeUp className="mr-2 h-5 w-5" />
                    Hear Letter
                  </Button>

                  <div className="flex justify-between w-full mt-4">
                    <Button
                      onClick={goToPrevious}
                      variant="outline"
                      size="lg"
                      className="flex items-center text-gray-300 border-gray-700 hover:bg-gray-700"
                    >
                      <ChevronLeft className="mr-2 h-5 w-5" />
                      Previous
                    </Button>
                    <Button
                      onClick={goToNext}
                      variant="outline"
                      size="lg"
                      className="flex items-center text-gray-300 border-gray-700 hover:bg-gray-700"
                    >
                      Next
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {alphabet.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-pink-400" : "bg-gray-600"}`}
                    aria-label={`Go to letter ${alphabet[index].letter}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {alphabet.map((item, index) => (
              <Card
                key={index}
                className="bg-gray-800 hover:shadow-lg transition-shadow cursor-pointer border border-gray-700"
                onClick={() => {
                  setCurrentIndex(index)
                  setViewMode("single")
                }}
              >
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="text-4xl font-bold text-pink-300 mb-2">{item.letter}</div>
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={`Sign for letter ${item.letter}`}
                    className="rounded-lg w-full"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

