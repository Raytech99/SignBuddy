"use client"

import { useState, useEffect } from 'react'
import { CameraFeed } from '@/components/camera-feed'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft, Play } from 'lucide-react'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const CONFIDENCE_THRESHOLD = 0.85

export default function LearnPage() {
  const [detectedLetter, setDetectedLetter] = useState<string | null>(null)
  const [confidence, setConfidence] = useState(0)
  const [isStarted, setIsStarted] = useState(false)

  // Clean up camera when leaving page
  useEffect(() => {
    return () => {
      setIsStarted(false)
    }
  }, [])

  const handleDetection = (letter: string, detectionConfidence: number) => {
    // Only show letters with high confidence
    if (!letter || detectionConfidence < 0.75) {
      setDetectedLetter(null)
      setConfidence(0)
      return
    }
    
    setDetectedLetter(letter)
    setConfidence(detectionConfidence * 100)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold">Practice Sign Language</h2>
              </div>
              <div className="max-w-3xl mx-auto">
                {!isStarted ? (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Button 
                      size="lg"
                      onClick={() => setIsStarted(true)}
                      className="gap-2"
                    >
                      <Play className="h-5 w-5" />
                      Start Practice
                    </Button>
                  </div>
                ) : (
                  <CameraFeed 
                    onDetection={handleDetection}
                    className="aspect-video bg-muted shadow-sm rounded-lg"
                  />
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Detected Letter</h3>
              <div className={`flex items-center justify-center h-32 text-6xl font-bold transition-all duration-200
                ${confidence > CONFIDENCE_THRESHOLD * 100 
                  ? "text-green-700 dark:text-green-400" 
                  : ""}`}
              >
                {!isStarted ? "?" : (detectedLetter || '?')}
              </div>
              {detectedLetter && isStarted && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Confidence: {confidence.toFixed(1)}%
                  </p>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">ASL Alphabet</h3>
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-9">
                {ALPHABET.map((letter) => (
                  <div
                    key={letter}
                    className={`flex items-center justify-center h-10 w-10 rounded-md border text-center font-medium transition-all duration-200
                      ${letter === detectedLetter && confidence > CONFIDENCE_THRESHOLD * 100
                        ? "bg-green-100 text-green-700 border-green-300 shadow-sm dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" 
                        : "bg-muted text-muted-foreground"}`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

