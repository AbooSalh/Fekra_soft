import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KheirBox - Food Donation Platform',
  description: 'Connect donors, receivers, and volunteers to reduce food waste',
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
