// Supported domains configuration
export const SUPPORTED_DOMAINS = [
  'results.ol-dm.de',
  'results.hamburg-ol.de',
] as const

export type SupportedDomain = typeof SUPPORTED_DOMAINS[number]

// Domain-specific configurations
export const DOMAIN_CONFIGS = {
  'results.ol-dm.de': {
    name: 'DM Orientierungslauf',
    description: 'Live results for German Championship orienteering events',
    region: 'Germany',
    organization: 'DM-OL',
  },
  'results.hamburg-ol.de': {
    name: 'Hamburg Orientierungslauf',
    description: 'Live results for Hamburg orienteering events',
    region: 'Hamburg',
    organization: 'Hamburg-OL',
  },
} as const

// Helper function to check if a domain is supported
export function isSupportedDomain(domain: string): domain is SupportedDomain {
  return SUPPORTED_DOMAINS.includes(domain as SupportedDomain)
}

// Helper function to get domain config
export function getDomainInfo(domain: string) {
  return DOMAIN_CONFIGS[domain as SupportedDomain]
} 