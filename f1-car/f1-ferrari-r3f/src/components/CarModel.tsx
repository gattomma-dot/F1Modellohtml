import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CarModel = () => {
  // 1️⃣ Load glTF with correct Draco config
  // @ts-ignore - tipo draco compatibile
  const { scene, materials } = useGLTF('/models/f1-car.glb', {
    // @ts-ignore - tipo draco
    draco: {
      decoderPath: '/draco/',
    },
  })

  // 2️⃣ Safe materials iteration
  useEffect(() => {
    if (materials) {
      const materialList = Array.isArray(materials)
        ? materials
        : Object.values(materials)
    }
  }, [materials])

  // 🆕 1️⃣ Ref per wheelGroups (pivot delle 2 ruote anteriori)
  const wheelGroups = useRef<THREE.Group[]>([])
  // 🆕 Ref per evitare doppia esecuzione in StrictMode
  const initializedRef = useRef(false)
  // 🆕 Ref per salvare l'asse di rotazione mondiale
  const wheelAxisRef = useRef<THREE.Vector3 | null>(null)

  // 🆕 2️⃣ Inizializzazione pivot ruote anteriori + materiali PBR + Texture
  useEffect(() => {
    // 🆕 Esegui una sola volta per istanza
    if (initializedRef.current) return
    initializedRef.current = true

    // 🆕 Svuota la ref
    wheelGroups.current = []

    if (!scene) return

    // 🆕 Aggiorna matrici mondo per coordinate esatte
    scene.updateMatrixWorld(true)

    // 🆕 ============================================================
    // CANVAS TEXTURE PROCEDURALI AD ALTA RISOLUZIONE (2048x2048)
    // ============================================================

    // Helper: crea CanvasTexture con settaggi corretti per glTF
    const createCanvasTexture = (drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) => {
      const size = 2048
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')!
      drawFn(ctx, size, size)
      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.flipY = false
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.anisotropy = 16
      texture.needsUpdate = true
      return texture
    }

    // --- 1️⃣ LIVREA McLAREN MP4/4 (body + bdcal) ---
    const liveryTexture = createCanvasTexture((ctx, w, h) => {
      // Sfondo bianco perla
      ctx.fillStyle = '#f8f8f8'
      ctx.fillRect(0, 0, w, h)

      // Chevron Marlboro rosso fluorescente
      const red = '#ff1e00'
      ctx.fillStyle = red

      // Chevron sul muso (triangoli che puntano avanti)
      const centerX = w / 2
      const chevronHeight = h * 0.15
      ctx.beginPath()
      ctx.moveTo(centerX, h * 0.1)
      ctx.lineTo(centerX - w * 0.25, h * 0.35)
      ctx.lineTo(centerX + w * 0.25, h * 0.35)
      ctx.closePath()
      ctx.fill()

      // Fasce laterali Marlboro (sui fianchi)
      ctx.fillStyle = '#ff1e00'
      // Fascia superiore fianchi
      ctx.fillRect(w * 0.05, h * 0.45, w * 0.9, h * 0.08)
      // Fascia inferiore fianchi
      ctx.fillRect(w * 0.05, h * 0.55, w * 0.9, h * 0.08)

      // Ala posteriore - banda rossa
      ctx.fillRect(w * 0.15, h * 0.82, w * 0.7, h * 0.1)

      // Linee pannellatura sottili bianche
      ctx.strokeStyle = '#e0e0e0'
      ctx.lineWidth = 1
      // Linee orizzontali pannelli
      for (let y = h * 0.3; y < h * 0.8; y += h * 0.05) {
        ctx.beginPath()
        ctx.moveTo(w * 0.1, y)
        ctx.lineTo(w * 0.9, y)
        ctx.stroke()
      }
      // Linee verticali pannelli
      for (let x = w * 0.2; x < w * 0.8; x += w * 0.08) {
        ctx.beginPath()
        ctx.moveTo(x, h * 0.3)
        ctx.lineTo(x, h * 0.8)
        ctx.stroke()
      }

      // Scritta "Marlboro" stilizzata (semplificata)
      ctx.font = 'bold 48px Arial'
      ctx.fillStyle = '#ff1e00'
      ctx.textAlign = 'center'
      ctx.fillText('MARLBORO', centerX, h * 0.5)

      // Logo McLaren arancione sul muso
      ctx.font = 'bold 36px Arial'
      ctx.fillStyle = '#ff8800'
      ctx.fillText('McLAREN', centerX, h * 0.22)
    })

    // --- 2️⃣ FIBRA DI CARBONIO (twill weave diagonale) ---
    const carbonTexture = createCanvasTexture((ctx, w, h) => {
      // Base scura carbonio
      ctx.fillStyle = '#1b1d21'
      ctx.fillRect(0, 0, w, h)

      // Trama twill diagonale (45 gradi) - ripetuta 40x40
      const cellSize = w / 40
      ctx.strokeStyle = '#2c3038'
      ctx.lineWidth = 1

      // Disegna diagonali alternate (twill 2/2)
      for (let y = -h; y < h * 2; y += cellSize * 2) {
        for (let x = -w; x < w * 2; x += cellSize * 2) {
          ctx.beginPath()
          // Diagonale principale
          ctx.moveTo(x, y)
          ctx.lineTo(x + cellSize * 2, y + cellSize * 2)
          ctx.stroke()
          // Diagonale secondaria offset
          ctx.beginPath()
          ctx.moveTo(x + cellSize, y)
          ctx.lineTo(x + cellSize * 3, y + cellSize * 2)
          ctx.stroke()
        }
      }

      // Punti di luce speculari (simula weave)
      ctx.fillStyle = '#3a3f4a'
      for (let y = 0; y < h; y += cellSize) {
        for (let x = 0; x < w; x += cellSize) {
          if ((Math.floor(x / cellSize) + Math.floor(y / cellSize)) % 2 === 0) {
            ctx.fillRect(x, y, 1, 1)
          }
        }
      }
    })
    carbonTexture.repeat.set(40, 40)
    carbonTexture.wrapS = THREE.RepeatWrapping
    carbonTexture.wrapT = THREE.RepeatWrapping

    // --- 3️⃣ PNEUMATICI - Spalle con scritte GOODYEAR ---
    const tireSideTexture = createCanvasTexture((ctx, w, h) => {
      // Base nero gomma
      ctx.fillStyle = '#26282c'
      ctx.fillRect(0, 0, w, h)

      // Texture micro-venature gomma
      ctx.fillStyle = '#2a2c30'
      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        const r = Math.random() * 1.5 + 0.5
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Scritta GOODYEAR gialla lungo la circonferenza (in orizzontale per UV)
      ctx.font = 'bold 120px Arial'
      ctx.fillStyle = '#ffcc00'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('GOODYEAR', w / 2, h * 0.35)
      ctx.fillText('EAGLE', w / 2, h * 0.65)

      // Linee sottili circonferenza (simula cordolo)
      ctx.strokeStyle = '#3a3c40'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, h * 0.25)
      ctx.lineTo(w, h * 0.25)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, h * 0.75)
      ctx.lineTo(w, h * 0.75)
      ctx.stroke()
    })

    // --- 4️⃣ BATTISTRADA - Micro-venature per bump ---
    const treadTexture = createCanvasTexture((ctx, w, h) => {
      // Base scura
      ctx.fillStyle = '#1a1b1e'
      ctx.fillRect(0, 0, w, h)

      // Pattern battistrada (scanalature longitudinali)
      ctx.fillStyle = '#141518'
      const grooveWidth = w / 16
      for (let i = 0; i < 16; i++) {
        if (i % 2 === 0) {
          ctx.fillRect(i * grooveWidth, 0, grooveWidth, h)
        }
      }

      // Micro-venature trasversali (lamelle)
      ctx.strokeStyle = '#2a2c30'
      ctx.lineWidth = 1
      for (let y = 0; y < h; y += h / 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }
    })

    // --- 5️⃣ BUMP MAP CARBONIO (per normali) ---
    const carbonBumpTexture = createCanvasTexture((ctx, w, h) => {
      ctx.fillStyle = '#808080' // neutro per bump
      ctx.fillRect(0, 0, w, h)

      // Variazioni altezza per weave
      const cellSize = w / 40
      ctx.fillStyle = '#909090'
      for (let y = -h; y < h * 2; y += cellSize * 2) {
        for (let x = -w; x < w * 2; x += cellSize * 2) {
          if ((Math.floor(x / cellSize) + Math.floor(y / cellSize)) % 2 === 0) {
            ctx.fillRect(x, y, cellSize, cellSize)
          }
        }
      }
    })
    carbonBumpTexture.repeat.set(40, 40)
    carbonBumpTexture.wrapS = THREE.RepeatWrapping
    carbonBumpTexture.wrapT = THREE.RepeatWrapping

    // 🆕 ============================================================
    // APPLICAZIONE MATERIALI PBR + TEXTURE
    // ============================================================
    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return

      const mesh = child as THREE.Mesh
      // @ts-ignore
      const material = Array.isArray(mesh.material)
        ? (mesh.material[0] as any)
        : (mesh.material as any)
      if (!material) return

      // Abilita ombre su tutte le mesh dell'auto
      mesh.castShadow = true
      mesh.receiveShadow = true

      const matName = material.name || ''

      // --- ORDINE CRITICO: cbodyf PRIMA di body ---
      if (matName.includes('cbodyf')) {
        ;(material as any).map = carbonTexture
        ;(material as any).bumpMap = carbonBumpTexture
        ;(material as any).bumpScale = 0.015
        ;(material as any).roughness = 0.35
        ;(material as any).metalness = 0.1
        ;(material as any).clearcoat = 0.6
        ;(material as any).clearcoatRoughness = 0.5
        ;(material as any).color = new THREE.Color('#22252a')
        ;(material as any).needsUpdate = true
        return
      }

      if (matName === 'MKCMP44V2_body.001' || (matName.includes('body') && !matName.includes('cbodyf'))) {
        // LIVREA MP4/4 con Vertex Colors (nessun shader custom, nessun errore)
        ;(material as any).map = null
        ;(material as any).color = new THREE.Color('#ffffff')
        ;(material as any).vertexColors = true
        ;(material as any).roughness = 0.14
        ;(material as any).metalness = 0.08
        ;(material as any).clearcoat = 1.0
        ;(material as any).clearcoatRoughness = 0.05
        ;(material as any).envMapIntensity = 2.2
        ;(material as any).needsUpdate = true

        // 🎨 Colora i vertici per creare la livrea MP4/4 (rosso Marlboro + bianco puro)
        const geometry = mesh.geometry as THREE.BufferGeometry
        geometry.computeBoundingBox()
        const box = geometry.boundingBox!
        const size = new THREE.Vector3()
        box.getSize(size)

        const positionAttr = geometry.getAttribute('position')
        const count = positionAttr.count
        const colors = new Float32Array(count * 3)

        const redR = 1.0, redG = 0.08, redB = 0.0      // #ff1e00 Marlboro
        const whiteR = 0.98, whiteG = 0.98, whiteB = 0.98 // #fafafa bianco puro

        for (let i = 0; i < count; i++) {
          const x = positionAttr.getX(i)
          const y = positionAttr.getY(i)
          const z = positionAttr.getZ(i)

          // Normalizza rispetto alla bounding box locale (0-1)
          const nx = (x - box.min.x) / size.x
          const ny = (y - box.min.y) / size.y
          const nz = (z - box.min.z) / size.z

          let isMarlboro = false

          // Punta del muso (front nose) - rosso: davanti (z basso), x centrale, y medio
          if (nz < 0.25 && Math.abs(nx - 0.5) < 0.4 && ny > 0.2) {
            isMarlboro = true
          }

          // Chevron superiore attorno airbox/cofano motore - rosso: zona centrale superiore
          if (nz > 0.2 && nz < 0.85 && Math.abs(nx - 0.5) < 0.3 && ny > 0.6) {
            isMarlboro = true
          }

          // Paratie laterali endplate alettone anteriore - rosso: x estremo, z davanti, y medio-basso
          if (nz < 0.35 && (nx < 0.2 || nx > 0.8) && ny > 0.1 && ny < 0.75) {
            isMarlboro = true
          }

          // Endplate ala posteriore - rosso: x estremo, z molto indietro, y medio-alto
          if (nz > 0.8 && (nx < 0.15 || nx > 0.85) && ny > 0.35 && ny < 0.95) {
            isMarlboro = true
          }

          // Fasce laterali Marlboro sui fianchi - rosso: x estremo, zona centrale
          if ((nx < 0.3 || nx > 0.7) && nz > 0.2 && nz < 0.7 && ny > 0.15 && ny < 0.85) {
            isMarlboro = true
          }

          const r = isMarlboro ? redR : whiteR
          const g = isMarlboro ? redG : whiteG
          const b = isMarlboro ? redB : whiteB

          colors[i * 3] = r
          colors[i * 3 + 1] = g
          colors[i * 3 + 2] = b
        }

        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        ;(geometry.attributes.color as any).needsUpdate = true
        return
      }

      if (matName === 'MKCMP44V2_bdcal.001') {
        // Calotte alettoni e dettagli rossi (colore diretto, nessuna texture)
        ;(material as any).map = null
        ;(material as any).color = new THREE.Color('#ff1e00')
        ;(material as any).roughness = 0.14
        ;(material as any).metalness = 0.0
        ;(material as any).clearcoat = 1.0
        ;(material as any).clearcoatRoughness = 0.05
        ;(material as any).envMapIntensity = 2.2
        ;(material as any).needsUpdate = true
        return
      }

      if (matName.includes('Ttread')) {
        ;(material as any).map = treadTexture
        ;(material as any).bumpMap = treadTexture
        ;(material as any).bumpScale = 0.02
        ;(material as any).roughness = 0.7
        ;(material as any).metalness = 0.05
        ;(material as any).color = new THREE.Color('#26282c')
        ;(material as any).needsUpdate = true
        return
      }

      if (matName.includes('Tside') || matName === 'MKCMP44V2_black.001') {
        ;(material as any).map = tireSideTexture
        ;(material as any).roughness = 0.7
        ;(material as any).metalness = 0.05
        ;(material as any).color = new THREE.Color('#26282c')
        ;(material as any).needsUpdate = true
        return
      }

      if (matName === 'wcrims.001' || matName === 'MKCMP44V2_mirror.001') {
        ;(material as any).color = new THREE.Color('#d4d8df')
        ;(material as any).roughness = 0.12
        ;(material as any).metalness = 0.92
        ;(material as any).envMapIntensity = 3.0
        ;(material as any).needsUpdate = true
        return
      }

      // Parti meccaniche e braccetti sospensione (metallo lucido)
      if (matName.includes('metalh') || matName.includes('Mechan')) {
        ;(material as any).color = new THREE.Color('#c8ccd2')
        ;(material as any).roughness = 0.12
        ;(material as any).metalness = 0.92
        ;(material as any).envMapIntensity = 3.0
        ;(material as any).needsUpdate = true
        return
      }

      // Carbonio (CarbFi, cptfib)
      if (matName.includes('CarbFi') || matName.includes('cptfib')) {
        ;(material as any).map = carbonTexture
        ;(material as any).bumpMap = carbonBumpTexture
        ;(material as any).bumpScale = 0.015
        ;(material as any).roughness = 0.35
        ;(material as any).metalness = 0.1
        ;(material as any).clearcoat = 0.6
        ;(material as any).clearcoatRoughness = 0.5
        ;(material as any).color = new THREE.Color('#2d3139')
        ;(material as any).needsUpdate = true
        return
      }

      // Alcantara
      if (matName.includes('alcant')) {
        ;(material as any).color = new THREE.Color('#2d3139')
        ;(material as any).roughness = 0.8
        ;(material as any).metalness = 0.0
        ;(material as any).needsUpdate = true
        return
      }

      // Vetro parabrezza
      if (matName.includes('windsh')) {
        ;(material as any).transparent = true
        ;(material as any).opacity = 0.45
        ;(material as any).side = THREE.FrontSide
        ;(material as any).depthWrite = false
        ;(material as any).refractionRatio = 0.98
        ;(material as any).color = new THREE.Color('#112233')
        ;(material as any).needsUpdate = true
        return
      }

      // Default: GRIGIO ANTRACITE
      ;(material as any).color = new THREE.Color('#2d3139')
      ;(material as any).roughness = 0.5
      ;(material as any).metalness = 0.2
      ;(material as any).needsUpdate = true
    })

    // 🆕 ============================================================
    // ASSEMBLAGGIO CONCENTRICO 2 RUOTE ANTERIORI (gomma + cerchione + mozzo)
    // ============================================================
    // Trova i mozzi anteriori (hub_0032 = sinistra, hub_0033 = destra)
    const hubLeft = scene.getObjectByName('hub_0032')
    const hubRight = scene.getObjectByName('hub_0033')

    if (!hubLeft || !hubRight) {
      console.warn('Hub anteriori non trovati!')
      return
    }

    // 🆕 ============================================================
    // CREA PIVOT SEPARATI PER SOLE MESH RUOTA (esclude sospensioni!)
    // ============================================================
    // Attacca SOLO i Mesh con materiali ruota ai pivot groups
    // Le sospensioni (CarbFi, metalh, ecc.) restano ferme sulla scocca
    
    const createWheelPivot = (hub: THREE.Object3D, hubName: string, isLeft: boolean): THREE.Vector3 => {
      const pivotGroup = new THREE.Group()
      
      // 1️⃣ PRIMA raccogli tutte le mesh ruota in un array (NO attach durante traverse!)
      const meshesToAttach: THREE.Mesh[] = []
      let treadMesh: THREE.Mesh | null = null
      
      hub.traverse((child) => {
        if (!(child as THREE.Mesh).isMesh) return
        
        const mesh = child as THREE.Mesh
        // @ts-ignore
        const material = Array.isArray(mesh.material)
          ? (mesh.material[0] as any)
          : (mesh.material as any)
        if (!material) return

        const matName = material.name || ''

        // 🆕 SOLO materiali ruota: gomma + cerchione + dadi
        // INCLUDE: Ttread, Tside, wcrims, black, Material #443, Material #444, Screws
        // ESCLUDE: CarbFi, metalh, Mechan, MtlBrb, MtlBrg, cpitpl (sospensioni/braccetti)
        const isWheelMaterial = 
          matName.includes('Ttread') ||
          matName.includes('Tside') ||
          matName === 'wcrims.001' ||
          matName === 'MKCMP44V2_black.001' ||
          matName === 'Material #443' ||
          matName === 'Material #444' ||
          matName === 'MKCMP44V2_Screws.001'
        
        // Esclusione esplicita sospensioni
        const isSuspensionMaterial = 
          matName.includes('CarbFi') ||
          matName.includes('metalh') ||
          matName.includes('Mechan') ||
          matName.includes('MtlBrb') ||
          matName.includes('MtlBrg') ||
          matName.includes('cpitpl')
        
        if (!isWheelMaterial || isSuspensionMaterial) {
          // Sospensione o altro - NON attaccare al pivot, resta fermo sulla scocca
          return
        }

        console.log(`  ${isLeft ? 'LEFT' : 'RIGHT'} WHEEL COLLECT: ${mesh.name || 'unnamed'} material: ${matName}`)
        meshesToAttach.push(mesh)
        
        // 🆕 Salva la mesh del battistrada per calcolo centro ESATTO dai vertici
        if (matName.includes('Ttread')) {
          treadMesh = mesh
        }
      })
      
      // 2️⃣ Calcola centro ESATTO dal baricentro dei vertici del battistrada (cilindro simmetrico)
      // Questo elimina l'errore dell'AABB e delle viti laterali
      let exactWorldCenter = new THREE.Vector3()
      if (treadMesh) {
        const geometry = (treadMesh as THREE.Mesh).geometry as THREE.BufferGeometry
        const positionAttr = geometry.getAttribute('position')
        const matrixWorld = (treadMesh as THREE.Mesh).matrixWorld
        
        let sumX = 0, sumY = 0, sumZ = 0
        const count = positionAttr.count
        
        for (let i = 0; i < count; i++) {
          const vertex = new THREE.Vector3()
          vertex.fromBufferAttribute(positionAttr, i)
          vertex.applyMatrix4(matrixWorld)
          sumX += vertex.x
          sumY += vertex.y
          sumZ += vertex.z
        }
        
        exactWorldCenter.set(sumX / count, sumY / count, sumZ / count)
        console.log(`  ${isLeft ? 'LEFT' : 'RIGHT'} EXACT TREAD CENTER (vertices):`, exactWorldCenter.x.toFixed(6), exactWorldCenter.y.toFixed(6), exactWorldCenter.z.toFixed(6))
      } else {
        // Fallback: Box3 solo su mesh ruota (senza sospensioni)
        const wheelBox = new THREE.Box3()
        meshesToAttach.forEach((mesh) => wheelBox.expandByObject(mesh))
        wheelBox.getCenter(exactWorldCenter)
        console.log(`  ${isLeft ? 'LEFT' : 'RIGHT'} FALLBACK Box3 CENTER:`, exactWorldCenter.x.toFixed(6), exactWorldCenter.y.toFixed(6), exactWorldCenter.z.toFixed(6))
      }
      
      // 3️⃣ Ancora pivotGroup al genitore dell'hub (braccetto sospensione) convertendo in coordinate locali
      const parent = hub.parent
      if (parent) {
        const localCenter = parent.worldToLocal(exactWorldCenter.clone())
        pivotGroup.position.copy(localCenter)
        parent.add(pivotGroup)
        console.log(`  ${isLeft ? 'LEFT' : 'RIGHT'} Pivot anchored to ${parent.name}, local pos:`, localCenter.x.toFixed(3), localCenter.y.toFixed(3), localCenter.z.toFixed(3))
      } else {
        // Fallback: aggiungi alla scena
        pivotGroup.position.copy(exactWorldCenter)
        scene.add(pivotGroup)
        console.log(`  ${isLeft ? 'LEFT' : 'RIGHT'} Pivot added to scene (no parent)`)
      }
      
      // 4️⃣ ORA attacca le mesh (dopo che traverse è finito!)
      let attachedCount = 0
      meshesToAttach.forEach((mesh) => {
        console.log(`  ${isLeft ? 'LEFT' : 'RIGHT'} WHEEL ATTACH: ${mesh.name || 'unnamed'} material: ${(mesh.material as any)?.name || 'unknown'}`)
        pivotGroup.attach(mesh)
        attachedCount++
      })
      
      if (attachedCount > 0) {
        wheelGroups.current.push(pivotGroup)
        console.log(`Pivot ${isLeft ? 'Left' : 'Right'} creato: ${attachedCount} mesh ruota attaccate al centro esatto:`, exactWorldCenter.x.toFixed(6), exactWorldCenter.y.toFixed(6), exactWorldCenter.z.toFixed(6))
      }
      
      return exactWorldCenter
    }

    // Crea pivot per ruota ANTERIORE SINISTRA (hub_0032)
    const leftWheelCenter = createWheelPivot(hubLeft, 'hub_0032', true)

    // Crea pivot per ruota ANTERIORE DESTRA (hub_0033)
    const rightWheelCenter = createWheelPivot(hubRight, 'hub_0033', false)

    // 🆕 RICALCOLA ASSE MONDIALE REALE dai centri ruota VERI (solo mesh ruota)
    const wheelAxis = new THREE.Vector3()
      .subVectors(rightWheelCenter, leftWheelCenter)
      .normalize()
    
    // Salva l'asse per useFrame
    wheelAxisRef.current = wheelAxis

    console.log('=== DEBUG RUOTE ANTERIORI (FINAL) ===')
    console.log('Left Wheel Center:', leftWheelCenter.x.toFixed(3), leftWheelCenter.y.toFixed(3), leftWheelCenter.z.toFixed(3))
    console.log('Right Wheel Center:', rightWheelCenter.x.toFixed(3), rightWheelCenter.y.toFixed(3), rightWheelCenter.z.toFixed(3))
    console.log('Wheel Axis (world):', wheelAxis.x.toFixed(3), wheelAxis.y.toFixed(3), wheelAxis.z.toFixed(3))

    // Nascondi piani di terra
    scene.traverse((child) => {
      if (child.name === 'Plane' || child.name === 'Plane.001') {
        ;(child as THREE.Object3D).visible = false
      }
    })

    // Cleanup
    return () => {
      wheelGroups.current.forEach((group) => {
        scene.remove(group)
      })
      initializedRef.current = false
    }
  }, [scene])

  // 🆕 3️⃣ Animazione rotazione SOLO 2 ruote anteriori - USA rotateOnWorldAxis!
  useFrame(() => {
    if (!wheelAxisRef.current) return
    
    const axis = wheelAxisRef.current
    const delta = -0.04 // velocità rotazione (negativo per direzione corretta)
    
    wheelGroups.current.forEach((group) => {
      // Ruota attorno all'asse MONDIALE calcolato (indipendente dall'orientamento del modello)
      group.rotateOnWorldAxis(axis, delta)
    })
  })

  // Render the full scene graph preserving hierarchy
  return scene ? (
    <primitive object={scene} />
  ) : null
}

export default CarModel