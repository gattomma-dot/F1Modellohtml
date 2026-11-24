import React, { useState } from 'react'
import { useUIStore } from '../store/useUIStore'
import { F1_2026_SPECS } from '../lib/constants'

export function UI() {
  const [showSpecs, setShowSpecs] = useState(false)
  const { autoRotate, wireframe, quality } = useUIStore()

  // Stato per pannello laterale collassabile
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Stato per vista camera attiva
  const views = ['Hero', 'Front Wing', 'Cockpit/Halo', 'Rear Diffuser', 'Top Aero']
  const [activeView, setActiveView] = useState(views[0])

  return (
    <div
      style={{
        position: 'fixed',
        inset: '0',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {/* --- IN ALTO A SINISTRA: Header Minimale Scuderia --- */}
      <div
        style={{
          pointerEvents: 'auto',
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#FF1E00',
          fontFamily: 'Segoe UI, sans-serif',
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 'clamp(1rem, 3vw, 1.5rem)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          SCUDERIA
        </div>
        <div style={{ color: '#DC0000', fontWeight: 900, fontSize: 'clamp(1.2rem, 5vw, 2.5rem)' }}>
          SF-26
        </div>
        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          TELEMETRY LIVE
        </div>
      </div>

      {/* --- IN ALTO A DESTRA: PANNELLE COLLABILI --- */}
      <div
        style={{
          position: 'fixed',
          top: '12px',
          right: '12px',
          display: sidebarOpen ? 'block' : 'none',
          minWidth: '280px',
          maxWidth: '320px',
          background: 'rgba(14,14,14,0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(220,0,0,0.2)',
          borderRadius: '12px',
          padding: '12px',
          color: '#fff',
          fontFamily: 'SF Mono, Menlo, Consolas, monospace',
          zIndex: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>CONFIGURAZIONE</span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              fontSize: '0.7rem',
              color: '#DC0000',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Toggle Camera Views */}
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '6px' }}>Visualizza</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {views.map((view) => (
              <button
                key={view}
                style={{
                  fontFamily: 'SF Mono, Menlo, Consolas, monospace',
                  fontSize: '0.75rem',
                  padding: '6px 10px',
                  background:
                    activeView === view ? 'rgba(220,0,0,0.25)' : 'rgba(255,255,255,0.05)',
                  color: activeView === view ? '#DC0000' : '#ccc',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '100%',
                }}
                onClick={() => setActiveView(view)
                }
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Auto-Rotate */}
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '4px' }}>
            Auto-Rotate
          </span>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={autoRotate}
              onChange={(e) =>
                useUIStore.getState().setAutoRotate(e.target.checked)
              }
              style={{ width: '14px', height: '14px', accentColor: '#DC0000' }}
            />
            Attiva
          </label>
        </div>

        {/* Toggle Exploded View */}
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '4px' }}>
            Exploded View
          </span>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={wireframe}
              onChange={(e) => useUIStore.getState().setWireframe(e.target.checked)}
              style={{ width: '14px', height: '14px', accentColor: '#DC0000' }}
            />
            Attiva
          </label>
        </div>
      </div>

      {/* --- IN BASSO AL CENTRO: DOCK Galleggiante --- */}
      <div
        style={{
          position: 'fixed',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          padding: '6px 10px',
          background: 'rgba(10,10,10,0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          zIndex: 20,
        }}
      >
        <button
          style={{
            fontFamily: 'SF Mono, Menlo, Consolas, monospace',
            fontSize: '0.65rem',
            padding: '6px 10px',
            background:
              activeView === 'Hero' ? 'rgba(220,0,0,0.3)' : 'rgba(255,255,255,0.03)',
            color: activeView === 'Hero' ? '#DC0000' : '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
          onClick={() => setActiveView('Hero')
          }
        >
          Hero
        </button>

        <span
          style={{
            fontFamily: 'SF Mono, Menlo, Consolas, monospace',
            fontSize: '0.6rem',
            padding: '4px 8px',
            background: autoRotate ? 'rgba(220,0,0,0.2)' : 'rgba(255,255,255,0.03)',
            color: autoRotate ? '#DC0000' : '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span style={{ fontWeight: 600 }}>🔄</span>
          {autoRotate ? 'On' : 'Off'}
        </span>

        <div style={{ fontSize: '0.6rem', color: '#666', marginTop: '2px' }}>
          Cam:{activeView}
        </div>
      </div>
    </div>
  )
}