export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      {/* Animated candle bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 40 }}>
        {[
          { h: 16, delay: '0s' },
          { h: 28, delay: '0.15s' },
          { h: 40, delay: '0.3s' },
          { h: 22, delay: '0.45s' },
          { h: 34, delay: '0.6s' },
        ].map((bar, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: bar.h,
              background: 'var(--emerald)',
              borderRadius: 3,
              animation: `loadPulse 1.2s ease-in-out infinite`,
              animationDelay: bar.delay,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontWeight: 300, color: 'var(--text2)', fontSize: 16 }}>with</span>
        <span style={{ fontWeight: 700, color: 'var(--emerald)', fontSize: 16 }}>Sahib</span>
      </div>

      <style>{`
        @keyframes loadPulse {
          0%, 100% { transform: scaleY(0.5); opacity: 0.3; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
