import { PrismaClient } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Generate unique AI cover images for all breweries using Gemini + Cloudinary.
 *
 * Usage:
 *   DATABASE_URL=... GEMINI_API_KEY=... CLOUDINARY_CLOUD_NAME=... \
 *   CLOUDINARY_API_KEY=... CLOUDINARY_API_SECRET=... npx tsx prisma/generate-brewery-images.ts
 */

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres:JTJTTURinttUaOvtLGaoSdZAUnqIjPSv@crossover.proxy.rlwy.net:52935/railway';

const prisma = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DELAY_MS = 3000;

// ---------------------------------------------------------------------------
// Brewery image prompts
// ---------------------------------------------------------------------------

const breweryImages: { slug: string; prompt: string }[] = [
  { slug: '3-floyds', prompt: 'A gritty, industrial craft brewery taproom in Munster, Indiana. Dark metal and reclaimed wood interior, heavy metal artwork on walls, dim dramatic lighting. Aggressive punk-rock brewery aesthetic. No text or logos.' },
  { slug: 'the-alchemist', prompt: 'A small, cozy Vermont craft brewery nestled in green mountains. Rustic New England barn-style building surrounded by autumn foliage. Warm, intimate small-town brewery feeling. No text or logos.' },
  { slug: 'alesmith', prompt: 'A San Diego craft brewery taproom with exposed brick, barrel stacks along the wall, and warm amber lighting. Baseball memorabilia mixed with brewing equipment. California craft brewery vibe. No text or logos.' },
  { slug: 'bells', prompt: 'A large, bustling Michigan craft brewery with a beautiful outdoor beer garden. Red brick building, string lights overhead, families and friends enjoying beer in the warm sunshine. Midwestern warmth and hospitality. No text or logos.' },
  { slug: 'boulevard', prompt: 'A historic Kansas City brewery with a smokestack and brick facade. Beautiful Art Deco touches, a spacious taproom with large windows overlooking the city. Heartland American brewery pride. No text or logos.' },
  { slug: 'cantillon', prompt: 'An ancient Belgian lambic brewery in Brussels with cobblestone floors, dusty oak barrels stacked ceiling-high, copper kettles patinated green with age. Traditional, rustic, almost museum-like atmosphere bathed in golden light. No text or logos.' },
  { slug: 'cigar-city', prompt: 'A vibrant Tampa, Florida craft brewery with tropical plants, bright murals, and open-air seating. Cuban-inspired design elements, palm trees, warm sunshine. Lively Latin-meets-craft atmosphere. No text or logos.' },
  { slug: 'deschutes', prompt: 'A Pacific Northwest craft brewery in Bend, Oregon with massive windows overlooking snow-capped mountains. Natural wood beams, stone fireplace, outdoor patio with mountain views. Rugged outdoor adventure brewery. No text or logos.' },
  { slug: 'dogfish-head', prompt: 'An eclectic Delaware craft brewery with a nautical coastal vibe. Steampunk brewing gadgets, vintage maps, quirky art installations. Beach-town creativity meets mad-scientist brewery. No text or logos.' },
  { slug: 'firestone-walker', prompt: 'An elegant California Central Coast brewery in Paso Robles wine country. Oak barrels, wine-country sophistication, warm terracotta tones. Where wine country meets craft brewing. No text or logos.' },
  { slug: 'founders', prompt: 'A massive Grand Rapids, Michigan brewery with an epic industrial taproom. Exposed steel beams, concrete floors, long communal tables packed with happy drinkers. Blue-collar craft beer at its finest. No text or logos.' },
  { slug: 'great-notion', prompt: 'A colorful, modern Portland, Oregon brewery taproom with bright murals, neon accents, and creative pastry stout flight boards. Hip, artistic, Instagram-friendly. Pacific Northwest creative energy. No text or logos.' },
  { slug: 'half-acre', prompt: 'A Chicago craft brewery in a converted warehouse. Exposed brick, skylights, industrial but warm. Local art on walls, communal vibe. Neighborhood brewery energy with city grit. No text or logos.' },
  { slug: 'hill-farmstead', prompt: 'A remote Vermont hilltop farmstead brewery surrounded by rolling green pastures and wildflowers. Simple wooden barn structure, peaceful countryside setting. The most beautiful, serene brewery location imaginable. No text or logos.' },
  { slug: 'jester-king', prompt: 'A rustic Texas Hill Country farmhouse brewery with limestone walls, a shaded outdoor biergarten under live oak trees, and goats roaming the property. Rural, pastoral, wild-ale-meets-ranch aesthetic. No text or logos.' },
  { slug: 'lagunitas', prompt: 'A funky, irreverent Petaluma, California brewery with psychedelic murals, a dog-friendly amphitheater, and a party-on-the-patio vibe. Counter-culture meets craft beer. Colorful and chaotic in the best way. No text or logos.' },
  { slug: 'left-hand', prompt: 'A cozy Longmont, Colorado brewery at the base of the Rocky Mountains. Mountain lodge feel with stone walls, wooden beams, and a roaring fireplace. Craft beer meets Colorado mountain living. No text or logos.' },
  { slug: 'maine-beer', prompt: 'A minimalist, pristine New England brewery in Freeport, Maine. Clean Scandinavian-inspired design, natural light, simple wooden furniture. A brewery that looks as clean as the beer tastes. Zen-like calm. No text or logos.' },
  { slug: 'modern-times', prompt: 'A retro-futuristic San Diego brewery with mid-century modern furniture, bold geometric patterns, and a built-in coffee roastery. Utopian sci-fi aesthetic meets craft beer. Colorful, bold design. No text or logos.' },
  { slug: 'montauk', prompt: 'A beachside Long Island brewery with surfboards on the wall, sandy floors near the entrance, and ocean views through large glass doors. Hamptons casual meets craft beer. Salty, breezy, summer forever. No text or logos.' },
  { slug: 'new-belgium', prompt: 'The iconic Fort Collins, Colorado brewery with a campus of whimsical buildings, bicycle art installations, and a liquid center visible through glass walls. Sustainability meets fun. Colorful, playful, eco-conscious. No text or logos.' },
  { slug: 'odell', prompt: 'A Fort Collins, Colorado craft brewery with a beautiful rooftop patio overlooking the Front Range mountains. Warm brick, hop vines growing on trellises, friendly neighborhood feel. No text or logos.' },
  { slug: 'oskar-blues', prompt: 'A rugged Longmont, Colorado brewery in a converted industrial space. Cans stacked everywhere, live music stage, Americana decor. Blue-collar, no-frills, rock-and-roll brewery energy. No text or logos.' },
  { slug: 'other-half', prompt: 'A trendy Brooklyn, New York craft brewery with a minimalist industrial interior. Concrete floors, metal stools, a wall of gleaming silver cans. Urban hype-beast brewery culture. Cool, confident, borough-proud. No text or logos.' },
  { slug: 'prairie-artisan', prompt: 'An Oklahoma farmhouse brewery with prairie grasslands stretching to the horizon. Rustic red barn, wildflowers, golden wheat fields. Where the heartland meets Belgian brewing tradition. No text or logos.' },
  { slug: 'revolution', prompt: 'A massive Chicago brewery in a converted industrial building with exposed brick, revolutionary war-inspired art, and a soaring brewhouse visible from the taproom. Bold, historic, Chicago tough. No text or logos.' },
  { slug: 'russian-river', prompt: 'An unassuming Santa Rosa, California brewpub packed wall-to-wall with people. Simple, no-frills interior focused purely on the beer. Long lines out the door hint at legendary status. Humble greatness. No text or logos.' },
  { slug: 'sierra-nevada', prompt: 'The original Chico, California craft brewery campus with a hop field, solar panels, and a massive copper brewhouse visible through windows. Where American craft beer began. Pioneer energy, sustainability. No text or logos.' },
  { slug: 'stone', prompt: 'A dramatic Escondido, California brewery built into natural stone with gargoyle statues, gothic architecture, and sprawling gardens with koi ponds. Bold, theatrical, unapologetically arrogant. No text or logos.' },
  { slug: 'surly', prompt: 'A massive Minneapolis, Minnesota destination brewery with a rooftop beer garden overlooking the city skyline. Modern industrial architecture, Viking-inspired bold design. Minnesota pride meets world-class brewing. No text or logos.' },
  { slug: 'toppling-goliath', prompt: 'A small-town Iowa craft brewery in Decorah that punches way above its weight. Simple Midwest storefront exterior hiding an incredible taproom inside. Small-town magic, big-time beer. No text or logos.' },
  { slug: 'tree-house', prompt: 'A stunning modern Massachusetts brewery with floor-to-ceiling windows overlooking New England countryside. Clean, architectural, almost museum-like. The Apple Store of craft breweries. No text or logos.' },
  { slug: 'trillium', prompt: 'A sleek Boston waterfront brewery with harbor views, modern glass and steel design, and a sophisticated urban taproom. New England brewing excellence in a world-class city setting. No text or logos.' },
  { slug: 'weihenstephaner', prompt: 'The worlds oldest brewery on a Bavarian hilltop near Munich. Ancient stone walls, traditional German beer hall with long wooden tables, monastery architecture. Nearly 1000 years of brewing history. No text or logos.' },
  { slug: 'wicked-weed', prompt: 'A beautiful Asheville, North Carolina brewery in a historic brick building downtown. Southern charm meets craft beer, with an expansive outdoor patio, barrel room visible through glass, and Blue Ridge Mountain views. No text or logos.' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isUnsplashUrl(url: string | null): boolean {
  return !!url && url.includes('unsplash.com');
}

async function generateAndUploadImage(prompt: string): Promise<string> {
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
      folder: 'brewiq/brewery-images',
      resource_type: 'image',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    },
  );

  return result.secure_url;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Generating AI cover images for breweries...\n');

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < breweryImages.length; i++) {
    const { slug, prompt } = breweryImages[i];

    try {
      // Look up the brewery
      const brewery = await prisma.brewery.findUnique({ where: { slug } });
      if (!brewery) {
        console.log(`  [${i + 1}/${breweryImages.length}] SKIP: "${slug}" not found in database`);
        skipped++;
        continue;
      }

      // Skip if already has a non-Unsplash imageUrl (i.e., already AI-generated)
      if (brewery.imageUrl && !isUnsplashUrl(brewery.imageUrl)) {
        console.log(`  [${i + 1}/${breweryImages.length}] SKIP: "${brewery.name}" already has AI image`);
        skipped++;
        continue;
      }

      console.log(`  [${i + 1}/${breweryImages.length}] Generating image for "${brewery.name}"...`);

      const imageUrl = await generateAndUploadImage(prompt);

      await prisma.brewery.update({
        where: { slug },
        data: { imageUrl },
      });

      console.log(`  [${i + 1}/${breweryImages.length}] Done: ${imageUrl}`);
      processed++;

      // Delay between requests to avoid rate limits
      if (i < breweryImages.length - 1) {
        console.log(`  Waiting ${DELAY_MS}ms before next brewery...`);
        await sleep(DELAY_MS);
      }
    } catch (error) {
      console.error(
        `  [${i + 1}/${breweryImages.length}] FAILED for "${slug}":`,
        error instanceof Error ? error.message : error,
      );
      failed++;

      // Still delay after failures to respect rate limits
      if (i < breweryImages.length - 1) {
        await sleep(DELAY_MS);
      }
    }
  }

  console.log('\n--- Summary ---');
  console.log(`  Processed: ${processed}`);
  console.log(`  Skipped:   ${skipped}`);
  console.log(`  Failed:    ${failed}`);
  console.log(`  Total:     ${breweryImages.length}`);
  console.log('\nDone!');
}

main()
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
