import { PrismaClient } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Regenerate AI review images with highly varied, unique prompts.
 *
 * This script replaces the existing uniform review images with diverse,
 * style-appropriate images using randomized settings, compositions, and moods.
 *
 * Usage:
 *   GEMINI_API_KEY=... CLOUDINARY_CLOUD_NAME=... CLOUDINARY_API_KEY=... \
 *   CLOUDINARY_API_SECRET=... npx tsx prisma/regenerate-review-images.ts
 *
 * Options:
 *   --limit N          Only process N reviews (for testing)
 *   --skip-existing    Only generate images for reviews that have no image
 */

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const DATABASE_URL =
  process.env.DATABASE_URL ??
  'postgresql://postgres:JTJTTURinttUaOvtLGaoSdZAUnqIjPSv@crossover.proxy.rlwy.net:52935/railway';

const prisma = new PrismaClient({
  datasources: { db: { url: DATABASE_URL } },
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const BATCH_SIZE = 5;
const DELAY_MS = 3000;

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

function parseArgs(): { limit: number | null; skipExisting: boolean } {
  const args = process.argv.slice(2);
  let limit: number | null = null;
  let skipExisting = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) {
      limit = parseInt(args[i + 1], 10);
      if (isNaN(limit) || limit <= 0) {
        console.error('Error: --limit must be a positive integer');
        process.exit(1);
      }
      i++; // skip next arg
    }
    if (args[i] === '--skip-existing') {
      skipExisting = true;
    }
  }

  return { limit, skipExisting };
}

// ---------------------------------------------------------------------------
// Glass type mapping by style
// ---------------------------------------------------------------------------

function getGlassType(style: string): string {
  const s = style.toLowerCase();

  if (s.includes('barleywine')) return 'snifter';
  if (s.includes('wheat') || s.includes('hefe') || s.includes('weizen') || s.includes('weiss'))
    return 'tall weizen glass';
  if (
    s.includes('belgian') ||
    s.includes('farmhouse') ||
    s.includes('saison') ||
    s.includes('tripel') ||
    s.includes('dubbel') ||
    s.includes('quad')
  )
    return pickRandom(['tulip glass', 'goblet chalice']);
  if (
    s.includes('sour') ||
    s.includes('lambic') ||
    s.includes('gueuze') ||
    s.includes('gose') ||
    s.includes('kriek') ||
    s.includes('berliner')
  )
    return pickRandom(['tulip glass', 'wine glass']);
  if (s.includes('stout') || s.includes('porter'))
    return pickRandom(['snifter', 'tulip glass']);
  if (s.includes('pilsner') || s.includes('lager') || s.includes('kolsch') || s.includes('helles'))
    return 'tall pilsner glass';
  if (
    s.includes('ipa') ||
    s.includes('pale ale') ||
    s.includes('double ipa') ||
    s.includes('dipa')
  )
    return pickRandom(['shaker pint glass', 'tulip glass']);

  return 'standard pint glass';
}

// ---------------------------------------------------------------------------
// Beer color mapping by style
// ---------------------------------------------------------------------------

function getBeerColor(style: string): string {
  const s = style.toLowerCase();

  if (s.includes('barleywine')) return 'dark amber to mahogany';
  if (s.includes('hazy') || s.includes('new england') || s.includes('neipa'))
    return 'opaque orange-gold, thick cloudy';
  if (s.includes('stout') || s.includes('porter'))
    return 'jet black with a tan-brown creamy head';
  if (s.includes('wheat') || s.includes('hefe') || s.includes('weizen') || s.includes('weiss'))
    return 'pale straw yellow, cloudy';
  if (
    s.includes('sour') ||
    s.includes('lambic') ||
    s.includes('gueuze') ||
    s.includes('kriek') ||
    s.includes('berliner')
  )
    return pickRandom(['bright pink', 'golden', 'ruby red', 'pale peach']);
  if (s.includes('pilsner') || s.includes('lager') || s.includes('kolsch') || s.includes('helles'))
    return 'crystal clear pale gold';
  if (s.includes('amber') || s.includes('red') || s.includes('scottish') || s.includes('marzen'))
    return 'deep amber copper';
  if (
    s.includes('ipa') ||
    s.includes('pale ale') ||
    s.includes('double ipa') ||
    s.includes('dipa')
  )
    return 'golden amber, slightly hazy';
  if (
    s.includes('belgian') ||
    s.includes('saison') ||
    s.includes('farmhouse') ||
    s.includes('tripel')
  )
    return 'golden with a tall effervescent white head';
  if (s.includes('dubbel') || s.includes('quad'))
    return 'deep reddish-brown with an off-white head';
  if (s.includes('brown'))
    return 'rich chestnut brown';

  return 'golden amber';
}

// ---------------------------------------------------------------------------
// Randomized element pools
// ---------------------------------------------------------------------------

const SETTINGS = [
  'a cozy craft bar with warm Edison bulb lighting and exposed brick',
  'a sunny outdoor patio with string lights overhead and lush greenery',
  'a clean kitchen counter with fresh citrus and herbs nearby',
  'a campfire setting at dusk with a wool blanket and pine trees',
  'a weathered wooden picnic table in a bustling beer garden',
  'a rooftop bar overlooking a glittering city skyline at night',
  'a beach boardwalk with soft ocean waves and golden sand in the background',
  'a rustic cellar with rough brick walls and candlelight',
  'a sleek modern minimalist countertop with marble texture',
  'a busy brewery taproom with stainless steel fermentation tanks visible behind',
  'a snow-covered cabin porch with warm light spilling from inside',
  'a cozy library or study with a leather chair and old books',
  'a concert venue with moody purple and blue stage lighting in the background',
  'a farmers market stall with wooden crates and fresh produce nearby',
  'a Japanese izakaya-style bar with warm wood panels and paper lanterns',
  'a vineyard patio at golden hour with rolling hills in the distance',
  'a rustic mountain lodge with stone fireplace and taxidermy',
  'a rainy window seat in a cafe with droplets on the glass',
  'a colorful food truck park with fairy lights strung between trucks',
  'a boat dock at sunset with calm lake water reflecting the sky',
];

const COMPOSITIONS = [
  'Classic straight-on pour shot, beer centered in frame',
  'Overhead flat-lay composition with the beer and small food bites',
  'Close-up macro shot of condensation droplets on the glass surface',
  'Backlit silhouette shot with light shining through the beer',
  'Beer being poured mid-stream from a bottle into the glass, capturing the cascade',
  'Table setting composition with a partial food pairing alongside the beer',
  'A hand holding the glass up at an angle, catching the light through the beer',
  'Glass resting on a worn wooden surface with dramatic long shadows',
  'Wide angle environmental shot with the beer in the lower third, setting in focus',
  'Macro shot of the foam head, showing intricate lacing and bubble texture',
  'Three-quarter angle view from slightly above, showing both the beer and the setting',
  'Low angle hero shot looking up at the glass, making the beer look monumental',
  'Beer next to its open bottle or can, with the pour freshly completed',
  'Two glasses of the same beer side by side, one full and one half-drunk',
];

const MOODS = [
  'warm golden hour sunlight streaming in from one side',
  'moody candlelit ambiance with deep shadows and warm highlights',
  'bright natural daylight, clean and crisp',
  'dramatic side lighting with stark contrast between light and dark',
  'neon-tinted bar glow with pinks, blues, and purples reflecting off the glass',
  'soft diffused overcast light, gentle and even',
  'rich amber firelight, flickering and warm',
  'cool blue twilight with the last traces of sunset on the horizon',
  'overhead spotlight creating a focused pool of light on the glass',
  'mixed warm and cool lighting with tungsten foreground and blue background',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

function buildPrompt(
  beerName: string,
  style: string,
  flavorTags: string[],
): string {
  const glassType = getGlassType(style);
  const beerColor = getBeerColor(style);
  const setting = pickRandom(SETTINGS);
  const composition = pickRandom(COMPOSITIONS);
  const mood = pickRandom(MOODS);

  const flavorDesc =
    flavorTags.length > 0
      ? flavorTags.slice(0, 4).join(', ')
      : 'classic malt and hop';

  return (
    `A beautiful, photo-realistic image of a ${beerColor} ${style} beer in a ${glassType}. ` +
    `${composition}. ` +
    `Setting: ${setting}. ` +
    `Lighting: ${mood}. ` +
    `The beer showcases ${flavorDesc} character. ` +
    `No text, labels, or brand names in the image.`
  );
}

// ---------------------------------------------------------------------------
// Image generation
// ---------------------------------------------------------------------------

async function generateImage(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    throw new Error('No content in Gemini response');
  }

  const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith('image/'));
  if (!imagePart?.inlineData?.data) {
    throw new Error('No image data in Gemini response');
  }

  const base64Data = imagePart.inlineData.data;

  const result = await cloudinary.uploader.upload(
    `data:image/jpeg;base64,${base64Data}`,
    {
      folder: 'brewiq/review-images',
      resource_type: 'image',
      transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
    },
  );

  return result.secure_url;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const { limit, skipExisting } = parseArgs();

  console.log('\nBrewIQ Review Image Regenerator');
  console.log('===============================');
  console.log(`Mode: ${skipExisting ? 'Only reviews WITHOUT images' : 'ALL reviews (replacing existing)'}`);
  if (limit) console.log(`Limit: ${limit} reviews`);
  console.log(`Batch size: ${BATCH_SIZE}`);
  console.log(`Delay between batches: ${DELAY_MS}ms\n`);

  try {
    // Build the query filter
    const whereClause = skipExisting ? { imageUrl: null } : {};

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: { beer: true },
      orderBy: { createdAt: 'desc' },
      ...(limit ? { take: limit } : {}),
    });

    const total = reviews.length;
    console.log(`Found ${total} reviews to process\n`);

    if (total === 0) {
      console.log('Nothing to do. Exiting.');
      return;
    }

    let success = 0;
    let failed = 0;

    for (let i = 0; i < reviews.length; i += BATCH_SIZE) {
      const batch = reviews.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(total / BATCH_SIZE);
      console.log(`--- Batch ${batchNum}/${totalBatches} (${batch.length} reviews) ---`);

      for (const review of batch) {
        const idx = i + batch.indexOf(review) + 1;
        try {
          const prompt = buildPrompt(
            review.beer.name,
            review.beer.style,
            review.flavorTags,
          );

          console.log(`  [${idx}/${total}] ${review.beer.name} (${review.beer.style})`);
          console.log(`    Prompt: ${prompt.substring(0, 120)}...`);

          const imageUrl = await generateImage(prompt);

          await prisma.review.update({
            where: { id: review.id },
            data: { imageUrl },
          });

          console.log(`    Done: ${imageUrl}`);
          success++;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          console.error(`    FAILED: ${message}`);
          failed++;
        }
      }

      // Delay between batches to avoid rate limits
      if (i + BATCH_SIZE < reviews.length) {
        console.log(`  Waiting ${DELAY_MS}ms before next batch...`);
        await sleep(DELAY_MS);
      }
    }

    console.log('\n===============================');
    console.log('Results:');
    console.log(`  Success: ${success}`);
    console.log(`  Failed:  ${failed}`);
    console.log(`  Total:   ${total}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
