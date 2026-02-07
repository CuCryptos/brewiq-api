import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Unsplash brewery/taproom images - high-quality photos
const breweryImages = [
  // Brewery interiors and taprooms
  'https://images.unsplash.com/photo-1559526642-c3f001ea68ee?w=800&q=80', // Brewery taproom
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80', // Beer taps
  'https://images.unsplash.com/photo-1532634733-cae1395e440f?w=800&q=80', // Brewery tanks
  'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=800&q=80', // Craft brewery
  'https://images.unsplash.com/photo-1536638317175-32449dab9449?w=800&q=80', // Tap handles
  'https://images.unsplash.com/photo-1504502350688-00f5d59bbdeb?w=800&q=80', // Brewery interior
  'https://images.unsplash.com/photo-1603219377308-153960dc0be8?w=800&q=80', // Beer fermenters
  'https://images.unsplash.com/photo-1595408075281-ab820f89b855?w=800&q=80', // Taproom bar
  'https://images.unsplash.com/photo-1570587336088-f65bec1f1f34?w=800&q=80', // Brewing equipment
  'https://images.unsplash.com/photo-1552786747-cf46c81e0be8?w=800&q=80', // Beer production
  'https://images.unsplash.com/photo-1587916499052-4f71d33e46f0?w=800&q=80', // Craft beer bar
  'https://images.unsplash.com/photo-1605701469873-3c7e19c5f6c3?w=800&q=80', // Beer flight
  'https://images.unsplash.com/photo-1578508653825-ca4e3b8e6d42?w=800&q=80', // Brewery entrance
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80', // Bar atmosphere
  'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=800&q=80', // Beer service
  'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&q=80', // Industrial brewery
  'https://images.unsplash.com/photo-1597290282695-edc43d0e7129?w=800&q=80', // Beer kegs
  'https://images.unsplash.com/photo-1547595468-1b765c37391c?w=800&q=80', // Taproom seating
  'https://images.unsplash.com/photo-1560840067-ddcaeb7831d2?w=800&q=80', // Brewery vats
  'https://images.unsplash.com/photo-1592845467711-f8b020c4a7f8?w=800&q=80', // Beer glasses
  'https://images.unsplash.com/photo-1575037614876-c38a4c44f5bd?w=800&q=80', // Craft beer setup
  'https://images.unsplash.com/photo-1555658636-6e4a36218be7?w=800&q=80', // Beer tasting
  'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=800&q=80', // Belgian brewery
  'https://images.unsplash.com/photo-1575367439058-6096bb9cf5e2?w=800&q=80', // Brewery tour
];

// Logo placeholder images (beer-themed icons/graphics)
const logoImages = [
  'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80',
  'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=80',
  'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=400&q=80',
  'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&q=80',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&q=80',
];

async function main() {
  console.log('🏭 Adding images to breweries...');

  const breweries = await prisma.brewery.findMany({
    orderBy: { iqScore: 'desc' },
  });

  for (let i = 0; i < breweries.length; i++) {
    const brewery = breweries[i];
    const imageUrl = breweryImages[i % breweryImages.length];
    const logoUrl = logoImages[i % logoImages.length];

    await prisma.brewery.update({
      where: { id: brewery.id },
      data: {
        imageUrl,
        logoUrl,
      },
    });

    console.log(`  ✓ ${brewery.name}`);
  }

  console.log(`\n✅ Added images to ${breweries.length} breweries`);
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
