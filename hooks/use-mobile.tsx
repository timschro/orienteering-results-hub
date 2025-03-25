"use client"

import { useCallback, useEffect, useState } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  // Memoize the checkIfMobile function to avoid recreating it on every render
  const checkIfMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return

    // Initial check
    checkIfMobile()

    // Use a debounced resize handler for better performance
    let resizeTimer: NodeJS.Timeout
    
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(checkIfMobile, 100)
    }

    // Add event listener with passive option for better performance
    window.addEventListener("resize", handleResize, { passive: true })

    // Clean up
    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener("resize", handleResize)
    }
  }, [checkIfMobile])

  return isMobile
}

