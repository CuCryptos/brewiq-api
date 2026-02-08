import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating BrewIQ HQ user and premium editorial reviews...\n');

  // ============================================================
  // PHASE 1: Create BrewIQ HQ user
  // ============================================================

  const passwordHash = await bcrypt.hash('BrewIQ2026!', 12);

  const hqUser = await prisma.user.upsert({
    where: { username: 'brewiq_hq' },
    create: {
      email: 'hello@brewiq.ai',
      username: 'brewiq_hq',
      displayName: 'BrewIQ HQ',
      bio: 'The official voice of BrewIQ. We taste, we score, we tell you what matters. No hype, no shortcuts — just honest beer intelligence from the team that built the platform.',
      passwordHash,
      isVerified: true,
      membershipTier: 'UNLIMITED',
      points: 10000,
      level: 25,
    },
    update: {
      displayName: 'BrewIQ HQ',
      bio: 'The official voice of BrewIQ. We taste, we score, we tell you what matters. No hype, no shortcuts — just honest beer intelligence from the team that built the platform.',
      membershipTier: 'UNLIMITED',
      points: 10000,
      level: 25,
    },
  });

  console.log(`BrewIQ HQ user: ${hqUser.id} (${hqUser.username})\n`);

  // ============================================================
  // PHASE 2: Premium Editorial Reviews
  // ============================================================

  const reviews = [
    // 1. Pliny the Elder — Russian River
    {
      beerSlug: 'russian-river-pliny-the-elder',
      rating: 5.0,
      content: `There's a reason Pliny the Elder became the benchmark for American Double IPAs — and tasting it fresh reminds you exactly why. This beer didn't just set the standard, it drew the blueprint that an entire generation of brewers has been chasing ever since.

The aroma hits you before the glass reaches your lips. Bright grapefruit zest and sticky pine resin fill the nose, layered over a faint floral sweetness that keeps pulling you back in. It smells like a Northern California forest after a rainstorm — green, alive, and electric.

On the palate, Pliny delivers an almost impossible balancing act. At 8% ABV, it drinks like a beer half its strength. The hop bitterness is assertive but never abrasive — waves of citrus, pine, and white pepper roll across the tongue, held in perfect tension by a lean, crackery malt backbone that knows its job is to stay out of the way. The mouthfeel is medium-bodied with fine carbonation that scrubs the palate clean between sips.

The finish is dry, resinous, and lingers just long enough to make you reach for the glass again. There's a ghost of grapefruit pith on the back end that slowly fades into clean bitterness. No cloying sweetness, no boozy heat — just pure, focused hop expression from start to finish.

Pliny the Elder isn't just a great DIPA — it's a masterclass in restraint. In an era where bigger and hazier dominates the conversation, Pliny quietly reminds you that clarity of vision and balance will always outrun brute force. If you can get it fresh, don't hesitate.`,
      flavorTags: ['Citrus', 'Pine', 'Resinous', 'Bitter', 'Dry', 'Complex'],
      aroma: 5.0,
      appearance: 4.5,
      taste: 5.0,
      mouthfeel: 5.0,
      overall: 5.0,
      servingType: 'draft',
    },

    // 2. Heady Topper — The Alchemist
    {
      beerSlug: 'alchemist-heady-topper',
      rating: 5.0,
      content: `Heady Topper was doing hazy before hazy was a thing — and over a decade later, it still sits comfortably in the conversation for the best DIPA ever brewed. John Kimmich's masterpiece from tiny Stowe, Vermont launched a thousand imitators, but the original remains stubbornly, defiantly great.

Pour it into a glass (yes, despite what the can says) and you get a gorgeous, golden-orange pour with a slight haze that catches the light. The aroma is an absolute carnival — ripe pineapple, fresh-squeezed tangerine, dank cannabis, and a floral sweetness that drifts up like perfume. It's one of the most complex hop noses in all of craft beer.

The first sip is a revelation even if you've had it before. Tropical fruit — papaya, mango, overripe peach — crashes into your palate with a soft, almost creamy mouthfeel that makes 8% ABV feel like a gentle suggestion rather than a warning. Midway through, earthy pine and a touch of peppery spice emerge to keep things grounded. The bitterness is firm but wrapped in so much fruit that it reads more as texture than aggression.

Finish is medium-long, with lingering tropical fruit and a gentle herbal dryness that clears the palate beautifully. The carbonation is softer than most DIPAs, giving it an almost pillow-like quality on the tongue that makes it dangerously easy to drink.

Heady Topper earns its legend status not through hype but through relentless consistency and genuine innovation. It proved that an IPA could be intensely hoppy and intensely drinkable at the same time. Every hazy IPA you've ever loved owes this beer a debt.`,
      flavorTags: ['Tropical', 'Dank', 'Juicy', 'Pine', 'Smooth', 'Complex'],
      aroma: 5.0,
      appearance: 4.5,
      taste: 5.0,
      mouthfeel: 5.0,
      overall: 5.0,
      servingType: 'can',
    },

    // 3. Two Hearted Ale — Bell's
    {
      beerSlug: 'bells-two-hearted-ale',
      rating: 4.5,
      content: `Two Hearted Ale is the beer you recommend to everyone because it genuinely works for everyone. Voted the best beer in America multiple times by the American Homebrewers Association, Bell's flagship IPA is the rare craft beer that achieves greatness through simplicity rather than complexity.

The pour is a clear, deep amber-gold with a fluffy white head that lasts. The aroma is all Centennial hops — bright grapefruit, pine needles, and a touch of floral honey that gives it warmth. It's an inviting nose that never tries too hard, and that's precisely the point.

Single-hop beers live or die on that hop's character, and Centennial delivers everything you could ask for in Two Hearted. The flavor opens with juicy grapefruit and moves through pine and a subtle herbal bitterness, all supported by a sturdy but never heavy caramel malt base. The balance here is extraordinary — each element gets exactly the space it needs without crowding the others. At 7% ABV, it has enough body to feel substantial without ever feeling like a chore.

The finish is clean and moderately bitter, with citrus lingering on the palate and a slight resinous grip that fades gracefully. Carbonation is lively without being aggressive, making this an IPA you can session through an entire evening without fatigue.

Two Hearted Ale is proof that you don't need twelve hop varieties, lactose, and a pastry chef to make a world-class beer. It's a single-hop, single-malt expression of what American IPA was always meant to be — honest, balanced, and endlessly drinkable. The kind of beer that makes you fall in love with craft beer all over again.`,
      flavorTags: ['Citrus', 'Pine', 'Floral', 'Bitter', 'Crisp', 'Sessionable'],
      aroma: 4.5,
      appearance: 4.5,
      taste: 5.0,
      mouthfeel: 4.5,
      overall: 4.5,
      servingType: 'can',
    },

    // 4. KBS (Kentucky Breakfast Stout) — Founders
    {
      beerSlug: 'founders-kbs',
      rating: 5.0,
      content: `KBS is the beer that turned barrel-aged stouts from a niche curiosity into an annual pilgrimage. Every spring, beer enthusiasts across the country line up for Founders' bourbon barrel-aged imperial stout brewed with coffee and chocolate — and the ritual exists because this beer delivers, year after year.

It pours jet black with a thin, mocha-colored head that releases intoxicating aromas of freshly roasted coffee, dark chocolate ganache, and vanilla-soaked bourbon. There's an undercurrent of charred oak and dried cherry that adds sophistication to what could easily be an overwhelming sensory experience. The nose alone is worth the price of admission.

The first sip of KBS is like sinking into a leather armchair next to a fireplace. Rich, velvety chocolate and espresso dominate the front, followed immediately by a wave of bourbon warmth — vanilla, caramel, toasted coconut, and a whisper of oak tannin. At 12% ABV, there's undeniable boozy heat, but it's integrated so smoothly that it reads as warmth rather than burn. The mouthfeel is full and silky, almost viscous, with a luxurious weight that coats every corner of your palate.

The finish is long and layered — coffee bitterness and dark chocolate linger for what feels like minutes, slowly giving way to bourbon sweetness and a final ghost of roasted malt. It's a beer that rewards patience; let it warm a few degrees and entirely new dimensions of toffee and dried fruit emerge.

KBS proves that a beer can be decadent and serious at the same time. It's not just a dessert beer — it's a meditation on what happens when world-class brewing meets world-class barrel selection. Share it with someone who thinks they don't like dark beer. Watch their face change.`,
      flavorTags: ['Coffee', 'Chocolate', 'Barrel-Aged', 'Vanilla', 'Boozy', 'Complex'],
      aroma: 5.0,
      appearance: 4.5,
      taste: 5.0,
      mouthfeel: 5.0,
      overall: 5.0,
      servingType: 'bottle',
    },

    // 5. Julius — Tree House
    {
      beerSlug: 'tree-house-julius',
      rating: 5.0,
      content: `Julius didn't just put Tree House Brewing on the map — it redefined what an American IPA could taste like. Before the term "New England IPA" became industry shorthand, Julius was already showing the world that an IPA could be a fruit-forward, pillowy experience rather than a bitter, resinous assault.

The pour is stunning — deep golden-orange with a permanent, opaque haze and a creamy white head. It looks like fresh-squeezed orange juice, which turns out to be a reliable preview of what's coming. The aroma bursts with ripe mango, tangerine, and peach, accented by a subtle floral note and the faintest hint of vanilla. It smells like a tropical smoothie that happens to contain 6.8% alcohol.

On the palate, Julius is pure liquid sunshine. An avalanche of tropical fruit — mango, passion fruit, fresh-squeezed orange — coats the tongue with an almost creamy sweetness that never crosses into cloying territory. The bitterness is remarkably restrained, present only as a gentle counterpoint that keeps the fruit from running away with the show. The mouthfeel is soft, full, and impossibly smooth — pillowy is the word everyone uses because no other word quite fits.

The finish is short and clean, which is part of the genius. There's no lingering bitterness, no astringent grip — just a fade of tropical fruit and a dry, gentle close that resets your palate perfectly for the next sip. This is what makes Julius so dangerously drinkable at nearly 7% ABV.

Julius is the beer that launched a movement, and it still stands as one of the purest expressions of the style it helped create. It's not about hype or scarcity — it's about a brewer who understood that the future of IPA was softness, fruit, and joy. This beer makes people smile, and that's the highest compliment we can give.`,
      flavorTags: ['Tropical', 'Juicy', 'Smooth', 'Citrus', 'Crushable', 'Complex'],
      aroma: 5.0,
      appearance: 5.0,
      taste: 5.0,
      mouthfeel: 5.0,
      overall: 5.0,
      servingType: 'can',
    },

    // 6. Zombie Dust — 3 Floyds
    {
      beerSlug: '3-floyds-zombie-dust',
      rating: 4.5,
      content: `Zombie Dust is the pale ale that made hop heads rethink what a "session" beer could be. 3 Floyds' single-hop Citra showcase has been the most sought-after pale ale in the Midwest for over a decade, and wider distribution hasn't dimmed its brilliance one bit.

It pours a beautiful pale gold with excellent clarity and a persistent white head. The aroma is pure Citra in its most expressive form — waves of grapefruit, mango, and lychee with a subtle floral sweetness underneath. It's bright and inviting without being aggressive, which sets the tone for everything that follows.

The flavor profile is a masterclass in hop-forward simplicity. Citra hops deliver punchy tropical fruit and citrus on the front, while a restrained but present malt backbone provides just enough biscuity sweetness to keep things grounded. At 6.2% ABV, Zombie Dust lives in that perfect sweet spot — flavorful enough to hold your attention, light enough to keep reaching for more. The bitterness is moderate and clean, never sharp or lingering.

The finish is crisp and dry with a final burst of citrus that fades cleanly. Carbonation is dialed in perfectly — lively enough to scrub the palate but never aggressive. The mouthfeel is light-medium, giving the hops a stage without adding weight.

Zombie Dust is the kind of beer that makes you realize complexity isn't always about layering more ingredients — sometimes it's about one hop, one vision, executed flawlessly. It's the pale ale that belongs in every refrigerator in America, and the fact that it consistently delivers at this level is a testament to the team at 3 Floyds.`,
      flavorTags: ['Tropical', 'Citrus', 'Crisp', 'Floral', 'Crushable', 'Bitter'],
      aroma: 5.0,
      appearance: 4.5,
      taste: 4.5,
      mouthfeel: 4.5,
      overall: 4.5,
      servingType: 'can',
    },

    // 7. Prairie BOMB! — Prairie Artisan Ales
    {
      beerSlug: 'prairie-bomb',
      rating: 4.5,
      content: `Prairie BOMB! is what happens when a brewer decides that an imperial stout should be a full sensory experience, not just a beer. Brewed with espresso beans, chocolate, vanilla beans, and ancho chili peppers, BOMB! manages to be one of the most complex stouts on the market while remaining remarkably cohesive.

It pours an impenetrable black with a thin tan head that carries aromas of dark roast coffee, Mexican hot chocolate, and a warmth that hints at the chili hiding inside. The nose is rich without being heavy — there's an elegance to how the vanilla rounds out the roasted edges.

The first sip is a journey. Rich dark chocolate and bold espresso lead the charge, immediately followed by a wave of warm vanilla that softens everything beautifully. Then, about three seconds in, the ancho chili arrives — not as heat, but as a slow, building warmth that radiates from the back of your throat and transforms the entire experience. It's the kind of heat that enhances rather than overwhelms, turning each sip into a conversation between sweet, bitter, and warm.

At 13% ABV, BOMB! has undeniable weight, but the combination of coffee bitterness, chili warmth, and vanilla sweetness creates so much internal tension that the alcohol integrates almost seamlessly. The mouthfeel is full and slightly oily, coating the palate like melted dark chocolate.

The finish is long, warm, and endlessly interesting — coffee and chili trade places for a solid minute after each sip, revealing new dimensions as the beer warms. BOMB! is the rare adjunct stout that uses its ingredients to tell a story rather than just pile on flavors. It's not a dessert — it's an experience.`,
      flavorTags: ['Coffee', 'Chocolate', 'Vanilla', 'Spiced', 'Boozy', 'Complex'],
      aroma: 4.5,
      appearance: 4.5,
      taste: 5.0,
      mouthfeel: 4.5,
      overall: 4.5,
      servingType: 'bottle',
    },

    // 8. Oberon Ale — Bell's
    {
      beerSlug: 'bells-oberon',
      rating: 4.0,
      content: `Oberon is summer in a glass — and in Michigan, its March release is treated like the unofficial first day of the season. Bell's American wheat ale has become such a cultural institution in the Midwest that "Oberon Day" is a genuine calendar event, complete with release parties and social media countdowns.

The pour is a hazy, golden straw with a fluffy white head. The aroma is gentle and inviting — fresh orange peel, light wheat, and a subtle spiciness from the yeast that gives it a slightly European character. It smells like sunshine and warm afternoons, which is exactly the mood it's going for.

On the palate, Oberon is all about easy-drinking charm. Soft wheat malt provides a smooth, slightly creamy base, while orange citrus and a hint of coriander-like spice add enough interest to keep things engaging. At 5.8% ABV, it's perfectly positioned for long sessions — substantial enough to taste like a real beer, light enough that you can have three without thinking twice. The sweetness is restrained, leaning more toward grain than sugar.

The finish is clean and refreshing with a light, peppery bite from the yeast and a lingering citrus note. Carbonation is bright and effervescent, making it incredibly refreshing on a hot day.

Oberon isn't trying to blow your mind — it's trying to make your Saturday afternoon perfect, and it succeeds every single time. It's the beer you bring to the beach, the cookout, the porch. It's not a beer you analyze; it's a beer you enjoy. And in a world of ever-escalating ABVs and adjunct lists, there's something deeply satisfying about a beer that just wants to be your friend.`,
      flavorTags: ['Citrus', 'Bread', 'Crisp', 'Sessionable', 'Smooth'],
      aroma: 4.0,
      appearance: 4.0,
      taste: 4.0,
      mouthfeel: 4.0,
      overall: 4.0,
      servingType: 'draft',
    },

    // 9. Sierra Nevada Pale Ale
    {
      beerSlug: 'sierra-nevada-pale-ale',
      rating: 4.5,
      content: `If there's one beer that deserves a monument in the craft beer hall of fame, it's Sierra Nevada Pale Ale. First brewed in 1980, this is the beer that showed America that pale ale could be bold, hoppy, and uncompromising — and four decades later, it hasn't changed because it didn't need to.

The pour is a gorgeous deep gold with copper highlights and a thick, persistent white head that leaves beautiful lacing down the glass. The aroma is the smell of American craft beer itself — Cascade hops delivering bright grapefruit, pine, and floral notes over a clean, biscuity malt base. It's immediately recognizable, like hearing the opening notes of a song you've known your whole life.

The flavor is deceptively simple and absolutely perfect. Cascade hops deliver their signature grapefruit and pine character, supported by a caramel malt sweetness that gives the beer a warmth and depth that separates it from more modern, stripped-down pale ales. The bitterness is firm and defined — this is a beer that isn't afraid to be bitter, and that honesty is part of its enduring appeal. At 5.6% ABV, it's sessionable but never thin.

The finish is clean, moderately bitter, and dry, with a final flourish of citrus and pine that hangs pleasantly on the palate. The carbonation is crisp and the body is medium — it has substance without weight, which is harder to achieve than most brewers will admit.

Sierra Nevada Pale Ale is the Godfather of American craft beer, and it still tastes as vital today as it did when Ken Grossman first brewed it in a homebrewing shop in Chico, California. It's not the flashiest beer on the shelf, but it might be the most important one. Every pale ale, every IPA, every craft brewery that came after owes something to this glass of beer.`,
      flavorTags: ['Citrus', 'Pine', 'Caramel', 'Bitter', 'Crisp', 'Biscuit'],
      aroma: 4.5,
      appearance: 4.5,
      taste: 4.5,
      mouthfeel: 4.5,
      overall: 4.5,
      servingType: 'draft',
    },

    // 10. Founders Breakfast Stout
    {
      beerSlug: 'founders-breakfast-stout',
      rating: 4.5,
      content: `Founders Breakfast Stout is the gateway drug of the dark beer world. Brewed with flaked oats, chocolate, and two types of coffee, it's the beer responsible for converting more pale-ale-only drinkers to the dark side than any other stout on the market. And unlike its big brother KBS, Breakfast Stout is available year-round and priced to drink often.

The pour is pitch black with a thick, creamy, dark mocha head that smells like a high-end coffee shop. Rich espresso, bittersweet chocolate, and a faint sweetness like brown sugar fill the nose. It's an aroma that makes you want to curl up on a couch with a good book — or, you know, just drink the beer.

The flavor is a symphony of roasted malt, coffee, and chocolate that somehow manages to be rich without being heavy. The coffee component is front and center — bold, bitter, and unmistakably fresh-roasted — while dark chocolate weaves in and out, adding depth and sweetness. The oats give it a silky, full mouthfeel that rounds every edge. At 8.3% ABV, it has enough warmth to remind you it's an imperial stout, but the bitterness from the coffee and roasted malt keeps the sweetness in check beautifully.

The finish is dry and coffee-forward, with lingering dark chocolate and a subtle roasted bitterness that cleanses the palate. There's a sophistication here that belies the beer's accessibility — it works equally well as a morning pour (we don't judge) and as a nightcap.

Breakfast Stout is the rare beer that's both an excellent introduction to a style and a beer that seasoned stout drinkers never outgrow. It's affordable, widely available, and consistently excellent — three qualities that shouldn't be remarkable but somehow are in craft beer. This is the beer you keep a six-pack of in the fridge at all times. No occasion needed.`,
      flavorTags: ['Coffee', 'Chocolate', 'Roast', 'Smooth', 'Bitter', 'Complex'],
      aroma: 5.0,
      appearance: 4.5,
      taste: 4.5,
      mouthfeel: 4.5,
      overall: 4.5,
      servingType: 'bottle',
    },

    // 11. Parabola — Firestone Walker
    {
      beerSlug: 'firestone-walker-parabola',
      rating: 5.0,
      content: `Parabola is the quiet giant of barrel-aged stouts — less hyped than some of its peers, but in many ways more refined. Firestone Walker's bourbon barrel-aged Russian imperial stout is released once a year, and every vintage reminds you why patience and barrel selection matter more than adjunct lists.

It pours an inky, motor-oil black with a thin, dark brown head. The aroma is immediately intoxicating — rich bourbon, dark chocolate fudge, vanilla extract, and toasted coconut from the barrel, all layered over a foundation of deeply roasted malt. There's a dried fig sweetness in the background that adds an old-world sophistication.

The palate is a masterpiece of integration. Unlike barrel-aged stouts that lean heavily on adjuncts to carry the flavor, Parabola lets the barrel and the base beer do the talking. Waves of dark chocolate, espresso, and caramel roll across the tongue, followed by bourbon warmth that builds slowly and gracefully. The barrel character is prominent but perfectly calibrated — vanilla, oak tannin, and coconut weave through the roasted malt without ever dominating it. At 14% ABV, the alcohol is significant, but the full, almost chewy mouthfeel absorbs it remarkably well.

The finish is impossibly long. Dark chocolate and bourbon warmth linger for minutes, slowly revealing layers of toffee, dried stone fruit, and toasted oak as the beer warms in your glass. This is a beer that changes shape over thirty minutes, and the best thing you can do is slow down and let it.

Parabola belongs in any conversation about the greatest barrel-aged stouts ever produced. It doesn't need gimmicks, adjuncts, or a marketing campaign — it's just an exceptional base beer aged in exceptional barrels by a team that understands that true complexity comes from time and restraint, not from adding more stuff. Open it on a special occasion, pour it for someone you want to impress, and take your time.`,
      flavorTags: ['Barrel-Aged', 'Chocolate', 'Vanilla', 'Boozy', 'Coffee', 'Complex'],
      aroma: 5.0,
      appearance: 4.5,
      taste: 5.0,
      mouthfeel: 5.0,
      overall: 5.0,
      servingType: 'bottle',
    },

    // 12. Edward — Hill Farmstead
    {
      beerSlug: 'hill-farmstead-edward',
      rating: 5.0,
      content: `Edward is the pale ale that makes other pale ales seem like they're not trying hard enough. Shaun Hill's tribute to his grandfather is brewed in tiny batches at his farmstead brewery in the rolling hills of Greensboro, Vermont — and it's widely considered one of the best pale ales ever made. Period.

The pour is a luminous pale gold with a delicate haze and a pillowy white head. The aroma is unlike any other pale ale — lush floral notes, ripe stone fruit, and a grassy, herbal quality that feels European in its restraint but American in its hop intensity. There's a freshness here that's almost startling, like smelling wildflowers in a mountain meadow.

The flavor is where Edward achieves transcendence. Soft, nuanced hop character — lemon verbena, white grape, fresh herbs — unfolds gradually across the palate with a gentleness that belies how much flavor is actually present. The malt backbone is barely there, a whisper of honey-kissed grain that provides structure without weight. At 5.2% ABV, it's featherlight in body but enormously complex in flavor, which is the hallmark of a truly great brewer. The bitterness is present but so finely tuned that it feels more like tension than aggression.

The finish is dry, clean, and effortlessly elegant. A lingering floral bitterness and the faintest trace of lemon zest drift away slowly, leaving your palate completely refreshed and your mind genuinely impressed.

Edward is the kind of beer that changes how you think about a style. It proves that a pale ale — the simplest, most humble format in craft beer — can be transcendent when brewed with obsessive attention to detail and genuine artistry. This isn't a beer you drink casually. This is a beer you pay attention to. And it rewards every moment of that attention.`,
      flavorTags: ['Floral', 'Herbal', 'Citrus', 'Crisp', 'Dry', 'Complex'],
      aroma: 5.0,
      appearance: 4.5,
      taste: 5.0,
      mouthfeel: 5.0,
      overall: 5.0,
      servingType: 'draft',
    },

    // 13. Jai Alai — Cigar City
    {
      beerSlug: 'cigar-city-jai-alai',
      rating: 4.0,
      content: `Jai Alai is Florida's gift to the American IPA landscape — a bold, tropical, unapologetically flavorful IPA that captured the sun-drenched energy of Tampa in a can and shipped it to the rest of the country. Cigar City's flagship has become one of the best-selling craft IPAs in America, and the quality-to-availability ratio here is remarkable.

The pour is a deep amber-gold with a slight haze and a sturdy off-white head. The aroma is loaded with tropical fruit — mango, papaya, and tangerine — riding on top of a caramelly malt sweetness and a touch of pine. It smells like a tropical fruit stand with a hoppy edge, which is exactly the vibe Cigar City is going for.

The flavor is big and confident. Tropical fruit hops lead with mango and citrus, followed by a piney, resinous bitterness that gives Jai Alai more backbone than most tropical-forward IPAs. The malt presence is noticeable — biscuity and lightly caramel — which gives it a more traditional IPA weight compared to the lean, stripped-down hazies that dominate the market. At 7.5% ABV, it has real presence on the palate without ever feeling boozy.

The finish is moderately bitter with lingering tropical fruit and pine. The carbonation is sharp and refreshing, cutting through the malt sweetness effectively. It's a beer that works equally well on a scorching Florida afternoon and a cold winter evening.

Jai Alai occupies an important space in the IPA spectrum — it's more flavorful and hop-forward than a session IPA, but more balanced and approachable than a double. It's the everyday IPA for people who actually want to taste their hops, and at its price point, it delivers more flavor per dollar than almost anything on the shelf.`,
      flavorTags: ['Tropical', 'Pine', 'Caramel', 'Citrus', 'Bitter', 'Juicy'],
      aroma: 4.0,
      appearance: 4.0,
      taste: 4.5,
      mouthfeel: 4.0,
      overall: 4.0,
      servingType: 'can',
    },

    // 14. Tank 7 — Boulevard
    {
      beerSlug: 'boulevard-tank-7',
      rating: 4.5,
      content: `Tank 7 is the American farmhouse ale that taught a generation of drinkers that saisons weren't just a Belgian thing. Boulevard's flagship — born from an unruly fermentation that the brewers almost dumped — turned out to be one of the most unique and beloved beers in the Midwest, and its influence on American farmhouse brewing can't be overstated.

The pour is a beautiful golden-amber with a massive, rocky white head that refuses to quit. The aroma is wonderfully complex — peppery yeast esters, fresh citrus peel, grassy hops, and a bready, slightly honeyed malt character. There's a wild, almost funky edge to the nose that hints at the Belgian yeast strains doing their work.

On the palate, Tank 7 is a high-wire act that somehow never falls. Bright citrus and peppery spice hit first, followed by a dry, biscuity malt that provides a foundation without adding sweetness. American hops contribute a grassy, floral bitterness that gives it a distinctly American edge over traditional Belgian farmhouse ales. At 8.5% ABV, it has real heat, but the bone-dry finish and effervescent carbonation mask the alcohol exceptionally well. The mouthfeel is light and prickly despite the strength, making it feel far more sessionable than it has any right to be.

The finish is long, dry, and spicy — black pepper and lemon zest linger while the carbonation scrubs your palate clean. Let it warm a few degrees and notes of white wine, hay, and stone fruit emerge from the background.

Tank 7 is the kind of beer that converts people to farmhouse ales on the first sip. It's complex enough to analyze but approachable enough to enjoy without thinking about it. It pairs brilliantly with food (try it with grilled chicken or goat cheese), it impresses beer geeks and casual drinkers equally, and it's available at your local grocery store. That combination is exceedingly rare.`,
      flavorTags: ['Farmhouse', 'Pepper', 'Citrus', 'Dry', 'Complex', 'Crisp'],
      aroma: 4.5,
      appearance: 5.0,
      taste: 4.5,
      mouthfeel: 4.5,
      overall: 4.5,
      servingType: 'bottle',
    },

    // 15. Dale's Pale Ale — Oskar Blues
    {
      beerSlug: 'oskar-blues-dales-pale-ale',
      rating: 4.0,
      content: `Dale's Pale Ale didn't just make a great beer — it changed the packaging game forever. When Oskar Blues became the first craft brewery to can their beer in 2002, the industry laughed. Twenty years later, the can is king, and Dale's is still the sturdy, reliable pale ale that proved the format works.

The pour is a clear amber-copper with a modest but persistent off-white head. The aroma is classic West Coast pale ale — piney Cascade and Columbus hops with grapefruit, a hint of caramel sweetness, and a clean, slightly bready malt underneath. It's not trying to be exotic or trendy; it's trying to be a damn good pale ale.

The flavor delivers exactly what the nose promises. Assertive hop bitterness — more aggressive than many modern pale ales dare to be — pairs with a robust caramel malt backbone that gives Dale's a satisfying weight. Grapefruit, pine, and a touch of spicy hop bitterness drive the front palate, while the malt provides a toffee-like sweetness that keeps the bitterness from becoming one-dimensional. At 6.5% ABV, it sits at the upper end of pale ale territory, giving it a fullness that rewards attention.

The finish is dry and firmly bitter, with lingering pine and a faint copper-penny minerality that adds an interesting edge. The carbonation is moderate and the body is medium, giving it a substantial, almost chewy mouthfeel that sets it apart from the waterier end of the pale ale spectrum.

Dale's Pale Ale is a throwback in the best possible way. In an era of fruited smoothie sours and triple-dry-hopped hazy IPAs, Dale's is a reminder that a well-made, traditionally-hopped, boldly bitter pale ale is still one of the most satisfying things you can put in a glass. It's a blue-collar beer with a brewer's pedigree — unpretentious, hardworking, and consistently excellent. Keep your fridge stocked.`,
      flavorTags: ['Pine', 'Citrus', 'Caramel', 'Bitter', 'Dry', 'Crisp'],
      aroma: 4.0,
      appearance: 4.0,
      taste: 4.0,
      mouthfeel: 4.0,
      overall: 4.0,
      servingType: 'can',
    },
  ];

  // ============================================================
  // PHASE 3: Insert reviews
  // ============================================================

  let created = 0;
  let skipped = 0;

  for (const review of reviews) {
    const beer = await prisma.beer.findUnique({
      where: { slug: review.beerSlug },
      select: { id: true, name: true },
    });

    if (!beer) {
      console.log(`  SKIP: Beer not found: ${review.beerSlug}`);
      skipped++;
      continue;
    }

    try {
      await prisma.review.upsert({
        where: {
          userId_beerId: {
            userId: hqUser.id,
            beerId: beer.id,
          },
        },
        create: {
          userId: hqUser.id,
          beerId: beer.id,
          rating: review.rating,
          content: review.content,
          flavorTags: review.flavorTags,
          aroma: review.aroma,
          appearance: review.appearance,
          taste: review.taste,
          mouthfeel: review.mouthfeel,
          overall: review.overall,
          servingType: review.servingType,
          isVerified: true,
        },
        update: {
          rating: review.rating,
          content: review.content,
          flavorTags: review.flavorTags,
          aroma: review.aroma,
          appearance: review.appearance,
          taste: review.taste,
          mouthfeel: review.mouthfeel,
          overall: review.overall,
          servingType: review.servingType,
          isVerified: true,
        },
      });
      created++;
      console.log(`  [${created}] ${beer.name} — ${review.rating}/5`);
    } catch (err: any) {
      console.log(`  ERROR: ${beer.name}: ${err.message}`);
      skipped++;
    }
  }

  console.log('\n========================================');
  console.log('  HQ REVIEWS COMPLETE');
  console.log('========================================\n');
  console.log(`Reviews created/updated: ${created}`);
  console.log(`Skipped: ${skipped}`);
}

main()
  .catch((e) => {
    console.error('FATAL:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
