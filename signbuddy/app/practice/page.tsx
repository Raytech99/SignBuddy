"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CameraFeed } from "@/components/camera-feed"
import { LetterGrid } from "@/components/letter-grid"
import { Progress } from "@/components/ui/progress"

export default function PracticePage() {
  const [detectedLetter, setDetectedLetter] = useState<string | null>(null)
  const [targetLetter, setTargetLetter] = useState("A")
  const [completedLetters, setCompletedLetters] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isCooldown, setIsCooldown] = useState(false)
  const lastSuccessfulLetter = useRef<string | null>(null)

  // Generate a new target letter that hasn't been completed yet
  const generateNewTargetLetter = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let remainingLetters = alphabet.split('').filter(letter => !completedLetters.includes(letter))
    if (remainingLetters.length === 0) {
      // All letters completed, reset progress
      setCompletedLetters([])
      remainingLetters = alphabet.split('')
    }
    return remainingLetters[Math.floor(Math.random() * remainingLetters.length)]
  }

  const handleDetection = (letter: string, confidence: number) => {
    setDetectedLetter(letter)
    
    // Check if detected letter matches target letter and we're not in cooldown
    if (letter === targetLetter && !isCooldown && letter !== lastSuccessfulLetter.current) {
      setCompletedLetters(prev => [...prev, letter])
      setProgress(prev => prev + 1)
      setFeedback("Great job! You got it right!")
      // Set a new target letter
      const newLetter = generateNewTargetLetter()
      setTargetLetter(newLetter)
      // Update last successful letter
      lastSuccessfulLetter.current = letter
      // Start cooldown
      setIsCooldown(true)
      // Reset cooldown after 2 seconds
      setTimeout(() => {
        setIsCooldown(false)
        setFeedback("")
        lastSuccessfulLetter.current = null
      }, 2000)
    } else if (letter !== targetLetter) {
      setFeedback("Try again! Keep practicing.")
    }
  }

  // Reset last successful letter when target letter changes
  useEffect(() => {
    lastSuccessfulLetter.current = null
  }, [targetLetter])

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-green-300 mb-8">Practice Sign Language</h1>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-700">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-200">Show the sign for letter:</h2>
                <div className="text-9xl font-bold text-green-300 my-4">{targetLetter}</div>
                <p className="text-gray-400">Make the sign with your hand and wait for detection</p>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <CameraFeed onDetection={handleDetection} className="w-full" />
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="bg-gray-900 rounded-lg p-6 flex-1 border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">Results</h3>

                    {detectedLetter ? (
                      <div className="text-center">
                        <p className="text-gray-400 mb-2">Detected Sign:</p>
                        <div className="text-7xl font-bold text-pink-300 mb-4">{detectedLetter}</div>

                        <div
                          className={`p-4 rounded-lg ${
                            detectedLetter === targetLetter && !isCooldown && detectedLetter !== lastSuccessfulLetter.current
                              ? "bg-green-900/30 text-green-300 border border-green-800"
                              : "bg-yellow-900/30 text-yellow-300 border border-yellow-800"
                          }`}
                        >
                          {detectedLetter === targetLetter && !isCooldown && detectedLetter !== lastSuccessfulLetter.current ? (
                            <div className="flex items-center justify-center">
                              <span>Correct! Great job!</span>
                            </div>
                          ) : (
                            <p>Keep trying! Practice makes perfect.</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center">
                        No sign detected yet. Make a sign and wait for detection.
                      </p>
                    )}
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-medium text-blue-300">Progress:</span>
                        <span className="text-2xl font-bold text-blue-300">{progress}/26</span>
                      </div>
                      <Progress value={(progress / 26) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>

              {feedback && (
                <div className="mt-6 p-4 bg-gray-900 rounded-lg text-center border border-gray-700">
                  <p className="text-blue-300">{feedback}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-200 mb-4">Progress Grid</h2>
              <p className="text-gray-400 mb-4">Completed letters are highlighted in green</p>
              <LetterGrid completedLetters={completedLetters} />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-200 mb-4">Tips for Better Detection</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-300 mr-2">✓</span>
                  <span>Make sure your hand is clearly visible in the camera</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-300 mr-2">✓</span>
                  <span>Use good lighting so the camera can see your hand clearly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-300 mr-2">✓</span>
                  <span>Position your hand in the center of the frame</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-300 mr-2">✓</span>
                  <span>Try to keep a plain background behind your hand</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-300 mr-2">✓</span>
                  <span>Practice each sign slowly and carefully</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

