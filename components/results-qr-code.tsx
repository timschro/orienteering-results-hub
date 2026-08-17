"use client"

import { memo } from "react"
import dynamic from "next/dynamic"

import { useMobile } from "@/hooks/use-mobile"

// Dynamically import QRCode with no SSR
const QRCode = dynamic(() => import("react-qr-code"), { ssr: false })

// Fully client-side QR code component
export const ResultsQRCode = memo(function ResultsQRCode({ value }: { value: string }) {
  const isMobile = useMobile()

  if (isMobile) return null

  return (
    <div className="w-full md:w-auto">
      <QRCode
        value={value}
        size={120}
        className="mx-auto md:mx-0"
        aria-label={`QR code für ${value}`}
      />
      <p className="text-xs text-center md:text-left mt-2 text-muted-foreground">
       Live Results
      </p>
    </div>
  )
})
