import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL ||
        'postgresql://postgres:JTJTTURinttUaOvtLGaoSdZAUnqIjPSv@crossover.proxy.rlwy.net:52935/railway',
    },
  },
});

const updatedReviews: { beerSlug: string; content: string }[] = [
  // 1. Pliny the Elder — Russian River (Double IPA, 8%)
  {
    beerSlug: 'russian-river-pliny-the-elder',
    content: `Had this fresh on draft in Santa Rosa and honestly, it's still the one I compare every DIPA to. The hop layering is unreal — grapefruit, pine, a little white pepper — but what gets me every time is how clean the finish is. At 8%, you'd never know. It just disappears and leaves you wanting another sip.

If you ever get the chance to drink this within two weeks of packaging, do it. It's a completely different beer fresh. The resin fades, the citrus gets brighter, and the whole thing just floats. I've had plenty of DIPAs that try to do what Pliny does, but nothing nails that dry, effortless finish quite like this.`,
  },

  // 2. Heady Topper — The Alchemist (Double IPA, 8%)
  {
    beerSlug: 'alchemist-heady-topper',
    content: `Poured this into a glass despite the can's instructions — no regrets. The nose alone is worth the trip to Vermont. Pineapple, tangerine, something almost dank and floral. It smells like a tropical greenhouse and I mean that as the highest compliment.

First sip is pillowy soft. Mango, papaya, a touch of peach. You forget this is 8% until you stand up. The bitterness is there but it's wrapped in so much fruit it feels more like texture than bite. My third time with this one and it's somehow better every time. If you're into hazy DIPAs, this is the one that started the whole conversation.`,
  },

  // 3. Two Hearted Ale — Bell's (IPA, 7%)
  {
    beerSlug: 'bells-two-hearted-ale',
    content: `This is the beer I hand to someone who says they want to try a "real" IPA. One hop. One malt. Zero gimmicks. And it's flat-out perfect. Centennial carries the entire show — grapefruit, pine, a little floral honey — and somehow that's all it needs.

I've had this probably a hundred times and it never gets old. The balance is ridiculous. Enough bitterness to remind you it's an IPA, enough malt sweetness to keep it smooth, and at 7% it's sessionable enough for a whole evening. This is the beer that proves you don't need twelve adjuncts to be world-class.`,
  },

  // 4. KBS — Founders (BA Imperial Stout, 12.2%)
  {
    beerSlug: 'founders-kbs',
    content: `Cracked a bottle of this year's vintage last weekend and just sat with it for an hour. The nose hit me before I even poured — dark roast coffee, chocolate ganache, bourbon vanilla. It smells like a dessert I can't afford.

First sip is velvety. Espresso and dark chocolate up front, then the bourbon rolls in — warm, caramelly, a little oak. At 12.2% there's heat, but it's the cozy kind, not the harsh kind. Best move is letting it warm up a few degrees. Toffee and dried cherry start showing up and the whole thing gets richer. KBS is an event beer. Share it with someone who thinks they don't like stouts.`,
  },

  // 5. Julius — Tree House (Hazy IPA, 6.8%)
  {
    beerSlug: 'tree-house-julius',
    content: `Grabbed a four-pack from the Charlton brewery and drank one in the parking lot. Could not wait. It pours like orange juice — deep gold, completely opaque — and the aroma is pure mango smoothie with a hint of vanilla.

The taste is just... joy. Tropical fruit everywhere — mango, passion fruit, fresh-squeezed orange — but with this soft, pillowy body that makes it dangerously easy to drink. There's barely any bitterness, just enough to keep it from being a fruit punch. At 6.8% it's right in that sweet spot where you could crush two before realizing you should probably slow down. Julius made me understand what the hazy IPA thing was all about.`,
  },

  // 6. Zombie Dust — 3 Floyds (Pale Ale, 6.2%)
  {
    beerSlug: '3-floyds-zombie-dust',
    content: `Finally got my hands on a six-pack after years of hearing the hype. Was it worth it? Yeah, actually. It's a single-hop Citra pale ale and it's just dialed in perfectly. Bright grapefruit, mango, a little lychee sweetness — Citra doing exactly what Citra does best.

At 6.2% it lives in this perfect zone where it's flavorful enough to pay attention to but light enough to drink all afternoon. The bitterness is moderate and clean. No lingering harshness. Just crisp, dry, and gone — which makes you immediately want the next one. It's not the most complex beer I've ever had, but it might be one of the most satisfying.`,
  },

  // 7. Prairie BOMB! — Prairie Artisan Ales (Imperial Stout, 13%)
  {
    beerSlug: 'prairie-bomb',
    content: `Espresso, chocolate, vanilla, and ancho chili in an imperial stout. Sounds like a mess, right? It's not. It's somehow one of the most cohesive stouts I've ever had. The coffee and chocolate hit first, then the vanilla softens everything, and then — about three seconds later — this slow chili warmth builds in the back of your throat. Not hot. Just warm.

At 13% this is a sipper, obviously. But the interplay between the sweet, the bitter, and the warm keeps every sip interesting. I poured two ounces for a friend who doesn't drink stouts and watched them immediately go buy a bottle. That tells you everything.`,
  },

  // 8. Oberon — Bell's (Wheat Ale, 5.8%)
  {
    beerSlug: 'bells-oberon',
    content: `Oberon Day is basically a holiday in Michigan and I get it now. This isn't a beer you sit and analyze — it's a beer you drink on a patio while the sun's out and life is good. Orange peel, light wheat, a little peppery spice from the yeast. Simple and perfect.

At 5.8% it's built for long afternoons. Not too sweet, not too bitter, not too anything. Just an extremely well-made wheat ale that knows exactly what it wants to be. I brought a six-pack to a cookout last summer and it was the first thing gone. That's the ultimate compliment for a beer like this.`,
  },

  // 9. Sierra Nevada Pale Ale (Pale Ale, 5.6%)
  {
    beerSlug: 'sierra-nevada-pale-ale',
    content: `This is the beer that started American craft beer and it still holds up. Grabbed one on draft at a random bar last month and was reminded why it matters. Cascade hops — grapefruit, pine, a little floral — over a clean biscuity malt. Nothing fancy. Nothing trendy. Just a pale ale that does everything right.

Honestly? In a world of triple-dry-hopped this and pastry-adjunct that, there's something almost radical about how straightforward SNPA is. It's bitter and it's not sorry about it. 5.6%, completely sessionable, available everywhere. This is the beer I always come back to when I need to recalibrate my palate.`,
  },

  // 10. Founders Breakfast Stout (Imperial Stout, 8.3%)
  {
    beerSlug: 'founders-breakfast-stout',
    content: `The gateway stout. I've personally watched three people try this and immediately abandon their "I don't drink dark beer" stance. The coffee is bold and fresh-roasted, the chocolate weaves in and out, and the oats make the whole thing silky smooth. It smells like a fancy coffee shop and tastes even better.

At 8.3% it's got some warmth but the coffee bitterness keeps everything in check. What I love about this beer is that it's available year-round and priced like a normal beer. No hunting, no trading, no hype — just a genuinely great stout in your grocery store whenever you want it. I keep a sixer in the fridge at all times.`,
  },

  // 11. Parabola — Firestone Walker (BA Imperial Stout, 14%)
  {
    beerSlug: 'firestone-walker-parabola',
    content: `Opened a bottle of last year's Parabola and let it breathe for twenty minutes. Worth the wait. Dark chocolate, bourbon, vanilla, toasted coconut — the barrel work here is immaculate. No single flavor dominates. Everything just... integrates.

This is 14% and you can feel it, but the full, almost chewy body absorbs the heat in a way that most barrel-aged stouts can't pull off. The finish goes on forever. I'm talking minutes. Chocolate and bourbon trading places while toffee and dried fruit creep in from the edges. Pour this one slow, let it warm up, and clear your schedule. It's that kind of beer.`,
  },

  // 12. Edward — Hill Farmstead (Pale Ale, 5.2%)
  {
    beerSlug: 'hill-farmstead-edward',
    content: `Made the pilgrimage to Greensboro, Vermont for this one and it was worth every mile on those dirt roads. Edward is a pale ale at 5.2% and it has no business being this complex. Lemon verbena, white grape, fresh herbs, the faintest whisper of honey-kissed grain. It's delicate and intense at the same time.

The mouthfeel is featherlight but the flavor just keeps unfolding. Every sip reveals something new. The bitterness is there but it reads more like tension than aggression — you feel it more than taste it. Shaun Hill is doing something different up on that hill. This beer made me rethink what a pale ale could be. Not kidding.`,
  },

  // 13. Jai Alai — Cigar City (IPA, 7.5%)
  {
    beerSlug: 'cigar-city-jai-alai',
    content: `My go-to grocery store IPA and I'm not ashamed of it. Jai Alai punches way above its price point. Mango, tangerine, a solid backbone of pine and caramel malt. It's more traditional than the haze-everything trend but that's what I like about it — it actually tastes like an IPA.

At 7.5% it's got real presence without being a chore. The bitterness is assertive but not punishing. Works great ice cold on a hot day, works great with a burger, works great just sitting on the couch. It's the everyday IPA that actually delivers flavor. I go through a lot of these.`,
  },

  // 14. Tank 7 — Boulevard (Farmhouse Ale, 8.5%)
  {
    beerSlug: 'boulevard-tank-7',
    content: `Tank 7 is the beer I pour for people who say they don't like farmhouse ales. Peppery yeast, citrus peel, grassy hops, and this sneaky 8.5% ABV that hides behind bone-dry carbonation. It's the most interesting beer in most grocery stores and nobody realizes it.

The trick with Tank 7 is temperature. Cold out of the fridge it's crisp and spicy. Let it warm up ten minutes and suddenly there's white wine, hay, stone fruit coming through. It's like two different beers. Pairs absurdly well with food — grilled chicken, goat cheese, Thai takeout. This is the farmhouse ale that converted me to the style, and I still grab a four-pack every couple weeks.`,
  },

  // 15. Dale's Pale Ale — Oskar Blues (Pale Ale, 6.5%)
  {
    beerSlug: 'oskar-blues-dales-pale-ale',
    content: `The first craft beer ever canned, and it still rips. Dale's is unapologetically bitter in a way that most modern pale ales have walked away from. Piney, grapefruity, with a toffee-like caramel malt that gives it real weight. This is a blue-collar pale ale with a brewer's pedigree.

At 6.5% it's on the stronger side for a pale ale, which gives it a fullness that thinner beers can't match. The finish is dry and firmly bitter — no soft landing here, and I respect that. It's not flashy, it's not trendy, and it doesn't care. Dale's is the beer I reach for when I want something honest. Grab a six-pack and keep it in rotation.`,
  },
];

async function main() {
  console.log('Updating BrewIQ HQ reviews with toned-down personal voice...\n');

  // Find the brewiq_hq user
  const hqUser = await prisma.user.findUnique({
    where: { username: 'brewiq_hq' },
    select: { id: true, username: true, displayName: true },
  });

  if (!hqUser) {
    console.error('ERROR: brewiq_hq user not found. Run populate-hq-reviews.ts first.');
    process.exit(1);
  }

  console.log(`Found HQ user: ${hqUser.displayName} (${hqUser.id})\n`);

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const review of updatedReviews) {
    // Find the beer by slug
    const beer = await prisma.beer.findUnique({
      where: { slug: review.beerSlug },
      select: { id: true, name: true },
    });

    if (!beer) {
      console.log(`  SKIP: Beer not found — ${review.beerSlug}`);
      notFound++;
      continue;
    }

    // Update only the content field, keeping all other fields intact
    const result = await prisma.review.updateMany({
      where: {
        userId: hqUser.id,
        beerId: beer.id,
      },
      data: {
        content: review.content,
      },
    });

    if (result.count > 0) {
      updated++;
      console.log(`  [${updated}] Updated: ${beer.name}`);
    } else {
      skipped++;
      console.log(`  SKIP: No existing review found for ${beer.name}`);
    }
  }

  console.log('\n========================================');
  console.log('  HQ REVIEW UPDATE COMPLETE');
  console.log('========================================\n');
  console.log(`Updated:   ${updated}`);
  console.log(`Skipped:   ${skipped}`);
  console.log(`Not found: ${notFound}`);
  console.log(`Total:     ${updatedReviews.length}`);
}

main()
  .catch((e) => {
    console.error('FATAL:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
