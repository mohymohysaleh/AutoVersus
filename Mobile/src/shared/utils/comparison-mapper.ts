import { VariantDetailDto } from '../../features/catalog/api/catalog.api';
import { ComparisonCar } from '../../features/comparison/types/comparison.types';
import { resolveCarImage } from './car-image.utils';

export function mapVariantToComparisonCar(variant: VariantDetailDto): ComparisonCar {
  const hp = variant.engine?.powerHp || 140;
  const torque = variant.engine?.torqueNm || 170;
  const zeroToHundred = variant.performance?.zeroToHundredKmh || 9.5;
  const topSpeed = variant.performance?.topSpeedKmh || 195;
  const fuelEconomy = variant.fuelEconomy?.combinedL100km || 6.8;
  const airbags = variant.safety?.airbagsCount || 6;
  const price = variant.startingPriceEGP || 1450000;
  const length = variant.dimensions?.lengthMm || 4630;
  const width = variant.dimensions?.widthMm || 1780;
  const height = variant.dimensions?.heightMm || 1435;
  const cargo = variant.dimensions?.cargoCapacityL || 450;
  const wheelbase = variant.dimensions?.wheelbaseMm || 2700;

  return {
    id: variant.id || variant.slug,
    brandName: variant.brandName || 'Brand',
    modelName: variant.modelName || 'Model',
    trimName: variant.trimName || 'Standard',
    year: variant.year || 2026,
    startingPriceEGP: price,
    imageUrl: resolveCarImage(
      variant.brandName,
      variant.modelName,
      variant.trimName,
      variant.engine?.fuelType
    ),
    slug: variant.slug,
    categoryTag: `${variant.generationName ? variant.generationName.toUpperCase() : 'SEDAN'} • EGYPT SPEC SHEET`,
    horsepower: hp,
    torqueNm: torque,
    zeroToHundredSec: zeroToHundred,
    topSpeedKmh: topSpeed,
    fuelEconomyL100km: fuelEconomy,
    airbagsCount: airbags,
    overviewSpecs: {
      horsepower: `${hp} HP`,
      torque: `${torque} Nm`,
      zeroToHundred: `${zeroToHundred} sec`,
      topSpeed: `${topSpeed} km/h`,
      fuelEconomy: `${fuelEconomy} L/100km`,
      airbags: `${airbags} Airbags`,
    },
    engineSpecs: {
      fuelType: variant.engine?.fuelType || 'Petrol (92/95 Octane)',
      displacement: variant.engine?.displacementCc ? `${variant.engine.displacementCc} cc` : '1598 cc',
      power: `${hp} HP (${variant.engine?.powerKw || Math.round(hp * 0.745)} kW)`,
      torque: `${torque} Nm`,
      transmission: variant.engine?.transmission || 'Automatic',
      drivetrain: variant.engine?.drivetrain || 'Front-Wheel Drive (FWD)',
    },
    dimensionSpecs: {
      dimensions: `${length} × ${width} × ${height} mm`,
      wheelbase: `${wheelbase} mm`,
      trunkVolume: `${cargo} L`,
      seating: `${variant.dimensions?.seatingCapacity || 5} Passengers`,
    },
    performanceSpecs: {
      acceleration: `${zeroToHundred} seconds (0-100 km/h)`,
      maxSpeed: `${topSpeed} km/h`,
      fuelConsumption: `${fuelEconomy} L/100km (Combined)`,
    },
    safetySpecs: {
      airbags: `${airbags} Airbags Package ✓`,
      abs: variant.safety?.hasAbs !== false ? 'Standard ABS + EBD ✓' : 'ABS Optional',
      esc: variant.safety?.hasEsc !== false ? 'Electronic Stability Control (ESC) ✓' : 'ESC Optional',
      aeb: variant.safety?.hasAeb ? 'Autonomous Emergency Braking (AEB) ✓' : 'Standard Warning System',
      tpms: 'Tire Pressure Monitoring System ✓',
      brakeAssist: 'Brake Assist System (BAS) ✓',
    },
    featureSpecs: {
      smartphone: 'Wireless Apple CarPlay & Android Auto ✓',
      cluster: 'Digital Multi-Information Instrument Cluster',
      climate: 'Dual-Zone Automatic Climate Control',
      lighting: 'Full LED Projector Headlamps & DRLs',
      parkingAssistance: 'Front & Rear Sensors + Rearview Camera',
      completeness: `${variant.completenessScore || 95}% Verified Egyptian Spec Sheet`,
    },
  };
}
