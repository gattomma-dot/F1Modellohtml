'use client'

import * as THREE from 'three'
import { Group, Mesh, BufferGeometry, Float32BufferAttribute, Box3, Vector3, Sphere } from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useMemo, useEffect } from 'react'
import {
  carrozzeria,
  carrozzeriaOpaca,
  carbonio,
  carbonioLucido,
  titanio,
  cerchioLega,
  cerchioLegaScuro,
  pneumatico,
  pneumaticoMorbido,
  copricerchio,
  abitacoloInterno,
  vetroVisiera,
  scaricoInconel,
  gialloModena,
  neroOpaco,
  neroLucido,
  fondoPiatto,
  lucePioggia,
  cloneWith,
} from '../lib/materials'

// ==========================================
// GEOMETRIE PARAMETRICHE F1 2026 (Fallback Procedurale)
// ==========================================

function createNoseGeometry() {
  const geo = new BufferGeometry()
  const positions: number[] = []
  const indices: number[] = []
  const normals: number[] = []
  const uvs: number[] = []

  const noseLength = 0.65
  const segmentsZ = 16
  const segmentsR = 12

  for (let zi = 0; zi <= segmentsZ; zi++) {
    const t = zi / segmentsZ
    const z = -1.85 + t * noseLength

    const radiusTop = 0.08 + t * 0.25
    const radiusBottom = 0.08 + t * 0.45
    const radiusSide = 0.08 + t * 0.38

    for (let ri = 0; ri <= segmentsR; ri++) {
      const theta = (ri / segmentsR) * Math.PI * 2
      const cosTheta = Math.cos(theta)
      const sinTheta = Math.sin(theta)

      const x = cosTheta * radiusSide
      let y = sinTheta >= 0 ? sinTheta * radiusTop : sinTheta * radiusBottom

      positions.push(x, y, z)
      uvs.push(ri / segmentsR, t)

      const nx = cosTheta
      const ny = sinTheta >= 0 ? radiusTop / radiusSide : radiusBottom / radiusSide
      const nz = 0
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz)
      normals.push(nx / len, ny / len, nz / len)
    }
  }

  for (let zi = 0; zi < segmentsZ; zi++) {
    for (let ri = 0; ri < segmentsR; ri++) {
      const a = zi * (segmentsR + 1) + ri
      const b = a + 1
      const c = (zi + 1) * (segmentsR + 1) + ri
      const d = c + 1
      indices.push(a, c, b)
      indices.push(b, c, d)
    }
  }

  geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geo.setAttribute('normal', new Float32BufferAttribute(normals, 3))
  geo.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeBoundingSphere()
  return geo
}

function createMonocoqueGeometry() {
  const geo = new BufferGeometry()
  const positions: number[] = []
  const indices: number[] = []
  const normals: number[] = []
  const uvs: number[] = []

  const length = 3.1
  const segmentsZ = 32
  const segmentsR = 16

  const sections = [
    { z: -1.55, w: 1.35, hTop: 0.45, hBottom: 0.10 },
    { z: -1.0,  w: 1.45, hTop: 0.48, hBottom: 0.10 },
    { z: -0.3,  w: 1.65, hTop: 0.52, hBottom: 0.10 },
    { z: 0.3,   w: 1.55, hTop: 0.55, hBottom: 0.10 },
    { z: 0.8,   w: 1.25, hTop: 0.60, hBottom: 0.08 },
    { z: 1.3,   w: 0.85, hTop: 0.58, hBottom: 0.04 },
    { z: 1.55,  w: 0.65, hTop: 0.50, hBottom: 0.05 },
  ]

  for (let zi = 0; zi <= segmentsZ; zi++) {
    const t = zi / segmentsZ
    const z = -1.55 + t * length

    let w = 1.35, hTop = 0.45, hBottom = 0.10
    for (let i = 0; i < sections.length - 1; i++) {
      const s1 = sections[i]
      const s2 = sections[i + 1]
      const localT = (z - s1.z) / (s2.z - s1.z)
      if (localT >= 0 && localT <= 1) {
        w = s1.w + localT * (s2.w - s1.w)
        hTop = s1.hTop + localT * (s2.hTop - s1.hTop)
        hBottom = s1.hBottom + localT * (s2.hBottom - s1.hBottom)
        break
      }
    }

    const halfW = w / 2
    const halfHTop = hTop / 2
    const halfHBottom = hBottom / 2

    for (let ri = 0; ri <= segmentsR; ri++) {
      const theta = (ri / segmentsR) * Math.PI * 2
      const cosTheta = Math.cos(theta)
      const sinTheta = Math.sin(theta)

      let x = cosTheta * halfW
      let y = sinTheta >= 0 ? sinTheta * halfHTop : -halfHBottom + sinTheta * (halfHBottom + halfHTop)

      positions.push(x, y, z)
      uvs.push(ri / segmentsR, t)

      const nx = cosTheta / halfW
      const ny = sinTheta >= 0 ? sinTheta / halfHTop : sinTheta / halfHBottom
      const nz = 0
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz)
      normals.push(nx / len, ny / len, nz / len)
    }
  }

  for (let zi = 0; zi < segmentsZ; zi++) {
    for (let ri = 0; ri < segmentsR; ri++) {
      const a = zi * (segmentsR + 1) + ri
      const b = a + 1
      const c = (zi + 1) * (segmentsR + 1) + ri
      const d = c + 1
      indices.push(a, c, b)
      indices.push(b, c, d)
    }
  }

  geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geo.setAttribute('normal', new Float32BufferAttribute(normals, 3))
  geo.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeBoundingSphere()
  return geo
}

function createSidepodGeometry(side: 'left' | 'right') {
  const geo = new BufferGeometry()
  const positions: number[] = []
  const indices: number[] = []
  const normals: number[] = []
  const uvs: number[] = []

  const sign = side === 'left' ? -1 : 1
  const length = 1.6
  const segmentsZ = 24
  const segmentsR = 12

  for (let zi = 0; zi <= segmentsZ; zi++) {
    const t = zi / segmentsZ
    const z = -1.2 + t * length

    const topWidth = 0.35 + t * 0.15
    const bottomWidth = 0.18 + t * 0.08
    const height = 0.55 + t * 0.15
    const inletHeight = 0.25 + t * 0.1

    for (let ri = 0; ri <= segmentsR; ri++) {
      const theta = (ri / segmentsR) * Math.PI * 2
      const cosTheta = Math.cos(theta)
      const sinTheta = Math.sin(theta)

      let x, y
      if (sinTheta >= 0) {
        x = sign * (topWidth * 0.5 + cosTheta * 0.08)
        y = inletHeight + sinTheta * 0.15
      } else {
        x = sign * (bottomWidth * 0.5 + cosTheta * 0.06)
        y = sinTheta * (height - inletHeight)
      }

      positions.push(x, y, z)
      uvs.push(ri / segmentsR, t)
      normals.push(cosTheta, sinTheta, 0)
    }
  }

  for (let zi = 0; zi < segmentsZ; zi++) {
    for (let ri = 0; ri < segmentsR; ri++) {
      const a = zi * (segmentsR + 1) + ri
      const b = a + 1
      const c = (zi + 1) * (segmentsR + 1) + ri
      const d = c + 1
      indices.push(a, c, b)
      indices.push(b, c, d)
    }
  }

  geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geo.setAttribute('normal', new Float32BufferAttribute(normals, 3))
  geo.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeBoundingSphere()
  return geo
}

function createWingGeometry(
  span: number,
  chord: number,
  thickness: number,
  camber: number,
  elements: number = 1,
  slotGap: number = 0.08
) {
  const geo = new BufferGeometry()
  const positions: number[] = []
  const indices: number[] = []
  const normals: number[] = []
  const uvs: number[] = []

  const segmentsX = 32

  for (let ei = 0; ei < elements; ei++) {
    const elementChord = chord * (1 - ei * 0.15)
    const elementThickness = thickness * (1 - ei * 0.2)
    const elementCamber = camber * (1 - ei * 0.3)
    const zOffset = ei * (slotGap + elementChord * 0.1)

    for (let zi = 0; zi <= 4; zi++) {
      const t = zi / 4
      const z = zOffset + t * elementChord

      for (let xi = 0; xi <= segmentsX; xi++) {
        const sx = xi / segmentsX
        const x = (sx - 0.5) * span

        const yTop = elementThickness * 0.5 * (1 - Math.pow(2 * t - 1, 2)) + elementCamber * Math.sin(Math.PI * t)
        const yBottom = -elementThickness * 0.5 * (1 - Math.pow(2 * t - 1, 2)) + elementCamber * Math.sin(Math.PI * t)

        positions.push(x, yTop, z)
        uvs.push(sx, t + ei * 0.25)
        normals.push(0, 1, 0)

        positions.push(x, yBottom, z)
        uvs.push(sx, t + ei * 0.25)
        normals.push(0, -1, 0)
      }
    }
  }

  const vertsPerElement = (segmentsX + 1) * 5 * 2
  for (let ei = 0; ei < elements; ei++) {
    const base = ei * vertsPerElement
    for (let zi = 0; zi < 4; zi++) {
      for (let xi = 0; xi < segmentsX; xi++) {
        const a = base + zi * (segmentsX + 1) * 2 + xi * 2
        const b = a + 2
        const c = a + 1
        const d = a + 3
        indices.push(a, c, b)
        indices.push(b, c, d)
      }
    }
  }

  geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geo.setAttribute('normal', new Float32BufferAttribute(normals, 3))
  geo.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeBoundingSphere()
  return geo
}

function createEndplateGeometry(height: number, depth: number, curveRadius: number) {
  const geo = new BufferGeometry()
  const positions: number[] = []
  const indices: number[] = []
  const normals: number[] = []
  const uvs: number[] = []

  const segmentsY = 16
  const segmentsZ = 12

  for (let yi = 0; yi <= segmentsY; yi++) {
    const t = yi / segmentsY
    const y = t * height
    const xOffset = Math.sin(t * Math.PI * 0.5) * curveRadius

    for (let zi = 0; zi <= segmentsZ; zi++) {
      const sz = zi / segmentsZ
      const z = sz * depth

      positions.push(xOffset, y, z)
      positions.push(xOffset + 0.08, y, z)
      uvs.push(sz, t)
      uvs.push(sz, t)
      normals.push(1, 0, 0)
      normals.push(1, 0, 0)
    }
  }

  for (let yi = 0; yi < segmentsY; yi++) {
    for (let zi = 0; zi < segmentsZ; zi++) {
      const a = yi * (segmentsZ + 1) * 2 + zi * 2
      const b = a + 2
      const c = a + 1
      const d = a + 3
      indices.push(a, c, b)
      indices.push(b, c, d)
    }
  }

  geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geo.setAttribute('normal', new Float32BufferAttribute(normals, 3))
  geo.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeBoundingSphere()
  return geo
}

function createDiffuserGeometry() {
  const geo = new BufferGeometry()
  const positions: number[] = []
  const indices: number[] = []
  const normals: number[] = []
  const uvs: number[] = []

  const width = 1.7
  const length = 1.1
  const segmentsX = 20
  const segmentsZ = 16

  for (let zi = 0; zi <= segmentsZ; zi++) {
    const t = zi / segmentsZ
    const z = 2.05 + t * length
    const w = width * (1 + t * 0.15)

    for (let xi = 0; xi <= segmentsX; xi++) {
      const sx = xi / segmentsX
      const x = (sx - 0.5) * w

      positions.push(x, -0.05, z)
      uvs.push(sx, t)
      normals.push(0, -1, 0)
    }
  }

  for (let zi = 0; zi < segmentsZ; zi++) {
    for (let xi = 0; xi < segmentsX; xi++) {
      const a = zi * (segmentsX + 1) + xi
      const b = a + 1
      const c = (zi + 1) * (segmentsX + 1) + xi
      const d = c + 1
      indices.push(a, c, b)
      indices.push(b, c, d)
    }
  }

  geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geo.setAttribute('normal', new Float32BufferAttribute(normals, 3))
  geo.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeBoundingSphere()
  return geo
}

// ==========================================
// COMPONENTE FERRARI F1 2026 - Con supporto GLB + Fallback Procedurale
// ==========================================

interface FerrariF1Props {
  wheelRotation: number
  drsActive: boolean
  time: number
}

// Preload GLB quando disponibile
useGLTF.preload('/models/f1-car.glb')

export function FerrariF1({ wheelRotation, drsActive, time }: FerrariF1Props) {
  const groupRef = useRef<Group | null>(null)
  const flapRefs = useRef<Map<string, Mesh>>(new Map())
  const wheelRefs = useRef<Map<string, Mesh>>(new Map())
  const gltfRef = useRef<any>(null)

  // Carica GLB se presente
  const { nodes, materials, scene } = useGLTF('/models/f1-car.glb', false)

  // Registra flap per animazione DRS/X-Mode
  useFrame((_, delta) => {
    if (flapRefs.current.size > 0) return

    groupRef.current?.traverse((child) => {
      if (child instanceof Mesh && child.name) {
        if (child.name.includes('rwUpper') || child.name.includes('drs')) {
          flapRefs.current.set(child.name, child)
        } else if (child.name.includes('rwLower')) {
          flapRefs.current.set(child.name, child)
        }
      }
    })
  }, 1)

  // Animazione flap X-Mode
  useFrame(() => {
    flapRefs.current.forEach((mesh, key) => {
      if (key.includes('upper') || key.includes('drs')) {
        const targetRotation = drsActive ? -0.18 : 0
        mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetRotation, 0.12)
      } else if (key.includes('lower')) {
        const targetRotation = drsActive ? 0.03 : 0
        mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetRotation, 0.12)
      }
    })

    // Leggero rollio corpo in curva
    if (groupRef.current) {
      const rollAngle = Math.sin(time * 0.5) * 0.015
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, rollAngle, 0.05)
    }
  })

  // Animazione ruote
  useFrame(() => {
    wheelRefs.current.forEach((tire) => {
      tire.rotation.z = wheelRotation
    })
  })

  // ==========================================
  // COSTRUZIONE MODELLO (GLB se caricato, altrimenti Procedurale)
  // ==========================================
  const group = useMemo(() => {
    const g = new Group()
    groupRef.current = g

    // Se il GLB è caricato con successo, usalo
    if (scene && nodes && Object.keys(nodes).length > 0) {
      const modelGroup = scene.clone(true)
      
      // Calcola bounding box per centrare e scalare
      const box = new Box3().setFromObject(modelGroup)
      const size = new Vector3()
      box.getSize(size)
      const center = new Vector3()
      box.getCenter(center)
      
      // Scala target: lunghezza ~5 unità (ruota anteriore a posteriore)
      const targetLength = 5.0
      const currentLength = size.z
      const scale = targetLength / currentLength
      
      modelGroup.scale.setScalar(scale)
      
      // Riposiziona per centrare e appoggiare ruote a y=0
      const newBox = new Box3().setFromObject(modelGroup)
      const newCenter = new Vector3()
      newBox.getCenter(newCenter)
      
      modelGroup.position.x -= newCenter.x
      modelGroup.position.y -= newBox.min.y  // Ruote a y=0
      modelGroup.position.z -= newCenter.z
      
      // Applica materiali Ferrari e ombre
      modelGroup.traverse((child) => {
        if (child instanceof Mesh) {
          child.castShadow = true
          child.receiveShadow = true
          
          // Rinomina materiali per mapping Ferrari
          const name = child.name.toLowerCase()
          if (name.includes('body') || name.includes('chassis') || name.includes('monocoque') || name.includes('nose') || name.includes('sidepod') || name.includes('engine') || name.includes('tail') || name.includes('cover')) {
            child.material = carrozzeria
          } else if (name.includes('wing') || name.includes('flap') || name.includes('endplate') || name.includes('diffuser') || name.includes('floor') || name.includes('skirt') || name.includes('barge') || name.includes('deflector')) {
            child.material = carbonioLucido
          } else if (name.includes('halo') || name.includes('pillar') || name.includes('tcam') || name.includes('camera')) {
            child.material = titanio
          } else if (name.includes('rim') || name.includes('wheel') || name.includes('hub') || name.includes('nut')) {
            child.material = cerchioLega
          } else if (name.includes('tire') || name.includes('tyre')) {
            child.material = pneumaticoMorbido
          } else if (name.includes('cover') || name.includes('cap')) {
            child.material = copricerchio
          } else if (name.includes('cockpit') || name.includes('visor') || name.includes('glass') || name.includes('window')) {
            child.material = vetroVisiera
          } else if (name.includes('exhaust') || name.includes('heat') || name.includes('shield')) {
            child.material = scaricoInconel
          } else if (name.includes('mirror') || name.includes('intake') || name.includes('airbox')) {
            child.material = carbonio
          } else {
            child.material = carrozzeriaOpaca
          }
          
          // Rinomina per animazioni
          if (name.includes('rear') && (name.includes('upper') || name.includes('flap'))) {
            child.name = 'rwUpper'
          } else if (name.includes('rear') && name.includes('lower')) {
            child.name = 'rwLower'
          } else if (name.includes('front') && name.includes('wheel')) {
            child.name = name.includes('left') ? 'wheelFL' : 'wheelFR'
          } else if (name.includes('rear') && name.includes('wheel')) {
            child.name = name.includes('left') ? 'wheelRL' : 'wheelRR'
          }
        }
      })
      
      // Registra flap e ruote dal GLB
      modelGroup.traverse((child) => {
        if (child instanceof Mesh && child.name) {
          if (child.name.includes('rwUpper') || child.name.includes('drs')) {
            flapRefs.current.set(child.name, child)
          } else if (child.name.includes('rwLower')) {
            flapRefs.current.set(child.name, child)
          }
          if (['wheelFL', 'wheelFR', 'wheelRL', 'wheelRR'].includes(child.name)) {
            wheelRefs.current.set(child.name, child)
          }
        }
      })
      
      g.add(modelGroup)
      return g
    }

    // ==========================================
    // FALLBACK: MODELLO PROCEDURALE COMPLETO
    // ==========================================

    // 1. MONOSCOCCA PRINCIPALE
    const monocoque = new Mesh(createMonocoqueGeometry(), carrozzeria)
    monocoque.castShadow = true
    monocoque.receiveShadow = true
    monocoque.position.y = 0.45
    monocoque.name = 'monocoque'
    g.add(monocoque)

    // 2. MUSO ANTERIORE
    const nose = new Mesh(createNoseGeometry(), carrozzeria)
    nose.castShadow = true
    nose.receiveShadow = true
    nose.position.y = 0.55
    nose.name = 'nose'
    g.add(nose)

    const nosePylon = new Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.6), carbonioLucido)
    nosePylon.position.set(0, 0.4, -1.5)
    nosePylon.castShadow = true
    nosePylon.name = 'nosePylon'
    g.add(nosePylon)

    // 3. COFANO MOTORE (Coca-Cola bottle)
    const engineCover = new Mesh(
      new THREE.CylinderGeometry(0.68, 0.38, 1.4, 16, 1, true, 0, Math.PI),
      carrozzeria
    )
    engineCover.rotation.z = Math.PI / 2
    engineCover.position.set(0, 0.85, 0.9)
    engineCover.castShadow = true
    engineCover.name = 'engineCover'
    g.add(engineCover)

    ;[-1, 1].forEach(sign => {
      const intake = new Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.5), carbonioLucido)
      intake.position.set(sign * 0.55, 0.95, 1.0)
      intake.castShadow = true
      intake.name = `engineIntake${sign > 0 ? 'R' : 'L'}`
      g.add(intake)
    })

    // 4. CODA POSTERIORE
    const tail = new Mesh(
      new THREE.CylinderGeometry(0.38, 0.18, 0.7, 12, 1, true, 0, Math.PI),
      carrozzeriaOpaca
    )
    tail.rotation.z = Math.PI / 2
    tail.position.set(0, 0.95, 2.0)
    tail.castShadow = true
    tail.name = 'tail'
    g.add(tail)

    // 5. SIDEPODS CON UNDERCUT
    const sidepodL = new Mesh(createSidepodGeometry('left'), carrozzeria)
    sidepodL.castShadow = true
    sidepodL.receiveShadow = true
    sidepodL.name = 'sidepodL'
    g.add(sidepodL)

    const sidepodR = new Mesh(createSidepodGeometry('right'), carrozzeria)
    sidepodR.castShadow = true
    sidepodR.receiveShadow = true
    sidepodR.name = 'sidepodR'
    g.add(sidepodR)

    ;[-1, 1].forEach(sign => {
      const inlet = new Mesh(new THREE.BoxGeometry(0.38, 0.28, 0.7), neroOpaco)
      inlet.position.set(sign * 1.18, 1.05, -0.55)
      inlet.castShadow = true
      inlet.name = `sidepodInlet${sign > 0 ? 'R' : 'L'}`
      g.add(inlet)

      const deflector = new Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.5), carbonioLucido)
      deflector.position.set(sign * 1.18, 1.25, -0.5)
      deflector.castShadow = true
      deflector.name = `sidepodDeflector${sign > 0 ? 'R' : 'L'}`
      g.add(deflector)
    })

    // 6. ABITACOLO E HALO
    const cockpit = new Mesh(
      new THREE.CylinderGeometry(0.52, 0.52, 0.55, 20, 1, true, 0, Math.PI),
      abitacoloInterno
    )
    cockpit.rotation.x = Math.PI / 2
    cockpit.position.set(0, 0.95, -0.15)
    cockpit.castShadow = true
    cockpit.name = 'cockpit'
    g.add(cockpit)

    const visor = new Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.18, 20, 1, true, 0, Math.PI),
      vetroVisiera
    )
    visor.rotation.x = Math.PI / 2
    visor.position.set(0, 1.05, -0.3)
    visor.castShadow = true
    visor.name = 'visor'
    g.add(visor)

    const numberPlate = new Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.02), cloneWith(carrozzeria, { color: new THREE.Color(0xFFFFFF) }))
    numberPlate.position.set(-0.85, 1.05, -0.15)
    numberPlate.name = 'numberPlate'
    g.add(numberPlate)

    // HALO TITANIO
    const haloGroup = new Group()
    haloGroup.name = 'halo'

    const haloArc = new Mesh(
      new THREE.TorusGeometry(0.58, 0.038, 16, 120, Math.PI),
      titanio
    )
    haloArc.rotation.x = Math.PI / 2
    haloArc.position.set(0, 1.55, 0.05)
    haloArc.castShadow = true
    haloArc.name = 'haloArc'
    haloGroup.add(haloArc)

    ;[-1, 1].forEach(sign => {
      const pillar = new Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.7, 12), titanio)
      pillar.position.set(sign * 0.58, 1.2, 0.15)
      pillar.castShadow = true
      pillar.name = `haloPillar${sign > 0 ? 'R' : 'L'}`
      haloGroup.add(pillar)

      const frontAttach = new Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.15), titanio)
      frontAttach.position.set(sign * 0.58, 0.9, -0.9)
      frontAttach.castShadow = true
      frontAttach.name = `haloFrontAttach${sign > 0 ? 'R' : 'L'}`
      haloGroup.add(frontAttach)
    })

    const centerPillar = new Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.55, 12), titanio)
    centerPillar.position.set(0, 1.25, 0.3)
    centerPillar.castShadow = true
    centerPillar.name = 'haloCenterPillar'
    haloGroup.add(centerPillar)

    g.add(haloGroup)

    // 7. ALA ANTERIORE - 3 ELEMENTI + ENDPLATE RICURVE
    const frontWingGroup = new Group()
    frontWingGroup.position.set(0, 0.32, -1.75)
    frontWingGroup.name = 'frontWing'

    const fwMain = new Mesh(createWingGeometry(1.8, 0.55, 0.045, 0.025, 1), carrozzeria)
    fwMain.name = 'fwMain'
    frontWingGroup.add(fwMain)

    const fwFlap = new Mesh(createWingGeometry(1.6, 0.42, 0.035, 0.018, 1), carbonioLucido)
    fwFlap.position.set(0, 0.055, -0.08)
    fwFlap.name = 'fwFlap'
    frontWingGroup.add(fwFlap)

    const fwFlapLower = new Mesh(createWingGeometry(1.5, 0.38, 0.03, 0.012, 1), carbonioLucido)
    fwFlapLower.position.set(0, -0.055, -0.05)
    fwFlapLower.name = 'fwFlapLower'
    frontWingGroup.add(fwFlapLower)

    const epL = new Mesh(createEndplateGeometry(0.45, 0.85, 0.15), carbonioLucido)
    epL.position.set(-1.0, 0.2, 0)
    epL.castShadow = true
    epL.name = 'fwEndplateL'
    frontWingGroup.add(epL)

    const epR = epL.clone()
    epR.position.x = -epR.position.x
    epR.scale.x = -1
    epR.name = 'fwEndplateR'
    frontWingGroup.add(epR)

    ;[-1, 1].forEach(sign => {
      const flap = new Mesh(new THREE.BoxGeometry(0.5, 0.035, 0.35), carbonioLucido)
      flap.position.set(sign * 0.75, 0.18, -0.15)
      flap.rotation.z = sign * 0.12
      flap.castShadow = true
      flap.name = `fwEndplateFlap${sign > 0 ? 'R' : 'L'}`
      frontWingGroup.add(flap)
    })

    g.add(frontWingGroup)

    // 8. ALA POSTERIORE - 3 ELEMENTI A CUCCHIAIO + X-MODE
    const rearWingGroup = new Group()
    rearWingGroup.position.set(0, 1.0, 1.85)
    rearWingGroup.name = 'rearWing'

    ;[-1, 1].forEach(sign => {
      const pylon = new Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.55, 12), carbonioLucido)
      pylon.position.set(sign * 0.65, 0.27, 0)
      pylon.castShadow = true
      pylon.name = `rwPylon${sign > 0 ? 'R' : 'L'}`
      rearWingGroup.add(pylon)

      const pylonFairing = new Mesh(new THREE.BoxGeometry(0.1, 0.35, 0.4), carbonioLucido)
      pylonFairing.position.set(sign * 0.65, 0.1, 0)
      pylonFairing.castShadow = true
      pylonFairing.name = `rwPylonFairing${sign > 0 ? 'R' : 'L'}`
      rearWingGroup.add(pylonFairing)
    })

    const rwMain = new Mesh(createWingGeometry(1.95, 0.75, 0.05, 0.035, 1), carrozzeria)
    rwMain.name = 'rwMain'
    rearWingGroup.add(rwMain)

    // FLAP SUPERIORE - X-Mode / DRS (ANIMATO)
    const rwUpper = new Mesh(createWingGeometry(1.85, 0.65, 0.04, 0.028, 1), carbonioLucido)
    rwUpper.position.set(0, 0.095, -0.05)
    rwUpper.name = 'rwUpper'
    rearWingGroup.add(rwUpper)

    const rwLower = new Mesh(createWingGeometry(1.75, 0.55, 0.035, 0.02, 1), carbonioLucido)
    rwLower.position.set(0, -0.095, -0.03)
    rwLower.name = 'rwLower'
    rearWingGroup.add(rwLower)

    const repL = new Mesh(createEndplateGeometry(0.5, 0.95, 0.12), carbonioLucido)
    repL.position.set(-1.07, 0.25, 0)
    repL.castShadow = true
    repL.name = 'rwEndplateL'
    rearWingGroup.add(repL)

    const repR = repL.clone()
    repR.position.x = -repR.position.x
    repR.scale.x = -1
    repR.name = 'rwEndplateR'
    rearWingGroup.add(repR)

    ;[-1, 1].forEach(sign => {
      const logo = new Mesh(new THREE.BoxGeometry(0.02, 0.18, 0.12), gialloModena)
      logo.position.set(sign * 1.08, 0.35, 0.1)
      logo.name = `rwLogo${sign > 0 ? 'R' : 'L'}`
      rearWingGroup.add(logo)
    })

    g.add(rearWingGroup)

    // 9. DIFFUSORE POSTERIORE RIALZATO
    const diffuser = new Mesh(createDiffuserGeometry(), carbonioLucido)
    diffuser.position.set(0, 0.2, 0)
    diffuser.castShadow = true
    diffuser.name = 'diffuser'
    g.add(diffuser)

    for (let i = 0; i < 4; i++) {
      const vg = new Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.35), carbonio)
      vg.position.set(-0.7 + i * 0.45, 0.35, 2.4)
      vg.rotation.y = 0.15
      vg.castShadow = true
      vg.name = `diffuserVG${i}`
      g.add(vg)
    }

    const rainLight = new Mesh(
      new THREE.BoxGeometry(0.14, 0.14, 0.03),
      lucePioggia(2.0)
    )
    rainLight.position.set(0, 0.55, 3.1)
    rainLight.name = 'rainLight'
    g.add(rainLight)

    // 10. RUOTE 18" CON CERCHI FORGIATI + COPPERCHI
    const wheelPositions = [
      { x: -0.81, z: -1.55, width: 0.28, front: true, name: 'wheelFL' },
      { x: 0.81, z: -1.55, width: 0.28, front: true, name: 'wheelFR' },
      { x: -0.79, z: 1.55, width: 0.375, front: false, name: 'wheelRL' },
      { x: 0.79, z: 1.55, width: 0.375, front: false, name: 'wheelRR' },
    ]

    wheelPositions.forEach(wp => {
      const wheelGroup = new Group()
      wheelGroup.position.set(wp.x, 0.36, wp.z)
      wheelGroup.name = wp.name

      const tire = new Mesh(
        new THREE.CylinderGeometry(0.36, 0.36, wp.width, 40),
        wp.front ? pneumaticoMorbido : pneumatico
      )
      tire.rotation.z = Math.PI / 2
      tire.castShadow = true
      tire.receiveShadow = true
      tire.name = 'tire'
      wheelGroup.add(tire)

      const rim = new Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, wp.width * 0.88, 24),
        cerchioLega
      )
      rim.rotation.z = Math.PI / 2
      rim.castShadow = true
      rim.name = 'rim'
      wheelGroup.add(rim)

      const rimChannel = new Mesh(new THREE.TorusGeometry(0.22, 0.012, 12, 24), cerchioLegaScuro)
      rimChannel.rotation.x = Math.PI / 2
      rimChannel.position.set(0, 0, wp.width * 0.44)
      rimChannel.name = 'rimChannelOuter'
      wheelGroup.add(rimChannel)
      const rimChannel2 = rimChannel.clone()
      rimChannel2.position.z = -wp.width * 0.44
      rimChannel2.name = 'rimChannelInner'
      wheelGroup.add(rimChannel2)

      const cover = new Mesh(
        new THREE.CylinderGeometry(0.34, 0.34, wp.width * 0.92, 32),
        copricerchio
      )
      cover.rotation.z = Math.PI / 2
      cover.position.z = wp.front ? 0.02 : -0.02
      cover.castShadow = true
      cover.name = 'wheelCover'
      wheelGroup.add(cover)

      if (wp.front) {
        const deflector = new Mesh(new THREE.BoxGeometry(wp.width * 1.15, 0.1, 0.45), carbonioLucido)
        deflector.position.set(wp.x, 0.72, wp.z + 0.25)
        deflector.castShadow = true
        deflector.name = `frontWheelDeflector${wp.name.slice(-2)}`
        g.add(deflector)
      }

      const hub = new Mesh(new THREE.CylinderGeometry(0.075, 0.075, wp.width * 0.55, 16), neroLucido)
      hub.rotation.z = Math.PI / 2
      hub.castShadow = true
      hub.name = 'hub'
      wheelGroup.add(hub)

      const nut = new Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.025, 12), cerchioLegaScuro)
      nut.rotation.z = Math.PI / 2
      nut.position.z = wp.width * 0.28
      nut.name = 'hubNut'
      wheelGroup.add(nut)

      const sensor = new Mesh(new THREE.BoxGeometry(0.025, 0.025, 0.015), gialloModena)
      sensor.position.set(0.33, 0, wp.width * 0.48)
      sensor.name = 'tireSensor'
      wheelGroup.add(sensor)

      // Registra ruota per animazione rotazione
      wheelRefs.current.set(wp.name, tire)

      g.add(wheelGroup)
    })

    // 11. FONDO PIATTO CON BORDO SEGHETTATO
    const floor = new Mesh(new THREE.PlaneGeometry(1.55, 2.9), fondoPiatto)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, 0.08, 0)
    floor.receiveShadow = true
    floor.name = 'floor'
    g.add(floor)

    for (let side = -1; side <= 1; side += 2) {
      const skirtGeo = new BufferGeometry()
      const skirtPositions: number[] = []
      const skirtIndices: number[] = []

      for (let i = 0; i <= 60; i++) {
        const t = i / 60
        const z = -1.45 + t * 2.9
        const x = side * (0.775 + Math.sin(t * Math.PI * 12) * 0.025)

        skirtPositions.push(x, 0.08, z)
        skirtPositions.push(x + side * 0.03, 0.08, z)
      }

      for (let i = 0; i < 60; i++) {
        const a = i * 2
        const b = a + 1
        const c = a + 2
        const d = a + 3
        skirtIndices.push(a, c, b)
        skirtIndices.push(b, c, d)
      }

      skirtGeo.setAttribute('position', new Float32BufferAttribute(skirtPositions, 3))
      skirtGeo.setIndex(skirtIndices)
      skirtGeo.computeVertexNormals()

      const skirt = new Mesh(
        skirtGeo,
        cloneWith(gialloModena, { transparent: true, opacity: 0.8, side: THREE.DoubleSide })
      )
      skirt.name = `skirt${side > 0 ? 'R' : 'L'}`
      g.add(skirt)
    }

    // 12. SCARICHI E DETTAGLI TERMICI
    ;[-1, 1].forEach(sign => {
      const exhaust = new Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.4, 12), scaricoInconel)
      exhaust.position.set(sign * 0.38, 0.45, 2.1)
      exhaust.rotation.x = -0.15
      exhaust.castShadow = true
      exhaust.name = `exhaust${sign > 0 ? 'R' : 'L'}`
      g.add(exhaust)

      const shield = new Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.5), carbonio)
      shield.position.set(sign * 0.38, 0.6, 2.1)
      shield.castShadow = true
      shield.name = `heatShield${sign > 0 ? 'R' : 'L'}`
      g.add(shield)
    })

    // 13. SPECCHIETTI RETROVISORI
    ;[-1, 1].forEach(sign => {
      const mirror = new Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.12), carbonioLucido)
      mirror.position.set(sign * 1.05, 1.1, -0.6)
      mirror.castShadow = true
      mirror.name = `mirror${sign > 0 ? 'R' : 'L'}`
      g.add(mirror)

      const mirrorArm = new Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.15, 8), titanio)
      mirrorArm.position.set(sign * 1.0, 1.1, -0.55)
      mirrorArm.rotation.y = sign * 0.2
      mirrorArm.castShadow = true
      mirrorArm.name = `mirrorArm${sign > 0 ? 'R' : 'L'}`
      g.add(mirrorArm)
    })

    // 14. AIRBOX / PRESA ARIA MOTORE
    const airbox = new Mesh(new THREE.BoxGeometry(0.45, 0.25, 0.35), neroOpaco)
    airbox.position.set(0, 1.35, 0.35)
    airbox.castShadow = true
    airbox.name = 'airbox'
    g.add(airbox)

    const airboxLogo = new Mesh(new THREE.BoxGeometry(0.25, 0.02, 0.15), gialloModena)
    airboxLogo.position.set(0, 1.48, 0.45)
    airboxLogo.name = 'airboxLogo'
    g.add(airboxLogo)

    // 15. T-CAM (Telecamera TV)
    const tcam = new Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.25, 12), neroOpaco)
    tcam.position.set(0, 1.55, -0.05)
    tcam.castShadow = true
    tcam.name = 'tcam'
    g.add(tcam)

    const tcamFront = new Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.04), vetroVisiera)
    tcamFront.position.set(0, 1.65, -0.05)
    tcamFront.name = 'tcamFront'
    g.add(tcamFront)

    return g
  }, [scene, nodes])

  return <primitive object={group} dispose={null} />
}