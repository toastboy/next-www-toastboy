import type { Metadata } from 'next'

// These styles apply to every route in the application
import '../globals.css'

export const metadata: Metadata = {
    title: "Toastboy FC",
    description: "Toastboy FC: five-a-side footy on Tuesdays at Kelsey Kerridge, Cambridge",
    icons: {
        icon: "/favicon.ico",
    },
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
