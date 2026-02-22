import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'export',
  env: {
    TASK_BOARD_PATH: process.env.TASK_BOARD_PATH || '/home/node/.openclaw/workspace/TASK-BOARD.md',
    ARCHITECTURE_PATH: process.env.ARCHITECTURE_PATH || '/home/node/.openclaw/workspace/ARCHITECTURE.md',
  },
}

export default config
