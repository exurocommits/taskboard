import type { NextConfig } from 'next'

const config: NextConfig = {
  env: {
    TASK_BOARD_PATH: process.env.TASK_BOARD_PATH || '/home/node/.openclaw/workspace/TASK-BOARD.md',
    ARCHITECTURE_PATH: process.env.ARCHITECTURE_PATH || '/home/node/.openclaw/workspace/ARCHITECTURE.md',
    TASKBOARD_PASSWORD: process.env.TASKBOARD_PASSWORD || 'claw2026',
  },
}

export default config
