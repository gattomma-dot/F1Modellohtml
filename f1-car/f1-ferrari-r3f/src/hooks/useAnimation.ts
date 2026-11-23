import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useState, useEffect } from 'react'

// Hook per animazioni sincronizzate
export function useAnimation() {
  const clock = useThree((state) => state.clock)
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)

  // Stato animazioni
  const wheelRotation = useRef(0)
  const [drsActive, setDrsActive] = useState(false)
  const [time, setTime] = useState(0)

  // Referenze per mesh animate (popolate via useFrame)
  const wheelRefs = useRef<Map<string, THREE.Mesh>>(new Map())
  const flapRefs = useRef<Map<string, THREE.Mesh>>(new Map())

  // Velocità simulata (km/h) per animazioni proporzionali
  const speedKmh = useMemo(() => {
    // Oscilla tra 80 e 340 km/h per simulare pista
    return 180 + 160 * Math.sin(clock.getElapsedTime() * 0.15)
  }, [clock])

  // DRS/X-Mode attivo su rettilinei (velocità > 280 km/h)
  useFrame(() => {
    const t = clock.getElapsedTime()
    setTime(t)

    // Toggle DRS ogni ~8 secondi (simula rettilineo/curva)
    const drsCycle = Math.floor(t / 8) % 2 === 0
    if (drsActive !== drsCycle) {
      setDrsActive(drsCycle)
    }

    // Rotazione ruote proporzionale a velocità
    const wheelAngularVel = (speedKmh / 3.6) / 0.36 // rad/s (v = ω * r)
    wheelRotation.current += wheelAngularVel * clock.getDelta()

    // Applica rotazione a tutte le ruote
    wheelRefs.current.forEach((mesh) => {
      mesh.rotation.z = wheelRotation.current
    })

    // Animazione flap ala posteriore (X-Mode / DRS)
    flapRefs.current.forEach((mesh, key) => {
      if (key.includes('upper') || key.includes('drs')) {
        // Flap superiore si apre in X-Mode
        const targetRotation = drsActive ? -0.18 : 0 // -10° circa
        mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetRotation, 0.15)
      } else if (key.includes('lower')) {
        // Flap inferiore leggero movimento opposto
        const targetRotation = drsActive ? 0.03 : 0
        mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetRotation, 0.15)
      }
    })

    // Leggero movimento sospensioni (compressione/estensione)
    const suspensionOffset = Math.sin(t * 8) * 0.008 * (speedKmh / 300)
    // Nota: le sospensioni reali richiedono refs alle mesh dei sidepods/corpo

    // Leggero rollio in curva (simulato)
    const rollAngle = Math.sin(t * 0.5) * 0.02
    // Nota: rollio reale richiede ref al gruppo auto
  })

  // Funzioni per registrare mesh animate
  const registerWheel = (name: string, mesh: THREE.Mesh) => {
    wheelRefs.current.set(name, mesh)
  }

  const registerFlap = (name: string, mesh: THREE.Mesh) => {
    flapRefs.current.set(name, mesh)
  }

  // Cleanup
  useEffect(() => {
    return () => {
      wheelRefs.current.clear()
      flapRefs.current.clear()
    }
  }, [])

  return {
    wheelRotation: wheelRotation.current,
    drsActive,
    time,
    speedKmh,
    registerWheel,
    registerFlap,
  }
}

// Hook per performance monitoring
export function usePerformance() {
  const [fps, setFps] = useState(60)
  const [quality, setQuality] = useState<'ultra' | 'high' | 'medium' | 'low'>('high')

  useEffect(() => {
    let frames = 0
    let lastTime = performance.now()
    let animationId: number

    const updateFps = (now: number) => {
      frames++
      if (now - lastTime >= 1000) {
        const currentFps = Math.round(frames * 1000 / (now - lastTime))
        setFps(currentFps)

        // Auto-quality scaling
        if (currentFps < 30 && quality !== 'low') {
          setQuality(q => q === 'ultra' ? 'high' : q === 'high' ? 'medium' : 'low')
        } else if (currentFps > 55 && quality === 'low') {
          setQuality('medium')
        } else if (currentFps > 58 && quality === 'medium') {
          setQuality('high')
        }

        frames = 0
        lastTime = now
      }
      animationId = requestAnimationFrame(updateFps)
    }

    animationId = requestAnimationFrame(updateFps)
    return () => cancelAnimationFrame(animationId)
  }, [quality])

  return { fps, quality, setQuality }
}

// Hook per qualità adattiva
export function useQualitySettings(quality: 'ultra' | 'high' | 'medium' | 'low') {
  return useMemo(() => {
    switch (quality) {
      case 'ultra':
        return {
          shadowMapSize: 4096,
          bloomIntensity: 0.7,
          dofEnabled: true,
          ssaoEnabled: true,
          pixelRatio: Math.min(window.devicePixelRatio, 2),
          antialias: true,
          samples: 8,
        }
      case 'high':
        return {
          shadowMapSize: 2048,
          bloomIntensity: 0.65,
          dofEnabled: true,
          ssaoEnabled: false,
          pixelRatio: Math.min(window.devicePixelRatio, 1.5),
          antialias: true,
          samples: 4,
        }
      case 'medium':
        return {
          shadowMapSize: 1024,
          bloomIntensity: 0.5,
          dofEnabled: false,
          ssaoEnabled: false,
          pixelRatio: Math.min(window.devicePixelRatio, 1.25),
          antialias: true,
          samples: 2,
        }
      case 'low':
        return {
          shadowMapSize: 512,
          bloomIntensity: 0.3,
          dofEnabled: false,
          ssaoEnabled: false,
          pixelRatio: 1,
          antialias: false,
          samples: 1,
        }
    }
  }, [quality])
}

// Import THREE per i tipi
import * as THREE from 'three'