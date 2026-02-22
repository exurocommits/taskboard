import { NextResponse } from 'next/server'
import { promises as fsPromises } from 'fs'

export async function GET() {
  try {
    const archPath = process.env.ARCHITECTURE_PATH || '/home/node/.openclaw/workspace/ARCHITECTURE.md';
    const content = await fsPromises.readFile(archPath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load architecture' }, { status: 500 });
  }
}
