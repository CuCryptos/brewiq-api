import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomFloat(min: number, max: number, step: number): number {
  const steps = Math.round((max - min) / step);
  return min + Math.floor(Math.random() * (steps + 1)) * step;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedRating(): number {
  // Weighted toward 3.5-4.5
  const weights = [
    { rating: 2.5, weight: 3 },
    { rating: 3.0, weight: 8 },
    { rating: 3.5, weight: 20 },
    { rating: 4.0, weight: 30 },
    { rating: 4.5, weight: 25 },
    { rating: 5.0, weight: 14 },
  ];
  const total = weights.reduce((s, w) => s + w.weight, 0);
  let r = Math.random() * total;
  for (const w of weights) {
    r -= w.weight;
    if (r <= 0) return w.rating;
  }
  return 4.0;
}

// ============================================================
// REVIEW DATA - Persona voice templates
// ============================================================

const personaReviews: Record<string, {
  voice: string;
  templates: string[];
  servingTypes: string[];
}> = {
  brewmaster_mike: {
    voice: 'technical',
    templates: [
      'The grain bill here is well-constructed with {adj} malt character supporting the {style} profile. Fermentation appears clean with {note}. {verdict}',
      'Interesting hop selection creating {adj} notes of {note}. The mash temperature was clearly dialed in for {style} drinkability. {verdict}',
      'From a brewing perspective, the {adj} character shows excellent process control. {note} comes through beautifully. {verdict}',
      'The yeast selection drives {adj} esters that complement the {style} base. Water chemistry seems optimized for {note}. {verdict}',
    ],
    servingTypes: ['draft', 'can', 'bottle'],
  },
  beerbabe_lex: {
    voice: 'casual',
    templates: [
      'Okay this is {adj}! Tastes like {note} and I am totally here for it. {verdict}',
      'Tried this at a {place} and it was {adj}. Super {note} vibes. {verdict}',
      'My friend recommended this and it is {adj}! The {note} flavor is everything. {verdict}',
      'Not gonna lie, this is pretty {adj}. Like {note} but make it beer. {verdict}',
    ],
    servingTypes: ['can', 'draft'],
  },
  cicerone_james: {
    voice: 'formal',
    templates: [
      'Per style guidelines, this {style} demonstrates {adj} adherence to tradition. {note} is precisely calibrated. {verdict}',
      'An {adj} example of the {style} style. The {note} contributes to a {adj2} overall impression. {verdict}',
      'The {adj} character is well-integrated with {note}. This represents a {adj2} interpretation of {style}. {verdict}',
      'Evaluating against BJCP standards, the {adj} profile aligns with expectations for {style}. Notable {note}. {verdict}',
    ],
    servingTypes: ['draft', 'bottle', 'can'],
  },
  craftdad: {
    voice: 'dad',
    templates: [
      'Perfect {place} beer. {adj} enough to enjoy but not so crazy the neighbors judge you. {note} is a nice touch. {verdict}',
      'Grabbed this at the store and the kids think I am fancy now. {adj} with {note} that even my wife appreciated. {verdict}',
      'This is what I reach for after a long {place} day. {adj} and {note} - exactly what a tired dad needs. {verdict}',
      'Brought this to the {place} and became everyone\'s best friend. {adj} with solid {note}. {verdict}',
    ],
    servingTypes: ['can', 'bottle'],
  },
  pilsner_pete: {
    voice: 'lager-loyalist',
    templates: [
      'For a {style} this is surprisingly {adj}. The {note} does not overpower like most craft beers try to. {verdict}',
      'I appreciate the {adj} restraint here. {note} without going overboard. That is how you brew {style}. {verdict}',
      '{adj} and actually refreshing - rare for modern craft. The {note} is pleasant without being obnoxious. {verdict}',
      'Would rather have a pilsner but this {style} is at least {adj}. {note} shows some respect for tradition. {verdict}',
    ],
    servingTypes: ['draft', 'can', 'bottle'],
  },
  barrel_queen: {
    voice: 'barrel-focused',
    templates: [
      'The {adj} barrel character here adds layers of {note}. {verdict} Would love to see a barrel-aged variant.',
      'Interesting {style} but it needs wood. The {adj} base would be {adj2} with some bourbon barrel time. {note} has potential. {verdict}',
      'The {adj} profile hints at what barrel aging could do. {note} would integrate beautifully with oak and vanilla. {verdict}',
      'As a {style} the {adj} character is solid. {note} gives it depth. {verdict}',
    ],
    servingTypes: ['bottle', 'draft'],
  },
  hops_and_dreams: {
    voice: 'college-hype',
    templates: [
      'DUDE this is {adj}! The {note} is insane. Brought some to the dorm and everyone lost it. {verdict}',
      'My roommate and I split this and it was {adj}. Like {note} in a glass. {verdict}',
      'Just discovered this {style} and I am obsessed. So {adj} with {note} character. {verdict}',
      'Road tripped to get this and totally worth it. {adj} with {note} that goes on forever. {verdict}',
    ],
    servingTypes: ['can', 'draft'],
  },
  the_beerologist: {
    voice: 'scientific',
    templates: [
      'The {adj} compounds in this {style} suggest {note}. Attenuation appears well-controlled with {adj2} residual sugar balance. {verdict}',
      'Analyzing the {adj} profile reveals {note} likely from specific yeast metabolism. The pH balance contributes to a {adj2} finish. {verdict}',
      'From a biochemistry perspective, the {adj} character derives from {note}. The fermentation kinetics are clearly {adj2}. {verdict}',
      'The {adj} aromatic compounds indicate {note}. Maillard reaction products are {adj2} integrated. {verdict}',
    ],
    servingTypes: ['draft', 'can', 'bottle'],
  },
  patio_pints: {
    voice: 'vibes',
    templates: [
      'Had this on a {place} and the {adj} character matched the setting perfectly. {note} in the fresh air hits different. {verdict}',
      'This {style} is made for {place} drinking. {adj} and {note} with the perfect vibe. {verdict}',
      'Cracked this open during a {place} session and it was {adj}. The {note} paired with the atmosphere beautifully. {verdict}',
      'Context matters and this beer at a {place} was {adj}. {note} elevated the whole experience. {verdict}',
    ],
    servingTypes: ['can', 'draft'],
  },
  alexa_brews: {
    voice: 'brief-evocative',
    templates: [
      '{adj} in the glass. {note} on the nose. {verdict}',
      '{adj} pour with {note}. {verdict} Photographs beautifully.',
      'Visually {adj}. Aroma of {note}. {verdict}',
      '{adj} color, {note} character. {verdict} Worth the shot.',
    ],
    servingTypes: ['draft', 'can', 'bottle'],
  },
  untapped_dan: {
    voice: 'efficient-rater',
    templates: [
      '{adj} {style} that delivers. {note} is on point. Quick {verdict}',
      'Check-in complete. {adj} with {note}. {verdict} Moving on to the next.',
      '{adj} for a {style}. {note} stands out. {verdict} Badge earned.',
      'Solid {adj} entry. {note} does the job. {verdict}',
    ],
    servingTypes: ['can', 'draft', 'bottle'],
  },
  suds_n_buds: {
    voice: 'enthusiastic-newbie',
    templates: [
      'Wait this is {adj}?? I had no idea {style} could taste like {note}! {verdict}',
      'My beer journey continues! This {style} is {adj} with {note}. Learning so much! {verdict}',
      'Someone at the bar recommended this and it is {adj}! The {note} blew my mind. {verdict}',
      'Another new {style} for me and it is {adj}! I can taste the {note} now. {verdict}',
    ],
    servingTypes: ['can', 'draft'],
  },
  grainbill_gary: {
    voice: 'retired-brewer',
    templates: [
      'After 30 years in the industry I know good {style} when I taste it. This is {adj} with {note} that shows real craft. {verdict}',
      'The brewer clearly understands {style}. {adj} execution with {note} that demonstrates skill. {verdict}',
      'In my brewing days we would have been proud of this {adj} {style}. The {note} shows thoughtful recipe design. {verdict}',
      'Respect to the brewer. This {adj} {style} with {note} shows they know what they are doing. {verdict}',
    ],
    servingTypes: ['draft', 'bottle'],
  },
  wild_ale_wendy: {
    voice: 'wild-specialist',
    templates: [
      'The {adj} fermentation character here is {adj2}. {note} adds complexity. {verdict}',
      'From a wild ale perspective, this {style} has {adj} qualities. {note} hints at mixed-culture potential. {verdict}',
      'The {adj} profile could benefit from some Brett. {note} is pleasant but I crave more funk. {verdict}',
      'Interesting {adj} {style} with {note}. {verdict} Would love a wild version.',
    ],
    servingTypes: ['bottle', 'draft'],
  },
  session_king: {
    voice: 'low-abv-advocate',
    templates: [
      'At this ABV the {adj} character is impressive. {note} proves you do not need high alcohol for flavor. {verdict}',
      'This {style} shows {adj} restraint. {note} in a sessionable package is exactly what craft needs more of. {verdict}',
      '{adj} and drinkable - what a concept. {note} without the boozy heat. {verdict}',
      'The {adj} profile at this strength shows real brewing skill. {note} is well-integrated. {verdict}',
    ],
    servingTypes: ['can', 'draft'],
  },
};

const adjectives = ['excellent', 'solid', 'impressive', 'clean', 'bold', 'nuanced', 'bright', 'robust', 'delicate', 'rich', 'crisp', 'smooth', 'complex', 'refreshing', 'intense', 'balanced', 'lively', 'elegant'];
const adjectives2 = ['satisfying', 'pleasant', 'well-executed', 'noteworthy', 'commendable', 'remarkable', 'enjoyable', 'refined', 'accomplished', 'polished'];
const notes = ['citrus and pine', 'tropical fruit', 'caramel malt', 'roasted barley', 'floral hops', 'stone fruit', 'dark chocolate', 'espresso', 'vanilla and oak', 'biscuit and honey', 'toffee', 'grapefruit pith', 'mango and papaya', 'lemon zest', 'toasted bread'];
const verdicts = ['Would happily drink again.', 'Solid offering.', 'Impressed overall.', 'A worthy addition to the lineup.', 'Delivers on its promise.', 'Not my favorite but respectable.', 'This hits the mark.', 'Well done.', 'Exceeded my expectations.', 'Exactly what I wanted.'];
const places = ['backyard', 'rooftop bar', 'porch', 'tailgate', 'beach', 'brewery taproom', 'neighborhood BBQ', 'fire pit', 'patio', 'boat', 'camping trip'];

function generateReviewContent(persona: string, style: string): string {
  const p = personaReviews[persona];
  if (!p) return 'Good beer, enjoyed it.';
  const template = randomElement(p.templates);
  return template
    .replace('{adj}', randomElement(adjectives))
    .replace('{adj2}', randomElement(adjectives2))
    .replace('{note}', randomElement(notes))
    .replace('{style}', style)
    .replace('{verdict}', randomElement(verdicts))
    .replace('{place}', randomElement(places));
}

// ============================================================
// SIGHTING LOCATIONS (reused from populate-sightings.ts pattern)
// ============================================================

const locations = [
  { name: 'The Porter Beer Bar', city: 'Atlanta', state: 'GA', lat: 33.7756, lng: -84.3853 },
  { name: 'Brick Store Pub', city: 'Decatur', state: 'GA', lat: 33.7748, lng: -84.2963 },
  { name: 'Craft Brewed', city: 'Nashville', state: 'TN', lat: 36.1627, lng: -86.7816 },
  { name: 'ChurchKey', city: 'Washington', state: 'DC', lat: 38.9107, lng: -77.0301 },
  { name: "Monk's Cafe", city: 'Philadelphia', state: 'PA', lat: 39.9479, lng: -75.1638 },
  { name: 'Pine Box', city: 'Seattle', state: 'WA', lat: 47.6148, lng: -122.3194 },
  { name: 'Hair of the Dog Brewing', city: 'Portland', state: 'OR', lat: 45.5109, lng: -122.6623 },
  { name: 'Beerhive Pub', city: 'Salt Lake City', state: 'UT', lat: 40.7608, lng: -111.8910 },
  { name: 'Sugar Maple', city: 'Milwaukee', state: 'WI', lat: 43.0205, lng: -87.9089 },
  { name: 'Side Project Cellar', city: 'Maplewood', state: 'MO', lat: 38.6118, lng: -90.3226 },
  { name: 'Rhinegeist Brewery', city: 'Cincinnati', state: 'OH', lat: 39.1157, lng: -84.5198 },
  { name: 'Arizona Wilderness', city: 'Phoenix', state: 'AZ', lat: 33.4511, lng: -112.0663 },
  { name: 'Surly Brewing', city: 'Minneapolis', state: 'MN', lat: 44.9733, lng: -93.2105 },
  { name: 'The Rare Barrel', city: 'Berkeley', state: 'CA', lat: 37.8566, lng: -122.2899 },
  { name: 'Modern Times Flavordome', city: 'San Diego', state: 'CA', lat: 32.8843, lng: -117.1500 },
  { name: 'Wicked Weed Brewing', city: 'Asheville', state: 'NC', lat: 35.5943, lng: -82.5512 },
  { name: "Max's Taphouse", city: 'Baltimore', state: 'MD', lat: 39.2883, lng: -76.5975 },
  { name: "Chuck's Hop Shop", city: 'Seattle', state: 'WA', lat: 47.6126, lng: -122.3122 },
  { name: 'Bier Station', city: 'Kansas City', state: 'MO', lat: 39.0557, lng: -94.5762 },
  { name: 'Parish Brewing', city: 'Broussard', state: 'LA', lat: 30.1460, lng: -91.9587 },
];

const sightingNotes = [
  'Just tapped today, super fresh',
  'Last few cans on the shelf',
  'Bartender recommended this, excellent on draft',
  'Annual release just dropped',
  'Cold-stored in the back cooler',
  'Seasonal release, will not last long',
  'Found this hiding behind the IPAs',
  'Great price compared to other spots',
  'Flight available if you want to sample first',
  'Brewery fresh, canned last week',
  'Rotating tap, might change by weekend',
  'Staff said new shipment came in today',
  'On nitro today which is rare',
  'Limited to 2 per person',
  'Perfectly carbonated, well-kept lines',
];

const formatWeights = [
  { format: 'DRAFT' as const, weight: 35 },
  { format: 'CAN' as const, weight: 30 },
  { format: 'BOTTLE' as const, weight: 18 },
  { format: 'CROWLER' as const, weight: 10 },
  { format: 'GROWLER' as const, weight: 7 },
];

const freshnessWeights = [
  { freshness: 'FRESH' as const, weight: 30 },
  { freshness: 'RECENT' as const, weight: 35 },
  { freshness: 'AGED' as const, weight: 10 },
  { freshness: 'UNKNOWN' as const, weight: 25 },
];

function weightedRandom<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

// ============================================================
// RECIPE DATA - 20+ clone recipes for popular beers
// ============================================================

const cloneRecipes = [
  {
    beerSlug: 'bells-two-hearted-ale',
    name: 'Two Hearted Ale Clone',
    slug: 'two-hearted-ale-clone',
    style: 'IPA',
    difficulty: 'INTERMEDIATE' as const,
    description: 'A faithful clone of the iconic single-hop Centennial IPA. Focus on water chemistry and a clean fermentation to let the hops shine.',
    batchSize: 5, boilTime: 60,
    estimatedOg: 1.065, estimatedFg: 1.012, estimatedAbv: 7.0, estimatedIbu: 55, estimatedSrm: 8,
    grains: [{ name: '2-Row Pale Malt', amount: 12, unit: 'lb' }, { name: 'Crystal 40L', amount: 0.5, unit: 'lb' }, { name: 'Munich Malt', amount: 0.5, unit: 'lb' }],
    hops: [{ name: 'Centennial', amount: 1.5, unit: 'oz', use: 'Boil', timing: '60 min' }, { name: 'Centennial', amount: 1, unit: 'oz', use: 'Boil', timing: '15 min' }, { name: 'Centennial', amount: 2, unit: 'oz', use: 'Dry Hop', timing: '5 days' }],
    yeast: { name: 'Safale US-05', brand: 'Fermentis', attenuation: 77 },
    adjuncts: [],
    mashTemp: 152, mashTime: 60, fermentTemp: 66, fermentDays: 14,
    notes: 'Use RO water with gypsum for a hop-forward profile. Keep fermentation temps below 68F for a clean finish.',
  },
  {
    beerSlug: 'founders-kbs',
    name: 'KBS Clone',
    slug: 'kbs-clone',
    style: 'Imperial Stout',
    difficulty: 'EXPERT' as const,
    description: 'A bourbon barrel-aged imperial stout clone inspired by Founders KBS. Requires bourbon barrel chips or a bourbon barrel for aging.',
    batchSize: 5, boilTime: 90,
    estimatedOg: 1.110, estimatedFg: 1.028, estimatedAbv: 11.8, estimatedIbu: 70, estimatedSrm: 45,
    grains: [{ name: '2-Row Pale Malt', amount: 16, unit: 'lb' }, { name: 'Chocolate Malt', amount: 1.5, unit: 'lb' }, { name: 'Roasted Barley', amount: 1, unit: 'lb' }, { name: 'Flaked Oats', amount: 1.5, unit: 'lb' }, { name: 'Crystal 120L', amount: 0.75, unit: 'lb' }],
    hops: [{ name: 'Nugget', amount: 2, unit: 'oz', use: 'Boil', timing: '60 min' }, { name: 'Willamette', amount: 1, unit: 'oz', use: 'Boil', timing: '15 min' }],
    yeast: { name: 'WLP001 California Ale', brand: 'White Labs', attenuation: 76 },
    adjuncts: [{ name: 'Kona Coffee', amount: 4, unit: 'oz' }, { name: 'Sumatra Coffee', amount: 4, unit: 'oz' }, { name: 'Cacao Nibs', amount: 4, unit: 'oz' }, { name: 'Bourbon Oak Chips', amount: 4, unit: 'oz' }],
    mashTemp: 154, mashTime: 75, fermentTemp: 67, fermentDays: 28,
    notes: 'Add coffee at flameout for 15 min. Age on bourbon-soaked oak chips for 4-8 weeks. Add cacao nibs in secondary.',
  },
  {
    beerSlug: 'alchemist-heady-topper',
    name: 'Heady Topper Clone',
    slug: 'heady-topper-clone',
    style: 'Double IPA',
    difficulty: 'ADVANCED' as const,
    description: 'A hazy double IPA clone inspired by the beer that launched the hazy revolution. Heavy dry-hop additions are key.',
    batchSize: 5, boilTime: 60,
    estimatedOg: 1.075, estimatedFg: 1.014, estimatedAbv: 8.0, estimatedIbu: 75, estimatedSrm: 6,
    grains: [{ name: '2-Row Pale Malt', amount: 13, unit: 'lb' }, { name: 'Wheat Malt', amount: 1.5, unit: 'lb' }, { name: 'Flaked Oats', amount: 1, unit: 'lb' }],
    hops: [{ name: 'Columbus', amount: 1, unit: 'oz', use: 'Boil', timing: '60 min' }, { name: 'Simcoe', amount: 1.5, unit: 'oz', use: 'Whirlpool', timing: '20 min' }, { name: 'Citra', amount: 2, unit: 'oz', use: 'Dry Hop', timing: '5 days' }, { name: 'Mosaic', amount: 2, unit: 'oz', use: 'Dry Hop', timing: '5 days' }],
    yeast: { name: 'WLP095 Burlington Ale', brand: 'White Labs', attenuation: 75 },
    adjuncts: [],
    mashTemp: 152, mashTime: 60, fermentTemp: 68, fermentDays: 14,
    notes: 'Do not cold crash - haze is part of the style. Drink from the can for maximum aroma impact.',
  },
  {
    beerSlug: 'russian-river-pliny-the-elder',
    name: 'Pliny the Elder Clone',
    slug: 'pliny-the-elder-clone',
    style: 'Double IPA',
    difficulty: 'ADVANCED' as const,
    description: 'The holy grail of DIPA homebrew clones. Focus on water chemistry with high sulfate and multiple hop additions.',
    batchSize: 5, boilTime: 90,
    estimatedOg: 1.072, estimatedFg: 1.010, estimatedAbv: 8.0, estimatedIbu: 100, estimatedSrm: 6,
    grains: [{ name: '2-Row Pale Malt', amount: 13, unit: 'lb' }, { name: 'Crystal 40L', amount: 0.25, unit: 'lb' }, { name: 'CaraPils', amount: 0.5, unit: 'lb' }, { name: 'Corn Sugar', amount: 1, unit: 'lb' }],
    hops: [{ name: 'Columbus', amount: 1, unit: 'oz', use: 'Boil', timing: '90 min' }, { name: 'Columbus', amount: 0.5, unit: 'oz', use: 'Boil', timing: '45 min' }, { name: 'Centennial', amount: 1, unit: 'oz', use: 'Boil', timing: '30 min' }, { name: 'Simcoe', amount: 1, unit: 'oz', use: 'Boil', timing: '0 min' }, { name: 'Centennial', amount: 1.5, unit: 'oz', use: 'Dry Hop', timing: '7 days' }, { name: 'Simcoe', amount: 1.5, unit: 'oz', use: 'Dry Hop', timing: '7 days' }],
    yeast: { name: 'WLP001 California Ale', brand: 'White Labs', attenuation: 78 },
    adjuncts: [],
    mashTemp: 150, mashTime: 60, fermentTemp: 67, fermentDays: 14,
    notes: 'High sulfate water (300ppm+) is critical. Ferment dry and finish bone-dry. Drink fresh within 3 weeks of packaging.',
  },
  {
    beerSlug: 'tree-house-julius',
    name: 'Julius Clone',
    slug: 'julius-clone',
    style: 'NEIPA',
    difficulty: 'ADVANCED' as const,
    description: 'A hazy, juicy NEIPA clone that captures the tropical explosion of Tree House Julius. Biotransformation hopping is key.',
    batchSize: 5, boilTime: 60,
    estimatedOg: 1.065, estimatedFg: 1.014, estimatedAbv: 6.8, estimatedIbu: 45, estimatedSrm: 5,
    grains: [{ name: '2-Row Pale Malt', amount: 10, unit: 'lb' }, { name: 'Flaked Oats', amount: 2, unit: 'lb' }, { name: 'Flaked Wheat', amount: 1.5, unit: 'lb' }, { name: 'Honey Malt', amount: 0.5, unit: 'lb' }],
    hops: [{ name: 'Citra', amount: 1, unit: 'oz', use: 'Whirlpool', timing: '20 min' }, { name: 'Galaxy', amount: 1, unit: 'oz', use: 'Whirlpool', timing: '20 min' }, { name: 'Citra', amount: 2, unit: 'oz', use: 'Dry Hop', timing: 'Biotransformation' }, { name: 'Galaxy', amount: 2, unit: 'oz', use: 'Dry Hop', timing: 'Biotransformation' }],
    yeast: { name: 'London Ale III (WLP013)', brand: 'White Labs', attenuation: 72 },
    adjuncts: [],
    mashTemp: 154, mashTime: 60, fermentTemp: 68, fermentDays: 14,
    notes: 'Add biotransformation dry hops 2-3 days into active fermentation. Use chloride-forward water (2:1 chloride to sulfate).',
  },
  {
    beerSlug: 'founders-breakfast-stout',
    name: 'Breakfast Stout Clone',
    slug: 'breakfast-stout-clone',
    style: 'Imperial Stout',
    difficulty: 'INTERMEDIATE' as const,
    description: 'A rich oatmeal coffee stout clone with dual coffee additions and chocolate malt for deep, complex flavor.',
    batchSize: 5, boilTime: 60,
    estimatedOg: 1.082, estimatedFg: 1.020, estimatedAbv: 8.3, estimatedIbu: 60, estimatedSrm: 42,
    grains: [{ name: '2-Row Pale Malt', amount: 12, unit: 'lb' }, { name: 'Flaked Oats', amount: 1.5, unit: 'lb' }, { name: 'Chocolate Malt', amount: 1, unit: 'lb' }, { name: 'Roasted Barley', amount: 0.75, unit: 'lb' }, { name: 'Crystal 80L', amount: 0.5, unit: 'lb' }],
    hops: [{ name: 'Nugget', amount: 1.5, unit: 'oz', use: 'Boil', timing: '60 min' }, { name: 'Willamette', amount: 0.5, unit: 'oz', use: 'Boil', timing: '15 min' }],
    yeast: { name: 'Safale US-05', brand: 'Fermentis', attenuation: 77 },
    adjuncts: [{ name: 'Sumatra Coffee (coarse)', amount: 4, unit: 'oz' }, { name: 'Kona Coffee (coarse)', amount: 4, unit: 'oz' }, { name: 'Cacao Nibs', amount: 4, unit: 'oz' }],
    mashTemp: 154, mashTime: 60, fermentTemp: 66, fermentDays: 21,
    notes: 'Add coffee at flameout and steep 15 min. Add cacao nibs in secondary for 5 days. Do not over-extract coffee.',
  },
  {
    beerSlug: 'sierra-nevada-pale-ale',
    name: 'Sierra Nevada Pale Ale Clone',
    slug: 'sierra-nevada-pale-ale-clone',
    style: 'Pale Ale',
    difficulty: 'BEGINNER' as const,
    description: 'The classic American pale ale that every homebrewer should attempt. Simple grain bill lets the Cascade hops shine.',
    batchSize: 5, boilTime: 60,
    estimatedOg: 1.052, estimatedFg: 1.012, estimatedAbv: 5.6, estimatedIbu: 38, estimatedSrm: 8,
    grains: [{ name: '2-Row Pale Malt', amount: 9.5, unit: 'lb' }, { name: 'Crystal 60L', amount: 0.5, unit: 'lb' }],
    hops: [{ name: 'Perle', amount: 0.75, unit: 'oz', use: 'Boil', timing: '60 min' }, { name: 'Cascade', amount: 1, unit: 'oz', use: 'Boil', timing: '15 min' }, { name: 'Cascade', amount: 1, unit: 'oz', use: 'Dry Hop', timing: '7 days' }],
    yeast: { name: 'WLP001 California Ale', brand: 'White Labs', attenuation: 76 },
    adjuncts: [],
    mashTemp: 152, mashTime: 60, fermentTemp: 66, fermentDays: 14,
    notes: 'Simple recipe that rewards good process. Focus on fresh hops and clean fermentation.',
  },
  {
    beerSlug: 'firestone-walker-parabola',
    name: 'Parabola Clone',
    slug: 'parabola-clone',
    style: 'Imperial Stout',
    difficulty: 'EXPERT' as const,
    description: 'A massive barrel-aged imperial oatmeal stout. Requires a healthy yeast pitch and patience for barrel aging.',
    batchSize: 5, boilTime: 90,
    estimatedOg: 1.120, estimatedFg: 1.030, estimatedAbv: 13.5, estimatedIbu: 50, estimatedSrm: 50,
    grains: [{ name: '2-Row Pale Malt', amount: 18, unit: 'lb' }, { name: 'Flaked Oats', amount: 2, unit: 'lb' }, { name: 'Chocolate Malt', amount: 1.5, unit: 'lb' }, { name: 'Roasted Barley', amount: 1, unit: 'lb' }, { name: 'Crystal 120L', amount: 1, unit: 'lb' }, { name: 'Black Patent', amount: 0.5, unit: 'lb' }],
    hops: [{ name: 'Magnum', amount: 2, unit: 'oz', use: 'Boil', timing: '60 min' }],
    yeast: { name: 'WLP001 California Ale', brand: 'White Labs', attenuation: 78 },
    adjuncts: [{ name: 'Bourbon Oak Spirals', amount: 2, unit: 'spirals' }],
    mashTemp: 156, mashTime: 75, fermentTemp: 67, fermentDays: 35,
    notes: 'Make a massive starter. Age on bourbon oak for 2-4 months minimum. Patience is the key ingredient.',
  },
  {
    beerSlug: 'bells-oberon',
    name: 'Oberon Ale Clone',
    slug: 'oberon-ale-clone',
    style: 'Wheat Ale',
    difficulty: 'BEGINNER' as const,
    description: 'A refreshing summer wheat ale clone. Simple, sessionable, and perfect for warm weather brewing.',
    batchSize: 5, boilTime: 60,
    estimatedOg: 1.054, estimatedFg: 1.012, estimatedAbv: 5.8, estimatedIbu: 12, estimatedSrm: 4,
    grains: [{ name: '2-Row Pale Malt', amount: 5, unit: 'lb' }, { name: 'White Wheat Malt', amount: 4.5, unit: 'lb' }, { name: 'Munich Malt', amount: 0.5, unit: 'lb' }],
    hops: [{ name: 'Saaz', amount: 1, unit: 'oz', use: 'Boil', timing: '60 min' }],
    yeast: { name: 'WLP320 American Hefeweizen', brand: 'White Labs', attenuation: 72 },
    adjuncts: [],
    mashTemp: 152, mashTime: 60, fermentTemp: 66, fermentDays: 12,
    notes: 'Light hand with hops. The wheat and yeast should drive the flavor. Serve with an orange slice if desired.',
  },
  {
    beerSlug: 'toppling-goliath-king-sue',
    name: 'King Sue Clone',
    slug: 'king-sue-clone',
    style: 'Double IPA',
    difficulty: 'ADVANCED' as const,
    description: 'A Citra-focused double IPA clone with massive tropical fruit character. Heavy dry-hopping is essential.',
    batchSize: 5, boilTime: 60,
    estimatedOg: 1.072, estimatedFg: 1.013, estimatedAbv: 7.8, estimatedIbu: 65, estimatedSrm: 5,
    grains: [{ name: '2-Row Pale Malt', amount: 12, unit: 'lb' }, { name: 'Flaked Oats', amount: 1, unit: 'lb' }, { name: 'Flaked Wheat', amount: 1, unit: 'lb' }, { name: 'Corn Sugar', amount: 0.5, unit: 'lb' }],
    hops: [{ name: 'Citra', amount: 1, unit: 'oz', use: 'Boil', timing: '60 min' }, { name: 'Citra', amount: 2, unit: 'oz', use: 'Whirlpool', timing: '20 min' }, { name: 'Citra', amount: 4, unit: 'oz', use: 'Dry Hop', timing: '5 days' }],
    yeast: { name: 'London Ale III (WLP013)', brand: 'White Labs', attenuation: 72 },
    adjuncts: [],
    mashTemp: 152, mashTime: 60, fermentTemp: 68, fermentDays: 14,
    notes: 'All Citra all the time. Use at least 7oz total hops. Biotransformation dry hop for extra tropical character.',
  },
  {
    beerSlug: 'dogfish-head-60-minute-ipa',
    name: '60 Minute IPA Clone',
    slug: '60-minute-ipa-clone',
    style: 'IPA',
    difficulty: 'INTERMEDIATE' as const,
    description: 'A continuously hopped IPA clone. Add small hop additions every 5 minutes during the 60-minute boil for smooth bitterness.',
    batchSize: 5, boilTime: 60,
    estimatedOg: 1.058, estimatedFg: 1.012, estimatedAbv: 6.0, estimatedIbu: 60, estimatedSrm: 8,
    grains: [{ name: '2-Row Pale Malt', amount: 10.5, unit: 'lb' }, { name: 'Crystal 60L', amount: 0.5, unit: 'lb' }, { name: 'Amber Malt', amount: 0.25, unit: 'lb' }],
    hops: [{ name: 'Warrior', amount: 3, unit: 'oz', use: 'Continuous', timing: 'Every 5 min over 60 min' }],
    yeast: { name: 'Safale US-05', brand: 'Fermentis', attenuation: 77 },
    adjuncts: [],
    mashTemp: 152, mashTime: 60, fermentTemp: 66, fermentDays: 14,
    notes: 'Divide total hops into 12 equal additions. Add one every 5 minutes throughout the boil for smooth bitterness.',
  },
  {
    beerSlug: 'boulevard-tank-7',
    name: 'Tank 7 Clone',
    slug: 'tank-7-clone',
    style: 'Farmhouse Ale',
    difficulty: 'INTERMEDIATE' as const,
    description: 'A Belgian-style farmhouse ale clone with fruity, spicy yeast character and a dry finish.',
    batchSize: 5, boilTime: 60,
    estimatedOg: 1.076, estimatedFg: 1.008, estimatedAbv: 8.5, estimatedIbu: 38, estimatedSrm: 4,
    grains: [{ name: 'Pilsner Malt', amount: 12, unit: 'lb' }, { name: 'White Wheat Malt', amount: 1, unit: 'lb' }, { name: 'Corn Sugar', amount: 1, unit: 'lb' }],
    hops: [{ name: 'Bravo', amount: 0.75, unit: 'oz', use: 'Boil', timing: '60 min' }, { name: 'Amarillo', amount: 1, unit: 'oz', use: 'Dry Hop', timing: '5 days' }],
    yeast: { name: 'WLP565 Belgian Saison I', brand: 'White Labs', attenuation: 83 },
    adjuncts: [],
    mashTemp: 148, mashTime: 60, fermentTemp: 72, fermentDays: 21,
    notes: 'Start fermentation at 68F and ramp up to 78F over 5 days. The yeast needs warmth to fully attenuate and express character.',
  },
  {
    beerSlug: 'cigar-city-jai-alai',
    name: 'Jai Alai IPA Clone',
    slug: 'jai-alai-ipa-clone',
    style: 'IPA',
    difficulty: 'INTERMEDIATE' as const,
    description: 'A bold, citrus-forward IPA clone inspired by the Tampa classic. Multiple hop varieties create a complex, layered hop profile.',
    batchSize: 5, boilTime: 60,
    estimatedOg: 1.069, estimatedFg: 1.013, estimatedAbv: 7.5, estimatedIbu: 70, estimatedSrm: 7,
    grains: [{ name: '2-Row Pale Malt', amount: 12, unit: 'lb' }, { name: 'Crystal 40L', amount: 0.5, unit: 'lb' }, { name: 'Victory Malt', amount: 0.5, unit: 'lb' }],
    hops: [{ name: 'Columbus', amount: 1, unit: 'oz', use: 'Boil', timing: '60 min' }, { name: 'Simcoe', amount: 1, unit: 'oz', use: 'Boil', timing: '15 min' }, { name: 'Citra', amount: 1.5, unit: 'oz', use: 'Dry Hop', timing: '5 days' }, { name: 'Simcoe', amount: 0.5, unit: 'oz', use: 'Dry Hop', timing: '5 days' }],
    yeast: { name: 'Safale US-05', brand: 'Fermentis', attenuation: 77 },
    adjuncts: [],
    mashTemp: 152, mashTime: 60, fermentTemp: 66, fermentDays: 14,
    notes: 'Focus on late and dry hop additions for maximum citrus and tropical character.',
  },
  {
    beerSlug: 'left-hand-milk-stout-nitro',
    name: 'Milk Stout Clone',
    slug: 'milk-stout-clone',
    style: 'Milk Stout',
    difficulty: 'BEGINNER' as const,
    description: 'A creamy, smooth milk stout clone. Lactose provides unfermentable sweetness and body.',
    batchSize: 5, boilTime: 60,
    estimatedOg: 1.058, estimatedFg: 1.018, estimatedAbv: 6.0, estimatedIbu: 25, estimatedSrm: 35,
    grains: [{ name: '2-Row Pale Malt', amount: 9, unit: 'lb' }, { name: 'Chocolate Malt', amount: 0.75, unit: 'lb' }, { name: 'Roasted Barley', amount: 0.25, unit: 'lb' }, { name: 'Crystal 80L', amount: 0.5, unit: 'lb' }, { name: 'Flaked Barley', amount: 0.5, unit: 'lb' }],
    hops: [{ name: 'East Kent Goldings', amount: 1, unit: 'oz', use: 'Boil', timing: '60 min' }],
    yeast: { name: 'WLP002 English Ale', brand: 'White Labs', attenuation: 66 },
    adjuncts: [{ name: 'Lactose', amount: 1, unit: 'lb' }],
    mashTemp: 156, mashTime: 60, fermentTemp: 66, fermentDays: 14,
    notes: 'Add lactose with 15 min left in the boil. For nitro, serve on a nitro tap or use a nitro widget.',
  },
  {
    beerSlug: 'deschutes-fresh-squeezed',
    name: 'Fresh Squeezed IPA Clone',
    slug: 'fresh-squeezed-ipa-clone',
    style: 'IPA',
    difficulty: 'INTERMEDIATE' as const,
    description: 'A juicy, citrus-forward IPA clone with Citra and Mosaic hops creating bright grapefruit and tropical character.',
    batchSize: 5, boilTime: 60,
    estimatedOg: 1.061, estimatedFg: 1.013, estimatedAbv: 6.4, estimatedIbu: 60, estimatedSrm: 7,
    grains: [{ name: '2-Row Pale Malt', amount: 10.5, unit: 'lb' }, { name: 'Crystal 20L', amount: 0.75, unit: 'lb' }, { name: 'Munich Malt', amount: 0.5, unit: 'lb' }],
    hops: [{ name: 'Nugget', amount: 0.5, unit: 'oz', use: 'Boil', timing: '60 min' }, { name: 'Citra', amount: 1, unit: 'oz', use: 'Boil', timing: '10 min' }, { name: 'Mosaic', amount: 1, unit: 'oz', use: 'Boil', timing: '5 min' }, { name: 'Citra', amount: 1.5, unit: 'oz', use: 'Dry Hop', timing: '5 days' }, { name: 'Mosaic', amount: 1, unit: 'oz', use: 'Dry Hop', timing: '5 days' }],
    yeast: { name: 'WLP001 California Ale', brand: 'White Labs', attenuation: 76 },
    adjuncts: [],
    mashTemp: 152, mashTime: 60, fermentTemp: 66, fermentDays: 14,
    notes: 'Fresh hops are critical. The name says it all - this should taste freshly squeezed.',
  },
  {
    beerSlug: 'alesmith-speedway-stout',
    name: 'Speedway Stout Clone',
    slug: 'speedway-stout-clone',
    style: 'Imperial Stout',
    difficulty: 'EXPERT' as const,
    description: 'A massive coffee imperial stout clone. Use high-quality locally roasted coffee for best results.',
    batchSize: 5, boilTime: 90,
    estimatedOg: 1.105, estimatedFg: 1.026, estimatedAbv: 12.0, estimatedIbu: 70, estimatedSrm: 48,
    grains: [{ name: '2-Row Pale Malt', amount: 16, unit: 'lb' }, { name: 'Chocolate Malt', amount: 1.5, unit: 'lb' }, { name: 'Roasted Barley', amount: 1, unit: 'lb' }, { name: 'Crystal 120L', amount: 1, unit: 'lb' }, { name: 'Black Patent', amount: 0.5, unit: 'lb' }, { name: 'Flaked Oats', amount: 1, unit: 'lb' }],
    hops: [{ name: 'Magnum', amount: 2, unit: 'oz', use: 'Boil', timing: '60 min' }],
    yeast: { name: 'WLP001 California Ale', brand: 'White Labs', attenuation: 78 },
    adjuncts: [{ name: 'Fresh Roasted Coffee', amount: 8, unit: 'oz' }],
    mashTemp: 154, mashTime: 75, fermentTemp: 67, fermentDays: 28,
    notes: 'Cold-steep coffee for 24 hours and add to secondary. Make a double starter for this massive OG.',
  },
  {
    beerSlug: 'jester-king-le-petit-prince',
    name: 'Le Petit Prince Clone',
    slug: 'le-petit-prince-clone',
    style: 'Farmhouse Table Beer',
    difficulty: 'INTERMEDIATE' as const,
    description: 'A low-ABV farmhouse table beer with subtle wild character. Proof that small beers can have big flavor.',
    batchSize: 5, boilTime: 60,
    estimatedOg: 1.028, estimatedFg: 1.004, estimatedAbv: 2.9, estimatedIbu: 23, estimatedSrm: 3,
    grains: [{ name: 'Pilsner Malt', amount: 4.5, unit: 'lb' }, { name: 'White Wheat Malt', amount: 1, unit: 'lb' }],
    hops: [{ name: 'Saaz', amount: 1, unit: 'oz', use: 'Boil', timing: '60 min' }, { name: 'Saaz', amount: 0.5, unit: 'oz', use: 'Boil', timing: '5 min' }],
    yeast: { name: 'WLP565 Belgian Saison I', brand: 'White Labs', attenuation: 85 },
    adjuncts: [],
    mashTemp: 148, mashTime: 60, fermentTemp: 75, fermentDays: 14,
    notes: 'Mash low for maximum fermentability. Ferment warm for expressive yeast character. Optional: pitch Brett at packaging.',
  },
  {
    beerSlug: '3-floyds-zombie-dust',
    name: 'Zombie Dust Clone',
    slug: 'zombie-dust-clone',
    style: 'Pale Ale',
    difficulty: 'INTERMEDIATE' as const,
    description: 'An all-Citra pale ale clone inspired by the Midwest cult classic. Simple malt bill lets Citra shine.',
    batchSize: 5, boilTime: 60,
    estimatedOg: 1.059, estimatedFg: 1.012, estimatedAbv: 6.2, estimatedIbu: 50, estimatedSrm: 6,
    grains: [{ name: '2-Row Pale Malt', amount: 10, unit: 'lb' }, { name: 'Munich Malt', amount: 0.5, unit: 'lb' }, { name: 'Crystal 40L', amount: 0.25, unit: 'lb' }],
    hops: [{ name: 'Citra', amount: 1, unit: 'oz', use: 'Boil', timing: '60 min' }, { name: 'Citra', amount: 1, unit: 'oz', use: 'Boil', timing: '10 min' }, { name: 'Citra', amount: 2, unit: 'oz', use: 'Dry Hop', timing: '5 days' }],
    yeast: { name: 'Safale US-05', brand: 'Fermentis', attenuation: 77 },
    adjuncts: [],
    mashTemp: 152, mashTime: 60, fermentTemp: 66, fermentDays: 14,
    notes: 'All Citra, all the time. Use fresh crop Citra for the best tropical character.',
  },
  {
    beerSlug: 'new-belgium-fat-tire',
    name: 'Fat Tire Clone',
    slug: 'fat-tire-clone',
    style: 'Amber Ale',
    difficulty: 'BEGINNER' as const,
    description: 'A balanced amber ale clone with biscuity malt character. Great beginner recipe with straightforward process.',
    batchSize: 5, boilTime: 60,
    estimatedOg: 1.050, estimatedFg: 1.012, estimatedAbv: 5.2, estimatedIbu: 22, estimatedSrm: 14,
    grains: [{ name: '2-Row Pale Malt', amount: 8, unit: 'lb' }, { name: 'Munich Malt', amount: 1, unit: 'lb' }, { name: 'Victory Malt', amount: 0.5, unit: 'lb' }, { name: 'Crystal 80L', amount: 0.5, unit: 'lb' }],
    hops: [{ name: 'Willamette', amount: 0.75, unit: 'oz', use: 'Boil', timing: '60 min' }, { name: 'Goldings', amount: 0.5, unit: 'oz', use: 'Boil', timing: '5 min' }],
    yeast: { name: 'WLP001 California Ale', brand: 'White Labs', attenuation: 76 },
    adjuncts: [],
    mashTemp: 152, mashTime: 60, fermentTemp: 66, fermentDays: 14,
    notes: 'Simple and balanced. Let the malt character lead. Great intro recipe for new homebrewers.',
  },
  {
    beerSlug: 'surly-furious',
    name: 'Furious IPA Clone',
    slug: 'furious-ipa-clone',
    style: 'IPA',
    difficulty: 'INTERMEDIATE' as const,
    description: 'An aggressively hopped West Coast IPA clone with bold citrus and pine character.',
    batchSize: 5, boilTime: 60,
    estimatedOg: 1.063, estimatedFg: 1.013, estimatedAbv: 6.6, estimatedIbu: 99, estimatedSrm: 10,
    grains: [{ name: '2-Row Pale Malt', amount: 11, unit: 'lb' }, { name: 'Crystal 40L', amount: 0.5, unit: 'lb' }, { name: 'Munich Malt', amount: 0.5, unit: 'lb' }],
    hops: [{ name: 'Warrior', amount: 1.5, unit: 'oz', use: 'Boil', timing: '60 min' }, { name: 'Amarillo', amount: 1, unit: 'oz', use: 'Boil', timing: '10 min' }, { name: 'Simcoe', amount: 1, unit: 'oz', use: 'Boil', timing: '5 min' }, { name: 'Amarillo', amount: 1.5, unit: 'oz', use: 'Dry Hop', timing: '5 days' }, { name: 'Simcoe', amount: 1, unit: 'oz', use: 'Dry Hop', timing: '5 days' }],
    yeast: { name: 'WLP001 California Ale', brand: 'White Labs', attenuation: 78 },
    adjuncts: [],
    mashTemp: 150, mashTime: 60, fermentTemp: 67, fermentDays: 14,
    notes: 'Aggressive hopping schedule. High sulfate water for crisp bitterness. Minnesota nice meets Minnesota hops.',
  },
  {
    beerSlug: 'prairie-bomb',
    name: 'BOMB! Clone',
    slug: 'bomb-clone',
    style: 'Imperial Stout',
    difficulty: 'ADVANCED' as const,
    description: 'A spiced imperial coffee stout clone with espresso, vanilla, cacao, and ancho chili. Complex but rewarding.',
    batchSize: 5, boilTime: 90,
    estimatedOg: 1.115, estimatedFg: 1.030, estimatedAbv: 13.0, estimatedIbu: 65, estimatedSrm: 48,
    grains: [{ name: '2-Row Pale Malt', amount: 17, unit: 'lb' }, { name: 'Chocolate Malt', amount: 1.5, unit: 'lb' }, { name: 'Roasted Barley', amount: 1, unit: 'lb' }, { name: 'Flaked Oats', amount: 1.5, unit: 'lb' }, { name: 'Crystal 120L', amount: 0.5, unit: 'lb' }],
    hops: [{ name: 'Magnum', amount: 2, unit: 'oz', use: 'Boil', timing: '60 min' }],
    yeast: { name: 'WLP001 California Ale', brand: 'White Labs', attenuation: 76 },
    adjuncts: [{ name: 'Espresso Beans', amount: 6, unit: 'oz' }, { name: 'Vanilla Beans (split)', amount: 2, unit: 'beans' }, { name: 'Cacao Nibs', amount: 6, unit: 'oz' }, { name: 'Ancho Chili Peppers', amount: 2, unit: 'peppers' }],
    mashTemp: 156, mashTime: 75, fermentTemp: 67, fermentDays: 28,
    notes: 'Add espresso at flameout. Add vanilla, cacao, and chili in secondary for 7 days. Start with less chili - you can always add more.',
  },
];

// ============================================================
// MAIN FUNCTION
// ============================================================

async function main() {
  console.log('Populating content (reviews, sightings, recipes)...\n');

  // Fetch existing users and beers
  const allUsers = await prisma.user.findMany({ select: { id: true, username: true } });
  const allBeers = await prisma.beer.findMany({ select: { id: true, name: true, slug: true, style: true } });

  const userMap: Record<string, string> = {};
  for (const u of allUsers) userMap[u.username] = u.id;

  const beerMap: Record<string, { id: string; name: string; style: string }> = {};
  for (const b of allBeers) beerMap[b.slug] = { id: b.id, name: b.name, style: b.style };

  const personaUsernames = Object.keys(personaReviews);

  console.log(`Found ${allUsers.length} users and ${allBeers.length} beers in database.`);

  // ============================================================
  // PHASE 1: REVIEWS (200+)
  // ============================================================
  console.log('\n--- Phase 1: Creating Reviews ---\n');

  let reviewsCreated = 0;
  let reviewsSkipped = 0;
  const usedPairs = new Set<string>();

  // For each beer, assign 2-4 reviews from different personas
  for (const beer of allBeers) {
    const numReviews = randomInt(2, 4);
    const shuffledPersonas = [...personaUsernames].sort(() => Math.random() - 0.5);

    for (let i = 0; i < numReviews && i < shuffledPersonas.length; i++) {
      const persona = shuffledPersonas[i];
      const userId = userMap[persona];
      if (!userId) continue;

      const pairKey = `${userId}-${beer.id}`;
      if (usedPairs.has(pairKey)) continue;
      usedPairs.add(pairKey);

      const rating = weightedRating();
      const content = generateReviewContent(persona, beer.style);
      const p = personaReviews[persona];
      const servingType = randomElement(p.servingTypes);

      // Generate sub-ratings clustered around main rating
      const subRating = () => {
        const delta = (Math.random() - 0.5) * 1.0;
        return Math.max(2.5, Math.min(5.0, Math.round((rating + delta) * 2) / 2));
      };

      const flavorTags = randomElement([
        ['Citrus', 'Balanced', 'Crisp'],
        ['Tropical', 'Juicy', 'Smooth'],
        ['Roast', 'Coffee', 'Chocolate'],
        ['Pine', 'Bitter', 'Dry'],
        ['Malty', 'Caramel', 'Toffee'],
        ['Floral', 'Clean', 'Refreshing'],
        ['Funky', 'Tart', 'Complex'],
        ['Hoppy', 'Bold', 'Intense'],
      ]);

      try {
        await prisma.review.upsert({
          where: { userId_beerId: { userId, beerId: beer.id } },
          create: {
            userId,
            beerId: beer.id,
            rating,
            content,
            flavorTags,
            aroma: subRating(),
            appearance: subRating(),
            taste: subRating(),
            mouthfeel: subRating(),
            overall: subRating(),
            servingType,
            isVerified: Math.random() > 0.4,
          },
          update: {},
        });
        reviewsCreated++;
        if (reviewsCreated % 25 === 0) {
          console.log(`  [${reviewsCreated}] reviews created...`);
        }
      } catch (err: any) {
        reviewsSkipped++;
      }
    }
  }

  console.log(`\nReviews created: ${reviewsCreated}, skipped: ${reviewsSkipped}`);

  // ============================================================
  // PHASE 2: SIGHTINGS (50+)
  // ============================================================
  console.log('\n--- Phase 2: Creating Sightings ---\n');

  const TARGET_SIGHTINGS = 60;
  let sightingsCreated = 0;
  const userIds = allUsers.map(u => u.id);

  for (let i = 0; i < TARGET_SIGHTINGS; i++) {
    const user = randomElement(userIds);
    const beer = randomElement(allBeers);
    const loc = randomElement(locations);
    const format = weightedRandom(formatWeights).format;
    const freshness = weightedRandom(freshnessWeights).freshness;

    const latitude = loc.lat + (Math.random() - 0.5) * 0.01;
    const longitude = loc.lng + (Math.random() - 0.5) * 0.01;

    let price: number | null = null;
    if (Math.random() < 0.7) {
      switch (format) {
        case 'DRAFT': price = Math.round((Math.random() * 8 + 6) * 4) / 4; break;
        case 'CAN': price = Math.round((Math.random() * 5 + 3) * 4) / 4; break;
        case 'BOTTLE': price = Math.round((Math.random() * 17 + 8) * 4) / 4; break;
        case 'CROWLER': price = Math.round((Math.random() * 10 + 12) * 4) / 4; break;
        case 'GROWLER': price = Math.round((Math.random() * 17 + 15) * 4) / 4; break;
      }
    }

    const notes = Math.random() < 0.4 ? randomElement(sightingNotes) : null;
    const confirmCount = randomInt(0, 5);
    const isVerified = confirmCount >= 3;
    const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const expiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);

    try {
      await prisma.sighting.create({
        data: {
          userId: user,
          beerId: beer.id,
          locationName: loc.name,
          city: loc.city,
          state: loc.state,
          latitude,
          longitude,
          format,
          freshness,
          price,
          notes,
          confirmCount,
          isVerified,
          createdAt,
          expiresAt,
          updatedAt: createdAt,
        },
      });
      sightingsCreated++;
    } catch (err: any) {
      // Skip errors silently
    }
  }

  console.log(`Sightings created: ${sightingsCreated}`);

  // ============================================================
  // PHASE 3: RECIPES (20+)
  // ============================================================
  console.log('\n--- Phase 3: Creating Clone Recipes ---\n');

  let recipesCreated = 0;
  let recipesSkipped = 0;

  for (const recipe of cloneRecipes) {
    const beerData = beerMap[recipe.beerSlug];
    if (!beerData) {
      console.log(`  SKIP: Beer not found for slug: ${recipe.beerSlug}`);
      recipesSkipped++;
      continue;
    }

    // Pick a random persona as the recipe author
    const authorUsername = randomElement(personaUsernames);
    const authorId = userMap[authorUsername];
    if (!authorId) {
      recipesSkipped++;
      continue;
    }

    try {
      await prisma.recipe.upsert({
        where: { slug: recipe.slug },
        create: {
          userId: authorId,
          name: recipe.name,
          slug: recipe.slug,
          style: recipe.style,
          type: 'CLONE',
          difficulty: recipe.difficulty,
          description: recipe.description,
          clonedBeerId: beerData.id,
          batchSize: recipe.batchSize,
          boilTime: recipe.boilTime,
          estimatedOg: recipe.estimatedOg,
          estimatedFg: recipe.estimatedFg,
          estimatedAbv: recipe.estimatedAbv,
          estimatedIbu: recipe.estimatedIbu,
          estimatedSrm: recipe.estimatedSrm,
          grains: recipe.grains,
          hops: recipe.hops,
          yeast: recipe.yeast,
          adjuncts: recipe.adjuncts,
          mashTemp: recipe.mashTemp,
          mashTime: recipe.mashTime,
          fermentTemp: recipe.fermentTemp,
          fermentDays: recipe.fermentDays,
          notes: recipe.notes,
          isPublic: true,
        },
        update: {},
      });
      recipesCreated++;
      console.log(`  [${recipesCreated}] Recipe: ${recipe.name}`);
    } catch (err: any) {
      console.log(`  ERROR: ${recipe.name}: ${err.message}`);
      recipesSkipped++;
    }
  }

  console.log(`\nRecipes created: ${recipesCreated}, skipped: ${recipesSkipped}`);

  // ============================================================
  // PHASE 4: Update beer stats
  // ============================================================
  console.log('\n--- Phase 4: Updating Beer Stats ---\n');

  const beersWithReviews = await prisma.beer.findMany({
    select: { id: true, name: true },
    where: { reviews: { some: {} } },
  });

  let statsUpdated = 0;
  for (const beer of beersWithReviews) {
    const agg = await prisma.review.aggregate({
      where: { beerId: beer.id },
      _avg: { rating: true },
      _count: { id: true },
    });

    if (agg._avg.rating) {
      // Map average rating (2.5-5.0) to iqScore (60-98)
      const avgRating = agg._avg.rating;
      const iqScore = Math.round(60 + (avgRating - 2.5) * (38 / 2.5));
      const clampedIq = Math.max(60, Math.min(98, iqScore));

      let tier: 'DIAMOND' | 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE';
      if (clampedIq >= 95) tier = 'DIAMOND';
      else if (clampedIq >= 90) tier = 'PLATINUM';
      else if (clampedIq >= 85) tier = 'GOLD';
      else if (clampedIq >= 75) tier = 'SILVER';
      else tier = 'BRONZE';

      await prisma.beer.update({
        where: { id: beer.id },
        data: { iqScore: clampedIq, tier },
      });
      statsUpdated++;
    }
  }

  console.log(`Updated stats for ${statsUpdated} beers.`);

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log('\n========================================');
  console.log('  CONTENT POPULATION COMPLETE');
  console.log('========================================\n');
  console.log(`Reviews created:   ${reviewsCreated}`);
  console.log(`Sightings created: ${sightingsCreated}`);
  console.log(`Recipes created:   ${recipesCreated}`);
  console.log(`Beer stats updated: ${statsUpdated}`);
}

main()
  .catch((e) => {
    console.error('FATAL:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
