import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import McLarenScene from './components/McLarenScene'
import { PostProcessing } from './components/PostProcessing'
import { UI } from './components/UI'
import { useUIStore } from './store/useUIStore'

// Camera rig - ora legge dallo store Zustand
function CameraRig() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!)

  // Leggi stato condiviso dallo store
  const { autoRotate } = useUIStore()

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
        autoRotate={autoRotate}
        autoRotateSpeed={0.25}
        zoomSpeed={1.2}
        panSpeed={0.8}
      />
    </>
  )
}

// Scene content - luci da studio e auto
function SceneContent() {
  return (
    <>
      {/* Environment HDRI per riflessioni realistiche (no background, no cubemap da disco) */}
      <Environment
        frames={1}
        resolution={512}
        background={false}
        environmentIntensity={1.2}
        ground={false}
      />

      {/* Pannelli luminosi da studio fotografico automotive (stile Blender) */}
      {/* Luce principale dall'alto-sinistra */}
      <Lightformer
        position={[-4, 6, 2]}
        target={[0, 0.75, 0]}
        scale={[4, 4, 1]}
        intensity={3}
      />
      {/* Luce di riempimento a destra */}
      <Lightformer
        position={[4, 4, -2]}
        target={[0, 0.75, 0]}
        scale={[3, 3, 1]}
        intensity={2}
      />
      {/* Luce posteriore (rim light) */}
      <Lightformer
        position={[0, 3, -5]}
        target={[0, 0.75, 0]}
        scale={[5, 3, 1]}
        intensity={2.5}
      />

      {/* LUCE PRINCIPALE direzionale con ombre */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={2.0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />
      {/* Luce di riempimento dall'alto per riflessi sul cofano */}
      <spotLight
        position={[0, 8, 0]}
        angle={0.4}
        penumbra={0.5}
        intensity={3.0}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      {/* Rim light posteriore */}
      <directionalLight
        position={[-5, 5, -8]}
        intensity={1.2}
      />

      {/* Luce ambientale soffusa */}
      <ambientLight intensity={0.35} />

      {/* Ombre morbide a terra */}
      <ContactShadows
        opacity={0.25}
        scale={20}
        blur={2}
        position={[0, 0.01, 0]}
        color="#232730"
      />

      {/* Pavimento base grigio antracite scuro per contrasto con carrozzeria */}
      <mesh
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color="#1e222b"
          roughness={0.85}
          metalness={0.0}
        />
      </mesh>

      {/* McLaren MP4/4 */}
      <McLarenScene />
    </>
  )
}

export default function App() {
  // Inizializza lo store Zustand (solo una volta)
  useUIStore.getState()

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          backgroundColor: '#232730',
        }}
        camera={{ position: [0, 2.6, 6.2], fov: 38 }}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <SceneContent />
          <PostProcessing />
        </Suspense>
      </Canvas>
      <UI />
    </div>
  )
}
