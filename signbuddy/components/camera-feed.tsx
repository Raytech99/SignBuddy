import React, { useEffect, useState, useRef } from 'react';
import { Button } from './ui/button';

interface CameraFeedProps {
  onDetection?: (letter: string, confidence: number) => void;
  className?: string;
}

export function CameraFeed({ onDetection, className = '' }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().then(() => {
              setIsStreaming(true);
              setError('');
            }).catch(err => {
              console.error('Video playback failed:', err);
              setError('Failed to start video playback');
            });
          };
          videoRef.current.onerror = (err) => {
            console.error('Video element error:', err);
            setError('Video element encountered an error');
          };
        } else {
          setError('Failed to initialize video element');
        }
      } catch (err) {
        console.error('Camera setup error:', err);
        setError(
          err instanceof DOMException && err.name === 'NotAllowedError'
            ? 'Camera access denied. Please allow camera access in your browser settings.'
            : 'Unable to access camera. Please make sure your camera is connected and not in use by another application.'
        );
      }
    }

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, []);

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    try {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the frame to base64
      const imageData = canvas.toDataURL('image/jpeg');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.success && onDetection) {
        onDetection(data.letter, data.confidence);
      }
    } catch (err) {
      console.error('Frame capture/detection error:', err);
      setError('Failed to communicate with the sign detection service.');
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isStreaming) {
      interval = setInterval(captureFrame, 1000); // Check every second
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isStreaming]);

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <div className="relative aspect-video max-h-[60vh] w-full bg-muted">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-contain"
          style={{ transform: 'scaleX(-1)' }} // Mirror effect
        />
        <canvas ref={canvasRef} className="hidden" />
        {!isStreaming && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground">Initializing camera...</p>
          </div>
        )}
      </div>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="max-w-md p-4">
            <p className="text-destructive text-center">{error}</p>
            <Button 
              className="mt-4 mx-auto block"
              onClick={() => window.location.reload()}
            >
              Retry Camera Access
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 