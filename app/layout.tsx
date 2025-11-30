import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Canards | Sanctuaire Animalier',
  description: 'Un jeu de gestion de sanctuaire animalier minimaliste où vous restaurez et entretenez un écosystème lacustre. Concentrez-vous sur le bien-être animal, la biodiversité et le contrôle de la pollution.',
  keywords: ['jeu', 'sanctuaire', 'animaux', 'écosystème', 'gestion', 'lac', 'canards'],
  authors: [{ name: 'Dimitri Bourreau' }],
  creator: 'Dimitri Bourreau',
  publisher: 'Dimitri Bourreau',
  metadataBase: new URL('https://github.com/dimitri-bourreau/canards'),
  openGraph: {
    title: 'Canards | Sanctuaire Animalier',
    description: 'Un jeu de gestion de sanctuaire animalier minimaliste où vous restaurez et entretenez un écosystème lacustre. Concentrez-vous sur le bien-être animal, la biodiversité et le contrôle de la pollution.',
    url: 'https://github.com/dimitri-bourreau/canards',
    siteName: 'Canards',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Canards - Sanctuaire Animalier',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Canards | Sanctuaire Animalier',
    description: 'Un jeu de gestion de sanctuaire animalier minimaliste où vous restaurez et entretenez un écosystème lacustre.',
    images: ['/opengraph-image'],
    creator: '@dimitri-bourreau',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased noise-overlay relative">
        {children}
      </body>
    </html>
  )
}
