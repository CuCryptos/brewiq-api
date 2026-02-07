import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample locations across the US - bars, bottle shops, restaurants
const locations = [
  // California
  { name: 'Toronado San Francisco', city: 'San Francisco', state: 'CA', lat: 37.7699, lng: -122.4469 },
  { name: 'City Beer Store', city: 'San Francisco', state: 'CA', lat: 37.7785, lng: -122.4056 },
  { name: 'Monk\'s Kettle', city: 'San Francisco', state: 'CA', lat: 37.7614, lng: -122.4213 },
  { name: 'The Bruery Tasting Room', city: 'Placentia', state: 'CA', lat: 33.8753, lng: -117.8553 },
  { name: 'Stone Brewing World Bistro', city: 'San Diego', state: 'CA', lat: 32.8993, lng: -117.1098 },
  { name: 'Whole Foods Market', city: 'Los Angeles', state: 'CA', lat: 34.0736, lng: -118.3795 },

  // New York
  { name: 'Torst', city: 'Brooklyn', state: 'NY', lat: 40.7195, lng: -73.9506 },
  { name: 'Other Half Brewing', city: 'Brooklyn', state: 'NY', lat: 40.6736, lng: -73.9987 },
  { name: 'As Is NYC', city: 'New York', state: 'NY', lat: 40.7282, lng: -73.9942 },
  { name: 'Covenhoven', city: 'Brooklyn', state: 'NY', lat: 40.6808, lng: -73.9654 },
  { name: 'Whole Foods Bowery', city: 'New York', state: 'NY', lat: 40.7246, lng: -73.9933 },

  // Massachusetts
  { name: 'Trillium Fort Point', city: 'Boston', state: 'MA', lat: 42.3475, lng: -71.0471 },
  { name: 'Row 34', city: 'Boston', state: 'MA', lat: 42.3483, lng: -71.0486 },
  { name: 'Craft Beer Cellar', city: 'Belmont', state: 'MA', lat: 42.3959, lng: -71.1773 },
  { name: 'Lord Hobo', city: 'Cambridge', state: 'MA', lat: 42.3653, lng: -71.1035 },

  // Michigan
  { name: 'HopCat', city: 'Grand Rapids', state: 'MI', lat: 42.9614, lng: -85.6681 },
  { name: 'Founders Taproom', city: 'Grand Rapids', state: 'MI', lat: 42.9584, lng: -85.6744 },
  { name: 'Bell\'s Eccentric Cafe', city: 'Kalamazoo', state: 'MI', lat: 42.2917, lng: -85.5872 },
  { name: 'Siciliano\'s Market', city: 'Grand Rapids', state: 'MI', lat: 42.9723, lng: -85.6573 },

  // Colorado
  { name: 'Falling Rock Tap House', city: 'Denver', state: 'CO', lat: 39.7533, lng: -104.9947 },
  { name: 'First Draft Taproom', city: 'Denver', state: 'CO', lat: 39.7543, lng: -104.9891 },
  { name: 'Argonaut Wine & Liquor', city: 'Denver', state: 'CO', lat: 39.7392, lng: -104.9718 },

  // Texas
  { name: 'Craft Pride', city: 'Austin', state: 'TX', lat: 30.2503, lng: -97.7491 },
  { name: 'Jester King Brewery', city: 'Austin', state: 'TX', lat: 30.2276, lng: -98.0892 },
  { name: 'Whip In', city: 'Austin', state: 'TX', lat: 30.2344, lng: -97.7261 },
  { name: 'Spec\'s', city: 'Houston', state: 'TX', lat: 29.7604, lng: -95.3698 },

  // Oregon
  { name: 'Belmont Station', city: 'Portland', state: 'OR', lat: 45.5163, lng: -122.6265 },
  { name: 'Bailey\'s Taproom', city: 'Portland', state: 'OR', lat: 45.5196, lng: -122.6784 },
  { name: 'Cascade Brewing Barrel House', city: 'Portland', state: 'OR', lat: 45.5047, lng: -122.6378 },

  // Illinois
  { name: 'Revolution Brewpub', city: 'Chicago', state: 'IL', lat: 41.9214, lng: -87.6978 },
  { name: 'Hopleaf', city: 'Chicago', state: 'IL', lat: 41.9778, lng: -87.6685 },
  { name: 'Binny\'s Beverage Depot', city: 'Chicago', state: 'IL', lat: 41.9103, lng: -87.6346 },

  // Vermont
  { name: 'The Alchemist Brewery', city: 'Stowe', state: 'VT', lat: 44.4654, lng: -72.6874 },
  { name: 'Prohibition Pig', city: 'Waterbury', state: 'VT', lat: 44.3378, lng: -72.7562 },
  { name: 'Hill Farmstead Brewery', city: 'Greensboro', state: 'VT', lat: 44.5901, lng: -72.2954 },

  // Florida
  { name: 'Cigar City Taproom', city: 'Tampa', state: 'FL', lat: 27.9621, lng: -82.5066 },
  { name: 'World of Beer', city: 'Tampa', state: 'FL', lat: 27.9478, lng: -82.4584 },
  { name: 'Total Wine & More', city: 'Orlando', state: 'FL', lat: 28.4824, lng: -81.4329 },
];

const formats = ['DRAFT', 'CAN', 'BOTTLE', 'CROWLER', 'GROWLER'] as const;
const freshness = ['FRESH', 'RECENT', 'AGED', 'UNKNOWN'] as const;

// Sample notes for sightings
const sampleNotes = [
  'Fresh batch just tapped!',
  'Limited release, get it while it lasts',
  'Great selection on tap today',
  'Staff said more coming next week',
  'Last few cans on the shelf',
  'Rotating tap, might change soon',
  'Excellent condition, cold storage',
  'New arrival this week',
  'On sale right now!',
  'Part of their rare beer collection',
  'Freshest I\'ve seen in months',
  'Great price for this one',
  '',
  '',
  '',
];

function randomPrice(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(Math.floor(Math.random() * 12) + 10); // Between 10am and 10pm
  return date;
}

async function main() {
  console.log('📍 Adding sample sightings...');

  // Get users and beers
  const users = await prisma.user.findMany();
  const beers = await prisma.beer.findMany({
    include: { brewery: true },
  });

  if (users.length === 0 || beers.length === 0) {
    console.error('No users or beers found. Run the main seed first.');
    process.exit(1);
  }

  const sightings: Array<{
    userId: string;
    beerId: string;
    locationName: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
    format: typeof formats[number];
    freshness: typeof freshness[number];
    price: number | null;
    notes: string | null;
    createdAt: Date;
  }> = [];

  // Create 50-80 sightings
  const numSightings = 65;

  for (let i = 0; i < numSightings; i++) {
    const user = randomElement(users);
    const beer = randomElement(beers);
    const location = randomElement(locations);
    const format = randomElement(formats);

    // Price varies by format
    let price: number | null = null;
    if (Math.random() > 0.3) { // 70% have prices
      switch (format) {
        case 'DRAFT':
          price = randomPrice(6, 14);
          break;
        case 'CAN':
          price = randomPrice(3, 8);
          break;
        case 'BOTTLE':
          price = randomPrice(8, 25);
          break;
        case 'CROWLER':
          price = randomPrice(12, 20);
          break;
        case 'GROWLER':
          price = randomPrice(15, 30);
          break;
      }
    }

    const notes = randomElement(sampleNotes) || null;
    const createdAt = randomDate(14); // Within last 2 weeks

    sightings.push({
      userId: user.id,
      beerId: beer.id,
      locationName: location.name,
      city: location.city,
      state: location.state,
      latitude: location.lat + (Math.random() - 0.5) * 0.01, // Slight variation
      longitude: location.lng + (Math.random() - 0.5) * 0.01,
      format,
      freshness: randomElement(freshness),
      price,
      notes,
      createdAt,
    });
  }

  // Insert sightings
  for (const sighting of sightings) {
    const beer = beers.find(b => b.id === sighting.beerId);
    await prisma.sighting.create({
      data: {
        userId: sighting.userId,
        beerId: sighting.beerId,
        locationName: sighting.locationName,
        city: sighting.city,
        state: sighting.state,
        latitude: sighting.latitude,
        longitude: sighting.longitude,
        format: sighting.format,
        freshness: sighting.freshness,
        price: sighting.price,
        notes: sighting.notes,
        createdAt: sighting.createdAt,
        updatedAt: sighting.createdAt,
      },
    });
    console.log(`  ✓ ${beer?.name} at ${sighting.locationName}, ${sighting.city}`);
  }

  console.log(`\n✅ Added ${sightings.length} sightings across ${locations.length} locations`);

  // Summary by city
  const cityCounts: Record<string, number> = {};
  for (const s of sightings) {
    cityCounts[s.city] = (cityCounts[s.city] || 0) + 1;
  }
  console.log('\n📊 Sightings by city:');
  Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([city, count]) => {
      console.log(`   ${city}: ${count}`);
    });
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
