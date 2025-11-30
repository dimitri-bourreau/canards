import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Canards | Sanctuaire Animalier',
  description: 'Un jeu de gestion de sanctuaire animalier minimaliste où vous restaurez et entretenez un écosystème lacustre. Concentrez-vous sur le bien-être animal, la biodiversité et le contrôle de la pollution.',
  keywords: ['jeu', 'sanctuaire', 'animaux', 'écosystème', 'gestion', 'lac', 'canards'],
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
