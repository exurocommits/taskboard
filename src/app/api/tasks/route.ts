import { NextResponse } from 'next/server'
import { getTasks } from '@/lib/tasks'

export async function GET() {
  try {
    const tasks = await getTasks()
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Failed to load tasks:', error)
    return NextResponse.json({ error: 'Failed to load tasks' }, { status: 500 })
  }
}
