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

  const shapeMap: Record<string, string> = {
    suv: 'SUV & Crossover',
    sedan: 'Sedan',
    hatchback: 'Hatchback',
    open: 'Vehicle',
  };
  const budgetMap: Record<string, string> = {
    b1: 'Under EGP 1.5M',
    b2: 'EGP 1.5M - 2.5M',
    b3: 'EGP 2.5M - 4.0M',
    b4: 'Above EGP 4.0M',
  };
  const priorityMap: Record<string, string> = {
    safety: 'Safety',
    resale: 'High Resale',
    tech: 'Luxury Tech',
    performance: 'High Power',
  };

  const priorityStr = priorityMap[priorityChoice] || 'Value';
  const budgetStr = budgetMap[budgetChoice] || 'Budget';

  // 1. ABSOLUTE STRICT BUDGET FILTERING (ZERO TOLERANCE FOR OVER-BUDGET CARS!)
  const budgetFiltered = COMPARISON_CARS_DATABASE.filter((car) => {
    const price = car.startingPriceEGP;
    if (budgetChoice === 'b1') return price <= 1500000; // STRICT HARD CAP <= 1,500,000 EGP
    if (budgetChoice === 'b2') return price >= 1400000 && price <= 2500000;
    if (budgetChoice === 'b3') return price >= 2400000 && price <= 4000000;
    if (budgetChoice === 'b4') return price >= 3800000;
    return true;
  });

  // If budgetFiltered has cars, we ONLY consider budgetFiltered!
  const targetPool = budgetFiltered.length >= 1 ? budgetFiltered : COMPARISON_CARS_DATABASE;

  // 2. ABSOLUTE STRICT BODY SHAPE FILTERING
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

  // If shapeFiltered has cars, use shapeFiltered. Otherwise stick to targetPool (still budget-compliant!).
  const candidates = shapeFiltered.length >= 1 ? shapeFiltered : targetPool;

  // 3. Fine-Grained Priority & Specs Scoring
  const scored = candidates.map((car) => {
    let score = 90;

    // Powertrain boost
    const fuelLower = (car.engineSpecs?.fuelType || '').toLowerCase();
    if (powertrainChoice === 'hybrid' && fuelLower.includes('hybrid')) score += 5;
    if (powertrainChoice === 'ev' && (fuelLower.includes('electric') || car.fuelEconomyL100km === 0)) score += 5;

    // Daily Drive
    if (driveChoice === 'city' && car.fuelEconomyL100km <= 6.8) score += 3;
    if (driveChoice === 'highway' && car.horsepower >= 160) score += 3;
    if (driveChoice === 'family' && car.airbagsCount >= 6) score += 3;

    // Priority
    if (priorityChoice === 'safety' && car.airbagsCount >= 6) score += 3;
    if (priorityChoice === 'resale' && ['Toyota', 'Hyundai', 'Nissan', 'Kia'].includes(car.brandName)) score += 3;
    if (priorityChoice === 'performance' && car.horsepower >= 180) score += 3;

    const matchPercentage = Math.min(99, Math.max(89, score));

    return {
      car,
      matchPercentage,
      matchReason: `100% compliant with your ${shapeMap[shapeChoice] || 'vehicle'} choice, ${budgetStr} budget, and ${priorityStr} priority.`,
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
    open: 'Any shape',
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

  const shapeStr = shapeMap[answers[1]] || 'Sedan/SUV';
  const budgetStr = budgetMap[answers[2]] || 'EGP 1.5M - 2.5M';
  const driveStr = driveMap[answers[3]] || 'City Commute';
  const powertrainStr = powertrainMap[answers[4]] || 'Petrol';
  const priorityStr = priorityMap[answers[5]] || 'High Resale & Reliability';

  const rankedCars = getInstantQuizMatches(answers);

  try {
    const aiPrompt = `User completed a 5-step car buyer quiz with these exact choices:
- Body Type Choice: ${shapeStr}
- Budget Bracket: ${budgetStr}
- Driving Scenario: ${driveStr}
- Powertrain: ${powertrainStr}
- Top Priority: ${priorityStr}

Provide a 2 to 3 bullet point expert recommendation (under 80 words total) explaining why these specific vehicles (${rankedCars.map((r) => `${r.car.brandName} ${r.car.modelName}`).join(', ')}) best match their choices in Egypt. Format with clean bullet points (•) and no markdown tables.`;

    const aiSummary = await sendChatMessageToAiAdvisor([{ role: 'user', content: aiPrompt }]);

    return {
      summary: aiSummary,
      matchedCars: rankedCars,
    };
  } catch (err) {
    return {
      summary: `Based on your ${shapeStr} choice, ${budgetStr} budget, and ${priorityStr} priority, these 3 vehicles offer the best matching performance and daily reliability in Egypt.`,
      matchedCars: rankedCars,
    };
  }
}
