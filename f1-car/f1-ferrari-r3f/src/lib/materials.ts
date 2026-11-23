import * as THREE from 'three'
import { F1_2026_SPECS } from './constants'

// Materiali PBR Ferrari F1 2026 - Fisicamente corretti
// Basati su reference reali: clearcoat per carrozzeria, anisotropy per carbonio, etc.

export const ferrariMaterials = {
  // ==========================================
  // CARROZZERIA - Rosso Corsa con clearcoat
  // ==========================================
  carrozzeria: new THREE.MeshPhysicalMaterial({
    color: F1_2026_SPECS.colors.rossoCorsa,
    metalness: 0.72,
    roughness: 0.16,
    clearcoat: 0.45,
    clearcoatRoughness: 0.08,
    clearcoatNormalScale: 0.5,
    envMapIntensity: 1.1,
    reflectivity: 1.0,
  }),

  carrozzeriaOpaca: new THREE.MeshPhysicalMaterial({
    color: F1_2026_SPECS.colors.rossoScuro,
    metalness: 0.55,
    roughness: 0.35,
    clearcoat: 0.15,
    clearcoatRoughness: 0.25,
    envMapIntensity: 0.9,
  }),

  // ==========================================
  // CARBONIO - Fibra di carbonio con anisotropy
  // ==========================================
  carbonio: new THREE.MeshPhysicalMaterial({
    color: F1_2026_SPECS.colors.carbonio,
    metalness: 0.42,
    roughness: 0.48,
    anisotropy: 0.85,
    anisotropyRotation: 0,
    clearcoat: 0.35,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.0,
  }),

  carbonioOpaco: new THREE.MeshStandardMaterial({
    color: F1_2026_SPECS.colors.carbonio,
    metalness: 0.35,
    roughness: 0.65,
  }),

  carbonioLucido: new THREE.MeshPhysicalMaterial({
    color: F1_2026_SPECS.colors.carbonio,
    metalness: 0.5,
    roughness: 0.28,
    clearcoat: 0.6,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.2,
  }),

  // ==========================================
  // HALO - Titanio spazzolato
  // ==========================================
  titanio: new THREE.MeshPhysicalMaterial({
    color: F1_2026_SPECS.colors.titanio,
    metalness: 0.98,
    roughness: 0.18,
    anisotropy: 0.6,
    anisotropyRotation: Math.PI / 2,
    clearcoat: 0.1,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.15,
  }),

  // ==========================================
  // CERCHI - Lega forgiata
  // ==========================================
  cerchioLega: new THREE.MeshPhysicalMaterial({
    color: F1_2026_SPECS.colors.argento,
    metalness: 0.95,
    roughness: 0.12,
    clearcoat: 0.55,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.25,
  }),

  cerchioLegaScuro: new THREE.MeshPhysicalMaterial({
    color: 0x888888,
    metalness: 0.92,
    roughness: 0.18,
    clearcoat: 0.4,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.1,
  }),

  // ==========================================
  // PNEUMATICI - Gomma Pirelli F1
  // ==========================================
  pneumatico: new THREE.MeshStandardMaterial({
    color: 0x0D0D0D,
    metalness: 0.05,
    roughness: 0.92,
  }),

  pneumaticoMorbido: new THREE.MeshStandardMaterial({
    color: 0x0A0A0A,
    metalness: 0.02,
    roughness: 0.95,
  }),

  // ==========================================
  // COPPICERCHI - Carbonio
  // ==========================================
  copricerchio: new THREE.MeshPhysicalMaterial({
    color: F1_2026_SPECS.colors.carbonio,
    metalness: 0.4,
    roughness: 0.45,
    clearcoat: 0.3,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.0,
  }),

  // ==========================================
  // ABITACOLO / INTERNI
  // ==========================================
  abitacoloInterno: new THREE.MeshStandardMaterial({
    color: 0x050505,
    metalness: 0.15,
    roughness: 0.85,
  }),

  sedileCarbonio: new THREE.MeshPhysicalMaterial({
    color: 0x0F0F0F,
    metalness: 0.4,
    roughness: 0.5,
    clearcoat: 0.25,
    clearcoatRoughness: 0.2,
  }),

  // ==========================================
  // VETRO / VISIERA / HANS
  // ==========================================
  vetroVisiera: new THREE.MeshPhysicalMaterial({
    color: 0x1a1a2e,
    metalness: 0.0,
    roughness: 0.0,
    transmission: 0.88,
    thickness: 0.004,
    ior: 1.52,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    envMapIntensity: 1.5,
    side: THREE.DoubleSide,
  }),

  // ==========================================
  // SCARICHI / PARTI TERMICHE
  // ==========================================
  scaricoInconel: new THREE.MeshPhysicalMaterial({
    color: 0x8B6B4A, // Inconel ossidato
    metalness: 0.85,
    roughness: 0.35,
    anisotropy: 0.7,
    clearcoat: 0.1,
    envMapIntensity: 1.0,
  }),

  scaricoCaldo: new THREE.MeshBasicMaterial({
    color: 0xFF4400,
    transparent: true,
    opacity: 0.0,
  }),

  // Emissivo per scarichi caldi (usa con MeshBasicMaterial o shader custom)
  emissiveHot: (intensity: number = 1.0) => new THREE.MeshBasicMaterial({
    color: new THREE.Color(1.0, 0.3, 0.0).multiplyScalar(intensity),
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }),

  // ==========================================
  // DETTAGLI GIALLO MODENA
  // ==========================================
  gialloModena: new THREE.MeshPhysicalMaterial({
    color: F1_2026_SPECS.colors.gialloModena,
    metalness: 0.6,
    roughness: 0.25,
    clearcoat: 0.4,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.1,
  }),

  gialloModenaOpaco: new THREE.MeshStandardMaterial({
    color: F1_2026_SPECS.colors.gialloModena,
    metalness: 0.3,
    roughness: 0.55,
  }),

  // ==========================================
  // NERO OPACO - Per parti tecniche
  // ==========================================
  neroOpaco: new THREE.MeshStandardMaterial({
    color: F1_2026_SPECS.colors.nero,
    metalness: 0.1,
    roughness: 0.9,
  }),

  neroLucido: new THREE.MeshPhysicalMaterial({
    color: F1_2026_SPECS.colors.nero,
    metalness: 0.6,
    roughness: 0.15,
    clearcoat: 0.5,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.2,
  }),

  // ==========================================
  // BIANCO - Per numeri, loghi
  // ==========================================
  bianco: new THREE.MeshPhysicalMaterial({
    color: F1_2026_SPECS.colors.bianco,
    metalness: 0.05,
    roughness: 0.3,
    clearcoat: 0.5,
    clearcoatRoughness: 0.08,
  }),

  // ==========================================
  // FONDO PIATTO / DIFFUSORE
  // ==========================================
  fondoPiatto: new THREE.MeshPhysicalMaterial({
    color: F1_2026_SPECS.colors.carbonio,
    metalness: 0.45,
    roughness: 0.5,
    clearcoat: 0.2,
    clearcoatRoughness: 0.15,
    anisotropy: 0.3,
  }),

  // ==========================================
  // LUCE PIOGGIA (emissiva)
  // ==========================================
  lucePioggia: (intensity: number = 1.0) => new THREE.MeshBasicMaterial({
    color: new THREE.Color(1.0, 0.05, 0.0).multiplyScalar(intensity),
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  }),

  // ==========================================
  // HELPER: Clona materiale con override
  // ==========================================
  cloneWith: <T extends THREE.Material>(
    material: T,
    overrides: Partial<T>
  ): T => {
    const cloned = material.clone()
    Object.assign(cloned, overrides)
    return cloned
  },

  // Preset per varianti livrea
  variants: {
    standard: 'carrozzeria',
    matte: 'carrozzeriaOpaca',
    carbonio: 'carbonioLucido',
  }
} as const

// Type per IntelliSense
export type FerrariMaterialKey = keyof typeof ferrariMaterials
export type FerrariMaterial = typeof ferrariMaterials[FerrariMaterialKey]

// Esporta anche i singoli materiali per uso diretto
export const {
  carrozzeria,
  carrozzeriaOpaca,
  carbonio,
  carbonioOpaco,
  carbonioLucido,
  titanio,
  cerchioLega,
  cerchioLegaScuro,
  pneumatico,
  pneumaticoMorbido,
  copricerchio,
  abitacoloInterno,
  sedileCarbonio,
  vetroVisiera,
  scaricoInconel,
  scaricoCaldo,
  emissiveHot,
  gialloModena,
  gialloModenaOpaco,
  neroOpaco,
  neroLucido,
  bianco,
  fondoPiatto,
  lucePioggia,
  cloneWith,
} = ferrariMaterials