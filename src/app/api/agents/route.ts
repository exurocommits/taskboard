import { NextResponse } from 'next/server'

export async function GET() {
  // Get running agents from OpenClaw
  // For now, return current status
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
