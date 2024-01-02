import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from "@/components/navbar";

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Toastboy FC",
  description: "Toastboy FC: five-a-side footy on Tuesdays at Kelsey Kerridge, Cambridge",
  icons: {
    icon: "favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="relative translate-y-24">
          {children}
        </div>
      </body>
    </html>
  )
}
