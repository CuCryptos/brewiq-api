import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 35 new locations across the US - real bars/shops with accurate GPS
const locations = [
  // Southeast
  { name: 'The Porter Beer Bar', city: 'Atlanta', state: 'GA', lat: 33.7756, lng: -84.3853 },
  { name: 'Brick Store Pub', city: 'Decatur', state: 'GA', lat: 33.7748, lng: -84.2963 },
  { name: 'Craft Brewed', city: 'Nashville', state: 'TN', lat: 36.1627, lng: -86.7816 },
  { name: 'Hi-Wire Brewing', city: 'Asheville', state: 'NC', lat: 35.5841, lng: -82.5515 },
  { name: 'Salud Cerveceria', city: 'Charlotte', state: 'NC', lat: 35.2271, lng: -80.8431 },

  // Mid-Atlantic
  { name: 'ChurchKey', city: 'Washington', state: 'DC', lat: 38.9107, lng: -77.0301 },
  { name: 'Bluejacket', city: 'Washington', state: 'DC', lat: 38.8754, lng: -77.0037 },
  { name: "Monk's Cafe", city: 'Philadelphia', state: 'PA', lat: 39.9479, lng: -75.1638 },
  { name: 'Tired Hands Brewing', city: 'Ardmore', state: 'PA', lat: 40.0073, lng: -75.2907 },
  { name: "Max's Taphouse", city: 'Baltimore', state: 'MD', lat: 39.2883, lng: -76.5975 },

  // Pacific Northwest
  { name: 'Pine Box', city: 'Seattle', state: 'WA', lat: 47.6148, lng: -122.3194 },
  { name: "Chuck's Hop Shop", city: 'Seattle', state: 'WA', lat: 47.6126, lng: -122.3122 },
  { name: 'Hair of the Dog Brewing', city: 'Portland', state: 'OR', lat: 45.5109, lng: -122.6623 },
  { name: 'Apex Bar', city: 'Portland', state: 'OR', lat: 45.5047, lng: -122.6570 },

  // Mountain West
  { name: 'Beerhive Pub', city: 'Salt Lake City', state: 'UT', lat: 40.7608, lng: -111.8910 },
  { name: 'Boise Brewing', city: 'Boise', state: 'ID', lat: 43.6150, lng: -116.2023 },
  { name: 'Canteen Taphouse', city: 'Colorado Springs', state: 'CO', lat: 38.8339, lng: -104.8214 },

  // Midwest
  { name: 'Sugar Maple', city: 'Milwaukee', state: 'WI', lat: 43.0205, lng: -87.9089 },
  { name: 'Side Project Cellar', city: 'Maplewood', state: 'MO', lat: 38.6118, lng: -90.3226 },
  { name: 'Bier Station', city: 'Kansas City', state: 'MO', lat: 39.0557, lng: -94.5762 },
  { name: 'Rhinegeist Brewery', city: 'Cincinnati', state: 'OH', lat: 39.1157, lng: -84.5198 },
  { name: 'Hoof Hearted Brewery', city: 'Columbus', state: 'OH', lat: 39.9612, lng: -82.9988 },

  // Southwest
  { name: 'Arizona Wilderness', city: 'Phoenix', state: 'AZ', lat: 33.4511, lng: -112.0663 },
  { name: 'La Cumbre Brewing', city: 'Albuquerque', state: 'NM', lat: 35.1107, lng: -106.6230 },

  // South
  { name: 'Parish Brewing', city: 'Broussard', state: 'LA', lat: 30.1460, lng: -91.9587 },
  { name: 'Burial Beer', city: 'Asheville', state: 'NC', lat: 35.5784, lng: -82.5510 },

  // Additional locations for variety
  { name: 'Surly Brewing', city: 'Minneapolis', state: 'MN', lat: 44.9733, lng: -93.2105 },
  { name: 'The Rare Barrel', city: 'Berkeley', state: 'CA', lat: 37.8566, lng: -122.2899 },
  { name: 'Courtyard Brewery', city: 'New Orleans', state: 'LA', lat: 29.9279, lng: -90.0890 },
  { name: 'Modern Times Flavordome', city: 'San Diego', state: 'CA', lat: 32.8843, lng: -117.1500 },
  { name: 'Wicked Weed Brewing', city: 'Asheville', state: 'NC', lat: 35.5943, lng: -82.5512 },
];

// Weighted format distribution: more drafts and cans than growlers/crowlers
const formatWeights = [
  { format: 'DRAFT' as const, weight: 35 },
  { format: 'CAN' as const, weight: 30 },
  { format: 'BOTTLE' as const, weight: 18 },
  { format: 'CROWLER' as const, weight: 10 },
  { format: 'GROWLER' as const, weight: 7 },
];

// Weighted freshness distribution
const freshnessWeights = [
  { freshness: 'FRESH' as const, weight: 30 },
  { freshness: 'RECENT' as const, weight: 35 },
  { freshness: 'AGED' as const, weight: 10 },
  { freshness: 'UNKNOWN' as const, weight: 25 },
];

// 25+ varied, realistic notes
const sampleNotes = [
  'Just tapped today! Super fresh',
  "Last 4-pack on the shelf, grab it quick",
  'Bartender recommended this, excellent on draft',
  'Annual release just hit distribution',
  'Cold-stored in the back cooler',
  'Part of a new mixed pack',
  "Seasonal release, won't last long",
  'Found this hiding behind the IPAs',
  "Great price, cheaper than I've seen elsewhere",
  'Had to ask for it - they keep it behind the counter',
  'Flight available too if you want to sample first',
  'Paired perfectly with their burger menu',
  'Brewery fresh, canned just last week',
  'Rotating tap, might change by weekend',
  'Spotted a full case in the walk-in cooler',
  'Staff said they just got a new shipment in today',
  'Only venue in the area carrying this right now',
  'Grabbed the second-to-last bottle, go fast',
  'On nitro today which is rare for this one',
  'Vintage date on the bottle looks recent',
  'They had it tucked away on the top shelf',
  'Happy hour pricing makes this a steal',
  'Saw the delivery truck unloading these just now',
  'Tap list says it just kicked, might want to call ahead',
  'Freshest pour I have had in a long time',
  'Limited to 2 per person, popular release',
  'Part of a collab series, worth checking out',
  'Perfectly carbonated, clearly well-kept lines',
  'Small batch variant, different from the regular version',
  'They rotate this in about once a month',
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedRandom<T extends { weight: number }>(items: T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  for (const item of items) {
    random -= item.weight;
    if (random <= 0) return item;
  }
  return items[items.length - 1];
}

function randomPrice(min: number, max: number): number {
  // Round to nearest quarter for realistic pricing
  const raw = Math.random() * (max - min) + min;
  return Math.round(raw * 4) / 4;
}

function randomDateWithinDays(days: number): Date {
  const now = Date.now();
  const offset = Math.random() * days * 24 * 60 * 60 * 1000;
  const date = new Date(now - offset);
  // Set to a realistic hour (10am - 10pm)
  date.setHours(Math.floor(Math.random() * 12) + 10);
  date.setMinutes(Math.floor(Math.random() * 60));
  date.setSeconds(Math.floor(Math.random() * 60));
  return date;
}

async function main() {
  console.log('Populating sightings...\n');

  // Query all users and beers from DB
  const users = await prisma.user.findMany({ select: { id: true, username: true } });
  const beers = await prisma.beer.findMany({
    select: { id: true, name: true },
  });

  if (users.length === 0) {
    console.error('ERROR: No users found in database. Seed users first.');
    process.exit(1);
  }
  if (beers.length === 0) {
    console.error('ERROR: No beers found in database. Seed beers first.');
    process.exit(1);
  }

  console.log(`Found ${users.length} users and ${beers.length} beers in database.`);
  console.log(`Using ${locations.length} locations across the US.\n`);

  const TARGET_SIGHTINGS = 155;
  let created = 0;
  const cityCounts: Record<string, number> = {};
  const formatCounts: Record<string, number> = {};
  const stateCounts: Record<string, number> = {};

  for (let i = 0; i < TARGET_SIGHTINGS; i++) {
    const user = randomElement(users);
    const beer = randomElement(beers);
    const location = randomElement(locations);

    // Weighted format selection
    const formatChoice = weightedRandom(formatWeights).format;

    // Weighted freshness selection
    const freshnessChoice = weightedRandom(freshnessWeights).freshness;

    // Slight GPS variation +/- 0.005
    const latitude = location.lat + (Math.random() - 0.5) * 0.01;
    const longitude = location.lng + (Math.random() - 0.5) * 0.01;

    // 70% have prices, format-appropriate ranges
    let price: number | null = null;
    if (Math.random() < 0.7) {
      switch (formatChoice) {
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
          price = randomPrice(12, 22);
          break;
        case 'GROWLER':
          price = randomPrice(15, 32);
          break;
      }
    }

    // 40% have notes
    const notes = Math.random() < 0.4 ? randomElement(sampleNotes) : null;

    // Confirm count: 0-5, with ~20% having 3+
    let confirmCount: number;
    const roll = Math.random();
    if (roll < 0.4) {
      confirmCount = 0;
    } else if (roll < 0.6) {
      confirmCount = 1;
    } else if (roll < 0.8) {
      confirmCount = 2;
    } else if (roll < 0.9) {
      confirmCount = 3;
    } else if (roll < 0.95) {
      confirmCount = 4;
    } else {
      confirmCount = 5;
    }
    const isVerified = confirmCount >= 3;

    // Created within last 7 days
    const createdAt = randomDateWithinDays(7);

    // Expires 7 days after creation
    const expiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);

    try {
      await prisma.sighting.create({
        data: {
          userId: user.id,
          beerId: beer.id,
          locationName: location.name,
          city: location.city,
          state: location.state,
          latitude,
          longitude,
          format: formatChoice,
          freshness: freshnessChoice,
          price,
          notes,
          confirmCount,
          isVerified,
          createdAt,
          expiresAt,
          updatedAt: createdAt,
        },
      });

      created++;
      cityCounts[location.city] = (cityCounts[location.city] || 0) + 1;
      formatCounts[formatChoice] = (formatCounts[formatChoice] || 0) + 1;
      stateCounts[location.state] = (stateCounts[location.state] || 0) + 1;

      console.log(
        `  [${created}/${TARGET_SIGHTINGS}] ${beer.name} at ${location.name}, ${location.city} ${location.state} (${formatChoice})`
      );
    } catch (err) {
      console.error(`  FAILED sighting #${i + 1}:`, err);
    }
  }

  // Summary output
  console.log('\n========================================');
  console.log('  SIGHTINGS POPULATION COMPLETE');
  console.log('========================================\n');
  console.log(`Total sightings created: ${created}`);
  console.log(`Target was: ${TARGET_SIGHTINGS}`);

  // Top 15 cities
  console.log('\n--- Sightings by City (top 15) ---');
  Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([city, count]) => {
      const bar = '#'.repeat(count);
      console.log(`  ${city.padEnd(20)} ${String(count).padStart(3)}  ${bar}`);
    });

  // Format breakdown
  console.log('\n--- Sightings by Format ---');
  Object.entries(formatCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([format, count]) => {
      const pct = ((count / created) * 100).toFixed(1);
      console.log(`  ${format.padEnd(10)} ${String(count).padStart(3)}  (${pct}%)`);
    });

  // State breakdown
  console.log('\n--- Sightings by State ---');
  Object.entries(stateCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([state, count]) => {
      console.log(`  ${state.padEnd(5)} ${String(count).padStart(3)}`);
    });

  // Verification stats
  const verifiedCount = await prisma.sighting.count({ where: { isVerified: true } });
  const totalCount = await prisma.sighting.count();
  console.log(`\n--- Verification Stats (all sightings in DB) ---`);
  console.log(`  Total sightings: ${totalCount}`);
  console.log(`  Verified:        ${verifiedCount}`);
  console.log(`  Unverified:      ${totalCount - verifiedCount}`);
}

main()
  .catch((e) => {
    console.error('FATAL:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
