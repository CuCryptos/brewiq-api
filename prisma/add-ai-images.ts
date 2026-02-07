import { PrismaClient } from '@prisma/client';

/**
 * Batch script to generate AI images for existing reviews.
 *
 * Usage:
 *   DATABASE_URL=... GEMINI_API_KEY=... CLOUDINARY_CLOUD_NAME=... \
 *   CLOUDINARY_API_KEY=... CLOUDINARY_API_SECRET=... npx tsx prisma/add-ai-images.ts
 */

// Dynamically import after env is available
async function main() {
  const prisma = new PrismaClient();

  // Lazy-import the gemini service so config is loaded with env vars
  const { geminiService } = await import('../src/services/gemini.service.js');

  const BATCH_SIZE = 10;
  const DELAY_MS = 2000;

  try {
    const reviews = await prisma.review.findMany({
      where: { imageUrl: null },
      include: { beer: true },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`Found ${reviews.length} reviews without images`);

    for (let i = 0; i < reviews.length; i += BATCH_SIZE) {
      const batch = reviews.slice(i, i + BATCH_SIZE);
      console.log(`\nProcessing batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} reviews)...`);

      for (const review of batch) {
        try {
          console.log(`  Generating image for review ${review.id} (${review.beer.name})...`);
          const imageUrl = await geminiService.generateReviewImage(
            review.beer.name,
            review.beer.style,
            review.rating,
            review.flavorTags,
          );

          await prisma.review.update({
            where: { id: review.id },
            data: { imageUrl },
          });

          console.log(`  Done: ${imageUrl}`);
        } catch (error) {
          console.error(`  Failed for review ${review.id}:`, error instanceof Error ? error.message : error);
        }
      }

      // Delay between batches to avoid rate limits
      if (i + BATCH_SIZE < reviews.length) {
        console.log(`  Waiting ${DELAY_MS}ms before next batch...`);
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      }
    }

    console.log('\nDone! All reviews processed.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
