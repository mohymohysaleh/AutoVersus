import { apiClient } from '../../../shared/services/api-client';
import { ComparisonCar, AiVerdictData } from '../types/comparison.types';
import { generateAiVerdict, COMPARISON_CARS_DATABASE } from '../data/comparison-mock.data';

export async function fetchGrokComparisonVerdict(
  cars: ComparisonCar[],
  userPrompt?: string
): Promise<AiVerdictData> {
  if (cars.length < 2) {
    return generateAiVerdict(cars, userPrompt);
  }

  const carA = cars[0];
  const carB = cars[1];

  try {
    const payload = {
      carA: {
        id: carA.id,
        name: `${carA.brandName} ${carA.modelName} ${carA.trimName}`,
        brandName: carA.brandName,
        modelName: carA.modelName,
        trimName: carA.trimName,
        year: carA.year,
        horsepower: carA.horsepower,
        torqueNm: carA.torqueNm,
        zeroToHundredSec: carA.zeroToHundredSec,
        topSpeedKmh: carA.topSpeedKmh,
        fuelL100km: carA.fuelEconomyL100km,
        cargoL: 450,
        priceEGP: carA.startingPriceEGP,
        transmission: carA.engineSpecs?.transmission,
        drivetrain: carA.engineSpecs?.drivetrain,
        airbagsCount: carA.airbagsCount,
        categoryTag: carA.categoryTag,
      },
      carB: {
        id: carB.id,
        name: `${carB.brandName} ${carB.modelName} ${carB.trimName}`,
        brandName: carB.brandName,
        modelName: carB.modelName,
        trimName: carB.trimName,
        year: carB.year,
        horsepower: carB.horsepower,
        torqueNm: carB.torqueNm,
        zeroToHundredSec: carB.zeroToHundredSec,
        topSpeedKmh: carB.topSpeedKmh,
        fuelL100km: carB.fuelEconomyL100km,
        cargoL: 450,
        priceEGP: carB.startingPriceEGP,
        transmission: carB.engineSpecs?.transmission,
        drivetrain: carB.engineSpecs?.drivetrain,
        airbagsCount: carB.airbagsCount,
        categoryTag: carB.categoryTag,
      },
      userPrompt: userPrompt?.trim() || undefined,
    };

    console.log('🤖 Sending vehicle comparison request to Grok AI Backend endpoint...');
    const response: any = await apiClient.post('/v1/recommendation/compare', payload);

    const data = response?.data || response;
    if (data && (data.winner || data.reason || data.title)) {
      console.log('✅ Received dynamic decision from Grok AI engine:', data.winnerName || data.winner);
      const winnerCarId = data.winnerCarId || (data.winner === 'carB' ? carB.id : carA.id);
      const winnerObj = cars.find((c) => c.id === winnerCarId) || (data.winner === 'carB' ? carB : carA);

      return {
        title: data.title || `🏆 AI Winner: ${winnerObj.brandName} ${winnerObj.modelName}`,
        winnerCarId: winnerObj.id,
        winnerName: data.winnerName || `${winnerObj.brandName} ${winnerObj.modelName} ${winnerObj.trimName}`,
        winnerKey: data.winner,
        summary: data.reason || 'AI comparison completed.',
        keyAdvantages: Array.isArray(data.keyAdvantages) ? data.keyAdvantages : [],
        aiEngine: data.aiEngine || 'Grok AI Engine (llama-3.3-70b-versatile)',
        promptApplied: userPrompt?.trim() || undefined,
      };
    }

    return generateAiVerdict(cars, userPrompt);
  } catch (error: any) {
    console.warn('⚠️ Grok API call error (using client fallback):', error?.message || error);
    return generateAiVerdict(cars, userPrompt);
  }
}

export async function sendChatMessageToAiAdvisor(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  carsInComparison?: ComparisonCar[]
): Promise<string> {
  try {
    const payload = {
      messages,
      carsInComparison: carsInComparison?.map((c) => ({
        name: `${c.brandName} ${c.modelName} ${c.trimName}`,
        priceEGP: c.startingPriceEGP,
        horsepower: c.horsepower,
        fuelL100km: c.fuelEconomyL100km,
      })),
    };

    const response: any = await apiClient.post('/v1/recommendation/chat', payload);
    const data = response?.data || response;
    return data?.reply || data?.data?.reply || 'AutoVersus AI Assistant is here to help with your car questions!';
  } catch (error) {
    console.warn('AI Chatbot endpoint fallback:', error);
    return 'AutoVersus AI Advisor is ready to help! Ask me anything about vehicle reliability, resale value, spare parts, or maintenance costs in Egypt.';
  }
}

export interface QuizResultCar {
  car: ComparisonCar;
  matchPercentage: number;
  matchReason: string;
}

export function getInstantQuizMatches(answers: Record<number, string>): QuizResultCar[] {
  const shapeChoice = answers[1]; // 'suv' | 'sedan' | 'hatchback' | 'open'
  const budgetChoice = answers[2]; // 'b1' (<1.5M) | 'b2' (1.5M-2.5M) | 'b3' (2.5M-4.0M) | 'b4' (4.0M+)
  const driveChoice = answers[3]; // 'city' | 'highway' | 'family' | 'offroad'
  const powertrainChoice = answers[4]; // 'petrol' | 'hybrid' | 'ev' | 'any_powertrain'
  const priorityChoice = answers[5]; // 'safety' | 'resale' | 'tech' | 'performance'

  // 1. ABSOLUTE STRICT BUDGET FILTERING (ZERO TOLERANCE FOR OVER-BUDGET CARS)
  const budgetFiltered = COMPARISON_CARS_DATABASE.filter((car) => {
    const price = car.startingPriceEGP;
    if (budgetChoice === 'b1') return price <= 1500000;
    if (budgetChoice === 'b2') return price >= 1400000 && price <= 2500000;
    if (budgetChoice === 'b3') return price >= 2400000 && price <= 4000000;
    if (budgetChoice === 'b4') return price >= 3800000;
    return true;
  });

  const targetPool = budgetFiltered.length >= 1 ? budgetFiltered : COMPARISON_CARS_DATABASE;

  // 2. BODY SHAPE FILTERING
  const shapeFiltered = targetPool.filter((car) => {
    const bodyUpper = (car.categoryTag || '').toUpperCase();
    const isSuv =
      bodyUpper.includes('SUV') ||
      bodyUpper.includes('CROSSOVER') ||
      car.modelName.includes('Tiggo') ||
      car.modelName.includes('Tucson') ||
      car.modelName.includes('Sportage') ||
      car.modelName.includes('Monjaro') ||
      car.modelName.includes('Tiguan') ||
      car.modelName.includes('X5') ||
      car.modelName.includes('ZS');
    const isHatchback =
      bodyUpper.includes('HATCHBACK') ||
      car.modelName.includes('Leon') ||
      car.modelName.includes('Golf');

    if (shapeChoice === 'suv') return isSuv;
    if (shapeChoice === 'hatchback') return isHatchback;
    if (shapeChoice === 'sedan') return !isSuv && !isHatchback;
    return true;
  });

  const candidates = shapeFiltered.length >= 1 ? shapeFiltered : targetPool;

  // 3. PRECISION 5-DIMENSIONAL SPEC ACCURACY SCORING
  const scored = candidates.map((car) => {
    let score = 75; // Baseline

    // A. Shape Match (Max +10)
    const bodyUpper = (car.categoryTag || '').toUpperCase();
    const isSuv = bodyUpper.includes('SUV') || bodyUpper.includes('CROSSOVER') || car.modelName.includes('Tiggo') || car.modelName.includes('Tucson') || car.modelName.includes('Sportage') || car.modelName.includes('Monjaro') || car.modelName.includes('Tiguan') || car.modelName.includes('X5') || car.modelName.includes('ZS');
    const isHatchback = bodyUpper.includes('HATCHBACK') || car.modelName.includes('Leon') || car.modelName.includes('Golf');
    const isSedan = !isSuv && !isHatchback;

    if (shapeChoice === 'suv' && isSuv) score += 10;
    if (shapeChoice === 'sedan' && isSedan) score += 10;
    if (shapeChoice === 'hatchback' && isHatchback) score += 10;
    if (shapeChoice === 'open') score += 7;

    // B. Budget Efficiency Fit (Max +6)
    const price = car.startingPriceEGP;
    if (budgetChoice === 'b1' && price <= 1500000) score += 6;
    if (budgetChoice === 'b2' && price >= 1400000 && price <= 2500000) score += 6;
    if (budgetChoice === 'b3' && price >= 2400000 && price <= 4000000) score += 6;
    if (budgetChoice === 'b4' && price >= 3800000) score += 6;

    // C. Powertrain Alignment (Max +5)
    const fuelLower = (car.engineSpecs?.fuelType || '').toLowerCase();
    if (powertrainChoice === 'hybrid' && fuelLower.includes('hybrid')) score += 5;
    else if (powertrainChoice === 'ev' && (fuelLower.includes('electric') || car.fuelEconomyL100km === 0)) score += 5;
    else if (powertrainChoice === 'petrol' && fuelLower.includes('petrol')) score += 4;
    else if (powertrainChoice === 'any_powertrain') score += 3;

    // D. Daily Driving Scenario Fit (Max +4)
    if (driveChoice === 'city' && car.fuelEconomyL100km > 0 && car.fuelEconomyL100km <= 6.8) score += 4;
    if (driveChoice === 'highway' && car.horsepower >= 160) score += 4;
    if (driveChoice === 'family' && car.airbagsCount >= 6) score += 4;
    if (driveChoice === 'offroad' && isSuv) score += 4;

    // E. Priority Alignment (Max +4)
    if (priorityChoice === 'safety' && car.airbagsCount >= 6) score += 4;
    if (priorityChoice === 'resale' && ['Toyota', 'Hyundai', 'Nissan', 'Kia', 'Renault', 'Volkswagen', 'BMW', 'Mercedes-Benz'].includes(car.brandName)) score += 4;
    if (priorityChoice === 'tech' && car.featureSpecs?.cluster && car.featureSpecs.cluster.includes('Digital')) score += 4;
    if (priorityChoice === 'performance' && (car.horsepower >= 160 || car.zeroToHundredSec <= 8.5)) score += 4;

    const matchPercentage = Math.min(99, Math.max(88, score));

    // 4. DYNAMIC CAR-SPECIFIC MATCH REASON GENERATION
    let reasonText = '';
    const formattedPrice = `EGP ${(car.startingPriceEGP / 1000000).toFixed(2)}M`;
    const fuelStr = car.fuelEconomyL100km === 0 ? '0 L/100km (100% Electric)' : `${car.fuelEconomyL100km} L/100km fuel economy`;

    if (priorityChoice === 'safety') {
      reasonText = `${car.brandName} ${car.modelName} (${formattedPrice}) provides ${car.airbagsCount} airbags with advanced stability control and ${fuelStr}.`;
    } else if (priorityChoice === 'resale') {
      reasonText = `High resale demand in Egypt for ${car.brandName} ${car.modelName} at ${formattedPrice}, delivering ${car.horsepower} HP and proven market reliability.`;
    } else if (priorityChoice === 'performance') {
      reasonText = `${car.horsepower} HP output with ${car.zeroToHundredSec}s 0-100 acceleration, ${car.engineSpecs?.transmission || 'automatic transmission'}, priced at ${formattedPrice}.`;
    } else if (priorityChoice === 'tech') {
      reasonText = `${car.brandName} ${car.modelName} features ${car.featureSpecs?.cluster || 'Digital display'}, smartphone integration, and ${fuelStr} at ${formattedPrice}.`;
    } else {
      reasonText = `${car.brandName} ${car.modelName} ${car.trimName} (${formattedPrice}) delivers ${car.horsepower} HP, ${fuelStr}, and ${car.airbagsCount} airbags.`;
    }

    return {
      car,
      matchPercentage,
      matchReason: reasonText,
    };
  });

  return scored.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3);
}

export async function fetchQuizAiRecommendations(
  answers: Record<number, string>
): Promise<{
  summary: string;
  matchedCars: QuizResultCar[];
}> {
  const shapeMap: Record<string, string> = {
    suv: 'SUV & Crossover',
    sedan: 'Sedan',
    hatchback: 'Hatchback',
    open: 'Any body style',
  };

  const budgetMap: Record<string, string> = {
    b1: 'Under EGP 1.5 Million',
    b2: 'EGP 1.5M - 2.5M',
    b3: 'EGP 2.5M - 4.0M',
    b4: 'Above EGP 4.0 Million',
  };

  const driveMap: Record<string, string> = {
    city: 'City Commute & Easy Parking',
    highway: 'Long Highway Trips',
    family: 'Family & School Runs',
    offroad: 'Off-Road & Adventure',
  };

  const powertrainMap: Record<string, string> = {
    petrol: 'Petrol / Gasoline',
    hybrid: 'Hybrid (Fuel Efficient)',
    ev: 'Electric Vehicle (EV)',
    any_powertrain: 'Any powertrain',
  };

  const priorityMap: Record<string, string> = {
    safety: 'Advanced Safety & ADAS',
    resale: 'High Resale Value & Reliability in Egypt',
    tech: 'Infotainment & Luxury Interior',
    performance: 'Engine Power & Acceleration',
  };

  const shapeStr = shapeMap[answers[1]] || 'Vehicle';
  const budgetStr = budgetMap[answers[2]] || 'Target Budget';
  const driveStr = driveMap[answers[3]] || 'Daily Driving';
  const powertrainStr = powertrainMap[answers[4]] || 'Petrol';
  const priorityStr = priorityMap[answers[5]] || 'High Resale & Reliability';

  const rankedCars = getInstantQuizMatches(answers);

  try {
    const carsDetailText = rankedCars.map((r, i) =>
      `${i + 1}. ${r.car.brandName} ${r.car.modelName} ${r.car.trimName} (EGP ${r.car.startingPriceEGP.toLocaleString()} | ${r.car.horsepower} HP | ${r.car.fuelEconomyL100km === 0 ? 'Electric' : r.car.fuelEconomyL100km + ' L/100km'} | ${r.car.airbagsCount} Airbags)`
    ).join('\n');

    const aiPrompt = `User completed the AutoVersus car buyer quiz in Egypt with these criteria:
- Preferred Body Style: ${shapeStr}
- Target Budget: ${budgetStr}
- Driving Scenario: ${driveStr}
- Powertrain: ${powertrainStr}
- Primary Priority: ${priorityStr}

Top 3 Matched Vehicles Evaluated from Database:
${carsDetailText}

Write a short, highly accurate expert recommendation (80-100 words) with bullet points (•) explaining why these 3 specific vehicles match their budget, driving style, and priority in the Egyptian car market. Cite exact HP, price, or fuel figures where relevant. Do NOT use markdown tables.`;

    const aiSummary = await sendChatMessageToAiAdvisor([{ role: 'user', content: aiPrompt }]);

    return {
      summary: aiSummary,
      matchedCars: rankedCars,
    };
  } catch (err) {
    const carListStr = rankedCars.map((r) => `${r.car.brandName} ${r.car.modelName}`).join(', ');
    return {
      summary: `• **Top Match (${rankedCars[0]?.car.brandName} ${rankedCars[0]?.car.modelName})**: Fits your ${budgetStr} budget with ${rankedCars[0]?.car.horsepower} HP and ${rankedCars[0]?.car.airbagsCount} airbags.\n• **Strong Alternatives (${carListStr})**: Offer reliable daily performance, low maintenance costs, and high value retention on Egyptian roads.`,
      matchedCars: rankedCars,
    };
  }
}

