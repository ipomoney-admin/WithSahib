'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { LogoMark } from '@/components/ui/Logo'
import { Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Minus, Trash2, Download, Save } from 'lucide-react'

const DRAFT_KEY = 'letterhead-draft'

export default function LetterheadPage() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [isPrinting, setIsPrinting] = useState(false)

  // Restore draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY)
    if (saved && editorRef.current) {
      editorRef.current.innerHTML = saved
    } else if (editorRef.current) {
      editorRef.current.innerHTML = '<p>Begin typing your letter here...</p>'
    }
  }, [])

  const exec = useCallback((cmd: string, value?: string) => {
    document.execCommand(cmd, false, value)
    editorRef.current?.focus()
  }, [])

  const saveDraft = useCallback(() => {
    if (!editorRef.current) return
    localStorage.setItem(DRAFT_KEY, editorRef.current.innerHTML)
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setLastSaved(now)
  }, [])

  const clearContent = useCallback(() => {
    if (!editorRef.current) return
    if (!window.confirm('Clear all content?')) return
    editorRef.current.innerHTML = '<p><br /></p>'
    editorRef.current.focus()
  }, [])

  const downloadPDF = useCallback(() => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 100)
  }, [])

  const ToolBtn = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      title={title}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '6px 8px', borderRadius: '6px', color: 'var(--text2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--border)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
    >
      {children}
    </button>
  )

  const Divider = () => (
    <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />
  )

  return (
    <>
      {/* Print styles — injected once */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          .letterhead-print-root { display: block !important; position: fixed; inset: 0; z-index: 99999; background: white; }
          .letterhead-print-root .no-print { display: none !important; }
          .letterhead-a4 {
            box-shadow: none !important;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            border-radius: 0 !important;
            page-break-after: always;
          }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      <div className="letterhead-print-root">
        {/* Page header — no-print */}
        <div className="no-print" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '24px', fontWeight: 400, color: 'var(--text)', marginBottom: '4px' }}>Letterhead Editor</h1>
            <p style={{ fontSize: '13px', color: 'var(--text3)' }}>Official correspondence on withSahib letterhead. Print or save as PDF.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {lastSaved && (
              <span style={{ fontSize: '11px', color: 'var(--text3)' }}>Saved at {lastSaved}</span>
            )}
            <button
              onClick={saveDraft}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'none',
                fontSize: '13px', fontWeight: 500, color: 'var(--text2)',
                cursor: 'pointer',
              }}
            >
              <Save size={14} />
              Save Draft
            </button>
            <button
              onClick={downloadPDF}
              disabled={isPrinting}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '8px',
                border: 'none', background: '#FF6B00',
                fontSize: '13px', fontWeight: 600, color: '#FFFFFF',
                cursor: isPrinting ? 'default' : 'pointer',
                opacity: isPrinting ? 0.7 : 1,
              }}
            >
              <Download size={14} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Toolbar — no-print */}
        <div
          className="no-print"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2px',
            marginBottom: '20px',
          }}
        >
          {/* Text format */}
          <ToolBtn onClick={() => exec('bold')} title="Bold (Ctrl+B)"><Bold size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('italic')} title="Italic (Ctrl+I)"><Italic size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('underline')} title="Underline (Ctrl+U)"><Underline size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('strikeThrough')} title="Strikethrough"><Strikethrough size={14} /></ToolBtn>
          <Divider />

          {/* Headings */}
          {(['H1', 'H2', 'H3'] as const).map((h) => (
            <ToolBtn key={h} onClick={() => exec('formatBlock', `<${h.toLowerCase()}>`)} title={h}>
              <span style={{ fontSize: '11px', fontWeight: 700 }}>{h}</span>
            </ToolBtn>
          ))}
          <ToolBtn onClick={() => exec('formatBlock', '<p>')} title="Normal text">
            <span style={{ fontSize: '11px', fontWeight: 500 }}>¶</span>
          </ToolBtn>
          <Divider />

          {/* Alignment */}
          <ToolBtn onClick={() => exec('justifyLeft')} title="Align left"><AlignLeft size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('justifyCenter')} title="Align center"><AlignCenter size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('justifyRight')} title="Align right"><AlignRight size={14} /></ToolBtn>
          <Divider />

          {/* Lists */}
          <ToolBtn onClick={() => exec('insertUnorderedList')} title="Bullet list"><List size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('insertOrderedList')} title="Numbered list"><ListOrdered size={14} /></ToolBtn>
          <Divider />

          {/* Misc */}
          <ToolBtn onClick={() => exec('insertHorizontalRule')} title="Horizontal rule"><Minus size={14} /></ToolBtn>
          <ToolBtn onClick={clearContent} title="Clear all content"><Trash2 size={14} /></ToolBtn>
        </div>

        {/* A4 preview */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '48px' }}>
          <div
            className="letterhead-a4"
            style={{
              width: '210mm',
              minHeight: '297mm',
              background: '#FFFFFF',
              boxShadow: '0 4px 40px rgba(0,0,0,0.15)',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Inter, system-ui, sans-serif',
              color: '#0A0A0A',
            }}
          >
            {/* Letterhead header */}
            <div style={{ padding: '28px 36px 20px', borderBottom: '2px solid #FF6B00' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <LogoMark size={28} animated={false} />
                  <span style={{ fontSize: '18px' }}>
                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 400, color: '#0A0A0A' }}>with</span>
                    <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', fontWeight: 700, color: '#FF6B00' }}>Sahib</span>
                  </span>
                </div>
                {/* SEBI details */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#B8975A', fontFamily: 'Courier New, monospace', letterSpacing: '1px', marginBottom: '2px' }}>SEBI RA · INH000026266</div>
                  <div style={{ fontSize: '9px', color: '#6E6E73' }}>Sahib Singh Hora · connect@withsahib.com</div>
                  <div style={{ fontSize: '9px', color: '#6E6E73' }}>withsahib.com · +91-9981248888</div>
                </div>
              </div>
            </div>

            {/* Editable body */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              style={{
                flex: 1,
                padding: '32px 36px',
                outline: 'none',
                fontSize: '13px',
                lineHeight: '1.8',
                color: '#0A0A0A',
                minHeight: '200mm',
              }}
            />

            {/* Letterhead footer */}
            <div
              style={{
                padding: '14px 36px',
                borderTop: '1px solid #E8E6E0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <p style={{ fontSize: '8px', color: '#6E6E73', lineHeight: 1.5, flex: 1 }}>
                Research by Sahib Singh Hora, SEBI RA INH000026266. Altitans Intelligence Private Limited · CIN: U62011MP2026PTC083080.
                Investments subject to market risk. Past performance not indicative of future results. Not investment advice.
              </p>
              <p style={{ fontSize: '8px', color: '#B8975A', whiteSpace: 'nowrap', fontFamily: 'Courier New, monospace' }}>withsahib.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
