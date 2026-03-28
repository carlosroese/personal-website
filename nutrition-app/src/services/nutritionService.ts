import Constants from 'expo-constants';
import { NutritionResult } from '../types';

const API_KEY = Constants.expoConfig?.extra?.ANTHROPIC_API_KEY ?? '';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const NUTRITION_SYSTEM_PROMPT = `Você é um especialista em nutrição. Sua tarefa é analisar alimentos e retornar valores nutricionais precisos.

Sempre responda APENAS com um objeto JSON válido, sem texto adicional, sem markdown, sem blocos de código.

O formato da resposta deve ser exatamente:
{
  "foods": [
    {
      "name": "nome do alimento",
      "weight": 100,
      "carbs": 25.5,
      "protein": 8.2,
      "fat": 3.1,
      "calories": 163
    }
  ],
  "total": {
    "carbs": 25.5,
    "protein": 8.2,
    "fat": 3.1,
    "calories": 163
  }
}

Use valores nutricionais baseados em tabelas nutricionais reconhecidas (TACO, USDA).
Arredonde os valores para 1 casa decimal.
Calorias devem ser números inteiros.`;

const IMAGE_NUTRITION_SYSTEM_PROMPT = `Você é um especialista em nutrição com capacidade de identificar alimentos por imagem e estimar porções.

Analise a imagem e identifique todos os alimentos visíveis. Estime o peso de cada alimento em gramas baseado no contexto visual (tamanho do prato, utensílios, proporções).

Responda APENAS com um objeto JSON válido, sem texto adicional, sem markdown, sem blocos de código.

O formato da resposta deve ser exatamente:
{
  "foods": [
    {
      "name": "nome do alimento identificado",
      "weight": 150,
      "carbs": 25.5,
      "protein": 8.2,
      "fat": 3.1,
      "calories": 163
    }
  ],
  "total": {
    "carbs": 25.5,
    "protein": 8.2,
    "fat": 3.1,
    "calories": 163
  },
  "imageAnalysis": true,
  "estimatedWeights": true
}

Use valores nutricionais baseados em tabelas nutricionais reconhecidas (TACO, USDA).
Arredonde os valores para 1 casa decimal.
Calorias devem ser números inteiros.`;

async function callAnthropicAPI(
  messages: Array<{ role: string; content: unknown }>,
  systemPrompt: string
): Promise<string> {
  if (!API_KEY) {
    throw new Error('API_KEY_MISSING');
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error?.message ?? `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

function parseNutritionJSON(text: string): NutritionResult {
  const cleaned = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  const parsed = JSON.parse(cleaned);

  if (!parsed.foods || !parsed.total) {
    throw new Error('Formato de resposta inválido');
  }

  return parsed as NutritionResult;
}

export async function analyzeTextFood(userMessage: string): Promise<NutritionResult> {
  const messages = [
    {
      role: 'user',
      content: `Analise os seguintes alimentos e forneça os valores nutricionais:\n\n${userMessage}`,
    },
  ];

  const responseText = await callAnthropicAPI(messages, NUTRITION_SYSTEM_PROMPT);
  return parseNutritionJSON(responseText);
}

export async function analyzeImageFood(base64Image: string, mimeType: string): Promise<NutritionResult> {
  const messages = [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mimeType,
            data: base64Image,
          },
        },
        {
          type: 'text',
          text: 'Identifique todos os alimentos nesta imagem, estime os pesos e forneça os valores nutricionais.',
        },
      ],
    },
  ];

  const responseText = await callAnthropicAPI(messages, IMAGE_NUTRITION_SYSTEM_PROMPT);
  return parseNutritionJSON(responseText);
}

export function formatNutritionMessage(result: NutritionResult): string {
  const lines: string[] = [];

  if (result.imageAnalysis) {
    lines.push('📸 *Alimentos identificados na imagem:*');
  }

  result.foods.forEach((food) => {
    lines.push(`\n*${food.name}* ${result.estimatedWeights ? '(peso estimado)' : ''} — ${food.weight}g`);
    lines.push(`  • Carboidratos: ${food.carbs}g`);
    lines.push(`  • Proteínas: ${food.protein}g`);
    lines.push(`  • Gorduras: ${food.fat}g`);
    lines.push(`  • Calorias: ${food.calories} kcal`);
  });

  if (result.foods.length > 1) {
    lines.push('\n─────────────────');
    lines.push('*Total*');
    lines.push(`  • Carboidratos: ${result.total.carbs}g`);
    lines.push(`  • Proteínas: ${result.total.protein}g`);
    lines.push(`  • Gorduras: ${result.total.fat}g`);
    lines.push(`  • Calorias: ${result.total.calories} kcal`);
  }

  return lines.join('\n');
}
