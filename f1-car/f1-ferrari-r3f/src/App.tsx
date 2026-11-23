import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Html, PerspectiveCamera, AccumulativeShadows } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { FerrariF1 } from './components/FerrariF1'
import { PostProcessing } from './components/PostProcessing'
import { UI } from './components/UI'

// Camera rig
function CameraRig() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!)

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 2.6, 6.2]}
        fov={38}
        near={0.1}
        far={200}
      />
      <OrbitControls
        camera={cameraRef.current}
        target={[0, 0.75, 0]}
        enableDamping
        dampingFactor={0.035}
        minDistance={2.0}
        maxDistance={20}
        minPolarAngle={0.12}
        maxPolarAngle={Math.PI / 2 - 0.03}
        autoRotate
        autoRotateSpeed={0.25}
        zoomSpeed={1.2}
        panSpeed={0.8}
      />
    </>
  )
}

// Scene content
function SceneContent() {
  return (
    <>
      {/* Environment HDRI */}
      <Environment
        preset="studio"
        background={false}
        environmentIntensity={1.25}
        ground={false}
      />

      {/* Ground with accumulative shadows */}
      <AccumulativeShadows
        temporal
        frames={100}
        scale={18}
        position={[0, -0.05, 0]}
        alphaTest={0.65}
        color="#000000"
        opacity={0.7}
      >
        <mesh receiveShadow position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[80, 80]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.1} />
        </mesh>
      </AccumulativeShadows>

      {/* Contact shadows */}
      <ContactShadows
        opacity={0.5}
        scale={20}
        blur={3}
        position={[0, 0.01, 0]}
        color="#000000"
      />

      {/* Grid helper */}
      <group position={[0, 0.02, 0]}>
        <lineSegments>
          <bufferGeometry attach="geometry">
            <float32BufferAttribute
              attach="attributes.position"
              count={482}
              array={(() => {
                const arr = []
                for (let i = -40; i <= 40; i += 2) {
                  arr.push(i, 0.02, -40, i, 0.02, 40, -40, 0.02, i, 40, 0.02, i)
                }
                return new Float32Array(arr)
              })()}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#1a1a1a" transparent opacity={0.3} />
        </lineSegments>
      </group>

      {/* Ferrari F1 2026 */}
      <FerrariF1 />
    </>
  )
}

export default function App() {
  return (
    <Canvas
      shadows
      gl={{
        preserveDrawingBuffer: true,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
        logarithmicDepthBuffer: true,
      }}
      style={{ width: '100%', height: '100%', display: 'block' }}
      camera={{ position: [0, 2.6, 6.2], fov: 38 }}
    >
      <Suspense fallback={null}>
        <CameraRig />
        <SceneContent />
        <PostProcessing />
        <UI />
      </Suspense>
    </Canvas>
  )
}