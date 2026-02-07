import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Populating reviews...');

  // Hash password for all new users
  const passwordHash = await bcrypt.hash('Demo123!', 12);

  // 15 new user personas
  const newUsers = [
    {
      email: 'brewmaster_mike@brewiq.ai',
      username: 'brewmaster_mike',
      displayName: 'Brewmaster Mike',
      bio: 'Homebrewer of 15 years. I dissect every beer like I am reverse-engineering the recipe. BJCP certified, grain-obsessed, and always chasing the perfect mash temp.',
      passwordHash,
      isVerified: true,
      membershipTier: 'PRO' as const,
      points: 2800,
      level: 12,
    },
    {
      email: 'beerbabe_lex@brewiq.ai',
      username: 'beerbabe_lex',
      displayName: 'Lexi B',
      bio: 'Here for good vibes and good brews. I drink what tastes good and skip the snobbery. Weekend warrior, patio enthusiast, and serial brunch-goer.',
      passwordHash,
      isVerified: true,
      membershipTier: 'FREE' as const,
      points: 620,
      level: 5,
    },
    {
      email: 'cicerone_james@brewiq.ai',
      username: 'cicerone_james',
      displayName: 'James Whitfield, Certified Cicerone',
      bio: 'Certified Cicerone with 10+ years in the beer industry. I evaluate beers against style guidelines and believe every pour tells a story about the brewer and their craft.',
      passwordHash,
      isVerified: true,
      membershipTier: 'UNLIMITED' as const,
      points: 4200,
      level: 18,
    },
    {
      email: 'craftdad@brewiq.ai',
      username: 'craftdad',
      displayName: 'CraftDad',
      bio: 'Dad of 3 who traded light lagers for craft beer after a brewery tour changed my life. Now my kids roll their eyes when I talk about hop varietals at dinner.',
      passwordHash,
      isVerified: true,
      membershipTier: 'PRO' as const,
      points: 1400,
      level: 7,
    },
    {
      email: 'pilsner_pete@brewiq.ai',
      username: 'pilsner_pete',
      displayName: 'Pilsner Pete',
      bio: 'Lager loyalist in a hazy world. Not every beer needs to be 8% and taste like orange juice. Give me a crisp pilsner and a front porch and I am a happy man.',
      passwordHash,
      isVerified: true,
      membershipTier: 'FREE' as const,
      points: 380,
      level: 4,
    },
    {
      email: 'barrel_queen@brewiq.ai',
      username: 'barrel_queen',
      displayName: 'Barrel Queen',
      bio: 'If it touched oak, I want it. Bourbon barrels, wine barrels, rum barrels - the wood is the magic. Cellaring addict with a temperature-controlled collection of 200+ bottles.',
      passwordHash,
      isVerified: true,
      membershipTier: 'PRO' as const,
      points: 3100,
      level: 13,
    },
    {
      email: 'hops_and_dreams@brewiq.ai',
      username: 'hops_and_dreams',
      displayName: 'Hops & Dreams',
      bio: 'College senior discovering that beer is more than what comes in a 30-rack. Every week is a new style adventure. Currently obsessed with NEIPAs.',
      passwordHash,
      isVerified: true,
      membershipTier: 'FREE' as const,
      points: 720,
      level: 6,
    },
    {
      email: 'the_beerologist@brewiq.ai',
      username: 'the_beerologist',
      displayName: 'Dr. Beerologist',
      bio: 'Food scientist by day, beer analyst by night. I approach every glass with a scientific lens - pH, attenuation, ester profiles. Data does not lie, and neither do my taste buds.',
      passwordHash,
      isVerified: true,
      membershipTier: 'UNLIMITED' as const,
      points: 3800,
      level: 16,
    },
    {
      email: 'patio_pints@brewiq.ai',
      username: 'patio_pints',
      displayName: 'Patio Pints',
      bio: 'Every beer is better with context. I review the full experience - the setting, the weather, the company. A mediocre beer on a perfect patio beats a great beer in a bad bar.',
      passwordHash,
      isVerified: true,
      membershipTier: 'PRO' as const,
      points: 1900,
      level: 9,
    },
    {
      email: 'alexa_brews@brewiq.ai',
      username: 'alexa_brews',
      displayName: 'Alexa Brews',
      bio: 'Beer photographer and visual storyteller. I taste with my eyes first. Short reviews, strong opinions, great pics.',
      passwordHash,
      isVerified: true,
      membershipTier: 'FREE' as const,
      points: 580,
      level: 5,
    },
    {
      email: 'untapped_dan@brewiq.ai',
      username: 'untapped_dan',
      displayName: 'Untapped Dan',
      bio: 'Former Untappd power user with 3,000+ unique check-ins. Migrated to BrewIQ for the AI features. I rate fast, drink wide, and never miss a new release.',
      passwordHash,
      isVerified: true,
      membershipTier: 'PRO' as const,
      points: 2600,
      level: 11,
    },
    {
      email: 'suds_n_buds@brewiq.ai',
      username: 'suds_n_buds',
      displayName: 'Suds N Buds',
      bio: 'Brand new to craft beer and loving it! Everything is exciting when you have never tried it before. Recommendations always welcome - I will try anything once!',
      passwordHash,
      isVerified: true,
      membershipTier: 'FREE' as const,
      points: 180,
      level: 3,
    },
    {
      email: 'grainbill_gary@brewiq.ai',
      username: 'grainbill_gary',
      displayName: 'Grainbill Gary',
      bio: 'Retired head brewer with 30 years in the industry. Worked at three major craft breweries before hanging up my mash paddle. Now I just drink and critique.',
      passwordHash,
      isVerified: true,
      membershipTier: 'UNLIMITED' as const,
      points: 3400,
      level: 14,
    },
    {
      email: 'wild_ale_wendy@brewiq.ai',
      username: 'wild_ale_wendy',
      displayName: 'Wild Ale Wendy',
      bio: 'Wild and sour beer specialist. I have visited lambic producers in Belgium, foraged wild yeast for homebrew, and can identify Brett strains by smell alone. Funk is life.',
      passwordHash,
      isVerified: true,
      membershipTier: 'PRO' as const,
      points: 2200,
      level: 10,
    },
    {
      email: 'session_king@brewiq.ai',
      username: 'session_king',
      displayName: 'Session King',
      bio: 'Low ABV, high flavor. I believe the hardest thing in brewing is making a phenomenal beer under 5%. Table beers, milds, session ales - that is where the real skill shows.',
      passwordHash,
      isVerified: true,
      membershipTier: 'FREE' as const,
      points: 350,
      level: 4,
    },
  ];

  // Upsert all new users
  for (const user of newUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      create: user,
      update: {},
    });
  }
  console.log(`Created/verified ${newUsers.length} new users`);

  // Fetch all users and beers
  const allUsers = await prisma.user.findMany();
  const allBeers = await prisma.beer.findMany();
  const userMap: Record<string, string> = {};
  for (const u of allUsers) {
    userMap[u.username] = u.id;
  }
  const beerMap: Record<string, string> = {};
  for (const b of allBeers) {
    beerMap[b.slug] = b.id;
  }

  console.log(`Found ${allUsers.length} users and ${allBeers.length} beers`);


  // Review data - each entry: [username, beerSlug, rating, content, flavorTags, aroma, appearance, taste, mouthfeel, overall, servingType]
  type ReviewTuple = [string, string, number, string, string[], number, number, number, number, number, string];

  const reviewData: ReviewTuple[] = [
    // ===== BREWMASTER MIKE (homebrewer, technical voice) =====
    ['brewmaster_mike', 'sierra-nevada-pale-ale', 4.0, 'Cascade and Centennial hops are doing all the heavy lifting here, and honestly they do not need help. Clean fermentation profile with a biscuity malt backbone that any homebrewer would be proud of. The OG of American craft.', ['hoppy', 'biscuit', 'piney', 'citrus'], 4.0, 4.0, 4.0, 3.5, 4.0, 'bottle'],
    ['brewmaster_mike', 'sierra-nevada-torpedo', 3.5, 'The torpedo device for dry-hopping is clever engineering, but the result is more resinous than I prefer. Solid malt bill keeps it from being a hop grenade. Good but not my favorite from Sierra Nevada.', ['resinous', 'citrus', 'piney', 'malty'], 4.0, 3.5, 3.5, 3.5, 3.5, 'can'],
    ['brewmaster_mike', 'bells-two-hearted-ale', 4.5, 'Single hop Centennial at its absolute finest. The grain bill must be beautifully simple because nothing competes with those hops. Fermented clean as a whistle. This is how you let ingredients shine.', ['grapefruit', 'floral', 'clean', 'balanced'], 4.5, 4.0, 4.5, 4.5, 4.5, 'can'],
    ['brewmaster_mike', 'bells-hopslam', 4.0, 'Six hop varietals and honey - ambitious grain bill that somehow works. The honey adds a dryness that keeps the 10% ABV from being cloying. My only gripe is the short shelf life. Drink it fresh or do not bother.', ['hoppy', 'honey', 'complex', 'strong'], 4.5, 4.0, 4.0, 3.5, 4.0, 'draft'],
    ['brewmaster_mike', 'founders-breakfast-stout', 4.5, 'Flaked oats in the grain bill give this incredible body. The coffee addition is perfectly calibrated - Sumatra and Kona beans are a smart combo. Double chocolate malt rounds it out. Textbook stout brewing.', ['coffee', 'chocolate', 'oatmeal', 'roasted'], 4.5, 4.5, 4.5, 5.0, 4.5, 'bottle'],
    ['brewmaster_mike', 'founders-kbs', 5.0, 'Cave-aged in bourbon barrels for a year and it shows. The base Breakfast Stout is transformed - vanilla and oak integration is seamless. The bourbon warmth is present but never harsh. Masterclass in barrel aging.', ['bourbon', 'vanilla', 'oak', 'coffee', 'chocolate'], 5.0, 5.0, 5.0, 4.5, 5.0, 'bottle'],
    ['brewmaster_mike', 'russian-river-pliny-the-elder', 5.0, 'Vinnie nailed the water chemistry on this one. The sulfate-to-chloride ratio must be sky-high because the hop bitterness is incredibly crisp. Columbus, Centennial, Simcoe, and CTZ in perfect harmony.', ['hoppy', 'crisp', 'piney', 'citrus'], 5.0, 4.5, 5.0, 5.0, 5.0, 'draft'],
    ['brewmaster_mike', 'tree-house-julius', 4.5, 'London Ale III yeast doing its thing with the biotransformation. The oat and wheat additions give that pillowy mouthfeel. Hop schedule must be mostly whirlpool and dry hop. Phenomenal NEIPA technique.', ['tropical', 'creamy', 'juicy', 'oat'], 5.0, 4.0, 4.5, 5.0, 4.5, 'can'],
    ['brewmaster_mike', 'dogfish-head-90-minute-ipa', 4.0, 'Continuous hopping for 90 minutes is Sam Calagione at his most innovative. The malt backbone is substantial enough to support the massive IBUs. Fermented warm enough to get some fruity esters. Bold recipe.', ['hoppy', 'malty', 'warming', 'complex'], 4.0, 4.0, 4.0, 4.0, 4.0, 'bottle'],
    ['brewmaster_mike', 'stone-ipa', 3.5, 'Classic West Coast approach - light crystal malt, clean yeast, and a heavy hand with the hops. Effective but feels a bit dated compared to modern IPAs. Still a solid benchmark for the style.', ['piney', 'bitter', 'crisp', 'clean'], 3.5, 3.5, 3.5, 3.5, 3.5, 'can'],
    ['brewmaster_mike', 'firestone-walker-parabola', 5.0, 'This is barrel-aged stout perfection from a technical standpoint. The base beer has to be massive to stand up to bourbon barrels this long. Vanilla, dark chocolate, charred oak. Impeccable blending.', ['bourbon', 'chocolate', 'vanilla', 'oak'], 5.0, 5.0, 5.0, 4.5, 5.0, 'bottle'],
    ['brewmaster_mike', 'hill-farmstead-edward', 4.5, 'Shaun Hill is a genius with water chemistry. This pale ale has no business being this good at 5.2%. The hop expression is crystalline - you can pick out each variety. Decoction mash? Whatever he is doing, it works.', ['floral', 'citrus', 'clean', 'crisp'], 4.5, 4.5, 4.5, 4.5, 4.5, 'draft'],
    ['brewmaster_mike', 'weihenstephaner-hefeweissbier', 4.5, 'Nearly a thousand years of brewing tradition in every sip. The banana ester to clove phenol ratio is textbook. Open fermentation with their proprietary yeast strain does things no other hefeweizen can match.', ['banana', 'clove', 'wheat', 'balanced'], 4.5, 4.5, 4.5, 4.5, 4.5, 'draft'],
    ['brewmaster_mike', 'cantillon-gueuze', 4.5, 'Spontaneous fermentation is the ultimate expression of terroir in beer. The blend of 1, 2, and 3 year lambics creates a complexity that no controlled fermentation can replicate. Bone dry with incredible depth.', ['tart', 'funky', 'complex', 'dry'], 4.5, 4.0, 4.5, 4.0, 4.5, 'bottle'],
    ['brewmaster_mike', 'founders-dirty-bastard', 4.0, 'Peated malt in a Scotch ale is a bold move and Founders pulls it off. The smokiness is restrained, letting the caramel and toffee malt character lead. Fermentation temp was clearly well-controlled.', ['smoky', 'toffee', 'caramel', 'malty'], 4.0, 4.0, 4.0, 4.0, 4.0, 'bottle'],
    ['brewmaster_mike', 'maine-beer-lunch', 4.0, 'Clean, precise, and endlessly drinkable. The grain bill has to be mostly pale malt with minimal crystal - the hop flavors are so transparent. This is restraint done right.', ['citrus', 'floral', 'clean', 'balanced'], 4.0, 4.0, 4.0, 4.0, 4.0, 'can'],

    // ===== BEERBABE LEX (casual, fun voice) =====
    ['beerbabe_lex', 'sierra-nevada-hazy-little-thing', 4.0, 'Okay this is literally like drinking a tropical smoothie that gets you a lil tipsy. So good with tacos on a Friday night. My go-to when I do not want to think too hard about what to order.', ['juicy', 'tropical', 'smooth', 'easy'], 4.0, 3.5, 4.0, 4.0, 4.0, 'can'],
    ['beerbabe_lex', 'bells-oberon', 4.0, 'Summer in a glass!! Light and easy with a little citrus kick. Perfect for floating the river or sitting by the pool. This is the beer that converted me from seltzers.', ['light', 'citrus', 'refreshing', 'summer'], 3.5, 4.0, 4.0, 4.0, 4.0, 'can'],
    ['beerbabe_lex', 'founders-all-day-ipa', 3.5, 'The name does not lie - you really can drink these all day without falling asleep on the couch by 4pm. Tastes like a real IPA but without the heaviness. Solid beach beer.', ['light', 'hoppy', 'easy', 'crisp'], 3.5, 3.0, 3.5, 3.5, 3.5, 'can'],
    ['beerbabe_lex', 'dogfish-head-seaquench', 4.5, 'OMG this is dangerously good. Salty and limey like a margarita had a baby with a beer. I brought a 6-pack to the beach and it was gone in like an hour. Summer essential.', ['salty', 'lime', 'refreshing', 'tart'], 4.5, 3.5, 4.5, 4.5, 4.5, 'can'],
    ['beerbabe_lex', 'stone-delicious-ipa', 3.5, 'Pretty solid! More tropical than bitter which is what I like in my IPAs. The lemon vibes are nice. Not my absolute fave but I would not turn one down at a party.', ['tropical', 'lemon', 'hoppy'], 3.5, 3.5, 3.5, 3.5, 3.5, 'can'],
    ['beerbabe_lex', 'cigar-city-jai-alai', 3.5, 'Got this on vacation in Florida and it hit different in the sunshine. Bold and citrusy. A little too bitter for my taste but my boyfriend loved it so at least someone was happy.', ['citrus', 'bold', 'bitter'], 3.5, 3.5, 3.5, 3.0, 3.5, 'can'],
    ['beerbabe_lex', 'deschutes-fresh-squeezed', 4.0, 'The name is perfect because it literally tastes like fresh squeezed grapefruit juice mixed with beer. So crushable. This is the IPA for people who think they do not like IPAs.', ['grapefruit', 'juicy', 'citrus', 'refreshing'], 4.0, 3.5, 4.0, 4.0, 4.0, 'can'],
    ['beerbabe_lex', 'tree-house-julius', 4.0, 'Everyone hyped this up SO much and honestly? It delivers. Creamy, tropical, and smooth as silk. Like a mango lassi but make it beer. Worth the drive to the brewery.', ['tropical', 'creamy', 'smooth', 'mango'], 4.0, 4.0, 4.5, 4.5, 4.0, 'can'],
    ['beerbabe_lex', 'weihenstephaner-hefeweissbier', 3.5, 'Banana bread beer! That is what this tastes like and I am here for it. Super refreshing with brunch. Cute cloudy yellow color too. Would order again at a German restaurant.', ['banana', 'wheat', 'refreshing'], 3.5, 4.0, 3.5, 3.5, 3.5, 'draft'],
    ['beerbabe_lex', 'jester-king-le-petit-prince', 4.0, 'Only 2.9% and still tastes like a real beer?? Game changer for day drinking. Light and slightly funky in a good way. Wish more breweries made stuff like this.', ['light', 'funky', 'crisp', 'refreshing'], 3.5, 3.5, 4.0, 4.0, 4.0, 'draft'],
    ['beerbabe_lex', 'revolution-anti-hero', 3.0, 'Decent IPA but nothing that made me go wow. Citrusy and a bit piney. Fine for a Tuesday night but I would pick something else if I had options. Sorry not sorry.', ['citrus', 'piney', 'average'], 3.0, 3.0, 3.0, 3.0, 3.0, 'can'],

    // ===== CICERONE JAMES (analytical, detailed, professional) =====
    ['cicerone_james', 'russian-river-pliny-the-elder', 5.0, 'Benchmark Double IPA that exemplifies style guidelines perfectly. Hop complexity is extraordinary with floral, citrus, and resinous layers. Malt backbone provides just enough sweetness to prevent palate fatigue. Finishes clean and dry.', ['floral', 'citrus', 'resinous', 'balanced', 'clean'], 5.0, 4.5, 5.0, 5.0, 5.0, 'draft'],
    ['cicerone_james', 'russian-river-pliny-the-younger', 5.0, 'A masterwork of brewing restraint at 10.25% ABV. The triple IPA designation is earned through hop intensity rather than boozy heat. Remarkably drinkable for the gravity. Vinnie Cilurzo has created something transcendent.', ['tropical', 'resinous', 'smooth', 'complex', 'layered'], 5.0, 4.5, 5.0, 5.0, 5.0, 'draft'],
    ['cicerone_james', 'cantillon-gueuze', 5.0, 'The definitive example of traditional lambic blending. The interplay between young and old lambics creates remarkable depth - lemon pith, hay, aged cheese, and green apple. Champagne-like carbonation elevates the experience.', ['tart', 'complex', 'funky', 'lemon', 'dry'], 5.0, 4.5, 5.0, 5.0, 5.0, 'bottle'],
    ['cicerone_james', 'cantillon-kriek', 5.0, 'Traditional kriek done with whole Schaerbeek cherries rather than juice or extract. The cherry character is dry, almond-like, and perfectly integrated with the lambic base. Not sweet - this is sour cherry at its most authentic.', ['sour', 'cherry', 'almond', 'dry', 'complex'], 5.0, 5.0, 5.0, 4.5, 5.0, 'bottle'],
    ['cicerone_james', 'hill-farmstead-abner', 5.0, 'Possibly the most refined Double IPA in America. Shaun Hill achieves a balance between hop intensity and drinkability that few can match. The bitterness is firm but never harsh. Floral and citrus notes persist through a long, satisfying finish.', ['floral', 'citrus', 'refined', 'balanced'], 5.0, 4.5, 5.0, 5.0, 5.0, 'draft'],
    ['cicerone_james', 'hill-farmstead-ann', 4.5, 'An exceptional interpretation of the saison style. Dry, effervescent, and complex with notes of white pepper, hay, and stone fruit. The fermentation character is beautifully expressive without dominating the malt and hop contributions.', ['peppery', 'dry', 'effervescent', 'complex'], 4.5, 4.5, 4.5, 4.5, 4.5, 'draft'],
    ['cicerone_james', 'weihenstephaner-hefeweissbier', 5.0, 'The style standard against which all hefeweizens should be measured. The 4-vinyl guaiacol to isoamyl acetate ratio is perfectly calibrated, delivering equal clove and banana. Effervescent, refreshing, and endlessly satisfying.', ['banana', 'clove', 'wheat', 'effervescent'], 5.0, 5.0, 5.0, 4.5, 5.0, 'draft'],
    ['cicerone_james', 'weihenstephaner-vitus', 4.5, 'A weizenbock of remarkable elegance. The elevated ABV adds warmth and body without creating cloying sweetness. Notes of ripe banana, vanilla, and toasted bread. The carbonation level is calibrated to perfection.', ['banana', 'vanilla', 'warming', 'toasty'], 4.5, 4.5, 4.5, 4.5, 4.5, 'draft'],
    ['cicerone_james', 'founders-kbs', 4.5, 'Exemplary barrel-aged imperial stout. The bourbon character integrates seamlessly with the coffee and chocolate base. My only observation is that recent vintages show slightly less barrel complexity than earlier releases. Still outstanding.', ['bourbon', 'coffee', 'chocolate', 'vanilla'], 4.5, 5.0, 4.5, 4.5, 4.5, 'bottle'],
    ['cicerone_james', 'firestone-walker-parabola', 5.0, 'Matt Brynildson has created a barrel-aged stout that demonstrates exceptional blending skill. The vanilla and bourbon notes are present without overwhelming the roasted malt character. Full-bodied yet not heavy. Remarkable achievement.', ['bourbon', 'vanilla', 'roasted', 'complex'], 5.0, 5.0, 5.0, 5.0, 5.0, 'bottle'],
    ['cicerone_james', 'russian-river-supplication', 4.5, 'A thoughtful American interpretation of sour brown ale. The Pinot Noir barrel contributes vinous tannins that complement the cherry tartness. Brettanomyces character is present but measured. Would pair excellently with roasted duck.', ['cherry', 'vinous', 'tart', 'funky'], 4.5, 4.5, 4.5, 4.0, 4.5, 'bottle'],
    ['cicerone_james', 'jester-king-atrial-rubicite', 4.5, 'Jester King continues to demonstrate that American wild ale producers can rival Belgian traditions. The raspberry character is vibrant and authentic, supported by a complex mixed-culture fermentation. Impressive terroir expression.', ['raspberry', 'tart', 'funky', 'complex'], 4.5, 5.0, 4.5, 4.0, 4.5, 'bottle'],
    ['cicerone_james', '3-floyds-zombie-dust', 4.0, 'An exceptionally well-crafted pale ale with Citra hops driving the aromatic profile. Tropical fruit and citrus notes are vivid. The malt bill provides just enough structure. My reservation is limited distribution reducing freshness guarantees.', ['citrus', 'tropical', 'hoppy', 'balanced'], 4.5, 4.0, 4.0, 4.0, 4.0, 'can'],
    ['cicerone_james', 'alchemist-heady-topper', 4.5, 'The progenitor of the hazy IPA movement deserves its reputation. Dense tropical fruit character with supporting pine and citrus notes. The instruction to drink from the can is a deliberate aromatic choice that works.', ['tropical', 'hazy', 'piney', 'citrus'], 4.5, 4.0, 4.5, 4.5, 4.5, 'can'],
    ['cicerone_james', 'maine-beer-dinner', 4.5, 'Double IPA executed with Maine Beer Company signature restraint. Despite the elevated ABV, the beer maintains remarkable balance and drinkability. Hop layering is precise with tropical and piney notes complementing each other beautifully.', ['tropical', 'piney', 'balanced', 'complex'], 4.5, 4.0, 4.5, 4.5, 4.5, 'bottle'],
    ['cicerone_james', 'bells-two-hearted-ale', 4.5, 'A perennial benchmark for American IPA. The single-hop Centennial approach allows for complete varietal expression. Grapefruit pith, floral honey, and a touch of pine resin. Malt integration is seamless. Consistently excellent across batches.', ['grapefruit', 'floral', 'piney', 'consistent'], 4.5, 4.5, 4.5, 4.0, 4.5, 'can'],

    // ===== CRAFTDAD (relatable dad humor, accessible) =====
    ['craftdad', 'founders-all-day-ipa', 4.5, 'This is the beer that lets me have three on a Saturday afternoon and still be functional enough to coach little league. Dad beer of the year every year. The cooler MVP.', ['sessionable', 'hoppy', 'light', 'crisp'], 4.0, 3.5, 4.5, 4.0, 4.5, 'can'],
    ['craftdad', 'sierra-nevada-pale-ale', 4.0, 'The first craft beer I ever tried, back when I thought Bud Light was peak brewing. Changed my whole perspective. Still reaches for this like an old friend. The kids call it Dad Juice.', ['hoppy', 'citrus', 'classic', 'balanced'], 4.0, 4.0, 4.0, 4.0, 4.0, 'bottle'],
    ['craftdad', 'bells-oberon', 4.5, 'Oberon season is basically a holiday in our house. Light enough for mowing the lawn, flavorful enough to feel like a treat. My wife even likes this one, which is the ultimate endorsement.', ['wheat', 'citrus', 'refreshing', 'summer'], 4.0, 4.5, 4.5, 4.5, 4.5, 'can'],
    ['craftdad', 'deschutes-fresh-squeezed', 4.0, 'Brought a sixer to the neighborhood BBQ and became instantly popular. Juicy and approachable with enough hop character to satisfy. The dad who usually drinks Miller Lite even asked for a second. Victory.', ['juicy', 'citrus', 'grapefruit', 'approachable'], 4.0, 3.5, 4.0, 4.0, 4.0, 'can'],
    ['craftdad', 'cigar-city-jai-alai', 3.5, 'Picked this up at the store because the can looked cool. Turns out it is a legit IPA with serious citrus punch. A bit more bitter than my usual picks but it grew on me by the third can.', ['citrus', 'bitter', 'bold', 'tropical'], 3.5, 4.0, 3.5, 3.5, 3.5, 'can'],
    ['craftdad', 'stone-arrogant-bastard', 3.0, 'The label warned me I would not like it and the label was half right. It is intense and aggressive - not really a kick-back-on-the-patio beer. Respect the craft but this is more beer than I need on a Tuesday.', ['bitter', 'aggressive', 'malty', 'bold'], 3.5, 4.0, 3.0, 3.0, 3.0, 'bottle'],
    ['craftdad', 'dogfish-head-60-minute-ipa', 4.0, 'Solid middle-of-the-road IPA that I can always find at the grocery store. Not too crazy, not too boring. The Goldilocks of IPAs for a dad who just wants a good beer after bedtime.', ['citrus', 'balanced', 'smooth', 'hoppy'], 3.5, 3.5, 4.0, 4.0, 4.0, 'bottle'],
    ['craftdad', 'revolution-anti-hero', 3.5, 'Chicago represent! Decent everyday IPA with solid citrus and pine notes. Not going to blow your mind but it is reliable and affordable. The hero this dad needs, not the one he deserves.', ['citrus', 'piney', 'reliable', 'balanced'], 3.5, 3.5, 3.5, 3.5, 3.5, 'can'],
    ['craftdad', 'sierra-nevada-hazy-little-thing', 4.0, 'My 12-year-old said this looked like orange juice and honestly she is not wrong. Smooth, tropical, and easy drinking. Converted at least two other dads at the cookout with this one.', ['hazy', 'tropical', 'smooth', 'juicy'], 4.0, 3.5, 4.0, 4.0, 4.0, 'can'],
    ['craftdad', 'surly-furious', 3.5, 'Minnesota nice meets Minnesota aggressive hops. A lot going on here for a weeknight beer but I respect the intensity. Better shared with a buddy so you can pretend you understood all the flavor notes.', ['hoppy', 'aggressive', 'citrus', 'bold'], 3.5, 4.0, 3.5, 3.0, 3.5, 'can'],
    ['craftdad', 'weihenstephaner-hefeweissbier', 4.0, 'My father-in-law served this at a family dinner and I felt cultured for once. Banana and clove flavors that even non-beer people enjoy. Great with bratwurst. I felt like a sophisticated dad for ten minutes.', ['banana', 'clove', 'wheat', 'refreshing'], 4.0, 4.0, 4.0, 4.0, 4.0, 'draft'],
    ['craftdad', 'toppling-goliath-pseudosue', 4.0, 'Iowa beer that punches way above its weight class. Smooth, tropical, and dangerously drinkable. Brought some back from a road trip and it did not last the weekend. The kids want to go back to Iowa now.', ['tropical', 'smooth', 'citrus', 'crisp'], 4.0, 3.5, 4.0, 4.0, 4.0, 'can'],

    // ===== PILSNER PETE (lager loyalist, skeptical of hop bombs) =====
    ['pilsner_pete', 'weihenstephaner-hefeweissbier', 4.5, 'Now this is how you brew a traditional beer. Nearly a thousand years and they still have not lost the plot. Clean, balanced, and full of character without needing a pound of hops. Perfection.', ['wheat', 'banana', 'clove', 'traditional'], 4.5, 5.0, 4.5, 4.5, 4.5, 'draft'],
    ['pilsner_pete', 'weihenstephaner-vitus', 4.5, 'Strong wheat beer that somehow remains elegant. The Bavarians know that ABV does not have to mean aggressive. Banana, vanilla, and a gentle warmth. This is how you do a big beer right.', ['banana', 'vanilla', 'elegant', 'warming'], 4.5, 4.5, 4.5, 4.5, 4.5, 'bottle'],
    ['pilsner_pete', 'founders-all-day-ipa', 3.5, 'For an IPA this is actually okay. Low enough ABV that it drinks like a session beer and the hops are present without being obnoxious. Would still rather have a pilsner but I will tolerate this at a party.', ['sessionable', 'mild', 'citrus'], 3.0, 3.0, 3.5, 3.5, 3.5, 'can'],
    ['pilsner_pete', 'jester-king-le-petit-prince', 5.0, 'Finally someone who understands that great beer does not need to be 8%. This table beer at 2.9% has more character than most double IPAs. Light, refreshing, subtly complex. More of this please.', ['light', 'refreshing', 'farmhouse', 'complex'], 4.5, 4.0, 5.0, 5.0, 5.0, 'draft'],
    ['pilsner_pete', 'bells-oberon', 4.0, 'Wheat ale done right. Light, citrusy, and actually refreshing instead of coating your tongue with hop resin. A beer for enjoying outside, not for sitting in a dark bar analyzing.', ['wheat', 'citrus', 'refreshing', 'light'], 3.5, 4.0, 4.0, 4.5, 4.0, 'can'],
    ['pilsner_pete', 'stone-ipa', 2.0, 'And here we go with the hop assault. Bitter for the sake of being bitter. I know people love this but I genuinely do not understand the appeal of drinking liquid pine needles. Pass.', ['bitter', 'piney', 'aggressive'], 2.5, 3.0, 2.0, 2.0, 2.0, 'can'],
    ['pilsner_pete', 'stone-arrogant-bastard', 2.0, 'The name is accurate at least. Arrogantly bitter and proud of it. The back label dares you not to like it - challenge accepted. This is everything wrong with the more-is-more approach to brewing.', ['bitter', 'aggressive', 'overwhelming'], 2.5, 3.0, 2.0, 2.0, 2.0, 'bottle'],
    ['pilsner_pete', 'sierra-nevada-pale-ale', 3.5, 'The OG craft beer gets a grudging nod from me. It is hoppy but balanced enough that the malt actually shows up. I can see why this converted people. Still prefer a clean lager though.', ['hoppy', 'balanced', 'citrus', 'malty'], 3.5, 3.5, 3.5, 3.5, 3.5, 'bottle'],
    ['pilsner_pete', 'dogfish-head-seaquench', 3.5, 'A sour beer with salt and lime - basically a Gose, which is a German style, so I will give it some respect. Refreshing and sessionable. Good beach beer even if it is not a proper pilsner.', ['salty', 'lime', 'tart', 'refreshing'], 3.0, 3.0, 3.5, 4.0, 3.5, 'can'],
    ['pilsner_pete', 'deschutes-black-butte-porter', 3.0, 'Dark beers are not my thing but at least this one is smooth and not bitter. The chocolate and coffee notes are pleasant. Okay for a cold evening. I still say lighter is better.', ['chocolate', 'coffee', 'smooth', 'dark'], 3.0, 3.5, 3.0, 3.5, 3.0, 'draft'],
    ['pilsner_pete', 'hill-farmstead-ann', 4.0, 'A saison that actually tastes like beer instead of a science experiment. Dry, peppery, and wonderfully effervescent. Hill Farmstead clearly respects tradition even while being creative. Rare praise from me.', ['peppery', 'dry', 'effervescent', 'crisp'], 4.0, 4.0, 4.0, 4.5, 4.0, 'draft'],
    ['pilsner_pete', 'tree-house-julius', 2.5, 'It looks like orange juice, smells like a tropical candle, and has the mouthfeel of a smoothie. This is not beer, this is a hop milkshake. I know the haze bros love it but this is just not for me.', ['hazy', 'tropical', 'thick', 'sweet'], 3.0, 2.0, 2.5, 2.0, 2.5, 'can'],

    // ===== BARREL QUEEN (barrel-aged obsessed) =====
    ['barrel_queen', 'founders-kbs', 5.0, 'The bourbon barrel integration is sublime. A full year of cave aging creates layers of vanilla, coconut, and charred oak that wrap around the coffee and chocolate base like a warm blanket. My annual pilgrimage beer.', ['bourbon', 'vanilla', 'coconut', 'oak', 'coffee'], 5.0, 5.0, 5.0, 5.0, 5.0, 'bottle'],
    ['barrel_queen', 'firestone-walker-parabola', 5.0, 'The Firestone barrel program is world class and Parabola is the crown jewel. Bourbon, dark chocolate, and espresso with a silky viscosity that coats the glass. I have cellared every vintage since 2012.', ['bourbon', 'chocolate', 'espresso', 'silky'], 5.0, 5.0, 5.0, 5.0, 5.0, 'bottle'],
    ['barrel_queen', '3-floyds-dark-lord', 4.5, 'Dark Lord Day is a religious experience for barrel chasers. The base beer is a monster of molasses and dark fruit. Barrel-aged variants are transcendent. The regular version is incredible but I always chase the BA.', ['molasses', 'dark fruit', 'intense', 'complex'], 4.5, 5.0, 4.5, 4.0, 4.5, 'bottle'],
    ['barrel_queen', 'cigar-city-hunahpus', 4.5, 'The chili and cinnamon additions create a Mexican hot chocolate character that plays beautifully off barrel aging. I have had both the regular and BA versions - both outstanding. The spice lingers for minutes.', ['chocolate', 'cinnamon', 'chili', 'warming'], 4.5, 5.0, 4.5, 4.0, 4.5, 'bottle'],
    ['barrel_queen', 'surly-darkness', 4.5, 'Darkness Day in Minneapolis is the stout equivalent of Mardi Gras. Rich, complex, and rewarding. Cherries, dark chocolate, and roasted malt with bourbon barrel warmth. Ages beautifully for 3-5 years.', ['chocolate', 'cherry', 'roasted', 'bourbon'], 4.5, 5.0, 4.5, 4.0, 4.5, 'bottle'],
    ['barrel_queen', 'russian-river-supplication', 4.5, 'Pinot Noir barrels are an underutilized gem in beer. The wine tannins add a sophistication that bourbon barrels cannot match. Tart cherry, vinous funk, and a dry finish. Different kind of barrel magic.', ['cherry', 'vinous', 'tannin', 'complex'], 4.5, 4.5, 4.5, 4.0, 4.5, 'bottle'],
    ['barrel_queen', 'founders-breakfast-stout', 3.5, 'Good base beer but it really needs barrel treatment to reach its full potential. The coffee and chocolate are solid but without the oak influence it feels a bit one-dimensional. KBS is the complete version.', ['coffee', 'chocolate', 'roasted', 'creamy'], 3.5, 4.0, 3.5, 4.0, 3.5, 'bottle'],
    ['barrel_queen', 'cantillon-gueuze', 4.5, 'Oak foudres and spontaneous fermentation - the original barrel-aged beer. Cantillon is proof that wood and time create magic. The complexity from years in old oak is unmatched by any modern barrel program.', ['tart', 'funky', 'oak', 'complex', 'dry'], 4.5, 4.0, 4.5, 4.0, 4.5, 'bottle'],
    ['barrel_queen', 'founders-dirty-bastard', 3.5, 'Smoky and malty Scotch ale that would be incredible with some barrel time. The peated malt is interesting but I keep imagining what bourbon or rum barrels would do to this. Founders, if you are reading this...', ['smoky', 'malty', 'toffee', 'caramel'], 3.5, 3.5, 3.5, 3.5, 3.5, 'bottle'],
    ['barrel_queen', 'deschutes-black-butte-porter', 3.0, 'Pleasant porter but lacking the depth I crave. Everything is smooth and inoffensive. I need more complexity, more layers, more wood influence. It is fine for what it is but I want more.', ['chocolate', 'smooth', 'mild', 'coffee'], 3.0, 3.5, 3.0, 3.5, 3.0, 'draft'],
    ['barrel_queen', 'dogfish-head-90-minute-ipa', 3.0, 'Massive IPA that has the body to support barrel aging but they did not barrel age it. The continuous hopping creates complexity but it is not the same kind of complexity I seek. Needs wood.', ['hoppy', 'malty', 'warming', 'complex'], 3.0, 3.5, 3.0, 3.0, 3.0, 'bottle'],
    ['barrel_queen', 'bells-hopslam', 3.0, 'The honey adds an interesting dimension but this is still fundamentally a hop bomb. At 10% it could handle some barrel time. As-is, it is a well-made DIPA that does not scratch my barrel itch.', ['hoppy', 'honey', 'sweet', 'strong'], 3.5, 3.5, 3.0, 3.0, 3.0, 'draft'],

    // ===== HOPS AND DREAMS (college student discovering craft) =====
    ['hops_and_dreams', 'tree-house-julius', 5.0, 'Drove two hours with my roommates to get this and it was worth every mile. This beer literally changed what I thought beer could be. Tropical explosion with zero bitterness. I am never going back to light lagers.', ['tropical', 'juicy', 'smooth', 'mind-blowing'], 5.0, 4.5, 5.0, 5.0, 5.0, 'can'],
    ['hops_and_dreams', 'tree-house-green', 4.5, 'Almost as good as Julius but different enough to justify buying both. Honeydew melon and citrus dominate. Creamy and soft. Tree House is basically my Disneyland at this point.', ['honeydew', 'citrus', 'creamy', 'tropical'], 4.5, 4.5, 4.5, 4.5, 4.5, 'can'],
    ['hops_and_dreams', 'other-half-green-city', 4.5, 'Brooklyn brewery visit with friends turned into a religious experience. Green City is everything I want in a hazy - juicy, soft, and absolutely bursting with hop flavor. The vibes at the taproom were unreal.', ['juicy', 'hazy', 'tropical', 'soft'], 4.5, 4.0, 4.5, 4.5, 4.5, 'draft'],
    ['hops_and_dreams', 'other-half-ddh-all-citra-everything', 4.5, 'DDH Citra is basically a cheat code for making incredible beer. This is pure citrus in a glass. Grapefruit, tangerine, and mango. At 8.5% it hits hard but goes down way too smooth.', ['citrus', 'grapefruit', 'mango', 'intense'], 5.0, 4.0, 4.5, 4.5, 4.5, 'can'],
    ['hops_and_dreams', 'alchemist-heady-topper', 5.0, 'My beer nerd friend made me try this and I understood the hype instantly. Drank it from the can like the label says. Tropical fruit paradise with a dank undertone. I get why people trade for this.', ['tropical', 'dank', 'smooth', 'legendary'], 5.0, 4.0, 5.0, 5.0, 5.0, 'can'],
    ['hops_and_dreams', 'sierra-nevada-hazy-little-thing', 3.5, 'This was my gateway hazy before I knew what good hazies actually tasted like. Still decent and easy to find anywhere but after having Tree House and Other Half it feels like the training wheels version.', ['hazy', 'citrus', 'light', 'accessible'], 3.5, 3.5, 3.5, 3.5, 3.5, 'can'],
    ['hops_and_dreams', 'trillium-congress-street', 4.5, 'Trillium makes insane NEIPAs and Congress Street is available year-round which is clutch. Tangerine and pineapple with a creamy body. Brought some back to campus and became very popular very fast.', ['tangerine', 'pineapple', 'creamy', 'hazy'], 4.5, 4.0, 4.5, 4.5, 4.5, 'can'],
    ['hops_and_dreams', 'trillium-ddh-fort-point', 4.0, 'DDH Fort Point is lighter than Congress Street but still packed with flavor. Peach and citrus vibes. Great for when you want hop flavor without getting destroyed. Perfect study break beer. If studying involves beer.', ['peach', 'citrus', 'light', 'refreshing'], 4.0, 3.5, 4.0, 4.0, 4.0, 'can'],
    ['hops_and_dreams', 'toppling-goliath-king-sue', 4.5, 'King Sue is absolutely royal. Massive tropical fruit character that tastes like a mango smoothie with attitude. 7.8% sneaks up on you. Split a 4-pack with my roommate and we were done for the night.', ['mango', 'tropical', 'juicy', 'strong'], 4.5, 4.0, 4.5, 4.0, 4.5, 'can'],
    ['hops_and_dreams', 'bells-two-hearted-ale', 4.0, 'Everyone says this is a classic and I see why. Grapefruit and pine with a solid malt backbone. Not as flashy as the hazies but there is something really pure about it. Dad recommended this one.', ['grapefruit', 'piney', 'classic', 'balanced'], 4.0, 4.0, 4.0, 3.5, 4.0, 'can'],
    ['hops_and_dreams', 'founders-all-day-ipa', 3.0, 'Okay for a session beer but honestly pretty boring compared to what else is out there. I know it is supposed to be sessionable but I would rather have one great beer than four mediocre ones.', ['mild', 'citrus', 'light', 'sessionable'], 3.0, 3.0, 3.0, 3.0, 3.0, 'can'],
    ['hops_and_dreams', 'stone-delicious-ipa', 3.5, 'Solid West Coast IPA that is more accessible than other Stone beers. The lemon and tropical hops are nice. Good gateway to West Coast style if you are coming from the hazy world like me.', ['lemon', 'tropical', 'hoppy', 'citrus'], 3.5, 3.5, 3.5, 3.0, 3.5, 'can'],

    // ===== THE BEEROLOGIST (scientific, molecular approach) =====
    ['the_beerologist', 'russian-river-pliny-the-elder', 4.5, 'Hop utilization in this beer is remarkably efficient. The alpha acid extraction from multiple additions creates a layered bitterness profile rather than a monolithic wall of IBUs. Residual sugar is precisely calibrated at the low end to maintain drinkability.', ['complex', 'citrus', 'resinous', 'balanced', 'efficient'], 4.5, 4.5, 4.5, 5.0, 4.5, 'draft'],
    ['the_beerologist', 'tree-house-julius', 4.5, 'Fascinating example of biotransformation where yeast metabolizes hop compounds during active fermentation. The resulting thiols and polyfunctional mercaptans create tropical notes impossible to achieve through dry hopping alone. Turbidity from protein-polyphenol complexes adds body.', ['tropical', 'creamy', 'complex', 'biotransformed'], 4.5, 4.0, 4.5, 5.0, 4.5, 'can'],
    ['the_beerologist', 'cantillon-gueuze', 5.0, 'Spontaneous fermentation represents the most complex microbial ecosystem in brewing. Multiple Brettanomyces strains, Pediococcus, Lactobacillus, and wild Saccharomyces all contribute to a flavor profile no single organism could produce. The pH likely sits around 3.3.', ['tart', 'complex', 'funky', 'microbial', 'dry'], 5.0, 4.5, 5.0, 4.5, 5.0, 'bottle'],
    ['the_beerologist', 'cantillon-rose-de-gambrinus', 4.5, 'The raspberry addition introduces anthocyanins that provide the rose color and additional phenolic compounds. The fruit sugars are fully attenuated by the mixed culture, resulting in a bone-dry beer with ethereal fruit character. No residual sweetness.', ['raspberry', 'dry', 'phenolic', 'tart', 'elegant'], 4.5, 5.0, 4.5, 4.5, 4.5, 'bottle'],
    ['the_beerologist', 'weihenstephaner-hefeweissbier', 5.0, 'The Weihenstephan yeast strain produces isoamyl acetate (banana) and 4-vinyl guaiacol (clove) in near-perfect equilibrium. Ferulic acid rest during mashing maximizes phenol precursors. The protein content from wheat contributes to stable foam and haze.', ['banana', 'clove', 'phenolic', 'wheat', 'balanced'], 5.0, 5.0, 5.0, 4.5, 5.0, 'draft'],
    ['the_beerologist', 'founders-kbs', 4.5, 'Barrel extraction kinetics are fascinating here. One year in bourbon barrels allows vanillin, lactones, and tannins to migrate into the beer while the charred interior provides color compounds. Ethanol concentration accelerates extraction of wood sugars.', ['bourbon', 'vanilla', 'lactone', 'tannin', 'complex'], 4.5, 5.0, 4.5, 4.5, 4.5, 'bottle'],
    ['the_beerologist', 'bells-two-hearted-ale', 4.0, 'Single-variety hop expression allows for clean analysis of Centennial characteristics: myrcene, humulene, and caryophyllene contribute herbal and floral notes while geraniol provides the citrus character. Malt provides fermentable sugars without competing aromatics.', ['herbal', 'floral', 'citrus', 'clean', 'balanced'], 4.0, 4.0, 4.0, 4.0, 4.0, 'can'],
    ['the_beerologist', 'hill-farmstead-edward', 4.5, 'Water chemistry is the unsung hero of this beer. Likely very low mineral content allowing hop flavors to present without interference. The attenuation appears high, suggesting a highly fermentable wort. Elegant and deceptively simple.', ['clean', 'floral', 'citrus', 'mineral', 'elegant'], 4.5, 4.5, 4.5, 4.5, 4.5, 'draft'],
    ['the_beerologist', 'firestone-walker-parabola', 5.0, 'At 14% ABV the ethanol acts as a solvent for barrel compounds, extracting deeper wood character than lower-gravity beers could achieve. The viscosity from residual dextrins and ethanol creates exceptional mouthfeel. Masterful control of Maillard reaction products.', ['bourbon', 'chocolate', 'vanilla', 'viscous', 'complex'], 5.0, 5.0, 5.0, 5.0, 5.0, 'bottle'],
    ['the_beerologist', 'dogfish-head-90-minute-ipa', 4.0, 'Continuous hopping creates a different IBU curve than traditional addition schedules. The constant introduction of alpha acids during the boil produces a smoother bitterness profile. Isomerization efficiency improves with smaller, frequent additions.', ['hoppy', 'smooth', 'complex', 'malty'], 4.0, 4.0, 4.0, 4.0, 4.0, 'bottle'],
    ['the_beerologist', 'alchemist-heady-topper', 4.5, 'Drinking from the can eliminates volatile hop compound oxidation that occurs with pouring. The aromatics are preserved in the headspace and delivered directly. Brilliant practical application of chemistry to improve the drinking experience.', ['tropical', 'dank', 'aromatic', 'preserved'], 5.0, 3.5, 4.5, 4.5, 4.5, 'can'],
    ['the_beerologist', 'jester-king-atrial-rubicite', 4.5, 'Mixed-culture fermentation with fruit addition creates a complex biochemical environment. The raspberry sugars provide additional substrates for Brett and bacteria, producing secondary metabolites that enhance fruit character beyond simple flavor addition.', ['raspberry', 'funky', 'complex', 'tart', 'microbial'], 4.5, 5.0, 4.5, 4.0, 4.5, 'bottle'],
    ['the_beerologist', 'stone-ipa', 3.0, 'Straightforward hop utilization schedule with late additions providing most of the aroma. The crystal malt inclusion adds caramel sweetness that slightly masks hop character. Technically sound but lacks the elegance of more refined formulations.', ['piney', 'caramel', 'bitter', 'straightforward'], 3.0, 3.5, 3.0, 3.0, 3.0, 'can'],

    // ===== PATIO PINTS (always mentions the vibe/setting) =====
    ['patio_pints', 'bells-oberon', 5.0, 'First warm Saturday of the year, sitting on the back porch with the grill going, cracking open an Oberon - there is no better feeling. This beer IS summer. The wheat character and citrus notes pair perfectly with sunshine.', ['summer', 'citrus', 'wheat', 'refreshing'], 4.5, 4.5, 4.5, 5.0, 5.0, 'can'],
    ['patio_pints', 'sierra-nevada-pale-ale', 4.0, 'Had this on a rooftop bar in San Francisco at sunset. The hoppy bitterness cut through the cool evening air perfectly. This beer was made for outdoor drinking. Simple, reliable, and always satisfying with a view.', ['hoppy', 'citrus', 'classic', 'balanced'], 4.0, 4.0, 4.0, 4.0, 4.0, 'draft'],
    ['patio_pints', 'dogfish-head-seaquench', 5.0, 'Toes in the sand, waves crashing, this beer in hand - pure bliss. The salt and lime make it feel like you are drinking the ocean breeze. Absolute top-tier beach beer. I go through cases every summer.', ['salty', 'lime', 'refreshing', 'beach'], 4.5, 4.0, 5.0, 5.0, 5.0, 'can'],
    ['patio_pints', 'jester-king-le-petit-prince', 5.0, 'Drank this on the Jester King patio overlooking the Texas Hill Country. 2.9% means you can sit there all afternoon without worry. The farmhouse funk pairs with the rustic setting like they were made for each other.', ['farmhouse', 'light', 'crisp', 'rustic'], 4.5, 4.0, 5.0, 5.0, 5.0, 'draft'],
    ['patio_pints', 'founders-all-day-ipa', 4.0, 'Tailgate MVP. This is the beer for when you arrive at noon and the game does not start until four. Flavorful enough to enjoy, light enough to keep going. The parking lot never tasted so good.', ['sessionable', 'citrus', 'light', 'hoppy'], 3.5, 3.5, 4.0, 4.0, 4.0, 'can'],
    ['patio_pints', 'cigar-city-jai-alai', 4.0, 'Crushed this on a boat in Tampa Bay and the tropical citrus notes blended with the salt air beautifully. Bold IPA that somehow works even in 95 degree heat. Florida knows how to brew for their weather.', ['citrus', 'tropical', 'bold', 'crisp'], 4.0, 4.0, 4.0, 3.5, 4.0, 'can'],
    ['patio_pints', 'deschutes-fresh-squeezed', 4.0, 'Perfect for the backyard fire pit. The juicy grapefruit character warms you from the inside while the fire warms you from the outside. Great with s-mores surprisingly. Outdoor beer essential.', ['grapefruit', 'juicy', 'refreshing', 'citrus'], 4.0, 3.5, 4.0, 4.0, 4.0, 'can'],
    ['patio_pints', 'alchemist-focal-banger', 4.5, 'Sat on the Alchemist patio in Stowe with the Green Mountains in the background sipping this. The tropical fruit character paired with the crisp Vermont air. Context matters and this context was flawless.', ['tropical', 'mango', 'smooth', 'scenic'], 4.5, 4.0, 4.5, 4.5, 4.5, 'can'],
    ['patio_pints', 'hill-farmstead-ann', 4.5, 'Drank this at the actual farmstead in Greensboro. Rolling Vermont hills, a wooden picnic table, and a dry effervescent saison. The peppery spice from the yeast matched the wildflower-scented air. Transcendent experience.', ['peppery', 'effervescent', 'dry', 'pastoral'], 4.5, 4.5, 4.5, 4.5, 4.5, 'draft'],
    ['patio_pints', 'surly-furious', 3.5, 'Had this at the Surly beer garden in Minneapolis on a warm July evening. The aggressive hops were almost too much for the setting - I wanted something more chill. Great beer, wrong vibe for a lazy summer night.', ['hoppy', 'aggressive', 'bold', 'citrus'], 4.0, 4.0, 3.5, 3.0, 3.5, 'draft'],
    ['patio_pints', 'weihenstephaner-hefeweissbier', 4.5, 'German beer garden energy in every sip. Had this at an Oktoberfest celebration under string lights with a giant pretzel. The banana and clove transported me straight to Bavaria even though I was in Ohio.', ['banana', 'clove', 'festive', 'wheat'], 4.5, 4.5, 4.5, 4.5, 4.5, 'draft'],
    ['patio_pints', 'tree-house-very-green', 3.5, 'Sat in the Tree House parking lot drinking this from the can per their no-on-premise rules. 8.3% double IPA in a parking lot is a choice. The beer is incredible but the setting dragged down my overall experience.', ['intense', 'tropical', 'creamy', 'parking-lot'], 4.5, 4.0, 4.5, 4.5, 3.5, 'can'],

    // ===== ALEXA BREWS (brief, evocative, photographer) =====
    ['alexa_brews', 'cantillon-rose-de-gambrinus', 5.0, 'Rose gold in the glass. Effervescent raspberry perfume. Dry, tart, ethereal. This is the most beautiful beer ever brewed.', ['raspberry', 'elegant', 'tart', 'beautiful'], 5.0, 5.0, 5.0, 4.5, 5.0, 'bottle'],
    ['alexa_brews', 'tree-house-julius', 4.5, 'Opaque golden orange. Smells like a fruit stand in paradise. Creamy, soft, tropical. Photographs like liquid sunshine.', ['tropical', 'golden', 'creamy', 'photogenic'], 4.5, 5.0, 4.5, 4.5, 4.5, 'can'],
    ['alexa_brews', 'founders-kbs', 4.5, 'Motor oil black with a tan head. Aromas of fresh espresso and vanilla bean. Rich, warming, endless. Looks stunning backlit by candlelight.', ['espresso', 'vanilla', 'dark', 'moody'], 4.5, 5.0, 4.5, 4.5, 4.5, 'bottle'],
    ['alexa_brews', 'weihenstephaner-hefeweissbier', 4.0, 'Cloudy gold poured into a proper weizen glass. Banana bread aroma. Classic beauty that never goes out of style. The foam crown is absolutely perfect for photos.', ['cloudy', 'banana', 'classic', 'golden'], 4.0, 5.0, 4.0, 4.0, 4.0, 'draft'],
    ['alexa_brews', 'russian-river-pliny-the-elder', 4.5, 'Copper amber with brilliant clarity. Pine and citrus leap from the glass. Crisp, clean, iconic. The color catches light like autumn.', ['copper', 'piney', 'citrus', 'luminous'], 4.5, 5.0, 4.5, 4.5, 4.5, 'draft'],
    ['alexa_brews', 'surly-darkness', 4.0, 'Jet black with garnet edges held to light. Dark chocolate and cherry on the nose. Thick, decadent, brooding. Named perfectly.', ['dark', 'chocolate', 'cherry', 'brooding'], 4.5, 5.0, 4.0, 4.0, 4.0, 'bottle'],
    ['alexa_brews', 'jester-king-atrial-rubicite', 5.0, 'Ruby pink with champagne bubbles. Raspberry and wild funk intertwine. Vibrant, alive, complex. The most Instagrammable beer in existence.', ['ruby', 'raspberry', 'funky', 'vibrant'], 5.0, 5.0, 5.0, 4.5, 5.0, 'bottle'],
    ['alexa_brews', 'hill-farmstead-edward', 4.0, 'Pale straw gold with delicate haze. Floral and citrus whisper from the glass. Understated, elegant, precise. Beauty in simplicity.', ['floral', 'delicate', 'straw', 'elegant'], 4.0, 4.5, 4.0, 4.0, 4.0, 'draft'],
    ['alexa_brews', 'other-half-green-city', 4.0, 'Dense golden haze like a sunset through clouds. Tropical punch aromatics. Soft, pillowy, bright. Looks incredible against exposed brick walls.', ['hazy', 'golden', 'tropical', 'soft'], 4.0, 4.5, 4.0, 4.0, 4.0, 'draft'],
    ['alexa_brews', 'cantillon-kriek', 4.5, 'Deep garnet red with pink foam. Sour cherry and almond aroma. Dry, complex, hauntingly good. The color alone is worth the price of admission.', ['garnet', 'cherry', 'almond', 'haunting'], 4.5, 5.0, 4.5, 4.0, 4.5, 'bottle'],
    ['alexa_brews', 'deschutes-black-butte-porter', 3.5, 'Deep brown with ruby highlights. Chocolate and light coffee aroma. Smooth and approachable. Good-looking beer but nothing that stops the scroll.', ['brown', 'chocolate', 'smooth', 'mild'], 3.5, 4.0, 3.5, 3.5, 3.5, 'draft'],

    // ===== UNTAPPED DAN (rating machine, efficient reviews) =====
    ['untapped_dan', 'russian-river-pliny-the-elder', 5.0, 'Whale acquired. Lives up to the hype completely. Best DIPA in the country and it is not even close. The balance is otherworldly. Finally checked this one off the list.', ['hoppy', 'balanced', 'legendary', 'citrus'], 5.0, 4.5, 5.0, 5.0, 5.0, 'draft'],
    ['untapped_dan', 'russian-river-pliny-the-younger', 5.0, 'THE whale. Waited three hours in line and would do it again. Triple IPA that drinks like a single. Smooth, tropical, and deceptively potent. Unique check-in number 3,247.', ['tropical', 'smooth', 'rare', 'legendary'], 5.0, 4.5, 5.0, 5.0, 5.0, 'draft'],
    ['untapped_dan', 'tree-house-julius', 4.5, 'Top-tier NEIPA that delivers every time. Tropical bomb with perfect mouthfeel. Consistent batch to batch which is rare for hazies. Easy 4.5 from me.', ['tropical', 'consistent', 'juicy', 'creamy'], 4.5, 4.0, 4.5, 5.0, 4.5, 'can'],
    ['untapped_dan', 'tree-house-green', 4.5, 'Another banger from Tree House. Honeydew and citrus with that signature creamy body. Slightly different hop profile than Julius. Unique entry number 47 from Tree House alone.', ['honeydew', 'citrus', 'creamy', 'unique'], 4.5, 4.0, 4.5, 4.5, 4.5, 'can'],
    ['untapped_dan', 'tree-house-very-green', 4.5, 'Amped up Green. More hops, more body, more everything. 8.3% that hides dangerously well. Third Tree House entry today and zero regrets.', ['intense', 'tropical', 'bold', 'dangerous'], 4.5, 4.0, 4.5, 4.5, 4.5, 'can'],
    ['untapped_dan', 'alchemist-heady-topper', 5.0, 'The OG haze king. Still holds up against the flood of NEIPAs it inspired. Tropical and dank with perfect carbonation. A must-have for any serious beer checklist.', ['dank', 'tropical', 'iconic', 'perfect'], 5.0, 4.0, 5.0, 5.0, 5.0, 'can'],
    ['untapped_dan', 'alchemist-focal-banger', 4.5, 'Heady Topper gets all the love but Focal Banger might actually be more drinkable. Tropical fruit without the dank edge. Easy-drinking VT IPA. Check.', ['tropical', 'smooth', 'mango', 'clean'], 4.5, 4.0, 4.5, 4.5, 4.5, 'can'],
    ['untapped_dan', 'founders-kbs', 4.5, 'Annual release that never disappoints. Bourbon, coffee, chocolate - the holy trinity of barrel-aged stouts. Grabbed two bottles, drank one, cellared one. Classic move.', ['bourbon', 'coffee', 'chocolate', 'annual'], 4.5, 5.0, 4.5, 4.5, 4.5, 'bottle'],
    ['untapped_dan', '3-floyds-zombie-dust', 4.5, 'The Citra pale ale that launched a thousand imitators. Fresh Zombie Dust is one of the best beers in the Midwest. Hard to get but worth the hunt. Badge unlocked.', ['citrus', 'tropical', 'fresh', 'cult'], 4.5, 4.0, 4.5, 4.5, 4.5, 'can'],
    ['untapped_dan', '3-floyds-dark-lord', 4.5, 'Dark Lord Day check-in complete. Waited in line for hours in the rain. Thick, intense, boozy. More of an experience than a casual drink. The variants are even crazier.', ['intense', 'boozy', 'molasses', 'event'], 4.5, 5.0, 4.5, 3.5, 4.5, 'bottle'],
    ['untapped_dan', 'toppling-goliath-king-sue', 4.5, 'Iowa produces some of the best beer in the country and people do not even know it. King Sue is proof. Massive tropical Citra character. Quick rating, obvious score.', ['tropical', 'mango', 'juicy', 'citra'], 4.5, 4.0, 4.5, 4.5, 4.5, 'can'],
    ['untapped_dan', 'toppling-goliath-pseudosue', 4.0, 'King Sue little brother that holds its own. More sessionable Citra goodness. Clean, tropical, crushable. Solid everyday craft beer from an elite brewery. Rating 4 of the day.', ['citra', 'clean', 'tropical', 'crushable'], 4.0, 3.5, 4.0, 4.0, 4.0, 'can'],
    ['untapped_dan', 'maine-beer-lunch', 4.5, 'Clean, balanced, and endlessly drinkable IPA. Maine Beer Company keeps it simple and executes perfectly. The sustainability mission is a bonus. Lunch earned its name - you want it every day.', ['clean', 'balanced', 'floral', 'crisp'], 4.5, 4.0, 4.5, 4.5, 4.5, 'can'],
    ['untapped_dan', 'maine-beer-dinner', 4.5, 'Bigger, bolder Lunch. More hops, more complexity, more ABV. Both are top-tier but Dinner has an extra gear. Limited release that is worth trading for. Check-in 3,252.', ['hoppy', 'bold', 'tropical', 'complex'], 4.5, 4.0, 4.5, 4.5, 4.5, 'bottle'],
    ['untapped_dan', 'cigar-city-jai-alai', 4.0, 'Florida IPA staple. Citrus forward with good bitterness. Consistent and widely available which counts for a lot. Not the flashiest but always reliable. Quick 4.0.', ['citrus', 'consistent', 'reliable', 'bold'], 4.0, 4.0, 4.0, 3.5, 4.0, 'can'],
    ['untapped_dan', 'surly-furious', 3.5, 'Solid Midwest IPA. Aggressive hops with decent balance. Not as polished as the top-tier IPAs but Minnesota pride earns it points. Done 23 Surly beers now total.', ['hoppy', 'aggressive', 'piney', 'solid'], 3.5, 4.0, 3.5, 3.5, 3.5, 'can'],
    ['untapped_dan', 'other-half-green-city', 4.5, 'Other Half does hazies like nobody else in NYC. Green City is their staple and it delivers tropical juice vibes every time. The Brooklyn taproom is always worth the trip. Checked in.', ['tropical', 'juicy', 'hazy', 'nyc'], 4.5, 4.0, 4.5, 4.5, 4.5, 'draft'],
    ['untapped_dan', 'firestone-walker-union-jack', 3.5, 'Solid West Coast IPA that does not break new ground but does everything right. Piney, crisp, and dry. Good shelf beer when you cannot find fresh local stuff. Dependable 3.5.', ['piney', 'crisp', 'dry', 'reliable'], 3.5, 3.5, 3.5, 3.5, 3.5, 'can'],

    // ===== SUDS N BUDS (enthusiastic newbie) =====
    ['suds_n_buds', 'sierra-nevada-hazy-little-thing', 4.0, 'My buddy told me to try this and wow, IPAs are actually good?? I always thought they were super bitter but this is like tropical juice. Mind officially blown. Beer is way more interesting than I thought.', ['juicy', 'tropical', 'smooth', 'surprising'], 4.0, 3.5, 4.0, 4.0, 4.0, 'can'],
    ['suds_n_buds', 'bells-oberon', 4.5, 'This is SO refreshing! Like liquid sunshine. I had no idea wheat beers were a thing and now I want to try them all. Bringing this to every summer hangout from now on.', ['wheat', 'refreshing', 'sunshine', 'citrus'], 4.0, 4.0, 4.5, 4.5, 4.5, 'can'],
    ['suds_n_buds', 'founders-all-day-ipa', 3.5, 'Good starter IPA that does not punch you in the face with bitterness. My more experienced friends say it is nothing special but for someone just getting into craft beer this is a great stepping stone.', ['mild', 'hoppy', 'accessible', 'light'], 3.5, 3.0, 3.5, 3.5, 3.5, 'can'],
    ['suds_n_buds', 'dogfish-head-seaquench', 4.5, 'Sour beers are a thing and they are AMAZING! This one has salt and lime like a margarita. Showed this to my girlfriend and she loved it too. Best discovery of the month.', ['sour', 'salty', 'lime', 'amazing'], 4.0, 3.5, 4.5, 4.5, 4.5, 'can'],
    ['suds_n_buds', 'deschutes-fresh-squeezed', 4.0, 'The name really checks out - it tastes like fresh grapefruit juice mixed with beer. So good with pizza. I am slowly building my craft beer knowledge and this one is a keeper.', ['grapefruit', 'juicy', 'fresh', 'citrus'], 4.0, 3.5, 4.0, 4.0, 4.0, 'can'],
    ['suds_n_buds', 'weihenstephaner-hefeweissbier', 4.0, 'A German wheat beer from the oldest brewery in the WORLD? How cool is that! Tastes like banana bread in beer form. Showed this fact to everyone at the bar. I am becoming that beer guy.', ['banana', 'wheat', 'historic', 'cool'], 4.0, 4.0, 4.0, 4.0, 4.0, 'draft'],
    ['suds_n_buds', 'deschutes-black-butte-porter', 3.5, 'First dark beer attempt and it was way better than expected! Not bitter like I thought dark beers would be. Smooth and chocolatey. Still prefer lighter beers but I get the appeal now.', ['chocolate', 'smooth', 'surprising', 'dark'], 3.5, 3.5, 3.5, 4.0, 3.5, 'draft'],
    ['suds_n_buds', 'stone-ipa', 2.5, 'Okay this one was too bitter for me. My friends say it is a classic but it made my face scrunch up. Maybe I will come back to it when my palate develops more. Respect the brewery though.', ['bitter', 'piney', 'intense', 'challenging'], 3.0, 3.5, 2.5, 2.5, 2.5, 'can'],
    ['suds_n_buds', 'revolution-anti-hero', 3.5, 'Decent IPA that is not too extreme in any direction. A friend from Chicago brought this and it was a nice intro to West Coast style IPAs. Citrusy with some pine. I am learning!', ['citrus', 'piney', 'balanced', 'learning'], 3.5, 3.5, 3.5, 3.5, 3.5, 'can'],
    ['suds_n_buds', 'sierra-nevada-pale-ale', 3.5, 'Everyone says to start here so I did. Pretty good! Has a nice balance of hops and malt that I can actually appreciate now that I have tried a few craft beers. The gateway beer is real.', ['hoppy', 'balanced', 'gateway', 'classic'], 3.5, 3.5, 3.5, 3.5, 3.5, 'bottle'],

    // ===== GRAINBILL GARY (retired brewer, deep technical knowledge) =====
    ['grainbill_gary', 'sierra-nevada-pale-ale', 4.5, 'Ken Grossman set the template for American craft with this beer. The grain bill is deceptively simple - two-row pale with a touch of crystal 60. That simplicity is what allows the Cascade and Centennial to truly sing.', ['citrus', 'piney', 'classic', 'craft-template'], 4.5, 4.0, 4.5, 4.0, 4.5, 'bottle'],
    ['grainbill_gary', 'bells-two-hearted-ale', 5.0, 'Larry Bell proved that a single hop variety, used correctly, can create something transcendent. This beer taught a generation of brewers that restraint and focus produce better results than throwing everything at the wall.', ['grapefruit', 'floral', 'focused', 'transcendent'], 5.0, 4.5, 5.0, 4.5, 5.0, 'can'],
    ['grainbill_gary', 'founders-kbs', 5.0, 'I helped train the team that eventually developed the barrel program at a competing brewery. KBS showed us all what was possible. The coffee and chocolate base is impeccable, and the cave aging concept was revolutionary.', ['bourbon', 'coffee', 'revolutionary', 'oak'], 5.0, 5.0, 5.0, 5.0, 5.0, 'bottle'],
    ['grainbill_gary', 'russian-river-pliny-the-elder', 5.0, 'Vinnie Cilurzo is one of the most talented brewers alive. The hop schedule on Pliny is a master class in extraction and timing. I have seen the recipe evolve over the years and it just keeps getting better.', ['hoppy', 'masterful', 'evolved', 'citrus'], 5.0, 4.5, 5.0, 5.0, 5.0, 'draft'],
    ['grainbill_gary', 'hill-farmstead-edward', 5.0, 'Shaun Hill does with water and grain what most brewers cannot do with unlimited budgets. This pale ale is the purest expression of ingredients I have ever encountered. If I could brew one more beer, it would be this.', ['pure', 'floral', 'citrus', 'masterwork'], 5.0, 4.5, 5.0, 5.0, 5.0, 'draft'],
    ['grainbill_gary', 'hill-farmstead-abner', 5.0, 'The double IPA that makes other double IPAs feel heavy-handed. Hill uses probably a very simple grain bill - mostly pilsner malt - and lets the hops and water do the talking. Brewing is about subtraction, not addition.', ['refined', 'hoppy', 'balanced', 'elegant'], 5.0, 4.5, 5.0, 5.0, 5.0, 'draft'],
    ['grainbill_gary', 'firestone-walker-parabola', 5.0, 'Matt Brynildson runs one of the best barrel programs in the country. Parabola shows what happens when a world-class brewer has access to premium bourbon barrels and the patience to use them properly. No shortcuts here.', ['bourbon', 'chocolate', 'patience', 'premium'], 5.0, 5.0, 5.0, 5.0, 5.0, 'bottle'],
    ['grainbill_gary', 'cantillon-gueuze', 5.0, 'Jean Van Roy is continuing a tradition that predates modern brewing science. Spontaneous fermentation, coolship exposure, and years of barrel aging. No brewing technology can replicate what time and microbes create here. Sacred.', ['funky', 'traditional', 'sacred', 'complex'], 5.0, 4.5, 5.0, 4.5, 5.0, 'bottle'],
    ['grainbill_gary', 'dogfish-head-60-minute-ipa', 4.0, 'Sam Calagione is an innovator but this beer is actually his most restrained creation. The continuous hopping concept produces a smoother bitterness curve than traditional scheduling. Smart brewing disguised as simplicity.', ['smooth', 'innovative', 'balanced', 'citrus'], 4.0, 3.5, 4.0, 4.0, 4.0, 'bottle'],
    ['grainbill_gary', 'stone-arrogant-bastard', 3.5, 'Greg Koch built Stone on attitude and aggressive beers. Arrogant Bastard was intentionally abrasive and it worked as marketing. As a beer, it is well-made but the approach has aged less gracefully than the recipe.', ['aggressive', 'malty', 'bold', 'dated'], 3.5, 4.0, 3.5, 3.5, 3.5, 'bottle'],
    ['grainbill_gary', 'founders-breakfast-stout', 4.5, 'The oat addition is what separates good stouts from great ones. Founders understood that mouthfeel drives perception of richness. The Sumatra and Kona coffee blend was a stroke of genius that nobody has matched.', ['coffee', 'oatmeal', 'genius', 'rich'], 4.5, 4.5, 4.5, 5.0, 4.5, 'bottle'],
    ['grainbill_gary', 'weihenstephaner-hefeweissbier', 5.0, 'The standard. Every hefeweizen I ever brewed professionally was measured against this beer. The yeast strain management at Weihenstephan is arguably the most impressive technical achievement in all of brewing.', ['banana', 'clove', 'standard', 'technical'], 5.0, 5.0, 5.0, 4.5, 5.0, 'draft'],
    ['grainbill_gary', 'trillium-congress-street', 4.0, 'The new generation of brewers is doing things we never imagined. Congress Street represents modern American craft at its most creative. The hop utilization techniques are novel and effective. Bright, tropical, well-executed.', ['tropical', 'modern', 'creative', 'bright'], 4.0, 4.0, 4.0, 4.0, 4.0, 'can'],
    ['grainbill_gary', 'surly-darkness', 4.5, 'Omar Ansari built Surly by not compromising. Darkness is proof that the Midwest can produce world-class imperial stouts. The recipe is ambitious and the execution is meticulous. I respect the craft deeply.', ['chocolate', 'complex', 'ambitious', 'meticulous'], 4.5, 5.0, 4.5, 4.5, 4.5, 'bottle'],

    // ===== WILD ALE WENDY (sour/wild specialist) =====
    ['wild_ale_wendy', 'cantillon-gueuze', 5.0, 'The holy grail of lambic. I have visited Cantillon three times and each visit deepens my appreciation. The blend of young and old lambics creates an orchestra of tart, funky, and fruity notes. Jean Van Roy is an artist.', ['tart', 'funky', 'complex', 'lambic', 'artistic'], 5.0, 4.5, 5.0, 5.0, 5.0, 'bottle'],
    ['wild_ale_wendy', 'cantillon-rose-de-gambrinus', 5.0, 'Rose de Gambrinus demonstrates what fruit lambic should be - bone dry with authentic fruit character, not sugary juice. The raspberries add aromatics and color while the lambic base provides all the complexity.', ['raspberry', 'dry', 'authentic', 'aromatic', 'complex'], 5.0, 5.0, 5.0, 4.5, 5.0, 'bottle'],
    ['wild_ale_wendy', 'cantillon-kriek', 5.0, 'Traditional Schaerbeek cherries, not the sweet Morello that lesser producers use. The result is almondy, tart, and profound. I brought a bottle to a wine dinner and converted three sommeliers on the spot.', ['cherry', 'almond', 'tart', 'profound'], 5.0, 5.0, 5.0, 4.5, 5.0, 'bottle'],
    ['wild_ale_wendy', 'russian-river-supplication', 4.5, 'Vinnie was one of the first Americans to take wild fermentation seriously. Supplication combines Pinot Noir barrel character with sour cherry and Brett in a way that rivals Belgian producers. A pioneer.', ['cherry', 'vinous', 'brett', 'pioneering'], 4.5, 4.5, 4.5, 4.0, 4.5, 'bottle'],
    ['wild_ale_wendy', 'jester-king-atrial-rubicite', 5.0, 'Texas terroir is real and Jester King proves it. The wild yeast captured from the Hill Country air creates a fermentation character unique to their location. Atrial Rubicite is their masterpiece - raspberry, funk, and place.', ['raspberry', 'terroir', 'funky', 'place', 'masterpiece'], 5.0, 5.0, 5.0, 4.5, 5.0, 'bottle'],
    ['wild_ale_wendy', 'jester-king-le-petit-prince', 4.0, 'A farmhouse table beer that shows Jester King range beyond big sours. At 2.9% the Brett character is subtle but present. Light, refreshing, and still unmistakably wild. Perfect for hot Texas afternoons.', ['farmhouse', 'brett', 'light', 'wild'], 4.0, 3.5, 4.0, 4.0, 4.0, 'draft'],
    ['wild_ale_wendy', 'dogfish-head-seaquench', 2.5, 'This is sour beer for people who do not like sour beer. The salt and lime mask any real fermentation character. Refreshing sure, but as a wild ale enthusiast I want complexity, not a beer-flavored margarita.', ['salty', 'lime', 'simple', 'commercial'], 2.5, 3.0, 2.5, 3.0, 2.5, 'can'],
    ['wild_ale_wendy', 'hill-farmstead-ann', 4.5, 'Hill Farmstead saisons are among the best in America. Ann has a peppery, dry character with hints of stone fruit from the yeast. Not explicitly wild but the farmhouse character speaks to traditional mixed-culture roots.', ['peppery', 'dry', 'stone fruit', 'farmhouse'], 4.5, 4.0, 4.5, 4.5, 4.5, 'draft'],
    ['wild_ale_wendy', 'weihenstephaner-hefeweissbier', 3.5, 'Beautiful traditional hefeweizen but as a wild ale person, I find clean beers a bit limiting. The banana and clove are perfectly executed. I just prefer my yeast to be a bit more... unpredictable.', ['banana', 'clove', 'clean', 'traditional'], 3.5, 4.0, 3.5, 3.5, 3.5, 'draft'],
    ['wild_ale_wendy', 'russian-river-pliny-the-elder', 3.5, 'Excellent clean IPA but not my world. I appreciate the technical achievement but I gravitate toward beers where microbes are driving the flavor rather than hops. Well-made, just not my lane.', ['hoppy', 'clean', 'technical', 'citrus'], 3.5, 4.0, 3.5, 3.5, 3.5, 'draft'],
    ['wild_ale_wendy', 'founders-dirty-bastard', 3.0, 'The peated malt is interesting and adds a dimension most beers lack. But without any wild character this feels one-note to me despite the complexity. I keep wishing for some Brett in the background.', ['smoky', 'malty', 'one-note', 'toffee'], 3.0, 3.5, 3.0, 3.0, 3.0, 'bottle'],

    // ===== SESSION KING (low-ABV advocate) =====
    ['session_king', 'jester-king-le-petit-prince', 5.0, 'At 2.9% this is the most flavorful table beer in America. Proof that ABV and quality are completely unrelated. The subtle farmhouse funk and dry finish pack more character than most 8% bombers. This is the future of craft.', ['farmhouse', 'light', 'flavorful', 'dry', 'future'], 4.5, 4.0, 5.0, 5.0, 5.0, 'draft'],
    ['session_king', 'founders-all-day-ipa', 4.5, 'The name says it all and the beer delivers. At 4.7% you can actually enjoy multiple without compromising your evening. Real hop flavor in a sessionable package. This should be the model for every brewery.', ['sessionable', 'hoppy', 'citrus', 'model'], 4.0, 3.5, 4.5, 4.5, 4.5, 'can'],
    ['session_king', 'dogfish-head-seaquench', 4.5, 'Session sour done right. 4.9% with real flavor complexity. The salt and lime additions are thoughtful, not gimmicky. You can crush these on a hot day and still form complete sentences afterward.', ['sour', 'salty', 'refreshing', 'smart'], 4.0, 3.5, 4.5, 4.5, 4.5, 'can'],
    ['session_king', 'bells-oberon', 4.0, 'Wheat ale at 5.8% is on the edge of session territory but the drinkability earns it a pass. Light body, citrus notes, and enough flavor to be interesting without demanding your full attention. Good lawn mower beer.', ['wheat', 'citrus', 'drinkable', 'summer'], 3.5, 4.0, 4.0, 4.5, 4.0, 'can'],
    ['session_king', 'sierra-nevada-pale-ale', 4.0, 'At 5.6% this is one of the most sessionable pale ales that still has real craft character. The hop bitterness is present without being punishing. You can have two or three and still enjoy dinner. That matters.', ['balanced', 'citrus', 'sessionable', 'piney'], 4.0, 4.0, 4.0, 4.0, 4.0, 'bottle'],
    ['session_king', 'weihenstephaner-hefeweissbier', 4.5, 'At 5.4% this is world-class beer in a sessionable package. The Germans understood centuries ago that great beer does not need to be strong. Character from yeast, not alcohol. Every modern brewer should take notes.', ['banana', 'clove', 'sessionable', 'wisdom'], 4.5, 4.5, 4.5, 4.5, 4.5, 'draft'],
    ['session_king', 'bells-hopslam', 2.0, 'At 10% ABV this is the opposite of everything I stand for. One glass and you are done for the afternoon. All that hop character wasted on a beer you can only have one of. Smaller is better.', ['boozy', 'excessive', 'strong', 'overpowered'], 3.0, 3.5, 2.5, 2.0, 2.0, 'draft'],
    ['session_king', 'russian-river-pliny-the-younger', 2.0, 'People wait hours in line for this 10.25% triple IPA and I genuinely do not understand why. You get one pour and you are buzzing. The craft beer industry glorifies strength and it is the wrong message.', ['strong', 'overhyped', 'excessive'], 3.5, 3.5, 3.0, 2.0, 2.0, 'draft'],
    ['session_king', '3-floyds-dark-lord', 2.0, 'A 15% beer served in a tiny pour at a festival where people pay hundreds of dollars. This is the emperor has no clothes moment for craft beer. More ABV does not equal more quality. Hard pass.', ['extreme', 'excessive', 'absurd'], 3.0, 4.0, 2.5, 2.0, 2.0, 'bottle'],
    ['session_king', 'deschutes-black-butte-porter', 4.0, 'At 5.5% this porter proves dark beer can be sessionable. Smooth chocolate and coffee without the boozy heat of imperial stouts. You can pair this with an entire meal and still walk straight. More of this.', ['chocolate', 'sessionable', 'smooth', 'coffee'], 3.5, 4.0, 4.0, 4.5, 4.0, 'draft'],
    ['session_king', 'hill-farmstead-edward', 5.0, 'Shaun Hill made a 5.2% pale ale that outshines double IPAs twice its strength. This is the masterwork of the session world. Every flavor is intentional, every sip is balanced. Proof that less is infinitely more.', ['floral', 'citrus', 'masterwork', 'balanced'], 5.0, 4.5, 5.0, 5.0, 5.0, 'draft'],
    ['session_king', 'toppling-goliath-pseudosue', 4.0, 'Citra pale ale at 5.8% with legitimate craft quality. Tropical, smooth, and crushable. Not quite session territory but close enough to earn respect. Iowa is doing sessionable right.', ['tropical', 'crushable', 'citra', 'smooth'], 4.0, 3.5, 4.0, 4.0, 4.0, 'can'],

    // ===== EXISTING USER ADDITIONAL REVIEWS =====
    // hophead - already reviewed: pliny-the-elder, julius, heady-topper, two-hearted-ale
    ['hophead', 'tree-house-green', 4.5, 'Another Tree House banger. The honeydew and citrus combo is unlike anything else. Slightly different hop profile than Julius but just as satisfying. These guys can do no wrong with NEIPAs.', ['honeydew', 'citrus', 'creamy', 'tropical'], 4.5, 4.5, 4.5, 5.0, 4.5, 'can'],
    ['hophead', 'other-half-green-city', 4.5, 'Other Half brings that Brooklyn energy to their hazies. Green City is juicy, tropical, and impossibly soft. The mouthfeel is like drinking a cloud of hop juice. One of the best NEIPAs on the East Coast.', ['juicy', 'tropical', 'soft', 'cloudy'], 4.5, 4.0, 4.5, 5.0, 4.5, 'draft'],
    ['hophead', 'other-half-ddh-all-citra-everything', 5.0, 'DDH Citra is EVERYTHING. Pure citrus overload in the best possible way. Grapefruit, tangerine, and tropical notes that go on forever. Other Half knows what hop heads want and they deliver hard.', ['citrus', 'grapefruit', 'tropical', 'intense'], 5.0, 4.0, 5.0, 4.5, 5.0, 'can'],
    ['hophead', 'alchemist-focal-banger', 4.5, 'Focal Banger is the more approachable sibling to Heady Topper. Less dank, more tropical fruit. Mango and papaya dominate with a clean finish. Some days I actually prefer this to Heady.', ['tropical', 'mango', 'papaya', 'clean'], 4.5, 4.0, 4.5, 4.5, 4.5, 'can'],
    ['hophead', 'toppling-goliath-king-sue', 5.0, 'King Sue is a Citra bomb of the highest order. Massive tropical fruit character with a smooth body. Iowa is quietly producing some of the best hop-forward beers in the country. This one is royalty.', ['tropical', 'citra', 'massive', 'smooth'], 5.0, 4.0, 5.0, 4.5, 5.0, 'can'],
    ['hophead', 'trillium-congress-street', 4.5, 'Trillium Congress Street is the year-round hazy I wish every brewery made. Tangerine and pineapple with the perfect amount of haze. Consistent and always fresh. Top-tier NEIPA program.', ['tangerine', 'pineapple', 'hazy', 'consistent'], 4.5, 4.5, 4.5, 4.5, 4.5, 'can'],
    ['hophead', 'maine-beer-dinner', 4.5, 'Maine Beer Dinner is the big brother to Lunch and it does not disappoint. More hop intensity, more complexity, but still that signature MBC balance. Limited release makes it special every time.', ['hoppy', 'complex', 'balanced', 'special'], 4.5, 4.0, 4.5, 4.5, 4.5, 'bottle'],
    ['hophead', 'hill-farmstead-abner', 5.0, 'Abner might be the most refined double IPA I have ever had. Hill Farmstead does something magical with water and hops. Zero rough edges, pure hop expression. If beer is art, this is the Mona Lisa.', ['refined', 'hoppy', 'pure', 'artistic'], 5.0, 4.5, 5.0, 5.0, 5.0, 'draft'],
    ['hophead', 'stone-ipa', 3.0, 'Classic West Coast IPA that feels a bit dated in the hazy era. Still has that piney, resinous character but I have moved on to softer, juicier beers. Respect the history though.', ['piney', 'resinous', 'dated', 'classic'], 3.0, 3.5, 3.0, 3.0, 3.0, 'can'],
    ['hophead', 'sierra-nevada-torpedo', 3.5, 'The hop torpedo device creates interesting resinous character but the overall profile feels like 2010 craft beer. Not bad, just not what I reach for anymore when so many hazies exist.', ['resinous', 'citrus', 'classic', 'piney'], 3.5, 3.5, 3.5, 3.0, 3.5, 'can'],
    ['hophead', 'bells-hopslam', 4.5, 'Hopslam is the annual event beer that actually delivers. Six hop varietals create a complex tropical and citrus profile, and the honey adds a unique dry sweetness. At 10% it is a sipper but what a sip.', ['hoppy', 'honey', 'tropical', 'complex'], 5.0, 4.0, 4.5, 4.0, 4.5, 'draft'],

    // stoutlover - already reviewed: kbs, breakfast-stout, dark-lord, hunahpus, black-butte-porter
    ['stoutlover', 'firestone-walker-parabola', 5.0, 'Parabola is KBS level excellence. The bourbon barrel aging adds incredible depth with vanilla, dark chocolate, and toasted coconut. Thick, warming, and complex. My annual bottle share centerpiece.', ['bourbon', 'vanilla', 'chocolate', 'coconut'], 5.0, 5.0, 5.0, 5.0, 5.0, 'bottle'],
    ['stoutlover', 'surly-darkness', 4.5, 'Darkness Day in Minneapolis is the stout lover equivalent of Christmas. Rich, complex, with layers of dark chocolate, coffee, and dark fruit. The annual variants keep it exciting year after year.', ['chocolate', 'coffee', 'dark fruit', 'complex'], 4.5, 5.0, 4.5, 4.5, 4.5, 'bottle'],
    ['stoutlover', 'founders-dirty-bastard', 3.5, 'Not a stout but the Scotch ale style has similar depth. Smoky, malty, and warming. The peated malt adds a nice dimension. Good but I always wish it had more roasted character.', ['smoky', 'malty', 'warming', 'toffee'], 3.5, 4.0, 3.5, 3.5, 3.5, 'bottle'],
    ['stoutlover', 'weihenstephaner-vitus', 3.0, 'An interesting change of pace from dark beers. The banana and vanilla are pleasant enough but I miss the roasted malt and coffee notes that make my heart sing. Well-made but not my world.', ['banana', 'vanilla', 'wheat', 'different'], 3.0, 3.5, 3.0, 3.5, 3.0, 'bottle'],
    ['stoutlover', 'russian-river-pliny-the-elder', 3.5, 'A technically perfect beer that I can appreciate even though hoppy beers are not my thing. The balance is remarkable. If I drank IPAs, this would be the one. But I drink stouts.', ['hoppy', 'balanced', 'impressive', 'not-my-style'], 3.5, 4.0, 3.5, 3.5, 3.5, 'draft'],
    ['stoutlover', 'stone-arrogant-bastard', 3.5, 'Aggressive and malty with enough dark character to pique my interest. Not a stout but the bold attitude resonates with me. The caramel and bitterness combo is interesting. A guilty pleasure.', ['bold', 'aggressive', 'caramel', 'bitter'], 3.5, 4.0, 3.5, 3.5, 3.5, 'bottle'],
    ['stoutlover', 'dogfish-head-90-minute-ipa', 3.0, 'Tried this because of the high ABV hoping for some malt complexity. The hops overpower everything else. I can taste caramel underneath if I try hard enough. Too hoppy for my stout-loving palate.', ['hoppy', 'malty', 'caramel', 'strong'], 3.0, 3.5, 3.0, 3.0, 3.0, 'bottle'],

    // sourpusher - already reviewed: gueuze, rose-de-gambrinus, supplication, atrial-rubicite, seaquench
    ['sourpusher', 'cantillon-kriek', 5.0, 'Cantillon completes the trifecta with their kriek. The sour cherry character is dry, not sweet, with almond-like overtones. Bone dry with electric acidity. The best kriek in the world, period.', ['cherry', 'almond', 'dry', 'acidic', 'supreme'], 5.0, 5.0, 5.0, 4.5, 5.0, 'bottle'],
    ['sourpusher', 'jester-king-le-petit-prince', 4.0, 'A gentle introduction to farmhouse funk. Low ABV but the subtle wild character shows Jester King DNA. Refreshing and complex for a table beer. Great gateway sour for newbies.', ['farmhouse', 'funky', 'gentle', 'refreshing'], 4.0, 3.5, 4.0, 4.0, 4.0, 'draft'],
    ['sourpusher', 'hill-farmstead-ann', 4.5, 'Hill Farmstead saison with beautiful dry farmhouse character. Not aggressively sour but the peppery yeast and bone-dry finish appeal to my sour-loving palate. Elegant and restrained.', ['peppery', 'dry', 'farmhouse', 'elegant'], 4.5, 4.5, 4.5, 4.5, 4.5, 'draft'],
    ['sourpusher', 'weihenstephaner-hefeweissbier', 3.0, 'Technically flawless hefeweizen but way too clean for my wild-fermentation-loving palate. The banana and clove are nice but I keep wishing for some Brett funk and tartness. Not my scene.', ['banana', 'clove', 'clean', 'too-clean'], 3.0, 4.0, 3.0, 3.0, 3.0, 'draft'],
    ['sourpusher', 'founders-breakfast-stout', 2.5, 'I know this is beloved but clean stouts just do not do it for me. The coffee and chocolate are fine. I keep imagining what this would taste like with Lactobacillus and barrel aging. A sour stout would be legendary.', ['coffee', 'chocolate', 'clean', 'lacking'], 2.5, 3.5, 2.5, 3.0, 2.5, 'bottle'],
    ['sourpusher', 'russian-river-pliny-the-elder', 3.0, 'Russian River makes incredible sours but Pliny represents their hop-focused side. It is very well made but I would trade this for another bottle of Supplication every single time.', ['hoppy', 'clean', 'well-made', 'not-sour'], 3.0, 4.0, 3.0, 3.0, 3.0, 'draft'],

    // demo - already reviewed: pale-ale (sierra nevada), hefeweissbier, all-day-ipa
    ['demo', 'bells-two-hearted-ale', 4.5, 'Finally tried the beer everyone raves about and I get it now. The grapefruit and floral hop character is incredibly well-balanced. This is what craft beer is all about - simple ingredients, perfect execution.', ['grapefruit', 'floral', 'balanced', 'perfect'], 4.5, 4.5, 4.5, 4.0, 4.5, 'can'],
    ['demo', 'founders-breakfast-stout', 4.0, 'My first imperial stout and what an introduction. Coffee, chocolate, and oatmeal come together like the best breakfast ever. Rich but not overwhelming. Now I understand the stout obsession.', ['coffee', 'chocolate', 'oatmeal', 'rich'], 4.0, 4.5, 4.0, 4.5, 4.0, 'bottle'],
    ['demo', 'dogfish-head-60-minute-ipa', 4.0, 'A great everyday IPA that I keep coming back to. Balanced hops and malt with citrus notes. Not as flashy as the trendy hazies but reliable and satisfying every single time.', ['balanced', 'citrus', 'reliable', 'hoppy'], 4.0, 3.5, 4.0, 4.0, 4.0, 'bottle'],
    ['demo', 'tree-house-julius', 4.5, 'Made the drive to Tree House and it was worth it. Julius is like drinking tropical juice with a beer backbone. The texture is incredible - so soft and creamy. I finally understand the hype around NEIPAs.', ['tropical', 'creamy', 'soft', 'hyped'], 4.5, 4.0, 4.5, 5.0, 4.5, 'can'],
    ['demo', 'deschutes-fresh-squeezed', 4.0, 'Fresh Squeezed lives up to its name. Bright grapefruit and citrus flavors that make every sip refreshing. Easy to find at most stores which is a huge plus. Great weeknight beer.', ['grapefruit', 'citrus', 'refreshing', 'available'], 4.0, 3.5, 4.0, 4.0, 4.0, 'can'],
    ['demo', 'stone-delicious-ipa', 3.5, 'Stone Delicious is more approachable than their other IPAs. Tropical and lemony with moderate bitterness. Good but not great - there are better options in this price range. Decent variety pack beer.', ['tropical', 'lemon', 'moderate', 'decent'], 3.5, 3.5, 3.5, 3.0, 3.5, 'can'],
    ['demo', 'cantillon-gueuze', 4.0, 'My first lambic was an eye-opening experience. Tart, funky, and completely different from anything I have had before. Not sure I fully appreciate it yet but I can tell this is something special. Will revisit.', ['tart', 'funky', 'unique', 'special'], 4.0, 4.0, 4.0, 3.5, 4.0, 'bottle'],
    ['demo', 'cigar-city-jai-alai', 3.5, 'Solid IPA from Florida. Citrus and tropical hop character with decent bitterness. Nothing revolutionary but a good representation of the style. Found it at my local grocery store which is convenient.', ['citrus', 'tropical', 'solid', 'convenient'], 3.5, 3.5, 3.5, 3.5, 3.5, 'can'],

    // craftcurious - already reviewed: oberon, hazy-little-thing, 60-minute-ipa
    ['craftcurious', 'dogfish-head-seaquench', 4.0, 'A sour beer that is not scary at all! The salt and lime make it super approachable. Like a more interesting version of a Corona with lime. I am adding sour beers to my exploration list.', ['sour', 'salty', 'lime', 'approachable'], 3.5, 3.5, 4.0, 4.0, 4.0, 'can'],
    ['craftcurious', 'weihenstephaner-hefeweissbier', 4.5, 'Tried this at a German restaurant and fell in love. The banana and clove flavors are amazing - I did not know beer could taste like this! From the oldest brewery in the world too. So cool!', ['banana', 'clove', 'amazing', 'historic'], 4.5, 4.5, 4.5, 4.5, 4.5, 'draft'],
    ['craftcurious', 'founders-all-day-ipa', 3.5, 'A good IPA for someone like me who is still getting used to hops. Not too bitter and very drinkable. My more experienced friends say to try bolder stuff but I like starting here.', ['mild', 'approachable', 'hoppy', 'starter'], 3.0, 3.0, 3.5, 3.5, 3.5, 'can'],
    ['craftcurious', 'sierra-nevada-pale-ale', 4.0, 'The classic craft beer that everyone recommends to beginners and I see why. Nice balance of hops and malt with a clean finish. I can taste the citrus notes people always mention now.', ['balanced', 'citrus', 'classic', 'educational'], 4.0, 4.0, 4.0, 3.5, 4.0, 'bottle'],
    ['craftcurious', 'deschutes-fresh-squeezed', 4.0, 'This is the IPA that made me realize I actually like IPAs! The grapefruit and citrus flavors are so bright and refreshing. Not scary bitter at all. Adding Deschutes to my list of breweries to explore.', ['grapefruit', 'citrus', 'bright', 'revelation'], 4.0, 3.5, 4.0, 4.0, 4.0, 'can'],
    ['craftcurious', 'deschutes-black-butte-porter', 3.5, 'My first dark beer and way less scary than expected! Smooth chocolatey flavors without harsh bitterness. I always assumed dark beers were gross but this opened my mind. Baby steps into the dark side.', ['chocolate', 'smooth', 'surprising', 'gateway'], 3.5, 3.5, 3.5, 4.0, 3.5, 'draft'],
    ['craftcurious', 'bells-two-hearted-ale', 4.0, 'Everyone on BrewIQ recommends this and they are right. Grapefruit and floral notes with a perfect balance. I am starting to understand what people mean by malt backbone. My beer vocabulary is growing!', ['grapefruit', 'floral', 'balanced', 'educational'], 4.0, 4.0, 4.0, 3.5, 4.0, 'can'],

    // ===== ADDITIONAL REVIEWS TO REACH 250+ =====
    // More sourpusher reviews
    ['sourpusher', 'weihenstephaner-vitus', 2.5, 'Strong wheat beer that is way too clean and sweet for my taste. Where is the funk? Where is the tartness? Without some wild character this just tastes like banana candy. Not my thing at all.', ['banana', 'sweet', 'clean', 'boring'], 2.5, 3.5, 2.5, 3.0, 2.5, 'bottle'],
    ['sourpusher', 'founders-dirty-bastard', 2.0, 'Smoky malty Scotch ale with zero sour character. The peated malt is interesting but I need acid and funk in my life. Everything tastes flat without tartness. Sorry, Founders.', ['smoky', 'malty', 'flat', 'no-sour'], 2.5, 3.0, 2.0, 2.5, 2.0, 'bottle'],
    ['sourpusher', 'stone-ipa', 2.0, 'Bitter hop juice with no complexity. I have tasted spontaneously fermented beers with more layers in a single sip than this has in the whole glass. Hop bitterness is not a substitute for real depth.', ['bitter', 'one-note', 'hoppy', 'shallow'], 2.5, 3.0, 2.0, 2.0, 2.0, 'can'],
    ['sourpusher', 'bells-hopslam', 2.5, 'A 10% hop bomb with honey. The sweetness clashes with the bitterness in a way that feels confused. Give me a funky farmhouse ale over this any day. Not everything needs to be bigger and hoppier.', ['sweet', 'bitter', 'confused', 'excessive'], 3.0, 3.5, 2.5, 2.5, 2.5, 'draft'],

    // More stoutlover reviews
    ['stoutlover', 'bells-hopslam', 3.0, 'Not a stout but the honey and high ABV give it body that I can appreciate. The hops are too aggressive for my taste but I respect the craft. Pairing the honey sweetness with hops is clever.', ['hoppy', 'honey', 'strong', 'body'], 3.0, 3.5, 3.0, 3.5, 3.0, 'draft'],
    ['stoutlover', 'tree-house-julius', 3.0, 'Hazy IPA is not my style but the creamy mouthfeel reminds me of a good oatmeal stout. The tropical fruit flavors are pleasant enough. I can see why people love it even if dark beer is my first love.', ['creamy', 'tropical', 'smooth', 'different'], 3.0, 3.5, 3.0, 4.0, 3.0, 'can'],
    ['stoutlover', 'cantillon-gueuze', 3.5, 'Sour and funky is not really my wheelhouse but I can appreciate the complexity here. It shares something with aged stouts - that deep, layered character that only time can create. Interesting experience.', ['tart', 'funky', 'complex', 'layered'], 3.5, 3.5, 3.5, 3.0, 3.5, 'bottle'],

    // More demo reviews
    ['demo', 'revolution-anti-hero', 3.5, 'Solid Chicago IPA that does the job. Citrus and pine hop character with decent balance. Not the most exciting beer I have had but reliable and available. A good Tuesday night beer.', ['citrus', 'piney', 'reliable', 'solid'], 3.5, 3.5, 3.5, 3.5, 3.5, 'can'],
    ['demo', 'surly-furious', 3.5, 'Aggressive IPA from Minnesota with serious hop intensity. The pine and citrus are bold. A little too much for a casual evening but I can appreciate the passion behind it. Would try other Surly beers.', ['hoppy', 'piney', 'bold', 'intense'], 3.5, 4.0, 3.5, 3.0, 3.5, 'can'],
    ['demo', 'toppling-goliath-pseudosue', 4.0, 'Smooth and tropical pale ale that punches above its weight. Citra hops create lovely tropical notes. Easy drinking and flavorful. Iowa beer is seriously underrated.', ['tropical', 'smooth', 'citra', 'underrated'], 4.0, 3.5, 4.0, 4.0, 4.0, 'can'],
    ['demo', 'alchemist-focal-banger', 4.0, 'Great Vermont IPA with tropical fruit character. More approachable than Heady Topper and easier to find. Mango and papaya with a clean finish. Would definitely buy again.', ['tropical', 'mango', 'clean', 'approachable'], 4.0, 3.5, 4.0, 4.0, 4.0, 'can'],

    // More craftcurious reviews
    ['craftcurious', 'stone-delicious-ipa', 3.5, 'Tried this on a friend recommendation. The tropical and lemon flavors are nice. A bit more bitter than I prefer but I can tell my palate is adjusting. Each new beer teaches me something.', ['tropical', 'lemon', 'bitter', 'learning'], 3.5, 3.5, 3.5, 3.0, 3.5, 'can'],
    ['craftcurious', 'revolution-anti-hero', 3.5, 'A Chicago IPA that is a nice middle ground. Not too bitter, not too sweet. Citrus and pine flavors I can actually identify now. Three months ago I could not have described any of this. Progress!', ['citrus', 'piney', 'progress', 'balanced'], 3.5, 3.5, 3.5, 3.5, 3.5, 'can'],
    ['craftcurious', 'surly-furious', 3.0, 'This one was pretty intense for me. Lots of bitterness and hop flavor. I can tell it is well-made but it might be above my current experience level. Will try again in a few months.', ['bitter', 'intense', 'hoppy', 'challenging'], 3.0, 3.5, 3.0, 2.5, 3.0, 'can'],

    // More suds_n_buds reviews
    ['suds_n_buds', 'bells-two-hearted-ale', 4.0, 'This keeps showing up on every best-of list and now I know why. Grapefruit and flowers with a smooth body. I can actually taste the complexity people talk about. My palate is leveling up!', ['grapefruit', 'floral', 'smooth', 'leveling-up'], 4.0, 4.0, 4.0, 4.0, 4.0, 'can'],
    ['suds_n_buds', 'cigar-city-jai-alai', 3.5, 'Bold IPA from Florida! The citrus is really prominent and there is a tropical thing going on. A bit bitter for my newbie palate but I liked it more with each sip. Is that how it works?', ['citrus', 'bold', 'tropical', 'growing'], 3.5, 4.0, 3.5, 3.0, 3.5, 'can'],
    ['suds_n_buds', 'toppling-goliath-pseudosue', 4.0, 'Someone at a party handed me this and I was blown away. So smooth and tropical! Did not even feel like a beer. Had to Google the brewery because I had never heard of it. Iowa, who knew??', ['tropical', 'smooth', 'surprising', 'discovery'], 4.0, 3.5, 4.0, 4.0, 4.0, 'can'],
    ['suds_n_buds', 'founders-breakfast-stout', 3.0, 'My first stout ever. It tastes like chocolate coffee which is actually pretty cool. Super thick and rich. One was plenty for the night. I understand why dark beer people love this stuff now.', ['chocolate', 'coffee', 'thick', 'rich'], 3.0, 3.5, 3.0, 3.0, 3.0, 'bottle'],
    ['suds_n_buds', 'tree-house-julius', 4.5, 'I NEED to talk about this beer. A friend brought it from Massachusetts and it completely changed my understanding of what beer can be. Like drinking tropical fruit through a cloud. Life-changing.', ['tropical', 'mind-blown', 'life-changing', 'creamy'], 4.5, 4.0, 4.5, 5.0, 4.5, 'can'],
  ];


  // Insert all reviews
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const [username, beerSlug, rating, content, flavorTags, aroma, appearance, taste, mouthfeel, overall, servingType] of reviewData) {
    const userId = userMap[username];
    const beerId = beerMap[beerSlug];

    if (!userId) {
      console.log(`  SKIP: User not found: ${username}`);
      skipped++;
      continue;
    }
    if (!beerId) {
      console.log(`  SKIP: Beer not found: ${beerSlug}`);
      skipped++;
      continue;
    }

    try {
      await prisma.review.upsert({
        where: {
          userId_beerId: { userId, beerId },
        },
        create: {
          userId,
          beerId,
          rating,
          content,
          flavorTags,
          aroma,
          appearance,
          taste,
          mouthfeel,
          overall,
          servingType,
          isVerified: true,
        },
        update: {},
      });
      created++;
    } catch (err: any) {
      console.log(`  ERROR: ${username} -> ${beerSlug}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nReview population complete!`);
  console.log(`  Created/verified: ${created}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Total review data entries: ${reviewData.length}`);

  // Print summary of reviews per user
  const reviewCounts: Record<string, number> = {};
  for (const [username] of reviewData) {
    reviewCounts[username] = (reviewCounts[username] || 0) + 1;
  }
  console.log('\nReviews per user:');
  for (const [username, count] of Object.entries(reviewCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${username}: ${count}`);
  }
}

main()
  .catch((e) => {
    console.error('Population failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
