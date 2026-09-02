export type ComparisonScope = 'Full' | 'Overview' | 'Specs' | 'Safety' | 'Features';

export type MetricCategory = 'Overview' | 'Specs' | 'Safety' | 'Features';

export type WinnerDirection = 'higher' | 'lower' | 'boolean' | 'none';

export interface ComparisonCar {
  id: string;
  brandName: string;
  modelName: string;
  trimName: string;
  year: number;
  startingPriceEGP: number;
  imageUrl: string;
  slug: string;
  categoryTag?: string;

  // Key spec numbers for fast scoring
  horsepower: number;
  torqueNm: number;
  zeroToHundredSec: number;
  topSpeedKmh: number;
  fuelEconomyL100km: number;
  airbagsCount: number;

  // Categorized Specs (matches CarDetailsScreen tabs)
  overviewSpecs: {
    horsepower: string;
    torque: string;
    zeroToHundred: string;
    topSpeed: string;
    fuelEconomy: string;
    airbags: string;
  };
  engineSpecs: {
    fuelType: string;
    displacement: string;
    power: string;
    torque: string;
    transmission: string;
    drivetrain: string;
  };
  dimensionSpecs: {
    dimensions: string;
    wheelbase: string;
    trunkVolume: string;
    seating: string;
  };
  performanceSpecs: {
    acceleration: string;
    maxSpeed: string;
    fuelConsumption: string;
  };
  safetySpecs: {
    airbags: string;
    abs: string;
    esc: string;
    aeb: string;
    tpms: string;
    brakeAssist: string;
  };
  featureSpecs: {
    smartphone: string;
    cluster: string;
    climate: string;
    lighting: string;
    parkingAssistance: string;
    completeness: string;
  };
}

export interface MetricDefinition {
  id: string;
  label: string;
  category: MetricCategory;
  groupTitle?: string;
  direction: WinnerDirection;
  getRawValue?: (car: ComparisonCar) => number | boolean | null;
  getDisplayValue: (car: ComparisonCar) => string;
}

export interface AiVerdictData {
  title: string;
  winnerCarId: string;
  winnerName?: string;
  winnerKey?: 'carA' | 'carB' | 'tie';
  summary: string;
  keyAdvantages?: string[];
  aiEngine?: string;
  promptApplied?: string;
}

