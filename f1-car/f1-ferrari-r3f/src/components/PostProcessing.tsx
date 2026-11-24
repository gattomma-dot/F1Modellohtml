import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { useMemo } from 'react'
import * as THREE from 'three'
import { ToneMappingMode } from 'postprocessing'

export function PostProcessing() {
  const bloom = useMemo(() => ({
    intensity: 0.02,
    luminanceThreshold: 1.1,
    luminanceSmoothing: 0.2,
    kernelSize: 1,
  }), [])

  const tonemap = useMemo(() => ({
    mode: ToneMappingMode.ACES_FILMIC,
    exposure: 1.0,
  }), [])

  return (
    <EffectComposer multisampling={8}>
      <Bloom {...bloom} />
      <ToneMapping {...tonemap} />
    </EffectComposer>
  )
}
