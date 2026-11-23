import { EffectComposer, Bloom, DepthOfField, Vignette, ChromaticAberration, Noise, ToneMapping, ToneMappingMode } from '@react-three/postprocessing'
import { useMemo } from 'react'
import * as THREE from 'three'

export function PostProcessing() {
  const bloom = useMemo(() => ({
    intensity: 0.65,
    mipmapBlur: true,
    luminanceThreshold: 0.88,
    luminanceSmoothing: 0.025,
    kernelSize: 1,
  }), [])

  const dof = useMemo(() => ({
    focusDistance: 6.2,
    focalLength: 0.05,
    bokehScale: 2.5,
    height: 480,
    maxBrightness: 1.0,
  }), [])

  const vignette = useMemo(() => ({
    eskil: true,
    darkness: 1.25,
    offset: 0.4,
  }), [])

  const chromatic = useMemo(() => ({
    offset: [0.00025, 0.00018],
  }), [])

  const noise = useMemo(() => ({
    opacity: 0.015,
    premultiply: true,
  }), [])

  const tonemap = useMemo(() => ({
    mode: ToneMappingMode.ACESFilmic,
    exposure: 0.92,
  }), [])

  return (
    <EffectComposer multisampling={8} frameBufferType={THREE.HalfFloatType}>
      <Bloom {...bloom} />
      <DepthOfField {...dof} />
      <Vignette {...vignette} />
      <ChromaticAberration {...chromatic} />
      <Noise {...noise} />
      <ToneMapping {...tonemap} />
    </EffectComposer>
  )
}