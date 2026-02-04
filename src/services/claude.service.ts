import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

const anthropic = new Anthropic({
  apiKey: config.ANTHROPIC_API_KEY,
});

export interface BeerScanResult {
  identified: boolean;
  confidence: number;
  beer: {
    name: string;
    brewery: string;
    style: string;
    abv?: number;
    ibu?: number;
  } | null;
  iqScore: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  tastingNotes: string;
  flavorTags: string[];
  foodPairings: string[];
  tryNext: string[];
  rawResponse: object;
}

export interface MenuScanResult {
  beers: Array<{
    name: string;
    brewery?: string;
    style?: string;
    abv?: number;
    price?: number;
    description?: string;
  }>;
  venueType?: string;
  rawResponse: object;
}

const BEER_SCAN_PROMPT = `You are a beer expert AI. Analyze this beer image (label, can, bottle, or tap handle) and provide detailed information.

Return a JSON object with this exact structure:
{
  "identified": true/false,
  "confidence": 0.0-1.0,
  "beer": {
    "name": "Beer Name",
    "brewery": "Brewery Name",
    "style": "Beer Style (e.g., IPA, Stout, Lager)",
    "abv": 5.5,
    "ibu": 45
  },
  "iqScore": 0-100,
  "tier": "BRONZE|SILVER|GOLD|PLATINUM|DIAMOND",
  "tastingNotes": "Detailed tasting notes...",
  "flavorTags": ["hoppy", "citrus", "piney"],
  "foodPairings": ["grilled chicken", "spicy tacos"],
  "tryNext": ["Similar Beer 1", "Similar Beer 2", "Similar Beer 3"]
}

IQ Score guidelines:
- 90-100 (DIAMOND): Exceptional, world-class beer
- 80-89 (PLATINUM): Outstanding quality
- 70-79 (GOLD): Very good, recommended
- 60-69 (SILVER): Good, solid choice
- 0-59 (BRONZE): Average or below

If you cannot identify the beer, set identified to false and provide your best guess with lower confidence.`;

const MENU_SCAN_PROMPT = `You are a beer expert AI. Analyze this menu, tap list, or beer board image and extract all the beers listed.

Return a JSON object with this exact structure:
{
  "beers": [
    {
      "name": "Beer Name",
      "brewery": "Brewery Name (if visible)",
      "style": "Beer Style (if visible)",
      "abv": 5.5,
      "price": 7.50,
      "description": "Any description if provided"
    }
  ],
  "venueType": "bar|restaurant|brewery|bottle_shop|unknown"
}

Extract as many beers as you can identify. Include prices if visible.`;

const SHELF_SCAN_PROMPT = `You are a beer expert AI. Analyze this store shelf, cooler, or beer display image and identify all visible beers.

Return a JSON object with this exact structure:
{
  "beers": [
    {
      "name": "Beer Name",
      "brewery": "Brewery Name",
      "style": "Beer Style",
      "format": "can|bottle|pack",
      "packSize": "6-pack|12-pack|single|etc"
    }
  ],
  "storeType": "grocery|liquor_store|convenience|unknown"
}

Identify as many beers as clearly visible in the image.`;

export const claudeService = {
  async scanBeer(imageBase64: string, mediaType: string = 'image/jpeg'): Promise<BeerScanResult> {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: BEER_SCAN_PROMPT,
              },
            ],
          },
        ],
      });

      const textContent = response.content.find((c) => c.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text response from Claude');
      }

      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const result = JSON.parse(jsonMatch[0]);

      return {
        identified: result.identified ?? false,
        confidence: result.confidence ?? 0,
        beer: result.beer,
        iqScore: result.iqScore ?? 50,
        tier: result.tier ?? 'BRONZE',
        tastingNotes: result.tastingNotes ?? '',
        flavorTags: result.flavorTags ?? [],
        foodPairings: result.foodPairings ?? [],
        tryNext: result.tryNext ?? [],
        rawResponse: result,
      };
    } catch (error) {
      logger.error('Claude scan error:', error);
      throw error;
    }
  },

  async scanMenu(imageBase64: string, mediaType: string = 'image/jpeg'): Promise<MenuScanResult> {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: MENU_SCAN_PROMPT,
              },
            ],
          },
        ],
      });

      const textContent = response.content.find((c) => c.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text response from Claude');
      }

      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const result = JSON.parse(jsonMatch[0]);

      return {
        beers: result.beers ?? [],
        venueType: result.venueType,
        rawResponse: result,
      };
    } catch (error) {
      logger.error('Claude menu scan error:', error);
      throw error;
    }
  },

  async scanShelf(imageBase64: string, mediaType: string = 'image/jpeg'): Promise<MenuScanResult> {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: SHELF_SCAN_PROMPT,
              },
            ],
          },
        ],
      });

      const textContent = response.content.find((c) => c.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text response from Claude');
      }

      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const result = JSON.parse(jsonMatch[0]);

      return {
        beers: result.beers ?? [],
        venueType: result.storeType,
        rawResponse: result,
      };
    } catch (error) {
      logger.error('Claude shelf scan error:', error);
      throw error;
    }
  },

  async generateCloneRecipe(beerName: string, brewery: string, style: string): Promise<object> {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        messages: [
          {
            role: 'user',
            content: `You are a master homebrewer. Create a clone recipe for: ${beerName} by ${brewery} (${style}).

Return a JSON object with this structure:
{
  "name": "${beerName} Clone",
  "style": "${style}",
  "difficulty": "BEGINNER|INTERMEDIATE|ADVANCED|EXPERT",
  "description": "Description of the recipe and what makes this beer special...",
  "batchSize": 5,
  "boilTime": 60,
  "estimatedOg": 1.065,
  "estimatedFg": 1.012,
  "estimatedAbv": 6.9,
  "estimatedIbu": 65,
  "estimatedSrm": 8,
  "grains": [
    {"name": "Pale Malt", "amount": 10, "unit": "lb"}
  ],
  "hops": [
    {"name": "Centennial", "amount": 1, "unit": "oz", "time": 60, "use": "boil"}
  ],
  "yeast": [
    {"name": "SafAle US-05", "amount": 1, "unit": "packet"}
  ],
  "adjuncts": [],
  "mashTemp": 152,
  "mashTime": 60,
  "fermentTemp": 68,
  "fermentDays": 14,
  "notes": "Tips for brewing this beer..."
}`,
          },
        ],
      });

      const textContent = response.content.find((c) => c.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text response from Claude');
      }

      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      logger.error('Claude clone recipe error:', error);
      throw error;
    }
  },
};
