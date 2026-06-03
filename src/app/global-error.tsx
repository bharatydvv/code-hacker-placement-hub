'use client';
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#050816', color: 'white', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 28 }}>Something went wrong</h1>
          <p style={{ color: '#94a3b8', marginTop: 8 }}>A critical error occurred.</p>
          <button onClick={reset} style={{ marginTop: 16, padding: '10px 20px', borderRadius: 12, border: '1px solid #334155', background: 'transparent', color: 'white', cursor: 'pointer' }}>Try again</button>
        </div>
      </body>
    </html>
  );
}
