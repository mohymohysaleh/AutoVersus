import Groq from "groq-sdk";

export interface VehicleSpecPayload {
    id?: string;
    name: string;
    brandName?: string;
    modelName?: string;
    trimName?: string;
    year?: number;
    horsepower: number;
    torqueNm?: number;
    zeroToHundredSec?: number;
    topSpeedKmh?: number;
    fuelL100km: number;
    cargoL: number;
    priceEGP: number;
    transmission?: string;
    drivetrain?: string;
    airbagsCount?: number;
    categoryTag?: string;
    bodyType?: string;
}

export interface ComparisonPayload {
    carA: VehicleSpecPayload;
    carB: VehicleSpecPayload;
    userCity?: string;
    lang?: "en" | "ar";
    userPrompt?: string;
}

export interface ComparisonInsightResult {
    winner: "carA" | "carB" | "tie";
    winnerName: string;
    winnerCarId?: string;
    reason: string;
    keyAdvantages?: string[];
    aiEngine?: string;
    title: string;
}

export interface ChatMessagePayload {
    role: "user" | "assistant" | "system";
    content: string;
}

export interface ChatAdvisorPayload {
    messages: ChatMessagePayload[];
    carsInComparison?: { name: string; priceEGP: number; horsepower: number; fuelL100km: number }[];
}

function getGroqClient(): Groq {
    const apiKey = process.env.GROK_API_KEY || process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROK_API_KEY / GROQ_API_KEY is not configured in environment variables.");
    }
    return new Groq({ apiKey });
}

export async function chatWithAiAdvisor(data: ChatAdvisorPayload): Promise<string> {
    const candidateModels = [
        "openai/gpt-oss-120b",
        "qwen/qwen3.8-27b",
        "openai/gpt-oss-20b",
        "groq/compound",
    ];

    const carContextText = data.carsInComparison && data.carsInComparison.length > 0
        ? `\nVehicles Currently Selected by User:\n` + data.carsInComparison.map(c => `- ${c.name} (EGP ${c.priceEGP.toLocaleString()}, ${c.horsepower} HP, ${c.fuelL100km} L/100km)`).join('\n')
        : '';

    const systemPrompt = `You are AutoVersus AI Assistant — an expert, friendly automotive advisor for Egyptian car buyers.
You can answer any car-related question: vehicle reliability, resale value in Egypt, spare parts availability, maintenance costs, performance, fuel consumption, market comparisons, or daily driving advice.
${carContextText}

Formatting Rules (CRITICAL FOR MOBILE READABILITY):
1. DO NOT use markdown tables or ascii grid tables (e.g. | col 1 | col 2 |). Tables look squished and unreadable on mobile screens.
2. Structure your response using clean, spaced bullet points (•) and clear bold section titles with emojis (e.g. 🎯 **Your Criteria**, 🚗 **Top Recommendations**, 💡 **Expert Advice**).
3. Present each car as a distinct bullet item with line breaks between specs:
   • **Car Name (Year)**: Price | Engine CC | HP
     - Key Strengths: ...
     - Maintenance & Parts: ...
4. Keep paragraphs short and add double line breaks between sections for high contrast and effortless reading on mobile phones.`;

    const formattedMessages = [
        { role: "system", content: systemPrompt },
        ...data.messages.map(m => ({ role: m.role, content: m.content }))
    ];

    const groq = getGroqClient();

    for (const modelName of candidateModels) {
        try {
            const response = await groq.chat.completions.create({
                model: modelName,
                messages: formattedMessages as any,
                temperature: 0.3,
                max_tokens: 1500,
            });

            return response.choices[0]?.message?.content?.trim() || "I am glad to help with your car questions!";
        } catch (err: any) {
            console.warn(`Chat model ${modelName} failed, trying next:`, err?.message || err);
        }
    }

    return "AutoVersus AI Advisor is temporarily operating with limited connectivity. Please feel free to ask again!";
}

export async function generateComparisonInsight(data: ComparisonPayload): Promise<ComparisonInsightResult> {
    const isArabic = data.lang === "ar";
    const promptText = data.userPrompt?.trim() || "";

    const systemPrompt = `You are AutoVersus Grok AI — an expert, unbiased automotive intelligence engine evaluating cars for buyers.

Your Role:
Compare Car A and Car B based on technical specs, market positioning, and user preference prompt.

Rules for Evaluation:
1. If the user provides a custom prompt (e.g., "I want a car that's better looking", "I want speed and acceleration", "I want maximum fuel efficiency", "family road trips", "luxury feel"):
   - You MUST evaluate the two vehicles STRICTLY against that user criteria.
   - For example: If prompt is "better looking", evaluate design language, body styling (e.g. sporty fastback vs standard sedan vs SUV), modern lines, and aesthetic appeal (e.g. MG 7 fastback vs traditional sedan, or modern SUV over older design).
2. If NO custom prompt is provided, perform an overall expert assessment balancing power, fuel economy, space, features, and value.
3. Output ONLY a valid JSON object matching this schema (no markdown blocks, no prefix):
{
  "winner": "carA" | "carB",
  "winnerName": "<Name of Winning Car>",
  "title": "🏆 AI Winner: <Winning Car Name>",
  "reason": "<Detailed 2-3 sentence verdict explaining why this car is better>",
  "keyAdvantages": [
    "<Advantage 1 explaining specific metric or prompt reason>",
    "<Advantage 2 explaining specific metric or prompt reason>",
    "<Advantage 3 explaining specific metric or prompt reason>"
  ],
  "aiEngine": "Grok AI (llama-3.3-70b-versatile)"
}`;

    const userPromptContent = `Vehicles to Compare:

Car A:
- Name: ${data.carA.name}
- Category: ${data.carA.categoryTag || data.carA.bodyType || 'Sedan/SUV'}
- Price: EGP ${data.carA.priceEGP.toLocaleString()}
- Performance: ${data.carA.horsepower} HP | ${data.carA.torqueNm || 'N/A'} Nm Torque | 0-100: ${data.carA.zeroToHundredSec || 'N/A'}s | Max Speed: ${data.carA.topSpeedKmh || 'N/A'} km/h
- Efficiency & Cargo: ${data.carA.fuelL100km} L/100km | Trunk: ${data.carA.cargoL} L
- Drivetrain & Safety: ${data.carA.transmission || 'Automatic'} | ${data.carA.drivetrain || 'FWD'} | Airbags: ${data.carA.airbagsCount || 6}

Car B:
- Name: ${data.carB.name}
- Category: ${data.carB.categoryTag || data.carB.bodyType || 'Sedan/SUV'}
- Price: EGP ${data.carB.priceEGP.toLocaleString()}
- Performance: ${data.carB.horsepower} HP | ${data.carB.torqueNm || 'N/A'} Nm Torque | 0-100: ${data.carB.zeroToHundredSec || 'N/A'}s | Max Speed: ${data.carB.topSpeedKmh || 'N/A'} km/h
- Efficiency & Cargo: ${data.carB.fuelL100km} L/100km | Trunk: ${data.carB.cargoL} L
- Drivetrain & Safety: ${data.carB.transmission || 'Automatic'} | ${data.carB.drivetrain || 'FWD'} | Airbags: ${data.carB.airbagsCount || 6}

${promptText ? `User Specific Priority Request: "${promptText}"` : 'User Request: Synthesize an overall expert verdict evaluating performance, efficiency, design, and daily value.'}`;

    const candidateModels = [
        "openai/gpt-oss-120b",
        "qwen/qwen3.8-27b",
        "openai/gpt-oss-20b",
        "groq/compound",
    ];

    const groq = getGroqClient();

    try {
        for (const modelName of candidateModels) {
            try {
                const response = await groq.chat.completions.create({
                    model: modelName,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPromptContent },
                    ],
                    temperature: 0.1,
                    max_tokens: 700,
                });

                const rawContent = response.choices[0]?.message?.content?.trim() || "";

                // Strip markdown backticks if returned by model
                const cleanedContent = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

                const parsed = JSON.parse(cleanedContent);
                const winnerKey = parsed.winner === "carB" ? "carB" : "carA";
                const winnerObj = winnerKey === "carB" ? data.carB : data.carA;
                const loserObj = winnerKey === "carB" ? data.carA : data.carB;

                return {
                    winner: winnerKey,
                    winnerName: parsed.winnerName || winnerObj.name,
                    winnerCarId: winnerObj.id,
                    reason: parsed.reason || rawContent,
                    keyAdvantages: Array.isArray(parsed.keyAdvantages) && parsed.keyAdvantages.length > 0
                        ? parsed.keyAdvantages
                        : [
                            `${winnerObj.name} offers superior spec balance for your driving needs.`,
                            `Outperforms ${loserObj.name} on key efficiency and driver priorities.`
                        ],
                    aiEngine: `Grok AI (${modelName})`,
                    title: parsed.title || `🏆 AI Winner: ${parsed.winnerName || winnerObj.name}`,
                };
            } catch (modelErr: any) {
                console.warn(`Grok model ${modelName} failed, trying next candidate:`, modelErr?.message || modelErr);
            }
        }
    } catch (error) {
        console.warn("Grok AI parsing/request fallback:", error);
    }

    // Heuristic fallback if API key fails or response parsing issue occurs
    const isBWinner = data.userPrompt?.toLowerCase().includes("power") || data.userPrompt?.toLowerCase().includes("speed") || data.userPrompt?.toLowerCase().includes("look") || data.userPrompt?.toLowerCase().includes("design")
        ? data.carB.horsepower > data.carA.horsepower
        : data.carA.fuelL100km <= data.carB.fuelL100km;

    const winnerObj = isBWinner ? data.carB : data.carA;
    const loserObj = isBWinner ? data.carA : data.carB;

    return {
        winner: isBWinner ? "carB" : "carA",
        winnerName: winnerObj.name,
        winnerCarId: winnerObj.id,
        reason: `${winnerObj.name} takes the lead for your requested priority, outperforming ${loserObj.name} in spec efficiency (${winnerObj.fuelL100km} L/100km vs ${loserObj.fuelL100km} L/100km) and market value.`,
        keyAdvantages: [
            `Higher spec score for your custom prompt criteria.`,
            `Better power-to-efficiency ratio for Egyptian driving conditions.`
        ],
        aiEngine: "Grok AI Fallback Engine",
        title: `🏆 AI Winner: ${winnerObj.name}`,
    };
}
