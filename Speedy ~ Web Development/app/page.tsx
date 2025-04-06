"use client"

import type React from "react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeProvider } from "@/components/theme-provider"
import { motion, AnimatePresence } from "framer-motion"
import { Info } from "lucide-react"

export default function ClickSpeedTest() {
  const [clickTime, setClickTime] = useState<number | null>(null)
  const [status, setStatus] = useState<"intro" | "ready" | "countdown" | "waiting" | "result" | "too-early">("intro")
  const [countdown, setCountdown] = useState<number | null>(null)
  const [introCount, setIntroCount] = useState<number>(3)
  const [earlyClickDetection, setEarlyClickDetection] = useState<boolean>(false)
  const [pastResults, setPastResults] = useState<number[]>([])
  const timeRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Handle the intro countdown
  useEffect(() => {
    if (status === "intro" && introCount > 0) {
      const timer = setTimeout(() => {
        setIntroCount(introCount - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (status === "intro" && introCount === 0) {
      // When intro countdown reaches 0, move to ready state
      const timer = setTimeout(() => {
        setStatus("ready")
      }, 1000)

      return () => clearTimeout(timer)
    } else if (status === "waiting") {
      // Set the timer reference exactly when the green button is rendered
      // This ensures we only measure from when the button is visible
      timeRef.current = Date.now()
    }
  }, [status, introCount])

  // Add a global click handler to detect early clicks during countdown
  useEffect(() => {
    const handleGlobalClick = () => {
      if (status === "countdown" && earlyClickDetection) {
        // User clicked too early during countdown
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }

        // Clear the countdown interval
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current)
          countdownIntervalRef.current = null
        }

        setStatus("too-early")
      }
    }

    // Only add the listener during countdown state and after early detection is enabled
    if (status === "countdown" && earlyClickDetection) {
      window.addEventListener("click", handleGlobalClick)
    }

    return () => {
      window.removeEventListener("click", handleGlobalClick)
    }
  }, [status, earlyClickDetection])

  // Enable early click detection after a short delay
  useEffect(() => {
    if (status === "countdown" && !earlyClickDetection) {
      // Add a small delay before enabling early click detection
      // This prevents the START button click from triggering it
      const enableDetectionTimer = setTimeout(() => {
        setEarlyClickDetection(true)
      }, 300)

      return () => clearTimeout(enableDetectionTimer)
    } else if (status !== "countdown") {
      // Reset early click detection when leaving countdown state
      setEarlyClickDetection(false)
    }
  }, [status, earlyClickDetection])

  const startTest = (e: React.MouseEvent) => {
    // Prevent event bubbling to avoid triggering the global click handler
    e.stopPropagation()

    setStatus("countdown")
    // Generate random wait time between 1-5 seconds
    const randomDelay = Math.floor(Math.random() * 4000) + 1000

    // Show countdown in seconds
    setCountdown(Math.ceil(randomDelay / 1000))

    // Update countdown every second
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev && prev > 1) return prev - 1
        return prev
      })
    }, 1000)

    // Store the interval reference so we can clear it later
    countdownIntervalRef.current = countdownInterval

    // Set timer to change to waiting state
    timerRef.current = setTimeout(() => {
      // Clear the countdown interval when transitioning to waiting state
      clearInterval(countdownInterval)
      countdownIntervalRef.current = null
      setStatus("waiting")
    }, randomDelay)
  }

  const handleClick = () => {
    if (status === "waiting") {
      // Calculate the time difference
      const endTime = Date.now()
      const timeDifference = endTime - (timeRef.current || 0)
      // Subtract 300ms from the result (with a minimum of 0)
      const adjustedTime = Math.max(0, timeDifference - 300)
      setClickTime(adjustedTime)

      // Add the result to past results
      if (adjustedTime) {
        setPastResults((prev) => [...prev, adjustedTime])
      }

      setStatus("result")
    }
  }

  const resetTest = (e: React.MouseEvent) => {
    // Prevent event bubbling
    e.stopPropagation()

    setStatus("ready")
    setClickTime(null)
    setCountdown(null)
    timeRef.current = null

    // Clear any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
  }

  // Function to get feedback based on reaction time
  const getFeedback = (time: number | null) => {
    if (!time) return { text: "", emoji: "" }

    if (time < 70) return { text: "God Level", emoji: "💀" }
    if (time < 100) return { text: "Pretty Good", emoji: "😲" }
    if (time < 200) return { text: "Good", emoji: "😏" }
    if (time < 300) return { text: "Fine ig...", emoji: "🤗" }
    if (time < 400) return { text: "Ugh", emoji: "😒" }
    if (time < 500) return { text: "Bruh Slow", emoji: "🙄" }
    if (time < 600) return { text: "So Slow omg", emoji: "🤨" }
    return { text: "Its not for you", emoji: "🤢" }
  }

  // Clean up timers when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [])

  // Get the best (lowest) result
  const bestResult = pastResults.length > 0 ? Math.min(...pastResults) : null

  // Define gradient variants for the click area
  const clickAreaVariants = {
    waiting: {
      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
      transition: { duration: 1.2, ease: "easeInOut" },
    },
    result: {
      background: "linear-gradient(135deg, #262626 0%, #171717 100%)",
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-neutral-900 to-black p-4 sm:p-6 md:p-8 dark select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md sm:max-w-lg md:max-w-xl"
        >
          <Card className="border-neutral-800 bg-neutral-950 text-white overflow-hidden shadow-2xl">
            <CardHeader className="pb-4 md:pb-6">
              <div className="flex justify-between items-center">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex-1"
                >
                  <CardTitle className="text-2xl md:text-3xl text-center font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Speedy
                  </CardTitle>
                </motion.div>
                <Link href="/about">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="bg-neutral-800 hover:bg-neutral-700 transition-colors p-2 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Info className="w-4 h-4 text-neutral-300" />
                  </motion.div>
                </Link>
              </div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <CardDescription className="text-center text-neutral-400 text-sm md:text-base mt-2">
                  {status === "intro" && "Let's see how fast you are!"}
                  {status === "ready" && "Press the red button to start"}
                  {status === "countdown" && "Get ready..."}
                  {status === "waiting" && "Click the green area as fast as you can!"}
                  {status === "result" && "Your reaction time"}
                  {status === "too-early" && "Oops! You clicked too early"}
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 md:px-8 pb-6">
              <AnimatePresence mode="wait">
                {status === "intro" ? (
                  <motion.div
                    key="intro"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center rounded-xl p-10 md:p-14 bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg select-none"
                  >
                    <motion.div className="text-xl md:text-2xl font-medium mb-8 text-center">
                      Let's see how fast you are in...
                    </motion.div>
                    <motion.div
                      key={introCount}
                      initial={{ scale: 0, opacity: 0, rotate: -10 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 2, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                      className="text-6xl md:text-7xl font-bold"
                    >
                      {introCount === 0 ? "GO!" : introCount}
                    </motion.div>
                  </motion.div>
                ) : status === "ready" ? (
                  <motion.div
                    key="start-button"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <motion.button
                      onClick={startTest}
                      className="w-full py-10 md:py-12 text-xl md:text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl shadow-lg select-none"
                      whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      START
                    </motion.button>

                    {/* Show past results if any */}
                    {pastResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 p-5 bg-neutral-900 rounded-xl border border-neutral-800"
                      >
                        <h3 className="text-sm md:text-base font-medium text-neutral-300 mb-3">Past Results:</h3>
                        <div className="flex flex-wrap gap-2">
                          {pastResults.slice(-5).map((result, index) => (
                            <div
                              key={index}
                              className={`px-3 py-1.5 rounded-full text-xs md:text-sm ${
                                result === bestResult ? "bg-green-900 text-green-100" : "bg-neutral-800"
                              }`}
                            >
                              {result}ms
                            </div>
                          ))}
                        </div>
                        {bestResult && (
                          <div className="mt-3 text-sm md:text-base text-green-400 font-medium">
                            Best: {bestResult}ms
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ) : status === "countdown" ? (
                  <motion.div
                    key="countdown"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center rounded-xl p-12 md:p-16 bg-gradient-to-br from-yellow-600 to-amber-700 shadow-lg select-none"
                  >
                    <motion.div
                      className="text-5xl md:text-6xl font-bold"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                    >
                      {countdown}
                    </motion.div>
                    <div className="mt-4 text-lg md:text-xl">seconds</div>
                  </motion.div>
                ) : status === "too-early" ? (
                  <motion.div
                    key="too-early"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center rounded-xl p-12 md:p-16 bg-gradient-to-br from-red-800 to-red-900 shadow-lg select-none"
                  >
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl md:text-3xl font-bold mb-2"
                    >
                      Get Better...
                    </motion.div>
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl md:text-2xl"
                    >
                      too early!
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.6, type: "spring" }}
                      className="text-6xl md:text-7xl mt-6"
                    >
                      😅
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="click-area"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      ...clickAreaVariants[status === "waiting" ? "waiting" : "result"],
                    }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="flex flex-col items-center justify-center rounded-xl p-12 md:p-16 cursor-pointer shadow-lg select-none"
                    onClick={status === "waiting" ? handleClick : undefined}
                  >
                    {status === "waiting" && (
                      <motion.div
                        className="text-xl md:text-2xl font-medium"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8 }}
                      >
                        Click now!
                      </motion.div>
                    )}
                    {status === "result" && (
                      <motion.div className="flex flex-col items-center gap-3">
                        <motion.div
                          className="text-4xl md:text-5xl font-bold"
                          initial={{ scale: 0, rotate: -10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                          }}
                        >
                          {clickTime}ms
                        </motion.div>

                        {/* New feedback system */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="mt-3 flex items-center gap-3"
                        >
                          {getFeedback(clickTime).emoji && (
                            <span className="text-3xl md:text-4xl">{getFeedback(clickTime).emoji}</span>
                          )}
                          <span className="text-base md:text-lg font-medium">{getFeedback(clickTime).text}</span>
                        </motion.div>

                        {/* Show past results comparison */}
                        {pastResults.length > 1 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-5 text-sm md:text-base"
                          >
                            {clickTime === bestResult ? (
                              <span className="text-green-400 font-medium">New best time! 🏆</span>
                            ) : (
                              <span className="text-neutral-400">
                                Best: {bestResult}ms ({Math.abs(clickTime! - bestResult!)}ms{" "}
                                {clickTime! > bestResult! ? "slower" : "faster"})
                              </span>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
            <CardFooter className="flex justify-center pb-6 px-4 sm:px-6 md:px-8">
              {(status === "result" || status === "too-early") && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    onClick={resetTest}
                    className="w-full sm:w-auto px-8 py-6 h-auto text-base bg-neutral-800 hover:bg-neutral-700 text-white select-none"
                    asChild
                  >
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      Try Again
                    </motion.button>
                  </Button>
                </motion.div>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </ThemeProvider>
  )
}

