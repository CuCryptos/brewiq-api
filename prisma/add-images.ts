import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Unsplash beer images - curated collection of high-quality beer photos
const beerImages = {
  // IPAs and Pale Ales - golden/amber colored beers
  ipa: [
    'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=800&q=80', // IPA glass
    'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80', // Craft beer glass
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80', // Beer pour
    'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=800&q=80', // Amber beer
    'https://images.unsplash.com/photo-1618183479302-1e0aa382c36b?w=800&q=80', // Craft IPA
  ],
  // Hazy/New England IPAs - cloudy, orange colored
  hazy: [
    'https://images.unsplash.com/photo-1599694089429-30cd39f9430e?w=800&q=80', // Hazy beer
    'https://images.unsplash.com/photo-1523567830207-96731740fa71?w=800&q=80', // Craft pour
    'https://images.unsplash.com/photo-1594805711527-04f79a2206ba?w=800&q=80', // Hazy glass
  ],
  // Stouts and Porters - dark beers
  stout: [
    'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80', // Dark stout
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80', // Dark beer
    'https://images.unsplash.com/photo-1574156237987-b068abeccc22?w=800&q=80', // Stout glass
    'https://images.unsplash.com/photo-1559526642-c3f001ea68ee?w=800&q=80', // Porter
  ],
  // Wheat beers - cloudy, light colored
  wheat: [
    'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80', // Wheat beer
    'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=800&q=80', // Hefeweizen
    'https://images.unsplash.com/photo-1555658636-6e4a36218be7?w=800&q=80', // Light beer
  ],
  // Sours and Wild Ales - various colors, often in special glassware
  sour: [
    'https://images.unsplash.com/photo-1569937756447-1d44f657dc69?w=800&q=80', // Sour beer
    'https://images.unsplash.com/photo-1575037614876-c38a4c44f5bd?w=800&q=80', // Fruited sour
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80', // Craft sour
  ],
  // Belgian/Farmhouse - golden, effervescent
  farmhouse: [
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80', // Belgian style
    'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=800&q=80', // Saison
    'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=800&q=80', // Farmhouse ale
  ],
  // Default/general beer images
  default: [
    'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80',
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80',
    'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=800&q=80',
  ],
};

// Map beer styles to image categories
function getImageCategory(style: string, name: string): keyof typeof beerImages {
  const lowerStyle = style.toLowerCase();
  const lowerName = name.toLowerCase();

  if (lowerStyle.includes('stout') || lowerStyle.includes('porter')) {
    return 'stout';
  }
  if (lowerStyle.includes('hazy') || lowerStyle.includes('new england') || lowerName.includes('hazy')) {
    return 'hazy';
  }
  if (lowerStyle.includes('sour') || lowerStyle.includes('lambic') || lowerStyle.includes('gueuze') || lowerStyle.includes('wild') || lowerStyle.includes('kriek')) {
    return 'sour';
  }
  if (lowerStyle.includes('wheat') || lowerStyle.includes('hefe') || lowerStyle.includes('weizen')) {
    return 'wheat';
  }
  if (lowerStyle.includes('saison') || lowerStyle.includes('farmhouse')) {
    return 'farmhouse';
  }
  if (lowerStyle.includes('ipa') || lowerStyle.includes('pale ale')) {
    return 'ipa';
  }
  return 'default';
}

async function main() {
  console.log('🖼️  Adding images to beers...');

  const beers = await prisma.beer.findMany({
    orderBy: { iqScore: 'desc' },
  });

  // Track used images per category to avoid duplicates
  const usedIndices: Record<string, number> = {};

  for (const beer of beers) {
    const category = getImageCategory(beer.style, beer.name);
    const images = beerImages[category];

    // Get next image index for this category
    if (!(category in usedIndices)) {
      usedIndices[category] = 0;
    }
    const imageIndex = usedIndices[category] % images.length;
    usedIndices[category]++;

    const imageUrl = images[imageIndex];

    await prisma.beer.update({
      where: { id: beer.id },
      data: { imageUrl },
    });

    console.log(`  ✓ ${beer.name} (${category})`);
  }

  console.log(`\n✅ Added images to ${beers.length} beers`);
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
