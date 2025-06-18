import { NextRequest, NextResponse } from 'next/server'
import { getDomainConfig } from '@/lib/data'
import { getDomainInfo, isSupportedDomain } from '@/lib/domains'

export async function GET(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const domain = hostname.split(':')[0]
  
  if (!isSupportedDomain(domain)) {
    return NextResponse.json(
      { error: 'Domain not supported' },
      { status: 400 }
    )
  }
  
  const domainConfig = getDomainConfig(domain)
  const domainInfo = getDomainInfo(domain)
  
  return NextResponse.json({
    domain,
    config: domainConfig,
    info: domainInfo,
  })
} 