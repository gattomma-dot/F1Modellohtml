// Regolamento F1 2026 - Dimensioni ufficiali (in metri)
export const F1_2026_SPECS = {
  // Telaio
  wheelbase: 3.4,        // 3400mm
  width: 1.9,            // 1900mm
  maxHeight: 0.95,       // 950mm
  minWeight: 768,        // kg

  // Ruote 18"
  frontWheelWidth: 0.28,   // 280mm
  rearWheelWidth: 0.375,   // 375mm
  wheelDiameter: 0.72,     // ~18" + gomma = 720mm
  wheelRadius: 0.36,

  // Carreggiate (stimate da larghezza totale)
  frontTrack: 1.62,
  rearTrack: 1.58,

  // Aerodinamica 2026
  frontWingWidth: 1.8,     // 100mm più stretta del 2025 (era 1.9m)
  rearWingWidth: 1.95,     // Quasi larghezza vettura
  frontWingElements: 3,
  rearWingElements: 3,

  // Z-Mode / X-Mode
  zModeDragReduction: 0.15,
  xModeTopSpeedBoost: 0.08,

  // Power Unit
  icePowerKW: 400,
  mguKPowerKW: 350,
  totalPowerKW: 750,
  energySplit: 0.5, // 50/50

  // Colori Ferrari
  colors: {
    rossoCorsa: 0xFF1E00,
    rossoScuro: 0xA80000,
    gialloModena: 0xFDD200,
    nero: 0x0A0A0A,
    carbonio: 0x1A1A1A,
    titanio: 0xB8B8B8,
    argento: 0xD4D4D4,
    bianco: 0xFFFFFF,
  }
} as const

// Posizioni chiave lungo Z (0 = centro vettura, negativo = anteriore)
export const KEY_POSITIONS = {
  noseTip: -1.85,
  frontWing: -1.75,
  frontAxle: -1.55,
  frontSidepodStart: -1.2,
  cockpitFront: -0.5,
  cockpitRear: 0.2,
  engineCoverStart: 0.3,
  rearAxle: 1.55,
  rearWing: 1.85,
  diffuserEnd: 2.15,
  totalLength: 5.0,
} as const