'use client'

const DOCUMENTS = [
  { label: 'Balance Sheet Analysis', color: '#FF6B00' },
  { label: 'Annual Report Deep Dive', color: '#22C55E' },
  { label: 'Sector Comparison', color: '#64A0FF' },
]

const FLOWS = [
  { from: 'Annual Reports', delay: 0 },
  { from: 'Balance Sheets', delay: 0.5 },
  { from: 'Sector Data', delay: 1.0 },
]

const PROGRESS = [
  { label: 'Q1 2026 Earnings Analysis', pct: 80, delay: 0.2 },
  { label: 'Sector Rotation Study', pct: 60, delay: 0.6 },
  { label: 'HNI Portfolio Review', pct: 40, delay: 1.0 },
]

export default function ResearchReportsPage() {
  return (
    <div style={{ minHeight: '80vh', background: '#0A0A0A', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>

      <style>{`
        @keyframes fanIn0 {
          from { opacity: 0; transform: translateX(-20px) rotate(-8deg); }
          to   { opacity: 1; transform: translateX(-20px) rotate(-8deg); }
        }
        @keyframes fanIn1 {
          from { opacity: 0; transform: translateX(0) rotate(0deg); }
          to   { opacity: 1; transform: translateX(0) rotate(0deg); }
        }
        @keyframes fanIn2 {
          from { opacity: 0; transform: translateX(20px) rotate(8deg); }
          to   { opacity: 1; transform: translateX(20px) rotate(8deg); }
        }
        @keyframes typeIn {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes drawFlow {
          from { stroke-dashoffset: 200; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes nodePulse {
          0%, 100% { box-shadow: 0 0 0 rgba(255,107,0,0); }
          50%       { box-shadow: 0 0 12px rgba(255,107,0,0.6); }
        }
        @keyframes fillBar0 { from { width: 0%; } to { width: 80%; } }
        @keyframes fillBar1 { from { width: 0%; } to { width: 60%; } }
        @keyframes fillBar2 { from { width: 0%; } to { width: 40%; } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .research-doc {
          position: absolute;
          width: 140px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 14px 16px;
        }
        .doc-line {
          height: 6px;
          background: rgba(255,255,255,0.08);
          border-radius: 99px;
          margin-bottom: 6px;
        }
      `}</style>

      {/* Background glow */}
      <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(100,160,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Title */}
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: '#64A0FF', textTransform: 'uppercase', marginBottom: 16 }}>Deep Research · In Progress</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 400, color: '#F0F0F0', textAlign: 'center', marginBottom: 12 }}>
        Research Reports
      </h1>
      <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', textAlign: 'center', maxWidth: 460, lineHeight: 1.7, marginBottom: 56 }}>
        Deep research. In progress.
      </p>

      {/* TOP — Document stack */}
      <div style={{ position: 'relative', width: 260, height: 140, marginBottom: 64, flexShrink: 0 }}>
        {DOCUMENTS.map((doc, i) => (
          <div
            key={doc.label}
            className="research-doc"
            style={{
              top: i * 8,
              left: '50%',
              marginLeft: -70,
              zIndex: i,
              borderTop: `2px solid ${doc.color}`,
              opacity: 0,
              animation: `fanIn${i} 0.4s ease both`,
              animationDelay: `${i * 0.35}s`,
            }}
          >
            <div className="doc-line" style={{ width: '60%', background: doc.color, opacity: 0.6 }} />
            <div className="doc-line" />
            <div className="doc-line" style={{ width: '75%' }} />
            <p style={{
              fontSize: 10, color: doc.color, fontWeight: 700, letterSpacing: 0.5,
              overflow: 'hidden', whiteSpace: 'nowrap',
              animation: `typeIn 0.8s steps(20, end) both`,
              animationDelay: `${0.5 + i * 0.35}s`,
              width: 0,
            }}>
              {doc.label}
            </p>
          </div>
        ))}
      </div>

      {/* MIDDLE — Data flow */}
      <div style={{ width: '100%', maxWidth: 600, marginBottom: 56 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {FLOWS.map((flow, i) => (
            <div key={flow.from} style={{ display: 'flex', alignItems: 'center', gap: 16, animation: 'slideUp 0.5s ease both', animationDelay: `${1.2 + flow.delay}s`, opacity: 0 }}>
              {/* Source */}
              <div style={{ width: 120, padding: '8px 12px', background: 'rgba(100,160,255,0.06)', border: '1px solid rgba(100,160,255,0.2)', borderRadius: 8, fontSize: 11, color: '#64A0FF', fontWeight: 600, textAlign: 'center', flexShrink: 0 }}>
                {flow.from}
              </div>
              {/* Arrow line */}
              <svg width="80" height="20" style={{ flexShrink: 0, overflow: 'visible' }}>
                <line
                  x1="0" y1="10" x2="80" y2="10"
                  stroke="rgba(255,107,0,0.4)" strokeWidth="1.5"
                  strokeDasharray="200" strokeDashoffset="200"
                  style={{ animation: 'drawFlow 0.6s ease both', animationDelay: `${1.5 + flow.delay}s` }}
                />
                <polygon points="80,6 90,10 80,14" fill="rgba(255,107,0,0.6)" style={{ opacity: 0, animation: 'slideUp 0.2s ease both', animationDelay: `${2.0 + flow.delay}s` }} />
              </svg>
              {/* Node */}
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(255,107,0,0.1)', border: '1.5px solid rgba(255,107,0,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
                animation: 'nodePulse 2s ease-in-out infinite',
                animationDelay: `${2.0 + flow.delay}s`,
              }}>
                ⚙
              </div>
              {/* Arrow */}
              <svg width="40" height="20" style={{ flexShrink: 0 }}>
                <line
                  x1="0" y1="10" x2="40" y2="10"
                  stroke="rgba(255,107,0,0.4)" strokeWidth="1.5"
                  strokeDasharray="200" strokeDashoffset="200"
                  style={{ animation: 'drawFlow 0.4s ease both', animationDelay: `${2.2 + flow.delay}s` }}
                />
              </svg>
              {/* Output */}
              <div style={{ flex: 1, padding: '8px 12px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, fontSize: 11, color: '#22C55E', fontWeight: 600, textAlign: 'center' }}>
                Research Note
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM — Progress indicators */}
      <div style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
        {PROGRESS.map((item, i) => (
          <div key={item.label} style={{ animation: 'slideUp 0.5s ease both', animationDelay: `${2.5 + item.delay}s`, opacity: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{item.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#FF6B00' }}>{item.pct}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #FF6B00, #C45200)',
                  borderRadius: 999,
                  width: '0%',
                  animation: `fillBar${i} 1.2s ease both`,
                  animationDelay: `${2.7 + item.delay}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center', maxWidth: 560, lineHeight: 1.8, marginBottom: 32 }}>
        Comprehensive equity research reports — balance sheet analysis, management commentary,
        earnings quality assessment, and sector context. Published for Elite and HNI subscribers.
      </p>

      {/* CTA */}
      <a
        href="mailto:connect@withsahib.com?subject=Research Reports Access"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '13px 28px', borderRadius: 10,
          background: '#FF6B00', color: '#fff',
          fontWeight: 700, fontSize: 14, textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(255,107,0,0.35)',
          transition: 'all 0.2s',
        }}
      >
        Get notified →
      </a>
    </div>
  )
}
