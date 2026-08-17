"use client"

import { memo, useEffect, useState } from "react"

/**
 * The clock is the only genuinely per-request value on the page, so it renders
 * on the client only. That keeps the server HTML free of a timestamp that would
 * go stale the moment the response is cached by the CDN.
 */
export const CurrentTime = memo(function CurrentTime() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
    setCurrentTime(new Date())

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!currentTime) {
    // Reserve the line height before hydration, without asserting a time.
    return <span className="text-sm text-muted-foreground">&nbsp;</span>
  }

  return (
    <time dateTime={currentTime.toISOString()} className="text-sm text-muted-foreground">
      {currentTime.toLocaleDateString("de-DE")}{" "}
      {currentTime.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
    </time>
  )
})
