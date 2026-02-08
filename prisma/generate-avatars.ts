import { PrismaClient } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Generate unique AI avatars for all 21 seed users using Gemini and Cloudinary.
 *
 * Usage:
 *   GEMINI_API_KEY=... CLOUDINARY_CLOUD_NAME=... CLOUDINARY_API_KEY=... \
 *   CLOUDINARY_API_SECRET=... npx tsx prisma/generate-avatars.ts
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

const DELAY_MS = 3000;

// ---------------------------------------------------------------------------
// User avatar prompts keyed by username
// ---------------------------------------------------------------------------

const USER_PROMPTS: Record<string, string> = {
  brewiq_hq:
    'A sophisticated, minimal brand logo mark featuring a stylized beer glass icon combined with a brain/intelligence motif. Gold and dark amber colors on a clean background. Modern, premium, tech-forward aesthetic. No text.',
  hophead:
    'A stylized portrait of a young woman with green-tinted hair, surrounded by hop cones and hop vines. Bright, energetic color palette with greens and gold. Modern digital art style.',
  stoutlover:
    'A rugged, bearded man holding a dark imperial stout in a snifter glass. Warm, moody dark tones with rich browns and amber highlights. Cozy pub atmosphere vibe.',
  sourpusher:
    'A playful portrait of a woman with bright pink-streaked hair, puckered expression, holding a tulip glass of pink sour beer. Vibrant pinks, purples, and teal. Whimsical art style.',
  craftcurious:
    'A young man with wide, excited eyes and a sampler flight of 4 different colored beers in front of him. Bright, warm colors. Curious, approachable expression. Clean illustration style.',
  wild_ale_wendy:
    'A mystical portrait of a woman with wildflowers in her hair, holding a rustic stoneware mug. Earthy tones — moss green, aged wood brown, wild berry purple. Cottage-core meets craft beer.',
  session_king:
    'A chill, confident figure lounging on a deck chair with a simple pint of golden session ale. Laid-back beach vibe, sunset colors. Relaxed and effortless style.',
  demo:
    'A friendly, generic craft beer enthusiast avatar. A person wearing a flannel shirt holding a pint glass of amber ale. Warm, welcoming colors. Clean, approachable illustration.',
  brewmaster_mike:
    'A serious-looking man in a brewer\'s apron and rubber boots standing in front of stainless steel fermentation tanks. Industrial brewery setting. Professional, authoritative vibe.',
  beerbabe_lex:
    'A stylish young woman taking a photo of her beer with a phone. Trendy aesthetic — neon signs in background, craft bar vibe. Warm pinks, amber lighting. Social media influencer energy.',
  cicerone_james:
    'A sophisticated man in a vest and rolled sleeves, examining a tulip glass of Belgian ale against the light. Wine bar sophistication meets beer culture. Muted, elegant color palette.',
  craftdad:
    'A dad in cargo shorts and a baseball cap, holding a tallboy can while flipping burgers on a grill. Backyard BBQ vibe. Warm summer colors, happy suburban energy.',
  pilsner_pete:
    'A retro-styled man with a handlebar mustache holding a tall pilsner glass of crystal-clear golden lager. Clean, crisp European beer garden aesthetic. Light golds and whites.',
  barrel_queen:
    'A regal portrait of a woman wearing a crown made of barrel staves, holding a snifter of dark barrel-aged stout. Rich bourbon browns, golds, and deep reds. Dramatic, elegant lighting.',
  hops_and_dreams:
    'A college-age guy in a university hoodie, excitedly trying his first hazy IPA. Bright campus setting, youthful energy. Fresh, vibrant colors.',
  the_beerologist:
    'A scientist in a lab coat holding a beaker filled with golden beer instead of chemicals. Laboratory setting with beer-themed equipment. Quirky, intellectual, playful.',
  patio_pints:
    'A golden-hour outdoor scene portrait of a person silhouetted against a sunset, holding up a pint glass catching the light. Warm oranges, pinks, and gold. Peaceful, atmospheric.',
  alexa_brews:
    'A woman with a camera around her neck, artfully arranging a beer pour shot. Artistic, photographer vibe. Soft bokeh background with warm amber tones.',
  untapped_dan:
    'A man intensely staring at a flight of beers, taking notes on his phone. Data analyst meets beer nerd. Clean, digital aesthetic with beer colors.',
  suds_n_buds:
    'A young guy looking amazed at a colorful hazy IPA, like he\'s seeing magic for the first time. Wide eyes, big smile. Bright, fun, beginner\'s wonder energy.',
  grainbill_gary:
    'A weathered, distinguished older man with a grey beard, sitting in a leather chair holding a barleywine in a goblet. Surrounded by malt bags and brewing books. Warm, wise, experienced.',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function generateAvatar(prompt: string): Promise<string> {
  const safePrompt = `Generate a stylized avatar illustration: ${prompt}. The style should be a clean, modern digital art portrait suitable for a profile picture. No text. Square composition.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ role: 'user', parts: [{ text: safePrompt }] }],
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
      folder: 'brewiq/avatars',
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
  const usernames = Object.keys(USER_PROMPTS);

  console.log(`\nBrewIQ Avatar Generator`);
  console.log(`======================`);
  console.log(`Users to process: ${usernames.length}`);
  console.log(`Delay between users: ${DELAY_MS}ms\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  try {
    for (let i = 0; i < usernames.length; i++) {
      const username = usernames[i];
      const prompt = USER_PROMPTS[username];

      console.log(`[${i + 1}/${usernames.length}] ${username}`);

      // Look up user
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        console.log(`  SKIP — user not found in database`);
        skipped++;
        continue;
      }

      // Skip users that already have an avatarUrl
      if (user.avatarUrl) {
        console.log(`  SKIP — already has avatar: ${user.avatarUrl}`);
        skipped++;
        continue;
      }

      try {
        console.log(`  Generating image...`);
        const imageUrl = await generateAvatar(prompt);

        await prisma.user.update({
          where: { username },
          data: { avatarUrl: imageUrl },
        });

        console.log(`  DONE — ${imageUrl}`);
        generated++;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`  FAIL — ${message}`);
        failed++;
      }

      // Delay between users to avoid rate limits (skip delay after last user)
      if (i < usernames.length - 1) {
        console.log(`  Waiting ${DELAY_MS}ms...`);
        await sleep(DELAY_MS);
      }
    }

    console.log(`\n======================`);
    console.log(`Results:`);
    console.log(`  Generated: ${generated}`);
    console.log(`  Skipped:   ${skipped}`);
    console.log(`  Failed:    ${failed}`);
    console.log(`  Total:     ${usernames.length}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
