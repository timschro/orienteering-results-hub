import { NextRequest, NextResponse } from 'next/server'
import { getDomainConfig, getDomainInfo, resolveDomain } from '@/lib/data'

export async function GET(request: NextRequest) {
  // Development hosts and preview deployments resolve to the default domain,
  // matching what the middleware serves them.
  const domain = resolveDomain(request.headers.get('host'))

  if (!domain) {
    return NextResponse.json(
      { error: 'Domain not supported' },
      { status: 400 }
    )
  }

  return NextResponse.json({
    domain,
    config: getDomainConfig(domain),
    info: getDomainInfo(domain),
  })
}
