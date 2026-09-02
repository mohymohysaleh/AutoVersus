import { ComparisonCar, MetricDefinition, AiVerdictData } from '../types/comparison.types';
import { resolveCarImage } from '../../../shared/utils/car-image.utils';

export const COMPARISON_CARS_DATABASE: ComparisonCar[] = [
  {
    id: 'corolla-2026-comfort',
    brandName: 'Toyota',
    modelName: 'Corolla',
    trimName: 'Comfort',
    year: 2026,
    startingPriceEGP: 1450000,
    imageUrl: resolveCarImage('Toyota', 'Corolla', 'Comfort', 'Petrol'),
    slug: 'toyota-corolla-comfort',
    categoryTag: 'SEDAN • EGYPT SPEC SHEET',
    horsepower: 139,
    torqueNm: 154,
    zeroToHundredSec: 10.2,
    topSpeedKmh: 190,
    fuelEconomyL100km: 6.8,
    airbagsCount: 6,
    overviewSpecs: {
      horsepower: '139 HP',
      torque: '154 Nm',
      zeroToHundred: '10.2 sec',
      topSpeed: '190 km/h',
      fuelEconomy: '6.8 L/100km',
      airbags: '6 Airbags',
    },
    engineSpecs: {
      fuelType: 'Petrol (92/95 Octane)',
      displacement: '1598 cc (1.6L Dynamic Force)',
      power: '139 HP (103 kW)',
      torque: '154 Nm @ 5200 rpm',
      transmission: 'Direct-Shift CVT (10-Speed Sim)',
      drivetrain: 'Front-Wheel Drive (FWD)',
    },
    dimensionSpecs: {
      dimensions: '4630 × 1780 × 1435 mm',
      wheelbase: '2700 mm',
      trunkVolume: '470 L',
      seating: '5 Passengers',
    },
    performanceSpecs: {
      acceleration: '10.2 seconds (0-100 km/h)',
      maxSpeed: '190 km/h',
      fuelConsumption: '6.8 L/100km (Cairo Commute)',
    },
    safetySpecs: {
      airbags: '6 Airbags (Front, Side, Curtain)',
      abs: 'Standard ABS + EBD ✓',
      esc: 'Vehicle Stability Control (VSC) ✓',
      aeb: 'Toyota Safety Sense 3.0 AEB ✓',
      tpms: 'Individual Tire Pressure Monitor ✓',
      brakeAssist: 'Brake Assist (BA) ✓',
    },
    featureSpecs: {
      smartphone: 'Wireless Apple CarPlay & Android Auto ✓',
      cluster: '7" TFT Digital Multi-Information Display',
      climate: 'Automatic Dual-Zone Air Conditioning',
      lighting: 'Bi-LED Projector Headlamps & DRLs',
      parkingAssistance: 'Rear Sensors + HD Rearview Camera',
      completeness: '98% Verified Toyota Spec Sheet',
    },
  },
  {
    id: 'elantra-2026-smart',
    brandName: 'Hyundai',
    modelName: 'Elantra',
    trimName: 'Smart',
    year: 2026,
    startingPriceEGP: 1520000,
    imageUrl: resolveCarImage('Hyundai', 'Elantra', 'Smart', 'Petrol'),
    slug: 'hyundai-elantra-smart',
    categoryTag: 'SEDAN • EGYPT SPEC SHEET',
    horsepower: 145,
    torqueNm: 179,
    zeroToHundredSec: 9.8,
    topSpeedKmh: 202,
    fuelEconomyL100km: 7.2,
    airbagsCount: 6,
    overviewSpecs: {
      horsepower: '145 HP',
      torque: '179 Nm',
      zeroToHundred: '9.8 sec',
      topSpeed: '202 km/h',
      fuelEconomy: '7.2 L/100km',
      airbags: '6 Airbags',
    },
    engineSpecs: {
      fuelType: 'Petrol (92/95 Octane)',
      displacement: '1591 cc (1.6L MPi)',
      power: '145 HP (108 kW)',
      torque: '179 Nm @ 4500 rpm',
      transmission: '6-Speed Automatic',
      drivetrain: 'Front-Wheel Drive (FWD)',
    },
    dimensionSpecs: {
      dimensions: '4675 × 1825 × 1430 mm',
      wheelbase: '2720 mm',
      trunkVolume: '474 L',
      seating: '5 Passengers',
    },
    performanceSpecs: {
      acceleration: '9.8 seconds (0-100 km/h)',
      maxSpeed: '202 km/h',
      fuelConsumption: '7.2 L/100km (Combined)',
    },
    safetySpecs: {
      airbags: '6 Airbags (Dual Front & Curtain)',
      abs: 'Standard ABS + EBD ✓',
      esc: 'Electronic Stability Control (ESC) ✓',
      aeb: 'Forward Collision-Avoidance Assist ✓',
      tpms: 'Tire Pressure Monitoring System ✓',
      brakeAssist: 'Brake Assist System (BAS) ✓',
    },
    featureSpecs: {
      smartphone: 'Wireless Apple CarPlay & Android Auto ✓',
      cluster: '10.25" Full Digital Instrument Cluster',
      climate: 'Dual-Zone Auto AC with Rear Vents',
      lighting: 'Full LED Parametric Headlamps',
      parkingAssistance: 'Front & Rear Sensors + 360° Camera',
      completeness: '96% Verified Hyundai Spec Sheet',
    },
  },
  {
    id: 'mg-6-2026-luxury',
    brandName: 'MG',
    modelName: 'MG 6',
    trimName: 'Luxury Turbo',
    year: 2026,
    startingPriceEGP: 1390000,
    imageUrl: resolveCarImage('MG', 'MG 6', 'Luxury', 'Petrol'),
    slug: 'mg-mg-6-luxury',
    categoryTag: 'FASTBACK • TURBO SPEC',
    horsepower: 169,
    torqueNm: 250,
    zeroToHundredSec: 8.5,
    topSpeedKmh: 210,
    fuelEconomyL100km: 6.9,
    airbagsCount: 6,
    overviewSpecs: {
      horsepower: '169 HP',
      torque: '250 Nm',
      zeroToHundred: '8.5 sec',
      topSpeed: '210 km/h',
      fuelEconomy: '6.9 L/100km',
      airbags: '6 Airbags',
    },
    engineSpecs: {
      fuelType: 'Petrol (95 Octane Recommended)',
      displacement: '1490 cc (1.5L Turbocharged)',
      power: '169 HP (126 kW)',
      torque: '250 Nm @ 1700-4300 rpm',
      transmission: '7-Speed Dual Clutch (DCT)',
      drivetrain: 'Front-Wheel Drive (FWD)',
    },
    dimensionSpecs: {
      dimensions: '4694 × 1848 × 1465 mm',
      wheelbase: '2715 mm',
      trunkVolume: '429 L (Expandable to 1170 L)',
      seating: '5 Passengers',
    },
    performanceSpecs: {
      acceleration: '8.5 seconds (0-100 km/h)',
      maxSpeed: '210 km/h',
      fuelConsumption: '6.9 L/100km',
    },
    safetySpecs: {
      airbags: '6 Airbags Package ✓',
      abs: 'ABS + EBD + CBC ✓',
      esc: 'Dynamic Stability Control (DSC) ✓',
      aeb: 'Radar Warning Assist ✓',
      tpms: 'Direct Tire Pressure Sensors ✓',
      brakeAssist: 'Emergency Brake Assist (EBA) ✓',
    },
    featureSpecs: {
      smartphone: 'Apple CarPlay & Android Auto ✓',
      cluster: '7" Digital Sports Cluster with G-Meter',
      climate: 'Dual Zone Automatic Air Conditioning',
      lighting: 'LED London Eye Headlamps',
      parkingAssistance: 'Rear Parking Camera + Dynamic Lines',
      completeness: '94% Verified MG Spec Sheet',
    },
  },
  {
    id: 'bmw-320i-2026-m-sport',
    brandName: 'BMW',
    modelName: '320i',
    trimName: 'M Sport Edition',
    year: 2026,
    startingPriceEGP: 3800000,
    imageUrl: resolveCarImage('BMW', '3 Series', 'M Sport', 'Petrol'),
    slug: 'bmw-320i-m-sport',
    categoryTag: 'LUXURY SEDAN • GERMAN TECH',
    horsepower: 184,
    torqueNm: 300,
    zeroToHundredSec: 7.4,
    topSpeedKmh: 235,
    fuelEconomyL100km: 6.3,
    airbagsCount: 8,
    overviewSpecs: {
      horsepower: '184 HP',
      torque: '300 Nm',
      zeroToHundred: '7.4 sec',
      topSpeed: '235 km/h',
      fuelEconomy: '6.3 L/100km',
      airbags: '8 Airbags',
    },
    engineSpecs: {
      fuelType: 'Petrol Premium (95 Octane)',
      displacement: '1998 cc (2.0L TwinPower Turbo)',
      power: '184 HP (135 kW)',
      torque: '300 Nm @ 1350-4000 rpm',
      transmission: '8-Speed Steptronic Sport Auto',
      drivetrain: 'Rear-Wheel Drive (RWD)',
    },
    dimensionSpecs: {
      dimensions: '4713 × 1827 × 1440 mm',
      wheelbase: '2851 mm',
      trunkVolume: '480 L',
      seating: '5 Passengers',
    },
    performanceSpecs: {
      acceleration: '7.4 seconds (0-100 km/h)',
      maxSpeed: '235 km/h',
      fuelConsumption: '6.3 L/100km',
    },
    safetySpecs: {
      airbags: '8 Airbags (Full Surround Protection)',
      abs: 'Cornering Brake Control (CBC) + ABS ✓',
      esc: 'Dynamic Stability Control (DSC) ✓',
      aeb: 'Active Guard Brake Assistant ✓',
      tpms: 'BMW Tyre Pressure Indicator ✓',
      brakeAssist: 'Dynamic Brake Support (DBS) ✓',
    },
    featureSpecs: {
      smartphone: 'Wireless Apple CarPlay & Android Auto ✓',
      cluster: '12.3" Digital Curved Live Cockpit Pro',
      climate: '3-Zone Automatic Climate Control',
      lighting: 'Adaptive LED Laserlight Headlamps',
      parkingAssistance: 'Parking Assistant Plus with 360° Cam',
      completeness: '99% Verified BMW Spec Sheet',
    },
  },
];

export const METRIC_DEFINITIONS: MetricDefinition[] = [
  // --- OVERVIEW TAB METRICS ---
  {
    id: 'ov-price',
    label: 'Starting Price (EGP)',
    category: 'Overview',
    direction: 'lower',
    getRawValue: (c) => c.startingPriceEGP,
    getDisplayValue: (c) => `EGP ${c.startingPriceEGP.toLocaleString()}`,
  },
  {
    id: 'ov-hp',
    label: 'Horsepower',
    category: 'Overview',
    direction: 'higher',
    getRawValue: (c) => c.horsepower,
    getDisplayValue: (c) => c.overviewSpecs.horsepower,
  },
  {
    id: 'ov-torque',
    label: 'Engine Torque',
    category: 'Overview',
    direction: 'higher',
    getRawValue: (c) => c.torqueNm,
    getDisplayValue: (c) => c.overviewSpecs.torque,
  },
  {
    id: 'ov-accel',
    label: '0 - 100 km/h Acceleration',
    category: 'Overview',
    direction: 'lower',
    getRawValue: (c) => c.zeroToHundredSec,
    getDisplayValue: (c) => c.overviewSpecs.zeroToHundred,
  },
  {
    id: 'ov-speed',
    label: 'Top Speed',
    category: 'Overview',
    direction: 'higher',
    getRawValue: (c) => c.topSpeedKmh,
    getDisplayValue: (c) => c.overviewSpecs.topSpeed,
  },
  {
    id: 'ov-fuel',
    label: 'Fuel Economy (Commute)',
    category: 'Overview',
    direction: 'lower',
    getRawValue: (c) => c.fuelEconomyL100km,
    getDisplayValue: (c) => c.overviewSpecs.fuelEconomy,
  },
  {
    id: 'ov-airbags',
    label: 'Airbags Safety Count',
    category: 'Overview',
    direction: 'higher',
    getRawValue: (c) => c.airbagsCount,
    getDisplayValue: (c) => c.overviewSpecs.airbags,
  },

  // --- SPECS TAB METRICS ---
  {
    id: 'spec-fuel-type',
    label: 'Fuel Type & Octane',
    category: 'Specs',
    groupTitle: 'ENGINE & POWERTRAIN',
    direction: 'none',
    getDisplayValue: (c) => c.engineSpecs.fuelType,
  },
  {
    id: 'spec-displacement',
    label: 'Engine Displacement',
    category: 'Specs',
    groupTitle: 'ENGINE & POWERTRAIN',
    direction: 'none',
    getDisplayValue: (c) => c.engineSpecs.displacement,
  },
  {
    id: 'spec-power',
    label: 'Horsepower & kW Output',
    category: 'Specs',
    groupTitle: 'ENGINE & POWERTRAIN',
    direction: 'higher',
    getRawValue: (c) => c.horsepower,
    getDisplayValue: (c) => c.engineSpecs.power,
  },
  {
    id: 'spec-torque',
    label: 'Peak Torque Rating',
    category: 'Specs',
    groupTitle: 'ENGINE & POWERTRAIN',
    direction: 'higher',
    getRawValue: (c) => c.torqueNm,
    getDisplayValue: (c) => c.engineSpecs.torque,
  },
  {
    id: 'spec-trans',
    label: 'Transmission System',
    category: 'Specs',
    groupTitle: 'ENGINE & POWERTRAIN',
    direction: 'none',
    getDisplayValue: (c) => c.engineSpecs.transmission,
  },
  {
    id: 'spec-drive',
    label: 'Drivetrain Configuration',
    category: 'Specs',
    groupTitle: 'ENGINE & POWERTRAIN',
    direction: 'none',
    getDisplayValue: (c) => c.engineSpecs.drivetrain,
  },
  {
    id: 'spec-dim',
    label: 'Dimensions (L × W × H)',
    category: 'Specs',
    groupTitle: 'DIMENSIONS & CAPACITY',
    direction: 'none',
    getDisplayValue: (c) => c.dimensionSpecs.dimensions,
  },
  {
    id: 'spec-wheelbase',
    label: 'Wheelbase Length',
    category: 'Specs',
    groupTitle: 'DIMENSIONS & CAPACITY',
    direction: 'higher',
    getRawValue: (c) => {
      const match = c.dimensionSpecs.wheelbase.match(/\d+/);
      return match ? parseInt(match[0], 10) : null;
    },
    getDisplayValue: (c) => c.dimensionSpecs.wheelbase,
  },
  {
    id: 'spec-trunk',
    label: 'Trunk Cargo Capacity',
    category: 'Specs',
    groupTitle: 'DIMENSIONS & CAPACITY',
    direction: 'higher',
    getRawValue: (c) => {
      const match = c.dimensionSpecs.trunkVolume.match(/\d+/);
      return match ? parseInt(match[0], 10) : null;
    },
    getDisplayValue: (c) => c.dimensionSpecs.trunkVolume,
  },
  {
    id: 'spec-seats',
    label: 'Seating Capacity',
    category: 'Specs',
    groupTitle: 'DIMENSIONS & CAPACITY',
    direction: 'none',
    getDisplayValue: (c) => c.dimensionSpecs.seating,
  },
  {
    id: 'spec-accel-perf',
    label: '0-100 Acceleration',
    category: 'Specs',
    groupTitle: 'PERFORMANCE & EFFICIENCY',
    direction: 'lower',
    getRawValue: (c) => c.zeroToHundredSec,
    getDisplayValue: (c) => c.performanceSpecs.acceleration,
  },
  {
    id: 'spec-max-speed',
    label: 'Maximum Speed',
    category: 'Specs',
    groupTitle: 'PERFORMANCE & EFFICIENCY',
    direction: 'higher',
    getRawValue: (c) => c.topSpeedKmh,
    getDisplayValue: (c) => c.performanceSpecs.maxSpeed,
  },
  {
    id: 'spec-fuel-cons',
    label: 'Fuel Consumption',
    category: 'Specs',
    groupTitle: 'PERFORMANCE & EFFICIENCY',
    direction: 'lower',
    getRawValue: (c) => c.fuelEconomyL100km,
    getDisplayValue: (c) => c.performanceSpecs.fuelConsumption,
  },

  // --- SAFETY TAB METRICS ---
  {
    id: 'safe-airbags',
    label: 'Airbags Package',
    category: 'Safety',
    direction: 'higher',
    getRawValue: (c) => c.airbagsCount,
    getDisplayValue: (c) => c.safetySpecs.airbags,
  },
  {
    id: 'safe-abs',
    label: 'Anti-lock Brakes (ABS)',
    category: 'Safety',
    direction: 'none',
    getDisplayValue: (c) => c.safetySpecs.abs,
  },
  {
    id: 'safe-esc',
    label: 'Stability Control (ESC/VSC)',
    category: 'Safety',
    direction: 'none',
    getDisplayValue: (c) => c.safetySpecs.esc,
  },
  {
    id: 'safe-aeb',
    label: 'Autonomous Emergency Braking',
    category: 'Safety',
    direction: 'none',
    getDisplayValue: (c) => c.safetySpecs.aeb,
  },
  {
    id: 'safe-tpms',
    label: 'Tire Pressure Monitor',
    category: 'Safety',
    direction: 'none',
    getDisplayValue: (c) => c.safetySpecs.tpms,
  },
  {
    id: 'safe-ba',
    label: 'Brake Assist System (BA)',
    category: 'Safety',
    direction: 'none',
    getDisplayValue: (c) => c.safetySpecs.brakeAssist,
  },

  // --- FEATURES TAB METRICS ---
  {
    id: 'feat-phone',
    label: 'Smartphone Integration',
    category: 'Features',
    direction: 'none',
    getDisplayValue: (c) => c.featureSpecs.smartphone,
  },
  {
    id: 'feat-cluster',
    label: 'Instrument Cluster',
    category: 'Features',
    direction: 'none',
    getDisplayValue: (c) => c.featureSpecs.cluster,
  },
  {
    id: 'feat-climate',
    label: 'Climate Control',
    category: 'Features',
    direction: 'none',
    getDisplayValue: (c) => c.featureSpecs.climate,
  },
  {
    id: 'feat-lighting',
    label: 'Lighting Tech',
    category: 'Features',
    direction: 'none',
    getDisplayValue: (c) => c.featureSpecs.lighting,
  },
  {
    id: 'feat-parking',
    label: 'Parking Assistance',
    category: 'Features',
    direction: 'none',
    getDisplayValue: (c) => c.featureSpecs.parkingAssistance,
  },
  {
    id: 'feat-completeness',
    label: 'Spec Sheet Completeness',
    category: 'Features',
    direction: 'higher',
    getRawValue: (c) => {
      const match = c.featureSpecs.completeness.match(/\d+/);
      return match ? parseInt(match[0], 10) : null;
    },
    getDisplayValue: (c) => c.featureSpecs.completeness,
  },
];

/**
 * Calculates which car(s) win a given metric.
 * Returns map of carId -> boolean (true if winner).
 */
export function calculateMetricWinner(
  metric: MetricDefinition,
  cars: ComparisonCar[]
): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  if (metric.direction === 'none' || cars.length < 2 || !metric.getRawValue) {
    return result;
  }

  const validValues = cars
    .map((c) => ({ carId: c.id, val: metric.getRawValue!(c) }))
    .filter((item): item is { carId: string; val: number } => item.val !== null && typeof item.val === 'number');

  if (validValues.length < 2) return result;

  let bestVal = validValues[0].val;
  for (const item of validValues) {
    if (metric.direction === 'higher') {
      if (item.val > bestVal) bestVal = item.val;
    } else if (metric.direction === 'lower') {
      if (item.val < bestVal) bestVal = item.val;
    }
  }

  for (const item of validValues) {
    if (item.val === bestVal) {
      result[item.carId] = true;
    }
  }

  return result;
}

/**
 * Dynamically synthesizes the AutoVersus AI Verdict based on selected vehicles & custom prompt.
 */
export function generateAiVerdict(cars: ComparisonCar[], customPrompt?: string): AiVerdictData {
  if (cars.length < 2) {
    return {
      title: 'AutoVersus AI Verdict',
      winnerCarId: cars[0]?.id || '',
      summary: 'Select at least 2 cars to generate a side-by-side AI decision analysis.',
    };
  }

  const carA = cars[0];
  const carB = cars[1];
  const carC = cars[2];

  // If custom prompt is passed, analyze driver preference keywords
  if (customPrompt && customPrompt.trim().length > 0) {
    const promptLower = customPrompt.toLowerCase();

    // Daily commute / city driver focus
    if (
      promptLower.includes('daily') ||
      promptLower.includes('commute') ||
      promptLower.includes('cairo') ||
      promptLower.includes('fuel') ||
      promptLower.includes('traffic')
    ) {
      // Compare fuel economy
      const bestFuelCar = [...cars].sort((a, b) => a.fuelEconomyL100km - b.fuelEconomyL100km)[0];
      return {
        title: 'AutoVersus AI Verdict',
        winnerCarId: bestFuelCar.id,
        summary: `Based on your personalized prompt ("${customPrompt.trim()}"), the ${bestFuelCar.brandName} ${bestFuelCar.modelName} wins for daily Cairo commute efficiency (${bestFuelCar.fuelEconomyL100km} L/100km) with a softer ride and lower running cost.`,
        promptApplied: customPrompt.trim(),
      };
    }

    // Speed / power / performance focus
    if (
      promptLower.includes('power') ||
      promptLower.includes('speed') ||
      promptLower.includes('fast') ||
      promptLower.includes('acceleration') ||
      promptLower.includes('hp')
    ) {
      const bestPowerCar = [...cars].sort((a, b) => b.horsepower - a.horsepower)[0];
      return {
        title: 'AutoVersus AI Verdict',
        winnerCarId: bestPowerCar.id,
        summary: `Based on your performance request ("${customPrompt.trim()}"), the ${bestPowerCar.brandName} ${bestPowerCar.modelName} takes victory delivering ${bestPowerCar.horsepower} HP and 0-100 in ${bestPowerCar.zeroToHundredSec}s.`,
        promptApplied: customPrompt.trim(),
      };
    }

    // Price / Budget focus
    if (
      promptLower.includes('price') ||
      promptLower.includes('budget') ||
      promptLower.includes('cheap') ||
      promptLower.includes('value') ||
      promptLower.includes('cost')
    ) {
      const bestPriceCar = [...cars].sort((a, b) => a.startingPriceEGP - b.startingPriceEGP)[0];
      return {
        title: 'AutoVersus AI Verdict',
        winnerCarId: bestPriceCar.id,
        summary: `Based on your budget preference ("${customPrompt.trim()}"), the ${bestPriceCar.brandName} ${bestPriceCar.modelName} offers superior value at EGP ${bestPriceCar.startingPriceEGP.toLocaleString()}.`,
        promptApplied: customPrompt.trim(),
      };
    }

    // Generic personalized fallback
    return {
      title: 'AutoVersus AI Verdict',
      winnerCarId: carA.id,
      summary: `Filtered for your priority ("${customPrompt.trim()}"): ${carA.brandName} ${carA.modelName} leads on comfort & fuel economy (${carA.fuelEconomyL100km} L/100km), while ${carB.brandName} ${carB.modelName} offers +${Math.abs(carB.horsepower - carA.horsepower)} HP extra response.`,
      promptApplied: customPrompt.trim(),
    };
  }

  // Default Cairo Commute benchmark (Toyota Corolla vs Hyundai Elantra vs 3rd car)
  if (carC) {
    return {
      title: 'AutoVersus AI Verdict (3-Way Battle)',
      winnerCarId: carA.id,
      summary: `In this 3-way battle, the ${carA.brandName} ${carA.modelName} leads on daily Cairo commute efficiency (${carA.fuelEconomyL100km} L/100km), ${carB.brandName} ${carB.modelName} offers +${carB.horsepower - carA.horsepower} HP, and ${carC.brandName} ${carC.modelName} brings maximum power (${carC.horsepower} HP).`,
    };
  }

  const hpDiff = carB.horsepower - carA.horsepower;
  const hpString = hpDiff > 0 ? `${hpDiff} extra horsepower` : `${Math.abs(hpDiff)} horsepower`;

  return {
    title: 'AutoVersus AI Verdict',
    winnerCarId: carA.id,
    summary: `The ${carA.modelName} wins on daily Cairo commute efficiency (${carA.fuelEconomyL100km} L/100km), while the ${carB.modelName} offers ${hpString} and a slightly larger wheelbase.`,
  };
}
