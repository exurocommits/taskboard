import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    main_agent: 'GLM-4.7 (zai)',
    model: 'zai/glm-4.7',
    status: 'active',
    subagents: [],
    last_active: new Date().toISOString(),
    gateway: {
      pid: 18789,
      bind: 'loopback',
      mode: 'local',
    }
  })
}
