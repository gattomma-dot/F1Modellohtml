import { Html } from '@react-three/drei'
import { useState, useEffect } from 'react'
import { F1_2026_SPECS } from '../lib/constants'

export function UI() {
  const [showSpecs, setShowSpecs] = useState(false)
  const [wireframe, setWireframe] = useState(false)
  const [quality, setQuality] = useState<'ultra' | 'high' | 'medium' | 'low'>('high')
  const [autoRotate, setAutoRotate] = useState(true)
  const [fps, setFps] = useState(60)

  // FPS counter
  useEffect(() => {
    let frames = 0
    let lastTime = performance.now()
    const updateFps = (now: number) => {
      frames++
      if (now - lastTime >= 1000) {
        setFps(Math.round(frames * 1000 / (now - lastTime)))
        frames = 0
        lastTime = now
      }
      requestAnimationFrame(updateFps)
    }
    const id = requestAnimationFrame(updateFps)
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <>
      {/* === TITOLO PRINCIPALE IN 3D (Html di Drei) === */}
      <Html
        position={[0, 2.4, 0]}
        occlude
        transform
        style={{
          pointerEvents: 'none',
          textAlign: 'center',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div style={{
          color: '#FF1E00',
          fontWeight: 900,
          fontSize: 'clamp(1.3rem, 3.5vw, 2.8rem)',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          textShadow: '0 0 30px rgba(255,30,0,0.6), 0 2px 8px rgba(0,0,0,0.8)',
          fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
          lineHeight: 1.1,
        }}>
          SCUDERIA FERRARI
          <br />
          <span style={{
            fontSize: 'clamp(0.8rem, 2vw, 1.4rem)',
            fontWeight: 700,
            color: '#FDD200',
            letterSpacing: '0.25em',
            display: 'block',
            marginTop: '0.3em',
            textShadow: '0 0 20px rgba(253,210,0,0.5)',
          }}>
            F1 2026
          </span>
        </div>
      </Html>

      {/* === PANNELLO CONTROLLI FISSO (DOM) === */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        maxWidth: '480px',
        margin: '0 auto',
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid #333',
        borderRadius: '16px',
        padding: '16px 20px',
        color: '#fff',
        fontFamily: "'Segoe UI', sans-serif",
        fontSize: '13px',
        zIndex: 100,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        {/* Riga 1: Controlli principali */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#ccc' }}>
            <input
              type="checkbox"
              checked={autoRotate}
              onChange={(e) => setAutoRotate(e.target.checked)}
              style={{ accentColor: '#FF1E00', width: '16px', height: '16px' }}
            />
            Auto-rotazione
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#ccc' }}>
            <input
              type="checkbox"
              checked={wireframe}
              onChange={(e) => setWireframe(e.target.checked)}
              style={{ accentColor: '#FF1E00', width: '16px', height: '16px' }}
            />
            Wireframe
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#ccc' }}>
            <input
              type="checkbox"
              checked={showSpecs}
              onChange={(e) => setShowSpecs(e.target.checked)}
              style={{ accentColor: '#FF1E00', width: '16px', height: '16px' }}
            />
            Specifiche
          </label>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#888', fontSize: '12px' }}>
            <span>Qualità:</span>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value as any)}
              style={{
                background: '#1a1a1a',
                border: '1px solid #333',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'inherit',
                accentColor: '#FF1E00',
              }}
            >
              <option value="ultra">Ultra</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Riga 2: FPS + Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #222', color: '#888', fontSize: '12px' }}>
          <span style={{ color: fps >= 55 ? '#4ade80' : fps >= 30 ? '#fbbf24' : '#f87171' }}>
            ● {fps} FPS
          </span>
          <span>Regolamento 2026 • {F1_2026_SPECS.wheelbase}m passo • {F1_2026_SPECS.width}m larghezza • {F1_2026_SPECS.minWeight}kg</span>
        </div>

        {/* Specifiche tecniche espandibili */}
        {showSpecs && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #222', fontSize: '11px', lineHeight: 1.8, color: '#aaa' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
              <span>Passo:</span> <span style={{ color: '#FDD200' }}>{F1_2026_SPECS.wheelbase * 1000} mm</span>
              <span>Larghezza:</span> <span style={{ color: '#FDD200' }}>{F1_2026_SPECS.width * 1000} mm</span>
              <span>Altezza max:</span> <span style={{ color: '#FDD200' }}>{F1_2026_SPECS.maxHeight * 1000} mm</span>
              <span>Peso minimo:</span> <span style={{ color: '#FDD200' }}>{F1_2026_SPECS.minWeight} kg</span>
              <span>Ruote ant.:</span> <span style={{ color: '#FDD200' }}>{F1_2026_SPECS.frontWheelWidth * 1000} mm</span>
              <span>Ruote post.:</span> <span style={{ color: '#FDD200' }}>{F1_2026_SPECS.rearWheelWidth * 1000} mm</span>
              <span>Cerchi:</span> <span style={{ color: '#FDD200' }}>18"</span>
              <span>Ala ant. elementi:</span> <span style={{ color: '#FDD200' }}>{F1_2026_SPECS.frontWingElements}</span>
              <span>Ala post. elementi:</span> <span style={{ color: '#FDD200' }}>{F1_2026_SPECS.rearWingElements}</span>
              <span>PU Termico:</span> <span style={{ color: '#FDD200' }}>{F1_2026_SPECS.icePowerKW} kW</span>
              <span>PU Elettrico:</span> <span style={{ color: '#FDD200' }}>{F1_2026_SPECS.mguKPowerKW} kW</span>
              <span>Split energia:</span> <span style={{ color: '#FDD200' }}>{Math.round(F1_2026_SPECS.energySplit * 100)}% / {Math.round((1 - F1_2026_SPECS.energySplit) * 100)}%</span>
              <span>Aerodinamica:</span> <span style={{ color: '#FDD200' }}>Z-Mode / X-Mode</span>
              <span>DRS:</span> <span style={{ color: '#FDD200' }}>Sostituito da X-Mode</span>
              <span>Halo:</span> <span style={{ color: '#FDD200' }}>Titanio</span>
              <span>Materiali:</span> <span style={{ color: '#FDD200' }}>PBR Clearcoat/Anisotropy</span>
            </div>
          </div>
        )}
      </div>

      {/* === LEGENDA TASTI === */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '12px 16px',
        color: '#888',
        fontSize: '11px',
        fontFamily: "'Segoe UI', sans-serif",
        lineHeight: 1.7,
        zIndex: 100,
        whiteSpace: 'nowrap',
      }}>
        <div style={{ color: '#fff', fontWeight: 600, marginBottom: '6px', fontSize: '12px' }}>CONTROLLI</div>
        <div>🖱️ Trascina = Ruota</div>
        <div>🔍 Rotella = Zoom</div>
        <div>↔️ Click destro = Sposta</div>
        <div>R = Reset vista</div>
      </div>
    </>
  )
}