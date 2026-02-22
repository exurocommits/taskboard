import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpenClaw Task Board',
  description: 'Real-time task tracking for OpenClaw AI agent',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
