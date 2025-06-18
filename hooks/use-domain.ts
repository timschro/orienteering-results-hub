"use client"

import { useEffect, useState } from 'react'
import { getDomainConfig, type Domain } from '@/lib/data'

export function useDomain() {
  const [domain, setDomain] = useState<string>('')
  const [domainConfig, setDomainConfig] = useState<ReturnType<typeof getDomainConfig> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get domain from headers (set by middleware)
    const getDomainFromHeaders = () => {
      // Try to get from headers first
      const domainHeader = document.querySelector('meta[name="x-domain"]')?.getAttribute('content')
      if (domainHeader) {
        return domainHeader
      }
      
      // Fallback to window.location.hostname
      return window.location.hostname
    }

    const currentDomain = getDomainFromHeaders()
    setDomain(currentDomain)
    
    const config = getDomainConfig(currentDomain)
    setDomainConfig(config)
    setIsLoading(false)
  }, [])

  return {
    domain,
    domainConfig,
    isLoading,
    isSupportedDomain: domainConfig !== null
  }
} 