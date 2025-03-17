"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CameraFeed } from "@/components/camera-feed"

export default function PracticePage() {
  const [detectedLetter, setDetectedLetter] = useState<string | null>(null)
  const [confidence, setConfidence] = useState<number>(0)

  const handleDetection = (letter: string, detectedConfidence: number) => {
    setDetectedLetter(letter)
    setConfidence(detectedConfidence)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-green-300 mb-8">Sign Language Recognition</h1>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <CameraFeed onDetection={handleDetection} className="w-full" />
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div className="bg-gray-900 rounded-lg p-6 flex-1 border border-gray-700 flex flex-col items-center justify-center">
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">Detected Sign</h3>

                    {detectedLetter ? (
                      <div className="text-center">
                        <div className="text-9xl font-bold text-green-300 mb-6">{detectedLetter}</div>
                        <p className="text-gray-400">Confidence: {(confidence * 100).toFixed(1)}%</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-gray-500 text-lg">
                          No sign detected yet. Make a sign with your hand.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
                  <span>Make each sign slowly and carefully</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

