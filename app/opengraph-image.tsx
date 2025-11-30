import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Canards - Sanctuaire Animalier'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #021e19 0%, #074c3e 50%, #0a6350 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
          position: 'relative',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(13, 122, 97, 0.2) 0%, transparent 70%)',
          }}
        />
        
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '40px',
            zIndex: 1,
          }}
        >
          {/* Duck icon */}
          <div
            style={{
              fontSize: '200px',
              lineHeight: 1,
            }}
          >
            🦆
          </div>
          
          {/* Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <h1
              style={{
                fontSize: '80px',
                fontWeight: 'bold',
                color: '#ffcc4d',
                margin: 0,
                textShadow: '0 4px 20px rgba(255, 204, 77, 0.3)',
              }}
            >
              Canards
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#fdf9f3',
                margin: 0,
                opacity: 0.9,
              }}
            >
              Sanctuaire Animalier
            </p>
            <p
              style={{
                fontSize: '24px',
                color: '#fdf9f3',
                margin: 0,
                opacity: 0.7,
              }}
            >
              Restaurer • Protéger • Chérir
            </p>
          </div>
        </div>
        
        {/* Footer text */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '20px',
            color: '#fdf9f3',
            opacity: 0.5,
          }}
        >
          Un jeu sur le soin, pas l'exploitation 💚
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

