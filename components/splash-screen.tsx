"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface SplashScreenProps {
  isVisible: boolean
  onComplete?: () => void
}

export function SplashScreen({ isVisible, onComplete }: SplashScreenProps) {
  return (
    <AnimatePresence mode="wait" onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
          {/* Background gradient orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-stone-400 to-stone-600 blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-stone-500 to-stone-700 blur-3xl"
            />
          </div>

          {/* Content */}
          <div className="relative flex flex-col items-center gap-8">
            {/* Logo container with animations */}
            <div className="relative">
              {/* Rotating ring */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, rotate: 360 }}
                transition={{
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 },
                  rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                }}
                className="absolute -inset-8 rounded-full border-2 border-dashed border-stone-400/50"
              />

              {/* Pulsing glow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -inset-4 rounded-full bg-gradient-to-r from-stone-400/20 to-stone-500/20 blur-xl"
              />

              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.6, -0.05, 0.01, 0.99],
                }}
              >
                <Image
                  src="/nova-logo-borae.png"
                  alt="BORAÊ"
                  width={200}
                  height={200}
                  className="relative z-10 h-32 w-auto md:h-40 lg:h-48 drop-shadow-lg"
                  priority
                />
              </motion.div>
            </div>

            {/* Slogan - Mudando de amber para stone (cor da logo) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              className="text-lg md:text-xl text-stone-700 font-light tracking-wider"
            >
              onde a cultura encontra você
            </motion.p>

            {/* Loading bar - Mudando de amber para stone (cor da logo) */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "200px" }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="h-1 bg-stone-200 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="h-full w-1/2 bg-gradient-to-r from-stone-500 via-stone-600 to-stone-500 rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Global splash screen for navigation
export default function GlobalSplashScreen() {
  return null
}
