"use client"

import { useState, useEffect, useRef} from "react"
import { Button } from "@/components/ui/button"
import { Clock, Focus, Leaf, PauseCircle, Volume2, VolumeX } from "lucide-react"
import NatureClock from "@/components/nature-clock"
import MossGrowth from "@/components/moss-growth"
import NatureBackground from "@/components/nature-background"
import SoundControls from "@/components/sound-controls"

export default function Home() {
  const [focusMode, setFocusMode] = useState(false)
  const [soundsPlaying, setSoundsPlaying] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const mainRef = useRef<HTMLElement>(null)
  const [mossGrowth, setMossGrowth] = useState(0) // 0-100 percentage

  // Check if API key is set
  useEffect(() => {
    // Request fullscreen when entering focus mode
    if (focusMode && mainRef.current) {
      try {
        if (document.fullscreenElement === null) {
          mainRef.current.requestFullscreen().catch((err) => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`)
          })
        }
      } catch (error) {
        console.log("Fullscreen API not supported:", error)
      }
    }
  }, [focusMode])

  // Get user location for weather data or use fallback
  useEffect(() => {
    const handleLocationError = () => {
      console.log("Using default location data")
      // Use default location if geolocation fails or is blocked
      setLocation({ lat: 40.7128, lon: -74.006 }) // New York as default
    }

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            })
          },
          (error) => {
            console.log("Geolocation error:", error.message)
            handleLocationError()
          },
          { timeout: 5000 },
        )
      } else {
        console.log("Geolocation not supported")
        handleLocationError()
      }
    } catch (error) {
      console.log("Geolocation access error:", error)
      handleLocationError()
    }
  }, [])



  // Simulate moss growth over time
  useEffect(() => {
    if (focusMode) {
      const interval = setInterval(() => {
        setMossGrowth((prev) => Math.min(prev + 0.5, 100))
      }, 5000) // Grow a little every 5 seconds when in focus mode

      return () => clearInterval(interval)
    }
  }, [focusMode])

  const toggleFocus = () => {
    setFocusMode(!focusMode)
    if (!focusMode) {
      // Starting focus mode
      setSoundsPlaying(true)
    }
  }

  return (
    <main ref={mainRef} className="relative h-screen w-full overflow-hidden bg-stone-900 text-white">
      {/* Nature Background with dynamic elements */}
      <NatureBackground focusMode={focusMode} location={location}/>

      {/* Main App UI */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-between p-6">
        {/* Top Bar with Status */}
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            {focusMode ? (
              <div className="flex items-center text-green-400">
                <Leaf className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Nature Time</span>
              </div>
            ) : (
              <div className="flex items-center text-stone-300">
                <Clock className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Standard Time</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundsPlaying(!soundsPlaying)}
              className="text-stone-300 hover:text-white transition-colors"
            >
              {soundsPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>

            
          </div>
        </div>

        {/* Nature Clock */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
          <NatureClock focusMode={focusMode} />

          {/* Moss Growth Indicator */}
          <div className="mt-12 w-full">
            <MossGrowth growthPercentage={mossGrowth} />
            <p className="text-center mt-3 text-sm text-stone-300">
              {mossGrowth < 20 && "Moss is just beginning to grow..."}
              {mossGrowth >= 20 && mossGrowth < 40 && "Moss is establishing itself..."}
              {mossGrowth >= 40 && mossGrowth < 60 && "Moss is growing steadily..."}
              {mossGrowth >= 60 && mossGrowth < 80 && "Moss is thriving..."}
              {mossGrowth >= 80 && mossGrowth < 100 && "Moss is almost fully grown..."}
              {mossGrowth >= 100 && "Moss has grown 2mm. Email replies unlocked."}
            </p>
          </div>
        </div>





        {/* Focus Button and Controls */}
        <div className="w-full max-w-md">
          <Button
            onClick={toggleFocus}
            className={`w-full py-6 text-lg rounded-full flex items-center justify-center gap-2 ${
              focusMode
                ? "bg-stone-700 hover:bg-stone-600 text-stone-100"
                : "bg-green-700 hover:bg-green-600 text-white"
            }`}
          >
            {focusMode ? (
              <>
                <PauseCircle className="h-5 w-5" />
                Return to Standard Time
              </>
            ) : (
              <>
                <Focus className="h-5 w-5" />
                Enter Nature Time
              </>
            )}
          </Button>

          {focusMode && <SoundControls playing={soundsPlaying} setPlaying={setSoundsPlaying} />}
        </div>
      </div>


    </main>
  )
}

