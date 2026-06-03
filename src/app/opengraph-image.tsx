import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/constants';

export const runtime = 'edge';
export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: 80,
          background: 'linear-gradient(135deg, #050816 0%, #0a0f2c 45%, #0b1b2e 100%)',
          color: 'white', fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, color: '#22d3ee' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#3b82f6,#a855f7)' }} />
          {SITE.name}
        </div>
        <div style={{ marginTop: 36, fontSize: 64, fontWeight: 800, lineHeight: 1.1, maxWidth: 900,
          backgroundImage: 'linear-gradient(90deg,#3b82f6,#a855f7,#22d3ee)', backgroundClip: 'text', color: 'transparent' }}>
          {SITE.tagline}
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: '#94a3b8', maxWidth: 900 }}>
          Company-wise prep, PYQs, notes, interview questions & aptitude.
        </div>
      </div>
    ),
    { ...size }
  );
}
