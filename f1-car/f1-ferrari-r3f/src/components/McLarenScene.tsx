import React from 'react'
import * as THREE from 'three'
import { OrbitControls, Environment } from '@react-three/drei'
import CarModel from './CarModel'

// McLarenScene è un componente "presentational" che riceve il canvas padre
// Non ha il suo propio <Canvas> per evitare nesting di canvas
const McLarenScene = () => {
  return (
    <>
      <OrbitControls makeDefault />
      <CarModel />
    </>
  )
}

export default McLarenScene