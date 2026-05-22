import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#FFFBF7',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
        }} />

        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: '#F97316',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
              <polyline points="6,22 12,15 18,17 26,8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="26" cy="8" r="2.5" fill="white"/>
            </svg>
          </div>
          <span style={{ fontSize: '36px', fontWeight: 900, color: '#1C1917', letterSpacing: '-0.03em' }}>
            ScaleLab
          </span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: '52px',
          fontWeight: 900,
          color: '#1C1917',
          textAlign: 'center',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          maxWidth: '800px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          Intelligence publicitaire pour&nbsp;
          <span style={{ color: '#F97316' }}>infopreneurs</span>
        </div>

        {/* Subtitle */}
        <div style={{
          marginTop: '20px',
          fontSize: '22px',
          color: 'rgba(28,25,23,0.5)',
          textAlign: 'center',
          maxWidth: '700px',
          display: 'flex',
        }}>
          Ads Meta & TikTok · Tunnels de vente · VSL Generator IA
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '36px' }}>
          {['1.9M+ Ads', '20K+ Créateurs', '117K+ Tunnels'].map(label => (
            <div key={label} style={{
              padding: '8px 20px',
              borderRadius: '100px',
              background: 'rgba(249,115,22,0.1)',
              border: '1px solid rgba(249,115,22,0.2)',
              color: '#F97316',
              fontSize: '16px',
              fontWeight: 600,
              display: 'flex',
            }}>
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
