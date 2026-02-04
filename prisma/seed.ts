import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create achievements
  const achievements = [
    {
      name: 'First Sip',
      slug: 'first-sip',
      description: 'Write your first beer review',
      category: 'REVIEWING' as const,
      rarity: 'COMMON' as const,
      pointsAwarded: 10,
      criteria: { type: 'reviews_count', count: 1 },
    },
    {
      name: 'Beer Critic',
      slug: 'beer-critic',
      description: 'Write 10 beer reviews',
      category: 'REVIEWING' as const,
      rarity: 'UNCOMMON' as const,
      pointsAwarded: 50,
      criteria: { type: 'reviews_count', count: 10 },
    },
    {
      name: 'Connoisseur',
      slug: 'connoisseur',
      description: 'Write 50 beer reviews',
      category: 'REVIEWING' as const,
      rarity: 'RARE' as const,
      pointsAwarded: 200,
      criteria: { type: 'reviews_count', count: 50 },
    },
    {
      name: 'Beer Sommelier',
      slug: 'beer-sommelier',
      description: 'Write 100 beer reviews',
      category: 'REVIEWING' as const,
      rarity: 'EPIC' as const,
      pointsAwarded: 500,
      criteria: { type: 'reviews_count', count: 100 },
    },
    {
      name: 'Scout',
      slug: 'scout',
      description: 'Report your first beer sighting',
      category: 'SIGHTING' as const,
      rarity: 'COMMON' as const,
      pointsAwarded: 10,
      criteria: { type: 'sightings_count', count: 1 },
    },
    {
      name: 'Beer Hunter',
      slug: 'beer-hunter',
      description: 'Report 25 beer sightings',
      category: 'SIGHTING' as const,
      rarity: 'RARE' as const,
      pointsAwarded: 150,
      criteria: { type: 'sightings_count', count: 25 },
    },
    {
      name: 'Scanner',
      slug: 'scanner',
      description: 'Scan your first beer',
      category: 'SCANNING' as const,
      rarity: 'COMMON' as const,
      pointsAwarded: 10,
      criteria: { type: 'scans_count', count: 1 },
    },
    {
      name: 'AI Enthusiast',
      slug: 'ai-enthusiast',
      description: 'Scan 50 beers',
      category: 'SCANNING' as const,
      rarity: 'RARE' as const,
      pointsAwarded: 150,
      criteria: { type: 'scans_count', count: 50 },
    },
    {
      name: 'Style Explorer',
      slug: 'style-explorer',
      description: 'Try 10 different beer styles',
      category: 'COLLECTION' as const,
      rarity: 'UNCOMMON' as const,
      pointsAwarded: 75,
      criteria: { type: 'unique_styles', count: 10 },
    },
    {
      name: 'Brewery Hopper',
      slug: 'brewery-hopper',
      description: 'Review beers from 10 different breweries',
      category: 'COLLECTION' as const,
      rarity: 'UNCOMMON' as const,
      pointsAwarded: 75,
      criteria: { type: 'unique_breweries', count: 10 },
    },
    {
      name: 'Influencer',
      slug: 'influencer',
      description: 'Gain 10 followers',
      category: 'SOCIAL' as const,
      rarity: 'UNCOMMON' as const,
      pointsAwarded: 50,
      criteria: { type: 'followers_count', count: 10 },
    },
    {
      name: 'Beer Guru',
      slug: 'beer-guru',
      description: 'Gain 100 followers',
      category: 'SOCIAL' as const,
      rarity: 'EPIC' as const,
      pointsAwarded: 300,
      criteria: { type: 'followers_count', count: 100 },
    },
    {
      name: 'Helpful',
      slug: 'helpful',
      description: 'Receive 10 helpful votes on your reviews',
      category: 'SOCIAL' as const,
      rarity: 'UNCOMMON' as const,
      pointsAwarded: 50,
      criteria: { type: 'helpful_votes', count: 10 },
    },
    {
      name: 'Level 5',
      slug: 'level-5',
      description: 'Reach level 5',
      category: 'SPECIAL' as const,
      rarity: 'UNCOMMON' as const,
      pointsAwarded: 100,
      criteria: { type: 'level', count: 5 },
    },
    {
      name: 'Level 10',
      slug: 'level-10',
      description: 'Reach level 10',
      category: 'SPECIAL' as const,
      rarity: 'RARE' as const,
      pointsAwarded: 250,
      criteria: { type: 'level', count: 10 },
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { slug: achievement.slug },
      create: achievement,
      update: achievement,
    });
  }

  console.log(`✅ Created ${achievements.length} achievements`);

  // Create sample breweries
  const breweries = [
    {
      name: 'Sierra Nevada Brewing Co.',
      slug: 'sierra-nevada',
      type: 'REGIONAL' as const,
      description: 'One of America\'s most iconic craft breweries, known for Pale Ale.',
      city: 'Chico',
      state: 'California',
      country: 'USA',
      specialties: ['Pale Ale', 'IPA', 'Stout'],
      hasTaproom: true,
      hasTours: true,
      foundedYear: 1980,
      iqScore: 92,
    },
    {
      name: 'Bell\'s Brewery',
      slug: 'bells-brewery',
      type: 'REGIONAL' as const,
      description: 'Michigan craft brewing pioneer, famous for Two Hearted Ale.',
      city: 'Kalamazoo',
      state: 'Michigan',
      country: 'USA',
      specialties: ['IPA', 'Stout', 'Wheat Beer'],
      hasTaproom: true,
      hasTours: true,
      foundedYear: 1985,
      iqScore: 90,
    },
    {
      name: 'Stone Brewing',
      slug: 'stone-brewing',
      type: 'REGIONAL' as const,
      description: 'Known for aggressive IPAs and bold flavors.',
      city: 'Escondido',
      state: 'California',
      country: 'USA',
      specialties: ['IPA', 'Double IPA', 'Stout'],
      hasTaproom: true,
      hasTours: true,
      foundedYear: 1996,
      iqScore: 88,
    },
    {
      name: 'Founders Brewing Co.',
      slug: 'founders-brewing',
      type: 'REGIONAL' as const,
      description: 'Craft brewing innovators from Grand Rapids.',
      city: 'Grand Rapids',
      state: 'Michigan',
      country: 'USA',
      specialties: ['Stout', 'IPA', 'Red Ale'],
      hasTaproom: true,
      hasTours: true,
      foundedYear: 1997,
      iqScore: 89,
    },
    {
      name: 'Dogfish Head Craft Brewery',
      slug: 'dogfish-head',
      type: 'REGIONAL' as const,
      description: 'Off-centered ales for off-centered people.',
      city: 'Milton',
      state: 'Delaware',
      country: 'USA',
      specialties: ['IPA', 'Experimental', 'Fruit Beer'],
      hasTaproom: true,
      hasTours: true,
      foundedYear: 1995,
      iqScore: 87,
    },
  ];

  for (const brewery of breweries) {
    await prisma.brewery.upsert({
      where: { slug: brewery.slug },
      create: brewery,
      update: brewery,
    });
  }

  console.log(`✅ Created ${breweries.length} breweries`);

  // Get brewery IDs for beer creation
  const sierraNevada = await prisma.brewery.findUnique({ where: { slug: 'sierra-nevada' } });
  const bells = await prisma.brewery.findUnique({ where: { slug: 'bells-brewery' } });
  const stone = await prisma.brewery.findUnique({ where: { slug: 'stone-brewing' } });
  const founders = await prisma.brewery.findUnique({ where: { slug: 'founders-brewing' } });
  const dogfish = await prisma.brewery.findUnique({ where: { slug: 'dogfish-head' } });

  // Create sample beers
  const beers = [
    {
      name: 'Pale Ale',
      slug: 'sierra-nevada-pale-ale',
      breweryId: sierraNevada!.id,
      style: 'American Pale Ale',
      description: 'The beer that started it all. Bold and complex with pine and citrus notes.',
      abv: 5.6,
      ibu: 38,
      iqScore: 88,
      tier: 'PLATINUM' as const,
      flavorTags: ['hoppy', 'citrus', 'piney', 'balanced'],
      foodPairings: ['burgers', 'pizza', 'grilled chicken'],
    },
    {
      name: 'Two Hearted Ale',
      slug: 'bells-two-hearted-ale',
      breweryId: bells!.id,
      style: 'American IPA',
      description: 'An American IPA with 100% Centennial hops.',
      abv: 7.0,
      ibu: 55,
      iqScore: 95,
      tier: 'DIAMOND' as const,
      flavorTags: ['hoppy', 'citrus', 'grapefruit', 'floral'],
      foodPairings: ['spicy tacos', 'curry', 'blue cheese'],
    },
    {
      name: 'Arrogant Bastard Ale',
      slug: 'stone-arrogant-bastard',
      breweryId: stone!.id,
      style: 'American Strong Ale',
      description: 'A strong ale for those who have the audacity to be different.',
      abv: 7.2,
      ibu: 100,
      iqScore: 85,
      tier: 'GOLD' as const,
      flavorTags: ['bitter', 'malty', 'aggressive', 'bold'],
      foodPairings: ['steak', 'barbecue', 'sharp cheddar'],
    },
    {
      name: 'Breakfast Stout',
      slug: 'founders-breakfast-stout',
      breweryId: founders!.id,
      style: 'Imperial Stout',
      description: 'Double chocolate, coffee, and oatmeal stout brewed with flaked oats.',
      abv: 8.3,
      ibu: 60,
      iqScore: 93,
      tier: 'DIAMOND' as const,
      flavorTags: ['coffee', 'chocolate', 'roasted', 'creamy'],
      foodPairings: ['chocolate desserts', 'pancakes', 'smoked meats'],
    },
    {
      name: '60 Minute IPA',
      slug: 'dogfish-head-60-minute-ipa',
      breweryId: dogfish!.id,
      style: 'American IPA',
      description: 'Continually hopped for 60 minutes for a balanced, flavorful IPA.',
      abv: 6.0,
      ibu: 60,
      iqScore: 86,
      tier: 'PLATINUM' as const,
      flavorTags: ['hoppy', 'citrus', 'balanced', 'smooth'],
      foodPairings: ['fish tacos', 'pad thai', 'goat cheese'],
    },
  ];

  for (const beer of beers) {
    await prisma.beer.upsert({
      where: { slug: beer.slug },
      create: beer,
      update: beer,
    });
  }

  console.log(`✅ Created ${beers.length} beers`);

  // Create a demo user
  const passwordHash = await bcrypt.hash('Demo123!', 12);
  await prisma.user.upsert({
    where: { email: 'demo@brewiq.ai' },
    create: {
      email: 'demo@brewiq.ai',
      username: 'demo',
      displayName: 'Demo User',
      passwordHash,
      isVerified: true,
      membershipTier: 'PRO',
      points: 500,
      level: 5,
    },
    update: {},
  });

  console.log('✅ Created demo user (demo@brewiq.ai / Demo123!)');

  console.log('🌱 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
