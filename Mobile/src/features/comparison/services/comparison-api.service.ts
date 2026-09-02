import { apiClient } from '../../../shared/services/api-client';
import { ComparisonCar, AiVerdictData } from '../types/comparison.types';
import { generateAiVerdict } from '../data/comparison-mock.data';

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

    // apiClient base URL is /api, endpoint is /v1/recommendation/compare
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
