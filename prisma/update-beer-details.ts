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

interface BeerUpdate {
  slug: string;
  description: string;
  flavorTags: string[];
  foodPairings: string[];
}

const beerUpdates: BeerUpdate[] = [
  // ============================================================
  // 3 FLOYDS
  // ============================================================
  {
    slug: '3-floyds-dark-lord',
    description:
      'Dark Lord is the beer that launched a thousand road trips. This titanic imperial stout pours like motor oil and delivers waves of fudge, dark fruit, and molasses so intense it borders on confectionery. At 15%, it warms from the inside out — a dessert, a nightcap, and a bucket-list experience rolled into one inky, legendary package.',
    flavorTags: ['Chocolate', 'Roast', 'Sweet', 'Boozy', 'Toffee', 'Complex'],
    foodPairings: [
      'Flourless chocolate torte',
      'Slow-smoked beef short ribs',
      'Aged Gouda with fig jam',
      'Bananas Foster',
    ],
  },
  {
    slug: '3-floyds-zombie-dust',
    description:
      'Zombie Dust earned its cult status the old-fashioned way — by being absurdly good. Single-hopped with Citra, it explodes with tangerine, mango, and grapefruit while a lean malt backbone keeps everything dangerously drinkable. This is the pale ale that made grown adults hoard six-packs like the apocalypse was real.',
    flavorTags: ['Citrus', 'Tropical', 'Crisp', 'Juicy', 'Bitter', 'Crushable'],
    foodPairings: [
      'Nashville hot chicken sandwich',
      'Fish tacos with mango salsa',
      'Sharp white cheddar',
      'Thai green papaya salad',
    ],
  },
  {
    slug: '3-floyds-gumballhead',
    description:
      'Gumballhead is summer in the Midwest distilled into a glass. Amarillo hops lend bright orange peel and floral notes to a pillowy wheat base, creating something that drinks like sunshine through a screen door. Light, aromatic, and endlessly refreshing — the kind of beer that empties a cooler before the coals are even hot.',
    flavorTags: ['Floral', 'Citrus', 'Crisp', 'Bread', 'Crushable', 'Sessionable'],
    foodPairings: [
      'Grilled bratwurst with stone-ground mustard',
      'Lemon-herb rotisserie chicken',
      'Watermelon and feta salad',
      'Soft pretzels with beer cheese',
    ],
  },

  // ============================================================
  // THE ALCHEMIST
  // ============================================================
  {
    slug: 'alchemist-heady-topper',
    description:
      'Before hazy was a style, there was Heady Topper. This Vermont-born double IPA practically invented the modern juice bomb — turbid, aromatic, and overflowing with tropical fruit, pine resin, and a finish so smooth it masks a serious 8% punch. The can says "drink from the can." The world says "drink whenever you can find it."',
    flavorTags: ['Tropical', 'Pine', 'Juicy', 'Resinous', 'Bitter', 'Complex'],
    foodPairings: [
      'Jamaican jerk chicken',
      'Spicy tuna poke bowl',
      'Vermont sharp cheddar with crackers',
      'Coconut shrimp with sweet chili sauce',
    ],
  },
  {
    slug: 'alchemist-focal-banger',
    description:
      'If Heady Topper is the legend, Focal Banger is the refined follow-up that stands entirely on its own. Brewed with Citra and Mosaic, it trades some of Heady\'s resinous edge for a laser-focused burst of peach, papaya, and citrus zest. At 7%, it\'s the more sessionable sibling that might just be the better drinking companion.',
    flavorTags: ['Tropical', 'Citrus', 'Juicy', 'Smooth', 'Crisp', 'Dank'],
    foodPairings: [
      'Lobster roll with drawn butter',
      'Pan-seared halibut with citrus beurre blanc',
      'Grilled peach and burrata salad',
      'Pad Thai with shrimp',
    ],
  },
  {
    slug: 'alchemist-crusher',
    description:
      'Crusher lives up to its name — this double IPA is a relentless wave of citrus and tropical fruit that hits hard and finishes clean. Galaxy and Mosaic hops deliver passion fruit, tangerine, and a hint of stone fruit, while the soft mouthfeel keeps you reaching back for more. Pure Vermont hop artistry at its finest.',
    flavorTags: ['Tropical', 'Citrus', 'Juicy', 'Smooth', 'Dank', 'Crushable'],
    foodPairings: [
      'Buffalo cauliflower bites',
      'Grilled mahi-mahi tacos',
      'Brie and apricot crostini',
      'Honey-sriracha glazed wings',
    ],
  },

  // ============================================================
  // ALESMITH
  // ============================================================
  {
    slug: 'alesmith-speedway-stout',
    description:
      'Speedway Stout is what happens when a world-class imperial stout meets a serious coffee obsession. Brewed with locally roasted beans, it pours jet-black and delivers an orchestra of espresso, bittersweet chocolate, and dark caramel that crescendos into a warming, velvety finish. At 12%, this is a beer you sip with reverence and time to spare.',
    flavorTags: ['Coffee', 'Chocolate', 'Roast', 'Smooth', 'Boozy', 'Complex'],
    foodPairings: [
      'Espresso-rubbed ribeye steak',
      'Dark chocolate lava cake',
      'Aged Manchego with quince paste',
      'Tiramisu',
    ],
  },
  {
    slug: 'alesmith-394-pale-ale',
    description:
      'Named for Tony Gwynn\'s legendary .394 batting average, this pale ale is San Diego in a glass — bright, balanced, and built for the long game. Citrus and pine hop notes play off a clean malt base with the kind of easy confidence that made Mr. Padre himself a once-in-a-generation talent. A tribute beer that actually delivers.',
    flavorTags: ['Citrus', 'Pine', 'Biscuit', 'Crisp', 'Bitter', 'Crushable'],
    foodPairings: [
      'Ballpark-style grilled sausage with peppers',
      'Carne asada street tacos',
      'Grilled corn with cotija and lime',
      'Smoked turkey club sandwich',
    ],
  },
  {
    slug: 'alesmith-nut-brown',
    description:
      'AleSmith\'s Nut Brown is a masterclass in understatement. Rich and malty with layers of hazelnut, toffee, and toasted bread, it\'s the kind of beer that reminds you why the classics never went away. Smooth and medium-bodied with a gentle sweetness that invites long, thoughtful sipping — a brown ale done exactly right.',
    flavorTags: ['Nutty', 'Toffee', 'Biscuit', 'Caramel', 'Smooth', 'Sweet'],
    foodPairings: [
      'Roasted mushroom and Gruyere tart',
      'Herb-crusted pork tenderloin',
      'Pecan pie with vanilla ice cream',
      'Caramelized onion and bacon flatbread',
    ],
  },

  // ============================================================
  // BELL'S
  // ============================================================
  {
    slug: 'bells-two-hearted-ale',
    description:
      'Two Hearted doesn\'t need hype — it has perfection. Single-hopped with Centennial, this IPA has been voted America\'s best beer so many times it should be retired to the hall of fame. Grapefruit, pine, and floral notes ride a perfectly calibrated malt backbone. It\'s the beer you hand someone when they ask what a great IPA tastes like.',
    flavorTags: ['Pine', 'Citrus', 'Floral', 'Bitter', 'Biscuit', 'Crisp'],
    foodPairings: [
      'Wood-fired margherita pizza',
      'Pan-seared salmon with dill',
      'Aged white cheddar and apple slices',
      'Herb-grilled lamb chops',
    ],
  },
  {
    slug: 'bells-oberon',
    description:
      'When Oberon hits shelves in Michigan, it\'s basically a state holiday. This American wheat ale is the unofficial starter pistol for summer — hazy golden, spicy from the house yeast, with notes of orange peel and clove that make every sip taste like the first warm day of the year. Simple, joyful, and utterly essential.',
    flavorTags: ['Citrus', 'Clove', 'Bread', 'Crisp', 'Crushable', 'Fruit'],
    foodPairings: [
      'Grilled shrimp skewers with lemon',
      'Caprese salad with heirloom tomatoes',
      'Fish and chips with malt vinegar',
      'Key lime pie',
    ],
  },
  {
    slug: 'bells-hopslam',
    description:
      'Hopslam drops once a year and disappears faster than concert tickets. This double IPA is aggressively hopped six times with a different variety each round, then finished with honey for a shimmering sweetness that plays beautifully against the citrus and pine onslaught. At 10%, it\'s a velvet sledgehammer — bold, complex, and absolutely worth the hunt.',
    flavorTags: ['Citrus', 'Pine', 'Honey', 'Boozy', 'Bitter', 'Complex'],
    foodPairings: [
      'Honey-glazed smoked ham',
      'Thai basil chicken stir-fry',
      'Blue cheese and candied walnut salad',
      'Mango habanero wings',
    ],
  },
  {
    slug: 'bells-expedition-stout',
    description:
      'Expedition Stout is the kind of beer that makes you cancel your evening plans. Pitch-black and full-bodied, it unravels with dark chocolate, espresso, dried fruit, and a port-like booziness that rewards patience. Cellar it for a year and it transforms into something even more extraordinary. A stout built for contemplation.',
    flavorTags: ['Chocolate', 'Coffee', 'Roast', 'Boozy', 'Complex', 'Fruit'],
    foodPairings: [
      'Dark chocolate truffles with sea salt',
      'Braised oxtail over polenta',
      'Stilton cheese with port reduction',
      'Espresso creme brulee',
    ],
  },

  // ============================================================
  // BOULEVARD
  // ============================================================
  {
    slug: 'boulevard-tank-7',
    description:
      'Tank 7 was born from a stubborn fermentation that wouldn\'t behave — and thank god for that. This farmhouse ale is effervescent, peppery, and bone-dry, with fruity esters from the Belgian yeast mingling with a grassy, floral hop presence. At 8.5%, it drinks deceptively light and pairs with practically everything. Kansas City\'s finest export.',
    flavorTags: ['Pepper', 'Farmhouse', 'Dry', 'Crisp', 'Floral', 'Complex'],
    foodPairings: [
      'Moules-frites with garlic butter',
      'Kansas City burnt ends',
      'Goat cheese and roasted beet salad',
      'Lemon-caper pan-fried sole',
    ],
  },
  {
    slug: 'boulevard-unfiltered-wheat',
    description:
      'Boulevard\'s Unfiltered Wheat is the gateway beer that built an empire. Hazy, citrusy, and impossibly easy-drinking, it\'s the perfect canvas for a lemon wedge and a lazy afternoon. There\'s a reason it\'s been a Midwestern staple for decades — it\'s unpretentious, refreshing, and always exactly what you want it to be.',
    flavorTags: ['Citrus', 'Bread', 'Crisp', 'Crushable', 'Smooth', 'Sessionable'],
    foodPairings: [
      'Fish tacos with cilantro-lime slaw',
      'Summer garden salad with vinaigrette',
      'Fried calamari with marinara',
      'Chicken quesadillas with pico de gallo',
    ],
  },
  {
    slug: 'boulevard-the-calling',
    description:
      'The Calling is Boulevard\'s answer to the hop arms race, and it answers loudly. This double IPA brings waves of mango, pineapple, and stone fruit with a firm but not punishing bitterness. The body is full but not heavy, and at 8.5%, it walks the tightrope between crushable and contemplative with the confidence of a tightrope walker who\'s done this a thousand times.',
    flavorTags: ['Tropical', 'Citrus', 'Pine', 'Bitter', 'Juicy', 'Boozy'],
    foodPairings: [
      'Blackened catfish po\'boy',
      'Green curry with chicken',
      'Pepper jack and jalapeno poppers',
      'Grilled pineapple and pork kabobs',
    ],
  },

  // ============================================================
  // CANTILLON
  // ============================================================
  {
    slug: 'cantillon-gueuze',
    description:
      'Cantillon Gueuze is the benchmark by which all sour beer is measured. A blend of one-, two-, and three-year-old lambics, it\'s bone-dry, bracingly tart, and layered with green apple, lemon pith, and a funky, barnyard earthiness that tells the story of wild Brussels air. This isn\'t just beer — it\'s a living, breathing piece of Belgian terroir.',
    flavorTags: ['Sour', 'Tart', 'Funk', 'Dry', 'Complex', 'Farmhouse'],
    foodPairings: [
      'Oysters on the half shell with mignonette',
      'Aged Comté cheese',
      'Charcuterie board with cornichons',
      'Seared duck breast with cherry reduction',
    ],
  },
  {
    slug: 'cantillon-kriek',
    description:
      'Cantillon Kriek is what happens when wild lambic meets whole Schaerbeek cherries — and the result is transcendent. Tart, dry, and intensely fruity without a hint of sweetness, it glows ruby-red in the glass and delivers wave after wave of sour cherry, almond skin, and delicate funk. A masterwork of patience and wild fermentation.',
    flavorTags: ['Sour', 'Tart', 'Fruit', 'Funk', 'Dry', 'Complex'],
    foodPairings: [
      'Duck confit with cherry gastrique',
      'Dark chocolate mousse',
      'Aged brie with cherry compote',
      'Prosciutto-wrapped figs',
    ],
  },
  {
    slug: 'cantillon-rose-de-gambrinus',
    description:
      'Rose de Gambrinus is Cantillon\'s raspberry masterpiece — a lambic aged on whole fruit that pours a stunning rose-pink and delivers pure, unadulterated raspberry character wrapped in bracing acidity and delicate funk. It\'s simultaneously one of the most elegant and most primal beers you\'ll ever drink. Sheer wild ale perfection.',
    flavorTags: ['Sour', 'Tart', 'Fruit', 'Funk', 'Dry', 'Complex'],
    foodPairings: [
      'Raspberry tart with almond frangipane',
      'Smoked salmon with cream cheese and capers',
      'Roquefort cheese with honeycomb',
      'Grilled lamb with rosemary and mint',
    ],
  },

  // ============================================================
  // CIGAR CITY
  // ============================================================
  {
    slug: 'cigar-city-jai-alai',
    description:
      'Jai Alai hits like its namesake sport — fast, fierce, and impossible to ignore. This Tampa-born IPA loads up on citrus and tropical hops with a caramel malt sweetness that keeps the bitterness from running away. It\'s bold without being abrasive, complex without being fussy, and has quietly become one of the most reliable IPAs in America.',
    flavorTags: ['Citrus', 'Tropical', 'Caramel', 'Bitter', 'Crisp', 'Pine'],
    foodPairings: [
      'Cuban sandwich with pickle and mustard',
      'Blackened grouper with mango salsa',
      'Spicy buffalo chicken dip',
      'Grilled chorizo with chimichurri',
    ],
  },
  {
    slug: 'cigar-city-florida-cracker',
    description:
      'Florida Cracker is a Belgian wit brewed for the tropics — hazy, effervescent, and kissed with orange peel and coriander. The Belgian yeast lends a subtle spiciness that plays against the citrusy brightness like a late-afternoon Gulf breeze. Light, refreshing, and tailor-made for those days when the humidity could drown you.',
    flavorTags: ['Citrus', 'Clove', 'Crisp', 'Bread', 'Spiced', 'Crushable'],
    foodPairings: [
      'Ceviche with fresh lime and cilantro',
      'Steamed mussels in white wine broth',
      'Key West-style conch fritters',
      'Thai mango sticky rice',
    ],
  },
  {
    slug: 'cigar-city-hunahpus',
    description:
      'Hunahpu\'s is Cigar City\'s Mayan god of cacao brought to liquid life. This imperial stout is brewed with cacao nibs, cinnamon, vanilla, and ancho and pasilla chili peppers — creating a dark, brooding beer with layers of chocolate, baking spice, and a slow, building heat that lingers long after the sip. Annual release day is a full-blown pilgrimage.',
    flavorTags: ['Chocolate', 'Spiced', 'Vanilla', 'Boozy', 'Complex', 'Sweet'],
    foodPairings: [
      'Mexican mole negro',
      'Churros with dark chocolate dipping sauce',
      'Smoked brisket with ancho chili rub',
      'Cinnamon-spiced flan',
    ],
  },

  // ============================================================
  // DESCHUTES
  // ============================================================
  {
    slug: 'deschutes-fresh-squeezed',
    description:
      'Fresh Squeezed lives up to its name like few beers can. Citra and Mosaic hops deliver an eruption of grapefruit, tangerine, and tropical fruit so vivid you\'d swear someone juiced an entire citrus grove into the fermenter. The body is medium and clean, making this IPA dangerously approachable for its flavor intensity. A modern classic.',
    flavorTags: ['Citrus', 'Tropical', 'Juicy', 'Crisp', 'Bitter', 'Crushable'],
    foodPairings: [
      'Ahi tuna tacos with avocado crema',
      'Lemon-pepper grilled chicken',
      'Goat cheese and sun-dried tomato bruschetta',
      'Thai red curry with shrimp',
    ],
  },
  {
    slug: 'deschutes-mirror-pond',
    description:
      'Mirror Pond is the pale ale that put Bend, Oregon on the beer map. Cascade hops deliver classic floral and grapefruit notes over a clean, biscuity malt base in a package so well-balanced it practically defines the West Coast pale ale style. It\'s the beer equivalent of a perfectly maintained hiking trail — nothing wasted, everything earned.',
    flavorTags: ['Floral', 'Citrus', 'Biscuit', 'Crisp', 'Bitter', 'Sessionable'],
    foodPairings: [
      'Grilled rainbow trout with almonds',
      'Turkey and avocado sandwich on sourdough',
      'Tillamook cheddar with apple slices',
      'Caesar salad with grilled chicken',
    ],
  },
  {
    slug: 'deschutes-black-butte-porter',
    description:
      'Black Butte Porter has been America\'s bestselling craft porter for so long it\'s practically a public utility. Creamy, chocolatey, and deceptively smooth, it layers dark chocolate and coffee over a subtle caramel sweetness without ever veering into heaviness. It\'s the dark beer for people who think they don\'t like dark beer — and the dark beer for those who know they do.',
    flavorTags: ['Chocolate', 'Coffee', 'Caramel', 'Smooth', 'Roast', 'Crisp'],
    foodPairings: [
      'Smoked gouda mac and cheese',
      'Grilled portobello mushroom burger',
      'Chocolate peanut butter brownies',
      'Slow-roasted pulled pork',
    ],
  },
  {
    slug: 'deschutes-the-abyss',
    description:
      'The Abyss is Deschutes\' annual dive into the deep end — a barrel-aged imperial stout that spends time in bourbon, wine, and new oak barrels before blending into a single, magnificent release. Expect layers of vanilla, dark chocolate, espresso, and dark fruit with a gentle oakiness that deepens with every cellar year. Patience has rarely tasted this good.',
    flavorTags: ['Barrel-Aged', 'Chocolate', 'Coffee', 'Vanilla', 'Boozy', 'Complex'],
    foodPairings: [
      'Wagyu beef filet with red wine reduction',
      'Dark chocolate and espresso panna cotta',
      'Blue cheese-stuffed dates wrapped in bacon',
      'Smoked duck breast with blackberry sauce',
    ],
  },

  // ============================================================
  // DOGFISH HEAD
  // ============================================================
  {
    slug: 'dogfish-head-90-minute-ipa',
    description:
      'Ninety minutes of continuous hopping — not a gimmick, an engineering marvel. Dogfish Head\'s 90 Minute IPA layers hop additions over the entire boil, building a complexity that a single addition could never achieve. The result is a beautifully balanced imperial IPA with sticky toffee, pine, citrus, and a warmth that wraps around you like a wool blanket. A modern American icon.',
    flavorTags: ['Pine', 'Citrus', 'Toffee', 'Caramel', 'Bitter', 'Complex'],
    foodPairings: [
      'Aged Gruyere with honeycomb',
      'Tandoori chicken with raita',
      'Grilled lamb burger with tzatziki',
      'Maple-glazed roasted carrots',
    ],
  },
  {
    slug: 'dogfish-head-60-minute-ipa',
    description:
      'The 60 Minute is where the continual hopping story began — sixty minutes of hop additions creating a perfectly calibrated IPA that hits every note without ever shouting. Citrus, pine, and a touch of honey malt make this one of the most balanced and approachable IPAs on the market. It\'s the daily driver of the Dogfish lineup, and for good reason.',
    flavorTags: ['Citrus', 'Pine', 'Biscuit', 'Bitter', 'Crisp', 'Smooth'],
    foodPairings: [
      'Wood-fired margherita pizza',
      'Beer-battered fish and chips',
      'Sharp cheddar and chutney sandwich',
      'Rotisserie chicken with herbs de Provence',
    ],
  },
  {
    slug: 'dogfish-head-slightly-mighty',
    description:
      'Slightly Mighty is the lo-cal IPA that actually tastes like an IPA — a minor miracle in a category full of watered-down pretenders. At just 95 calories and 4% ABV, it somehow delivers legitimate tropical and citrus hop character with a clean, crisp body. Brewed with monk fruit for a touch of sweetness without the sugar. Proof that restraint can be delicious.',
    flavorTags: ['Tropical', 'Citrus', 'Crisp', 'Sessionable', 'Dry', 'Crushable'],
    foodPairings: [
      'Grilled shrimp with lemon and garlic',
      'Arugula and goat cheese salad',
      'Sushi rolls with ginger and wasabi',
      'Grilled vegetable wrap',
    ],
  },
  {
    slug: 'dogfish-head-seaquench',
    description:
      'SeaQuench Ale is a session sour that reads like a cocktail recipe — black limes, sea salt, and lime juice layered into a hybrid of kolsch, gose, and Berliner weisse. It\'s crushingly refreshing, salty-tart, and impossible to drink just one of. The beach beer to end all beach beers, and it works just as well after a run or on a Wednesday night.',
    flavorTags: ['Sour', 'Tart', 'Citrus', 'Crisp', 'Crushable', 'Sessionable'],
    foodPairings: [
      'Raw oysters with lemon and hot sauce',
      'Grilled fish tacos with pickled onion',
      'Peel-and-eat Old Bay shrimp',
      'Cucumber and avocado sushi rolls',
    ],
  },

  // ============================================================
  // FIRESTONE WALKER
  // ============================================================
  {
    slug: 'firestone-walker-parabola',
    description:
      'Parabola is Firestone Walker\'s crown jewel — a bourbon barrel-aged imperial stout that redefines what dark beer can be. Rich, viscous, and layered with dark chocolate, vanilla, charred oak, and dried stone fruit, it unfolds over the course of a glass like a great novel. At 14%, it demands respect and rewards patience. One of the finest barrel-aged stouts ever produced.',
    flavorTags: ['Barrel-Aged', 'Chocolate', 'Vanilla', 'Boozy', 'Complex', 'Roast'],
    foodPairings: [
      'Bourbon pecan pie',
      'Wagyu beef tartare',
      'Roquefort cheese with dark chocolate shavings',
      'Braised lamb shank with root vegetables',
    ],
  },
  {
    slug: 'firestone-walker-mind-haze',
    description:
      'Mind Haze proves that Firestone Walker can go hazy without losing its soul. This IPA is loaded with tropical fruit, tangerine, and melon from a rotating cast of hops, all riding on a soft, pillowy body that coats the palate without clinging. Balanced, aromatic, and genuinely flavorful — a hazy IPA made by brewers who understand that drinkability is the ultimate trick.',
    flavorTags: ['Tropical', 'Citrus', 'Juicy', 'Smooth', 'Crushable', 'Dank'],
    foodPairings: [
      'Teriyaki salmon bowl',
      'Street corn with lime and chili',
      'Fried chicken sandwich with pickles',
      'Mango and avocado salad',
    ],
  },
  {
    slug: 'firestone-walker-805',
    description:
      'Named for the Central Coast area code, 805 is the ultimate hang-out beer. This blonde ale is light, clean, and subtly honeyed with just enough malt character to keep things interesting. It\'s the beer you crack open after surfing, after mowing the lawn, after literally anything. Breezy, unpretentious, and available by the case for a reason.',
    flavorTags: ['Crisp', 'Bread', 'Honey', 'Smooth', 'Crushable', 'Sessionable'],
    foodPairings: [
      'Fish tacos with pineapple salsa',
      'California-style cheeseburger',
      'Chips and fresh guacamole',
      'Grilled chicken Caesar wrap',
    ],
  },
  {
    slug: 'firestone-walker-union-jack',
    description:
      'Union Jack is a West Coast IPA purist\'s dream — dry, bitter, and loaded with Centennial, Citra, Amarillo, and Simcoe hops that deliver a dazzling array of grapefruit, pine, and tropical notes. The body is lean and clean, letting the hops do all the talking. In a world of hazy softballs, Union Jack is a fastball right down the middle.',
    flavorTags: ['Citrus', 'Pine', 'Tropical', 'Bitter', 'Dry', 'Crisp'],
    foodPairings: [
      'Carne asada burrito',
      'Thai peanut noodles',
      'Pepper Jack cheese quesadilla',
      'Grilled swordfish with chimichurri',
    ],
  },

  // ============================================================
  // FOUNDERS
  // ============================================================
  {
    slug: 'founders-breakfast-stout',
    description:
      'Breakfast Stout is the beer that proved dessert stouts could be serious business. Brewed with Sumatra and Kona coffee, imported chocolate, and flaked oats, it pours like a velvet curtain and delivers waves of espresso, dark chocolate, and toasted oat in a package that somehow stays remarkably drinkable at 8.3%. Morning beer has never sounded so reasonable.',
    flavorTags: ['Coffee', 'Chocolate', 'Roast', 'Smooth', 'Complex', 'Sweet'],
    foodPairings: [
      'Chocolate chip pancakes with maple syrup',
      'Coffee-rubbed pork belly',
      'Dark chocolate and cherry scones',
      'Tiramisu with extra espresso',
    ],
  },
  {
    slug: 'founders-kbs',
    description:
      'KBS — Kentucky Breakfast Stout — is Breakfast Stout\'s bigger, barrel-aged sibling, and it\'s a beast. Aged in bourbon barrels, it amplifies everything with layers of vanilla, oak, dark chocolate, and rich espresso. At 12.2%, it drinks like a decadent after-dinner ritual. Once impossible to find, always worth the effort. A certified American stout legend.',
    flavorTags: ['Barrel-Aged', 'Coffee', 'Chocolate', 'Vanilla', 'Boozy', 'Complex'],
    foodPairings: [
      'Bourbon-soaked bread pudding',
      'Smoked brisket with dark coffee rub',
      'Chocolate hazelnut torte',
      'Aged Stilton with walnut bread',
    ],
  },
  {
    slug: 'founders-all-day-ipa',
    description:
      'All Day IPA answered the question nobody thought had a good answer: can a 4.7% beer actually taste like a full-flavored IPA? Turns out, yes. Generously hopped with Centennial, Cascade, and Simcoe, it delivers real hop character — citrus, floral, pine — without the weight. It\'s the session IPA that set the standard for every one that followed.',
    flavorTags: ['Citrus', 'Floral', 'Pine', 'Crisp', 'Sessionable', 'Crushable'],
    foodPairings: [
      'Backyard cheeseburgers off the grill',
      'Hummus and vegetable platter',
      'Fried pickle spears',
      'Grilled chicken tacos with avocado',
    ],
  },
  {
    slug: 'founders-centennial-ipa',
    description:
      'Centennial IPA is Founders\' ode to the hop that shares its name — and what an ode it is. Floral, citrusy, and resinous with a caramel malt sweetness that gives the bitterness something to lean on, this is a no-nonsense IPA with serious credentials. It doesn\'t chase trends; it just sits there being excellent, year after year.',
    flavorTags: ['Citrus', 'Floral', 'Caramel', 'Bitter', 'Pine', 'Crisp'],
    foodPairings: [
      'BBQ pulled pork sliders',
      'Thai green curry with chicken',
      'Sharp cheddar with hot pepper jelly',
      'Grilled asparagus with lemon zest',
    ],
  },
  {
    slug: 'founders-dirty-bastard',
    description:
      'Dirty Bastard doesn\'t apologize for what it is — a big, malty, unapologetically rich Scotch ale that wraps you in a blanket of toffee, dark fruit, and smoky caramel. At 8.5%, it drinks warming and round, with a subtle peatiness that nods to its Scottish roots without ever losing its Grand Rapids identity. A cold-weather essential.',
    flavorTags: ['Toffee', 'Caramel', 'Smoked', 'Boozy', 'Sweet', 'Complex'],
    foodPairings: [
      'Shepherd\'s pie with lamb',
      'Scotch eggs with spicy mustard',
      'Smoked cheddar and onion soup',
      'Sticky toffee pudding',
    ],
  },

  // ============================================================
  // GREAT NOTION
  // ============================================================
  {
    slug: 'great-notion-double-stack',
    description:
      'Double Stack is the pastry stout that started a movement in Portland. This imperial stout is brewed with maple syrup, coffee, and vanilla to taste like a stack of pancakes drowned in butter and syrup — and somehow, impossibly, it works. Rich, sweet, and dessert-forward, it\'s breakfast fantasy turned liquid reality at 12% ABV.',
    flavorTags: ['Coffee', 'Vanilla', 'Sweet', 'Smooth', 'Boozy', 'Lactose'],
    foodPairings: [
      'Maple-bacon donuts',
      'Buttermilk waffles with whipped cream',
      'Peanut butter cup cheesecake',
      'Cinnamon-sugar French toast',
    ],
  },
  {
    slug: 'great-notion-juice-jr',
    description:
      'Juice Jr. packs all of Great Notion\'s hazy expertise into a 4.5% package that refuses to compromise on flavor. Bursting with peach, mango, and tangerine, it\'s pillowy-soft and impossibly aromatic for a session beer. This is the juice box for adults — low ABV, big flavor, zero guilt about reaching for a second.',
    flavorTags: ['Tropical', 'Citrus', 'Juicy', 'Smooth', 'Crushable', 'Sessionable'],
    foodPairings: [
      'Poke bowl with mango and avocado',
      'Grilled chicken satay with peanut sauce',
      'Fresh spring rolls with sweet chili dip',
      'Citrus-dressed arugula salad',
    ],
  },
  {
    slug: 'great-notion-blueberry-muffin',
    description:
      'Blueberry Muffin is one of those beers that makes you question everything you thought you knew about sours. It tastes exactly like its name — fresh blueberries, vanilla cake batter, and a gentle tartness that mimics the tang of a fresh-from-the-oven muffin. Playful, creative, and genuinely delicious. Great Notion at its most inspired.',
    flavorTags: ['Fruit', 'Sour', 'Tart', 'Vanilla', 'Lactose', 'Sweet'],
    foodPairings: [
      'Blueberry lemon scones',
      'Vanilla bean panna cotta with berry compote',
      'Cream cheese-stuffed French toast',
      'Fresh fruit tart with pastry cream',
    ],
  },

  // ============================================================
  // HALF ACRE
  // ============================================================
  {
    slug: 'half-acre-daisy-cutter',
    description:
      'Daisy Cutter is Chicago\'s pale ale — the one that proved the city could hold its own in the craft beer arms race. Aggressively hopped for a pale ale, it delivers punchy citrus, tropical, and resinous pine notes over a lean malt body. Dry, snappy, and unapologetically bitter, it\'s the beer that put Half Acre on the map and stayed on the table.',
    flavorTags: ['Citrus', 'Pine', 'Tropical', 'Bitter', 'Dry', 'Crisp'],
    foodPairings: [
      'Chicago-style Italian beef sandwich',
      'Spicy pepperoni and sausage pizza',
      'Beer-battered cheese curds',
      'Grilled kielbasa with sauerkraut',
    ],
  },
  {
    slug: 'half-acre-gone-away',
    description:
      'Gone Away is Half Acre\'s full-throttle IPA — dank, resinous, and loaded with citrus and tropical fruit. It pushes the boundary between bitter and fruity without losing sight of balance, and the firm malt backbone gives the hops a runway to really take off. If Daisy Cutter is the gateway, Gone Away is the destination.',
    flavorTags: ['Dank', 'Citrus', 'Tropical', 'Resinous', 'Bitter', 'Crisp'],
    foodPairings: [
      'Korean fried chicken with gochujang',
      'Smoked turkey and avocado wrap',
      'Jalapeño cheddar cornbread',
      'Grilled shrimp with garlic butter',
    ],
  },
  {
    slug: 'half-acre-bodem',
    description:
      'Bodem is Half Acre\'s study in hop nuance — an IPA that favors aroma and drinkability over raw bitterness. Bright citrus and stone fruit notes float above a clean, medium body, making it the kind of IPA you can session without fatigue. It\'s not trying to blow your palate apart; it\'s trying to keep you coming back. It succeeds.',
    flavorTags: ['Citrus', 'Floral', 'Crisp', 'Juicy', 'Smooth', 'Crushable'],
    foodPairings: [
      'Grilled chicken pesto sandwich',
      'White cheddar and apple grilled cheese',
      'Shrimp ceviche with tortilla chips',
      'Mediterranean grain bowl',
    ],
  },

  // ============================================================
  // HILL FARMSTEAD
  // ============================================================
  {
    slug: 'hill-farmstead-edward',
    description:
      'Edward, named for founder Shaun Hill\'s grandfather, is a pale ale that transcends its category. Brewed with American hops and English malt, it delivers luminous citrus, floral, and stone fruit notes with a pillowy softness that makes you wonder how something this delicate can also be this flavorful. A beer of uncommon grace from Vermont\'s most revered farmstead.',
    flavorTags: ['Citrus', 'Floral', 'Biscuit', 'Smooth', 'Crisp', 'Juicy'],
    foodPairings: [
      'Farm-fresh chèvre with wildflower honey',
      'Pan-roasted chicken with tarragon',
      'Heirloom tomato and basil salad',
      'Grilled peach and prosciutto flatbread',
    ],
  },
  {
    slug: 'hill-farmstead-abner',
    description:
      'Named for Shaun Hill\'s great-grandfather, Abner is a double IPA that embodies everything Hill Farmstead stands for — restraint, balance, and an almost spiritual devotion to hop character. Tropical fruit, citrus zest, and pine weave through a soft, full body that somehow feels effortless at 8.2%. It\'s the rare DIPA where elegance outshines power.',
    flavorTags: ['Tropical', 'Citrus', 'Pine', 'Smooth', 'Juicy', 'Complex'],
    foodPairings: [
      'Herb-crusted rack of lamb',
      'Grilled lobster tail with drawn butter',
      'Aged Comté with dried apricots',
      'Seared scallops with citrus beurre blanc',
    ],
  },
  {
    slug: 'hill-farmstead-ann',
    description:
      'Ann is Hill Farmstead\'s tribute to Shaun\'s grandmother — a farmhouse ale fermented with the house saison yeast that captures the pastoral spirit of Greensboro, Vermont. Dry, peppery, and effervescent, with lemon zest and wildflower aromatics, it tastes like a sun-warmed field after rain. Elegant and alive in a way only farmstead brewing can achieve.',
    flavorTags: ['Farmhouse', 'Pepper', 'Dry', 'Citrus', 'Floral', 'Crisp'],
    foodPairings: [
      'Roasted chicken with herbs de Provence',
      'Grilled asparagus with shaved Parmesan',
      'Fresh goat cheese crostini with fig jam',
      'Pan-seared trout with brown butter',
    ],
  },
  {
    slug: 'hill-farmstead-society-solitude-5',
    description:
      'Society & Solitude #5 is Hill Farmstead\'s Galaxy-hopped double IPA — and it\'s a stunner. Galaxy hops bring intense passion fruit, peach, and citrus zest to a soft, creamy body that drinks like a tropical daydream. At 8%, it balances hop intensity with drinkability in a way that only Hill Farmstead seems to consistently nail.',
    flavorTags: ['Tropical', 'Citrus', 'Juicy', 'Smooth', 'Dank', 'Complex'],
    foodPairings: [
      'Grilled mahi-mahi with passion fruit salsa',
      'Brie and mango chutney crostini',
      'Coconut curry with prawns',
      'Citrus-glazed duck breast',
    ],
  },

  // ============================================================
  // JESTER KING
  // ============================================================
  {
    slug: 'jester-king-atrial-rubicite',
    description:
      'Atrial Rubicite is Jester King\'s masterwork — a wild ale refermented with raspberries that captures the terroir of the Texas Hill Country in every sip. Bracingly tart, bone-dry, and awash in fresh raspberry character without a trace of sweetness, it\'s one of the finest American wild ales ever produced. The kind of beer that converts skeptics and silences cynics.',
    flavorTags: ['Sour', 'Tart', 'Fruit', 'Funk', 'Dry', 'Complex'],
    foodPairings: [
      'Aged goat cheese with raspberry preserves',
      'Seared duck breast with berry gastrique',
      'Dark chocolate and raspberry truffles',
      'Grilled quail with pomegranate molasses',
    ],
  },
  {
    slug: 'jester-king-le-petit-prince',
    description:
      'Le Petit Prince proves that table beers deserve a seat at the big table. At just 2.9%, this farmhouse-inspired session ale is dry, peppery, and refreshingly tart with notes of lemon, fresh hay, and wildflowers. It\'s the beer you drink all afternoon in the Texas sun without missing a beat — maximum flavor, minimum consequence.',
    flavorTags: ['Farmhouse', 'Pepper', 'Dry', 'Crisp', 'Sessionable', 'Tart'],
    foodPairings: [
      'Grilled chicken with lemon and olive oil',
      'Goat cheese and herb salad',
      'Smoked fish dip with crackers',
      'Fresh summer rolls with dipping sauce',
    ],
  },
  {
    slug: 'jester-king-spon',
    description:
      'SPON is Jester King\'s venture into spontaneous fermentation — beer brewed in a coolship exposed to the wild Hill Country air, then aged in oak barrels for years. The result is a bracingly acidic, bone-dry, and deeply complex ale with notes of green apple, sourdough, and barnyard funk. It\'s a radical act of patience that tastes like place itself.',
    flavorTags: ['Sour', 'Funk', 'Dry', 'Brett', 'Complex', 'Tart'],
    foodPairings: [
      'Oysters with champagne mignonette',
      'Aged Manchego with membrillo',
      'Charcuterie with cornichons and whole-grain mustard',
      'Grilled octopus with lemon and olive oil',
    ],
  },

  // ============================================================
  // LAGUNITAS
  // ============================================================
  {
    slug: 'lagunitas-ipa',
    description:
      'Lagunitas IPA is the people\'s IPA — the one that showed up at every house party, barbecue, and late-night jam session for two decades running. Hoppy, malty, and carrying a signature caramel sweetness that balances its piney, citrusy bitterness, it\'s never trying to be the coolest beer in the room. It just is.',
    flavorTags: ['Pine', 'Citrus', 'Caramel', 'Bitter', 'Crisp', 'Herbal'],
    foodPairings: [
      'Backyard burgers with all the fixings',
      'Spicy chicken wings',
      'Monterey Jack nachos with jalapeños',
      'Smoked sausage with whole-grain mustard',
    ],
  },
  {
    slug: 'lagunitas-little-sumpin',
    description:
      'A Little Sumpin\' Sumpin\' is exactly that — a little wheat, a little hop, a lot of character. This wheat IPA walks the line between the softness of a hefeweizen and the bite of an IPA, delivering tropical fruit, citrus, and a bready, pillowy body. At 7.5%, it\'s got more muscle than it lets on. The stealth bomber of the Lagunitas lineup.',
    flavorTags: ['Tropical', 'Citrus', 'Bread', 'Juicy', 'Smooth', 'Bitter'],
    foodPairings: [
      'Teriyaki chicken bowl with rice',
      'Grilled shrimp tacos with slaw',
      'Soft pretzels with beer cheese',
      'Hawaiian poke bowl',
    ],
  },
  {
    slug: 'lagunitas-maximus',
    description:
      'Maximus is Lagunitas turned up to 11 — an imperial IPA that doubles down on everything the flagship does well. More hops, more malt, more body, more everything. Expect intense citrus, resinous pine, and a chewy caramel backbone that keeps the 8.2% warmth in check. It\'s not subtle, and it\'s not trying to be.',
    flavorTags: ['Citrus', 'Pine', 'Resinous', 'Caramel', 'Bitter', 'Boozy'],
    foodPairings: [
      'Double bacon cheeseburger',
      'Jamaican jerk pork',
      'Extra-sharp cheddar with hot pepper jelly',
      'Lamb vindaloo',
    ],
  },

  // ============================================================
  // LEFT HAND
  // ============================================================
  {
    slug: 'left-hand-milk-stout-nitro',
    description:
      'Left Hand\'s Milk Stout Nitro changed the game by putting a nitrogen widget in a bottle — no draft system required. The pour cascades like a miniature thunderstorm, settling into a creamy, chocolatey, silky stout with lactose sweetness and a pillowy head that lingers for days. It\'s liquid dessert with the texture of a cloud, and it made nitro accessible to everyone.',
    flavorTags: ['Chocolate', 'Lactose', 'Smooth', 'Sweet', 'Coffee', 'Roast'],
    foodPairings: [
      'Chocolate lava cake with vanilla ice cream',
      'Coffee-rubbed filet mignon',
      'Salted caramel brownies',
      'Roasted mushroom and truffle risotto',
    ],
  },
  {
    slug: 'left-hand-sawtooth',
    description:
      'Sawtooth is an ESB — Extra Special Bitter — and Left Hand nails the style with the kind of quiet confidence that earns respect without demanding attention. Nutty, biscuity, and gently bitter with a toasty caramel warmth, it\'s a British-inspired pub classic reimagined in the Colorado Rockies. Understated and absolutely sessionable.',
    flavorTags: ['Biscuit', 'Caramel', 'Nutty', 'Bitter', 'Smooth', 'Sessionable'],
    foodPairings: [
      'Classic fish and chips with malt vinegar',
      'Ploughman\'s lunch with pickles and cheese',
      'Roast chicken with root vegetables',
      'Cheddar and ale soup',
    ],
  },
  {
    slug: 'left-hand-fade-to-black',
    description:
      'Fade to Black is a schwarzbier — a German-style black lager — and it\'s a masterclass in defying expectations. Despite its inky appearance, it drinks surprisingly light and crisp, with delicate notes of dark chocolate, espresso, and toasted bread. Clean lager fermentation keeps everything snappy and refreshing. The dark beer that drinks like a lager because it is one.',
    flavorTags: ['Roast', 'Chocolate', 'Coffee', 'Crisp', 'Dry', 'Smooth'],
    foodPairings: [
      'Bratwurst with spicy mustard and sauerkraut',
      'Black bean soup with sour cream',
      'Grilled portobello mushroom caps',
      'German chocolate cake',
    ],
  },

  // ============================================================
  // MAINE BEER COMPANY
  // ============================================================
  {
    slug: 'maine-beer-lunch',
    description:
      'Lunch is the IPA that put Freeport, Maine on the beer map — and kept it there. Clean, balanced, and loaded with Simcoe, Amarillo, Centennial, and Warrior hops, it delivers citrus, tropical fruit, and a hint of pine with a dry, clean finish that practically begs for another sip. Named for a now-departed whale, it\'s become an icon in its own right.',
    flavorTags: ['Citrus', 'Tropical', 'Pine', 'Crisp', 'Dry', 'Bitter'],
    foodPairings: [
      'Lobster roll on a buttered split-top bun',
      'Grilled swordfish with herb butter',
      'Aged Cabot cheddar with crackers',
      'Pan-seared haddock with lemon caper sauce',
    ],
  },
  {
    slug: 'maine-beer-dinner',
    description:
      'If Lunch is the perfect IPA, Dinner is the perfect double IPA. Intensely aromatic with tropical fruit, stone fruit, and resinous pine, it manages to stay remarkably drinkable at 8.1%. The malt is just present enough to keep things grounded while the hops soar. It\'s released in limited runs, and the frenzy every time is entirely justified.',
    flavorTags: ['Tropical', 'Pine', 'Citrus', 'Resinous', 'Bitter', 'Complex'],
    foodPairings: [
      'Grilled bone-in ribeye',
      'Thai red curry with duck',
      'Truffle fries with Parmesan',
      'Blue cheese and pear salad with candied walnuts',
    ],
  },
  {
    slug: 'maine-beer-peeper',
    description:
      'Peeper is Maine Beer Company\'s pale ale — bright, sessionable, and brimming with the kind of hop-forward character that makes you forget it\'s only 5.5%. Citrus, floral, and lightly fruity with a clean malt base, it embodies the "Do What\'s Right" philosophy printed on every bottle. Simple, honest, and beautifully made.',
    flavorTags: ['Citrus', 'Floral', 'Crisp', 'Biscuit', 'Crushable', 'Sessionable'],
    foodPairings: [
      'Grilled salmon with dill',
      'Caprese panini on ciabatta',
      'Maine blueberry salad with goat cheese',
      'Fried clam strips with tartar sauce',
    ],
  },

  // ============================================================
  // MODERN TIMES
  // ============================================================
  {
    slug: 'modern-times-orderville',
    description:
      'Orderville is Modern Times\' flagship hazy IPA, and it\'s a textbook example of the style done right. Mosaic and Citra hops deliver a torrent of mango, tangerine, and stone fruit through a soft, oat-laden body that coats the palate like velvet. Juicy without being sweet, hazy without being sloppy — a haze-forward IPA with serious pedigree.',
    flavorTags: ['Tropical', 'Citrus', 'Juicy', 'Smooth', 'Dank', 'Crisp'],
    foodPairings: [
      'Banh mi sandwich with pickled vegetables',
      'Mango habanero ceviche',
      'Fried avocado tacos',
      'Grilled peach and arugula salad',
    ],
  },
  {
    slug: 'modern-times-blazing-world',
    description:
      'Blazing World is the amber ale that refuses to stay in its lane. Heavily hopped with Nelson Sauvin, Simcoe, and Mosaic, it pairs a rich, toasty malt backbone with white wine, tropical fruit, and dank resin hop character. The result is a hybrid that doesn\'t really fit any category — and that\'s exactly the point. Bold, malty, and hopped to the heavens.',
    flavorTags: ['Caramel', 'Tropical', 'Dank', 'Resinous', 'Bitter', 'Complex'],
    foodPairings: [
      'Smoked brisket with tangy BBQ sauce',
      'Aged Gouda with dark honey',
      'Lamb sliders with feta and tzatziki',
      'Roasted sweet potato and black bean tacos',
    ],
  },
  {
    slug: 'modern-times-black-house',
    description:
      'Black House is the oatmeal coffee stout that Modern Times built its reputation on — silky, rich, and brewed with their own in-house roasted beans. Expect velvety layers of cold-brew coffee, dark chocolate, and a subtle oat creaminess that makes every sip feel luxurious. At 5.8%, it\'s remarkably sessionable for something this flavorful. Your morning routine wishes it tasted this good.',
    flavorTags: ['Coffee', 'Chocolate', 'Smooth', 'Roast', 'Sweet', 'Crisp'],
    foodPairings: [
      'Chocolate croissant',
      'Espresso-glazed donuts',
      'Brie and dark chocolate crostini',
      'Coffee-rubbed pork chops',
    ],
  },

  // ============================================================
  // MONTAUK
  // ============================================================
  {
    slug: 'montauk-summer-ale',
    description:
      'Montauk Summer Ale is the taste of the Long Island shore — golden, breezy, and effortlessly drinkable. This wheat ale has a soft body with hints of citrus and honey, designed for boardwalk afternoons and sunset sessions. It\'s not trying to be complex; it\'s trying to be the beer in your hand when the day is perfect. Mission accomplished.',
    flavorTags: ['Bread', 'Citrus', 'Honey', 'Crisp', 'Crushable', 'Smooth'],
    foodPairings: [
      'Fried clam strips with lemon',
      'Grilled corn on the cob with butter',
      'Lobster salad on a brioche roll',
      'Fresh fruit with whipped cream',
    ],
  },
  {
    slug: 'montauk-pilsner',
    description:
      'Montauk Pilsner is clean, bright, and honest — a European-style pils with noble hop spice and a cracker-dry finish that makes it perfect for drinking by the half dozen. No tricks, no gimmicks, just golden lager done with care. It\'s the kind of beer that reminds you why the simplest styles are often the hardest to master.',
    flavorTags: ['Crisp', 'Herbal', 'Bread', 'Dry', 'Bitter', 'Sessionable'],
    foodPairings: [
      'Steamed lobster with drawn butter',
      'Grilled chicken Caesar salad',
      'Fried calamari with marinara',
      'Classic New York-style hot dog',
    ],
  },
  {
    slug: 'montauk-wave-chaser',
    description:
      'Wave Chaser is Montauk\'s IPA — citrus-forward, medium-bodied, and built for the kind of people who want hop flavor without hop exhaustion. Bright grapefruit and orange peel notes ride a clean malt base, and the finish is dry enough to keep you paddling back for more. Approachable, flavorful, and as refreshing as the first wave of the morning.',
    flavorTags: ['Citrus', 'Pine', 'Crisp', 'Bitter', 'Dry', 'Crushable'],
    foodPairings: [
      'Fish and chips with malt vinegar',
      'Grilled shrimp with old bay',
      'Buffalo chicken pizza',
      'Crab cake sliders with remoulade',
    ],
  },

  // ============================================================
  // NEW BELGIUM
  // ============================================================
  {
    slug: 'new-belgium-fat-tire',
    description:
      'Fat Tire is the beer that launched a revolution from a basement in Fort Collins. This amber ale rides on a biscuity, toasty malt backbone with gentle caramel sweetness and a touch of fruity yeast character — approachable, balanced, and endlessly nostalgic. It may not be the trendiest beer anymore, but it\'s still the one that introduced millions to craft.',
    flavorTags: ['Biscuit', 'Caramel', 'Smooth', 'Bread', 'Sweet', 'Crushable'],
    foodPairings: [
      'Grilled portobello mushroom burger',
      'Roasted butternut squash soup',
      'Smoked turkey and brie sandwich',
      'Apple crisp with vanilla ice cream',
    ],
  },
  {
    slug: 'new-belgium-voodoo-ranger',
    description:
      'Voodoo Ranger is New Belgium\'s hop-forward flagship — a punchy, juicy IPA that swings with tropical fruit, citrus peel, and a touch of dank, piney bitterness. It\'s bold enough for hop enthusiasts and approachable enough for newcomers, which is exactly why it\'s become one of the bestselling IPAs in America. The skeleton on the label doesn\'t lie.',
    flavorTags: ['Tropical', 'Citrus', 'Dank', 'Bitter', 'Juicy', 'Crisp'],
    foodPairings: [
      'Spicy buffalo wings',
      'Carnitas tacos with salsa verde',
      'Pepper jack grilled cheese',
      'Tandoori chicken skewers',
    ],
  },
  {
    slug: 'new-belgium-la-folie',
    description:
      'La Folie — "the folly" — is New Belgium\'s wood-aged sour brown ale, blended from barrels aged one to three years in massive oak foeders. Bracingly tart with layers of green apple, cherry, balsamic vinegar, and dark caramel, it\'s a Flanders-style oud bruin that proves American brewers can play in the most traditional Belgian sandbox. Stunning acidity, stunning complexity.',
    flavorTags: ['Sour', 'Tart', 'Caramel', 'Fruit', 'Complex', 'Barrel-Aged'],
    foodPairings: [
      'Duck confit with cherry reduction',
      'Blue cheese and walnut salad',
      'Dark chocolate and raspberry tart',
      'Charcuterie with grain mustard and pickles',
    ],
  },

  // ============================================================
  // ODELL
  // ============================================================
  {
    slug: 'odell-ipa',
    description:
      'Odell IPA is a Colorado staple — a bright, punchy IPA with a West Coast soul and a Rocky Mountain address. Cascade, Centennial, and Chinook hops deliver classic grapefruit, pine, and floral notes over a light malt body that keeps things crisp and drinkable. It\'s the kind of reliable IPA that anchors a brewery\'s reputation. Fort Collins done right.',
    flavorTags: ['Citrus', 'Pine', 'Floral', 'Bitter', 'Crisp', 'Dry'],
    foodPairings: [
      'Green chile cheeseburger',
      'Grilled trout with lemon',
      'Spicy Thai peanut noodles',
      'Sharp cheddar and jalapeño poppers',
    ],
  },
  {
    slug: 'odell-90-shilling',
    description:
      'Odell\'s 90 Shilling is a Scottish-style amber ale that\'s been a Colorado taproom staple for decades. Toasty, caramelly, and gently sweet with notes of toffee and bread crust, it\'s the kind of beer that pairs with literally everything and offends absolutely no one. Reliable, comforting, and quietly excellent — the flannel shirt of craft beer.',
    flavorTags: ['Caramel', 'Toffee', 'Bread', 'Smooth', 'Sweet', 'Sessionable'],
    foodPairings: [
      'Smoked cheddar and ale soup',
      'BBQ pulled pork sandwich',
      'Roasted root vegetable medley',
      'Soft pretzels with honey mustard',
    ],
  },
  {
    slug: 'odell-drumroll',
    description:
      'Drumroll is Odell\'s take on the hazy pale ale — unfiltered, aromatic, and bursting with fresh citrus and tropical fruit character. At 5.3%, it\'s session-friendly and approachable, with a soft, pillowy body that makes the hop flavors pop. It\'s the kind of beer that needs no drumroll to make an entrance — it wins the room on flavor alone.',
    flavorTags: ['Tropical', 'Citrus', 'Juicy', 'Smooth', 'Crushable', 'Sessionable'],
    foodPairings: [
      'Fish tacos with mango slaw',
      'Grilled chicken with chimichurri',
      'Brie and apricot jam crostini',
      'Fresh spring rolls with peanut dipping sauce',
    ],
  },

  // ============================================================
  // OSKAR BLUES
  // ============================================================
  {
    slug: 'oskar-blues-dales-pale-ale',
    description:
      'Dale\'s Pale Ale was the first craft beer ever canned, and it set the standard that every can to follow has chased. Big, bold, and aggressively hopped for a pale ale, it delivers citrus, floral, and piney hop notes with enough malt backbone to keep things interesting. It proved that great beer doesn\'t need glass — it just needs guts.',
    flavorTags: ['Citrus', 'Floral', 'Pine', 'Caramel', 'Bitter', 'Crisp'],
    foodPairings: [
      'Smoked pulled pork sliders',
      'Grilled bratwurst with spicy mustard',
      'Jalapeño-cheddar cornbread',
      'BBQ chicken flatbread',
    ],
  },
  {
    slug: 'oskar-blues-mamas-little-yella-pils',
    description:
      'Mama\'s Little Yella Pils is the craft pilsner that proved American brewers could master European restraint. Bright, crisp, and beautifully hopped with Saaz, it delivers the classic spicy, herbal, and floral pilsner character with a cracker-dry finish. At 5.3%, it\'s pure liquid refreshment — no frills, no fillers, just precision brewing in a can.',
    flavorTags: ['Herbal', 'Crisp', 'Bread', 'Spicy Hop', 'Dry', 'Sessionable'],
    foodPairings: [
      'Schnitzel with lemon wedge',
      'Grilled bratwurst with sauerkraut',
      'Margherita pizza',
      'Steamed mussels in white wine',
    ],
  },
  {
    slug: 'oskar-blues-ten-fidy',
    description:
      'Ten FIDY hits 10.5% and looks like it could patch a tire. This imperial stout is absurdly thick, pouring motor-oil black with flavors of dark chocolate fudge, espresso, molasses, and brown sugar. It\'s rich enough to eat with a spoon, but somehow stays smooth enough to sip. The name references the original gravity — 1.050 it ain\'t.',
    flavorTags: ['Chocolate', 'Coffee', 'Roast', 'Sweet', 'Boozy', 'Smooth'],
    foodPairings: [
      'Flourless chocolate cake',
      'Slow-smoked beef brisket',
      'Espresso-rubbed pork ribs',
      'Caramel and sea salt ice cream',
    ],
  },

  // ============================================================
  // OTHER HALF
  // ============================================================
  {
    slug: 'other-half-green-city',
    description:
      'Green City is Other Half\'s ode to Brooklyn — a hazy IPA that captures the borough\'s creative energy in liquid form. Mosaic and Citra hops deliver a surge of tropical fruit, peach, and citrus through a soft, pillowy body. It\'s big on aroma, smooth on the palate, and finishes clean enough to keep the conversation going. Pure New York haze.',
    flavorTags: ['Tropical', 'Citrus', 'Juicy', 'Smooth', 'Dank', 'Crisp'],
    foodPairings: [
      'Spicy chicken over rice from a halal cart',
      'New York-style pepperoni pizza slice',
      'Korean BBQ tacos',
      'Everything bagel with lox and cream cheese',
    ],
  },
  {
    slug: 'other-half-ddh-all-citra-everything',
    description:
      'DDH All Citra Everything is exactly what the name promises — a double dry-hopped double IPA that goes all-in on Citra with zero subtlety and maximum impact. The result is an explosion of tangerine, mango, grapefruit, and papaya so intense it borders on a juice cleanse. At 8.5%, it\'s unapologetically hop-forward and proud of it. The haze that built an empire.',
    flavorTags: ['Citrus', 'Tropical', 'Juicy', 'Dank', 'Bitter', 'Complex'],
    foodPairings: [
      'Nashville hot chicken sandwich',
      'Spicy tuna roll with extra wasabi',
      'Jalapeño-cheddar soft pretzel',
      'Grilled jerk chicken with pineapple salsa',
    ],
  },
  {
    slug: 'other-half-dream-in-green',
    description:
      'Dream in Green is Other Half in its comfort zone — a hazy IPA brewed with their favorite hops and a soft, oat-heavy grain bill. Expect lush tropical fruit, tangerine peel, and a creamy mouthfeel that glides across the palate. It\'s less intense than their DDH offerings but every bit as accomplished. Sometimes the best dreams are the easiest ones.',
    flavorTags: ['Tropical', 'Citrus', 'Juicy', 'Smooth', 'Crushable', 'Dank'],
    foodPairings: [
      'Chicken shawarma wrap',
      'Mango and avocado sushi roll',
      'Grilled halloumi with roasted peppers',
      'Street-style elote with cotija cheese',
    ],
  },

  // ============================================================
  // PRAIRIE ARTISAN ALES
  // ============================================================
  {
    slug: 'prairie-bomb',
    description:
      'Prairie BOMB! is exactly what it sounds like — a flavor explosion of an imperial stout brewed with espresso beans, chocolate, vanilla, and ancho chili peppers. At 13%, it detonates on the palate with waves of dark chocolate, spice, and roasted coffee, finishing with a slow, creeping chili warmth. It\'s big, bold, and completely unhinged in the best way.',
    flavorTags: ['Coffee', 'Chocolate', 'Spiced', 'Vanilla', 'Boozy', 'Complex'],
    foodPairings: [
      'Mole enchiladas',
      'Espresso brownie sundae',
      'Smoked brisket with ancho chili rub',
      'Mexican hot chocolate flan',
    ],
  },
  {
    slug: 'prairie-noir',
    description:
      'Prairie Noir takes the imperial stout formula and ages it in bourbon barrels, adding layers of vanilla, oak, caramel, and a warming booziness that elevates an already complex base beer. Dark as midnight and rich as sin, it unravels slowly — chocolate, dried fruit, barrel char — rewarding patience with every sip. A meditation in barrel-aged darkness.',
    flavorTags: ['Barrel-Aged', 'Chocolate', 'Vanilla', 'Boozy', 'Complex', 'Roast'],
    foodPairings: [
      'Bourbon bread pudding with vanilla sauce',
      'Smoked duck with cherry glaze',
      'Dark chocolate truffles with sea salt',
      'Braised beef cheeks with red wine',
    ],
  },
  {
    slug: 'prairie-artisan-ale',
    description:
      'Prairie\'s namesake farmhouse ale is a sun-drenched saison that channels the wide-open Oklahoma plains. Dry, effervescent, and peppery with notes of citrus zest, fresh hay, and white grape, it\'s deceptively simple and endlessly drinkable. At 5.2%, it\'s built for long sessions and warm days — proof that Prairie does restraint as well as excess.',
    flavorTags: ['Farmhouse', 'Pepper', 'Citrus', 'Dry', 'Crisp', 'Sessionable'],
    foodPairings: [
      'Grilled chicken with herbed vinaigrette',
      'Goat cheese and honey crostini',
      'Fried okra with ranch',
      'Lemon and herb roasted vegetables',
    ],
  },

  // ============================================================
  // REVOLUTION
  // ============================================================
  {
    slug: 'revolution-anti-hero',
    description:
      'Anti-Hero is Revolution\'s flagship IPA and Chicago\'s liquid declaration of hop independence. Bright and bold with Centennial, Amarillo, and Citra hops delivering grapefruit, tropical fruit, and pine over a clean, supportive malt base. It\'s assertive without being aggressive, balanced without being boring. The people\'s IPA of the Midwest.',
    flavorTags: ['Citrus', 'Tropical', 'Pine', 'Bitter', 'Crisp', 'Dry'],
    foodPairings: [
      'Chicago deep-dish sausage pizza',
      'Spicy Italian beef with giardiniera',
      'Cheddar and jalapeño sausages',
      'Korean fried chicken',
    ],
  },
  {
    slug: 'revolution-fist-city',
    description:
      'Fist City is a pale ale with the heart of a Chicago brawler — punchy, quick, and surprisingly smooth. It leads with citrus and floral hop notes, backed by a biscuity malt sweetness that gives it just enough body to throw a proper punch. At 5.5%, it\'s sessionable enough for a full nine innings but flavorful enough to keep you interested through extras.',
    flavorTags: ['Citrus', 'Floral', 'Biscuit', 'Crisp', 'Crushable', 'Sessionable'],
    foodPairings: [
      'Chicago-style hot dog with all the fixings',
      'Beer-battered onion rings',
      'Grilled chicken and pesto flatbread',
      'Cheddar and apple slaw tacos',
    ],
  },
  {
    slug: 'revolution-deths-tar',
    description:
      'Deth\'s Tar is Revolution\'s Deep Wood series at its most formidable — a barrel-aged imperial oatmeal stout clocking in at 14.3% that pours like liquid obsidian. Expect a symphony of bourbon vanilla, dark chocolate, espresso, coconut, and charred oak, all wrapped in a silky, full-bodied embrace. It\'s a once-a-year indulgence that demands reverence.',
    flavorTags: ['Barrel-Aged', 'Chocolate', 'Vanilla', 'Coffee', 'Boozy', 'Complex'],
    foodPairings: [
      'Bourbon pecan pie with whipped cream',
      'Coffee-rubbed beef tenderloin',
      'Dark chocolate ganache tart',
      'Smoked gouda and fig preserves',
    ],
  },

  // ============================================================
  // RUSSIAN RIVER
  // ============================================================
  {
    slug: 'russian-river-pliny-the-elder',
    description:
      'Pliny the Elder didn\'t just set the standard for double IPAs — it created the category as we know it. Named for the Roman naturalist, this West Coast legend delivers waves of citrus, pine, and floral hops with a dry, clean finish that belies its 8% ABV. It\'s bracingly bitter, impeccably balanced, and still the benchmark against which every DIPA is measured.',
    flavorTags: ['Citrus', 'Pine', 'Floral', 'Bitter', 'Dry', 'Complex'],
    foodPairings: [
      'Garlic and herb roasted whole chicken',
      'Vietnamese banh mi with pickled daikon',
      'Aged white cheddar with fig jam',
      'Grilled lamb chops with rosemary',
    ],
  },
  {
    slug: 'russian-river-pliny-the-younger',
    description:
      'Pliny the Younger is the beer that makes people stand in line for hours in the rain — and nobody regrets it. This triple IPA takes Elder\'s blueprint and amplifies everything: more hops, more body, more complexity, yet somehow even more drinkable than a 10.25% beer has any right to be. Fresh, vibrant, and dangerously smooth. The annual release is a genuine cultural event.',
    flavorTags: ['Citrus', 'Pine', 'Tropical', 'Resinous', 'Bitter', 'Boozy'],
    foodPairings: [
      'Herb-crusted prime rib',
      'Dungeness crab with drawn butter',
      'Aged Manchego with Marcona almonds',
      'Thai basil chicken stir-fry',
    ],
  },
  {
    slug: 'russian-river-blind-pig',
    description:
      'Blind Pig is the IPA that Vinnie Cilurzo brewed before Pliny — and purists will argue it\'s just as essential. At 6.1%, it\'s leaner and more sessionable, with a West Coast dryness and bright citrus, herbal, and pine hop character that showcases the style at its most refined. If Pliny is the spectacle, Blind Pig is the craft.',
    flavorTags: ['Citrus', 'Pine', 'Herbal', 'Bitter', 'Dry', 'Crisp'],
    foodPairings: [
      'Sonoma goat cheese and olive tapenade',
      'Grilled chicken with lemon and capers',
      'Pan-seared halibut with herb salsa verde',
      'Wood-fired pizza with arugula and prosciutto',
    ],
  },
  {
    slug: 'russian-river-supplication',
    description:
      'Supplication is Russian River\'s wild ale aged in Pinot Noir barrels with sour cherries — a beer that bridges the gap between wine and wild fermentation. Tart, fruity, and deeply complex, with layers of cherry, oak, vanilla, and a vinous acidity that speaks to its barrel heritage. It\'s patient, elegant, and utterly unique. A quiet masterpiece from the kings of California sour.',
    flavorTags: ['Sour', 'Fruit', 'Barrel-Aged', 'Tart', 'Complex', 'Funk'],
    foodPairings: [
      'Seared duck breast with cherry port sauce',
      'Aged Humboldt Fog goat cheese',
      'Dark chocolate cherry bark-thins',
      'Grilled lamb with rosemary and balsamic reduction',
    ],
  },

  // ============================================================
  // SIERRA NEVADA
  // ============================================================
  {
    slug: 'sierra-nevada-pale-ale',
    description:
      'Sierra Nevada Pale Ale is the Big Bang of American craft beer. First brewed in 1980, it introduced the world to Cascade hops and single-handedly defined what a pale ale could be — piney, citrusy, and beautifully balanced with a clean caramel malt backbone. Four decades later, it\'s still the measuring stick. Not just a great beer — a historic one.',
    flavorTags: ['Pine', 'Citrus', 'Floral', 'Biscuit', 'Bitter', 'Crisp'],
    foodPairings: [
      'Classic cheeseburger with lettuce and tomato',
      'Grilled chicken with herb marinade',
      'Pepper jack and avocado quesadilla',
      'Roasted vegetable pasta with pesto',
    ],
  },
  {
    slug: 'sierra-nevada-torpedo',
    description:
      'Torpedo gets its name from the hop torpedo — a device Sierra Nevada invented to extract maximum hop flavor without excessive bitterness. The result is an extra IPA that\'s explosively aromatic with citrus, pine, and tropical notes while staying remarkably smooth and balanced. Innovation meets drinkability. The torpedo hit its target.',
    flavorTags: ['Citrus', 'Pine', 'Tropical', 'Resinous', 'Bitter', 'Crisp'],
    foodPairings: [
      'Blackened Cajun catfish',
      'Grilled chicken wings with mango hot sauce',
      'Spicy Thai peanut satay',
      'Sharp cheddar with whole-grain mustard',
    ],
  },
  {
    slug: 'sierra-nevada-celebration',
    description:
      'Celebration is the holiday beer that hop heads wait all year for. Brewed exclusively with fresh, wet hops straight from the harvest, it delivers a raw, vibrant hop character — bright pine, citrus, and herbal notes — that you simply cannot get from dried hops. Each vintage is slightly different, and that\'s part of the magic. The most wonderful time of the beer year.',
    flavorTags: ['Pine', 'Citrus', 'Herbal', 'Bitter', 'Crisp', 'Complex'],
    foodPairings: [
      'Herb-roasted turkey with cranberry sauce',
      'Glazed holiday ham',
      'Aged Gruyere with walnuts and honey',
      'Rosemary-garlic prime rib',
    ],
  },
  {
    slug: 'sierra-nevada-bigfoot',
    description:
      'Bigfoot is Sierra Nevada\'s barleywine — a massive, malty, hop-forward beast that blurs the line between beer and liquid bread. Fresh, it\'s aggressively bitter with caramel, dark fruit, and resinous pine. Aged, it mellows into toffee, sherry, and dried fruit complexity that rivals vintage port. One of the original American barleywines, and still one of the best.',
    flavorTags: ['Caramel', 'Resinous', 'Toffee', 'Boozy', 'Bitter', 'Complex'],
    foodPairings: [
      'Aged Stilton with port reduction',
      'Braised short ribs with red wine',
      'Dark fruit cake',
      'Roasted bone marrow with toast and parsley',
    ],
  },
  {
    slug: 'sierra-nevada-hazy-little-thing',
    description:
      'Hazy Little Thing is Sierra Nevada\'s entry into the haze game — and it landed with a splash. Unfiltered, unprocessed, and loaded with Citra, El Dorado, and Magnum hops, it delivers a juicy hit of tropical fruit and citrus with a soft, approachable body. It brought the hazy style to every grocery store in America, and did it without sacrificing quality. Democratized haze.',
    flavorTags: ['Tropical', 'Citrus', 'Juicy', 'Smooth', 'Crushable', 'Crisp'],
    foodPairings: [
      'Fish tacos with cilantro-lime crema',
      'Grilled chicken satay',
      'Caprese flatbread',
      'Coconut shrimp with sweet chili glaze',
    ],
  },

  // ============================================================
  // STONE
  // ============================================================
  {
    slug: 'stone-ipa',
    description:
      'Stone IPA is the West Coast IPA that refused to compromise. Bracingly bitter, pine-forward, and dry as the San Diego desert that birthed it, it\'s been the gatekeeper of hoppy beer for over two decades. Citrus and floral hop notes balance the assertive bitterness, and the clean malt bill gets out of the hops\' way entirely. Unapologetically bold since \'97.',
    flavorTags: ['Pine', 'Citrus', 'Bitter', 'Dry', 'Floral', 'Crisp'],
    foodPairings: [
      'Carne asada fries',
      'Thai red curry with tofu',
      'Pepper jack and jalapeño burger',
      'Grilled swordfish with salsa verde',
    ],
  },
  {
    slug: 'stone-enjoy-by',
    description:
      'Enjoy By is Stone\'s love letter to freshness — a double IPA with a drink-by date printed right on the bottle because this beer was made to be consumed at peak hop intensity. Bright, explosive citrus and tropical fruit hit the palate like a freight train of flavor, and the 9.4% ABV hides behind sheer hop power. Procrastinators need not apply.',
    flavorTags: ['Citrus', 'Tropical', 'Bitter', 'Pine', 'Juicy', 'Boozy'],
    foodPairings: [
      'Spicy chicken tikka masala',
      'Grilled pineapple and jalapeño burger',
      'Habanero pepper jack nachos',
      'Szechuan kung pao shrimp',
    ],
  },
  {
    slug: 'stone-arrogant-bastard',
    description:
      'Arrogant Bastard doesn\'t care if you like it — and that attitude is printed right on the label. This strong ale is malty, hoppy, and complex in a way that defies easy categorization. Rich caramel, dark fruit, and piney hop bitterness collide with a boozy warmth that dares you to keep up. It\'s not for everyone, and it\'s proud of that fact.',
    flavorTags: ['Caramel', 'Pine', 'Bitter', 'Boozy', 'Complex', 'Roast'],
    foodPairings: [
      'Smoked prime rib',
      'Dark chocolate and chipotle bark',
      'Aged cheddar with caramelized onion jam',
      'Lamb meatballs with harissa',
    ],
  },
  {
    slug: 'stone-delicious-ipa',
    description:
      'Stone Delicious IPA proves that gluten-reduced doesn\'t mean flavor-reduced. Brewed with Lemondrop and El Dorado hops, it delivers bright lemon zest, tropical fruit, and a clean, crisp bitterness with a body that never feels like it\'s missing anything. At 7.7%, it\'s full-flavored, full-bodied, and fully inclusive. Delicious by name, delicious by nature.',
    flavorTags: ['Citrus', 'Tropical', 'Crisp', 'Bitter', 'Dry', 'Juicy'],
    foodPairings: [
      'Grilled lemon-herb chicken',
      'Citrus-glazed salmon',
      'Goat cheese and sun-dried tomato salad',
      'Mango and black bean tacos',
    ],
  },

  // ============================================================
  // SURLY
  // ============================================================
  {
    slug: 'surly-furious',
    description:
      'Furious is the beer that built Surly — an aggressively hopped IPA that channeled Minnesota\'s long winters into pure hop fury. Golden amber and packed with citrus, tropical, and pine hop character over a sturdy caramel malt base, it hits with the kind of unapologetic intensity that changed Minnesota\'s beer laws. Literally. This beer helped legalize taprooms in the state.',
    flavorTags: ['Citrus', 'Pine', 'Caramel', 'Bitter', 'Tropical', 'Complex'],
    foodPairings: [
      'Juicy Lucy cheeseburger',
      'Hot wings with blue cheese dip',
      'Smoked walleye dip with crackers',
      'Grilled corn on the cob with chili butter',
    ],
  },
  {
    slug: 'surly-darkness',
    description:
      'Darkness is Surly\'s annual imperial stout release — and it\'s a Minnesota event unto itself. This pitch-black behemoth rolls through the palate with dark chocolate, espresso, dark fruit, and a boozy warmth that clings like a December night. Rich, viscous, and unyielding, it rewards cellaring but impresses immediately. The darkest day in Minnesota is the best one.',
    flavorTags: ['Chocolate', 'Coffee', 'Roast', 'Boozy', 'Complex', 'Sweet'],
    foodPairings: [
      'Chocolate mousse with raspberry coulis',
      'Smoked beef ribs',
      'Espresso cheesecake',
      'Braised venison with juniper berries',
    ],
  },
  {
    slug: 'surly-todd-the-axe-man',
    description:
      'Todd the Axe Man is Surly\'s West Coast-meets-Midwest IPA — heavily hopped with Citra, Mosaic, and Amarillo for waves of mango, grapefruit, and stone fruit, but brewed with a restraint that lets the hops sing without the malt getting in the way. Clean, bitter, and dangerously drinkable at 7.2%. A modern classic from the state that brought you Prince and Furious.',
    flavorTags: ['Tropical', 'Citrus', 'Pine', 'Bitter', 'Dry', 'Crisp'],
    foodPairings: [
      'Smoked brisket on Texas toast',
      'Thai green papaya salad',
      'Pepper jack quesadilla with guacamole',
      'Pan-seared walleye with herb butter',
    ],
  },

  // ============================================================
  // TOPPLING GOLIATH
  // ============================================================
  {
    slug: 'toppling-goliath-king-sue',
    description:
      'King Sue reigns supreme among Citra-hopped double IPAs. This Iowa-born beast delivers a tidal wave of mango, papaya, and citrus through a hazy, full body that coats the palate in tropical bliss. At 7.8%, it\'s approachable enough for a session but complex enough to reward deep attention. The tiny town of Decorah\'s biggest claim to fame, and rightfully so.',
    flavorTags: ['Tropical', 'Citrus', 'Juicy', 'Dank', 'Smooth', 'Complex'],
    foodPairings: [
      'Grilled mahi-mahi with tropical salsa',
      'Coconut curry with chicken',
      'Brie and mango chutney flatbread',
      'Hawaiian poke bowl with sesame',
    ],
  },
  {
    slug: 'toppling-goliath-pseudosue',
    description:
      'PseudoSue is King Sue\'s more sessionable sibling — a single-hop Citra pale ale that punches well above its 5.8% weight class. Bright, juicy, and loaded with grapefruit, tangerine, and mango, it drinks like a stripped-down hot rod: lightweight, fast, and thrilling. Proof that you don\'t need double-digit ABV to deliver world-class hop flavor.',
    flavorTags: ['Citrus', 'Tropical', 'Juicy', 'Crisp', 'Crushable', 'Bitter'],
    foodPairings: [
      'Grilled shrimp tacos with avocado',
      'Citrus-marinated chicken thighs',
      'White cheddar and apple slices',
      'Thai basil fried rice',
    ],
  },
  {
    slug: 'toppling-goliath-mornin-delight',
    description:
      'Mornin\' Delight is the beer that put Toppling Goliath on the world stage — an imperial stout brewed with maple syrup and Intelligentsia coffee that tastes like the most decadent breakfast you\'ve never had. Rich, sweet, and velvety with layers of maple, espresso, dark chocolate, and vanilla, it\'s a bucket-list stout that lives up to impossible hype.',
    flavorTags: ['Coffee', 'Chocolate', 'Vanilla', 'Sweet', 'Boozy', 'Complex'],
    foodPairings: [
      'Maple-glazed bacon',
      'Chocolate espresso bread pudding',
      'Brown butter pecan pancakes',
      'Creme brulee with maple sugar',
    ],
  },

  // ============================================================
  // TREE HOUSE
  // ============================================================
  {
    slug: 'tree-house-julius',
    description:
      'Julius is the beer that launched a thousand hazy IPAs — and the line outside Tree House\'s Charlton, MA brewery to prove it. This flagship hazy IPA is a masterwork of tropical fruit, orange juice, and mango wrapped in a soft, creamy body that defies everything the West Coast taught us about what an IPA should be. Fresh Julius is a transformative experience.',
    flavorTags: ['Tropical', 'Citrus', 'Juicy', 'Smooth', 'Dank', 'Complex'],
    foodPairings: [
      'Lobster mac and cheese',
      'Mango and avocado ceviche',
      'Grilled chicken with peach salsa',
      'Brie and prosciutto panini',
    ],
  },
  {
    slug: 'tree-house-green',
    description:
      'Green is Tree House at full volume — a bigger, bolder take on the hazy IPA that amps up the hop intensity without losing the silky drinkability. Expect amplified tropical fruit, tangerine, and melon notes with a resinous, dank edge that adds depth and complexity. At 7.6%, it fills the space between Julius and Very Green with quiet confidence.',
    flavorTags: ['Tropical', 'Citrus', 'Dank', 'Juicy', 'Resinous', 'Smooth'],
    foodPairings: [
      'Grilled salmon with mango chutney',
      'Crispy duck bao buns',
      'Truffle and Parmesan fries',
      'Green curry with shrimp and Thai basil',
    ],
  },
  {
    slug: 'tree-house-very-green',
    description:
      'Very Green is Tree House turned up to 11 — a double IPA that doubles down on everything that makes their hazy beers legendary. The hop bill is massive, delivering an overwhelming cascade of tropical fruit, stone fruit, and fresh citrus with a pillowy, almost custard-like body. At 8.3%, it\'s remarkably smooth and dangerously sessionable for its strength.',
    flavorTags: ['Tropical', 'Citrus', 'Juicy', 'Dank', 'Smooth', 'Boozy'],
    foodPairings: [
      'Spicy fried chicken sandwich with coleslaw',
      'Mango sticky rice',
      'Truffle mushroom flatbread',
      'Coconut shrimp with passion fruit dipping sauce',
    ],
  },
  {
    slug: 'tree-house-bright',
    description:
      'Bright is Tree House\'s most accessible offering — a pale ale that captures all the brewery\'s hop magic in a lower-ABV, endlessly drinkable package. Light, juicy, and sparkling with citrus and tropical fruit, it proves you don\'t need heft to deliver flavor. At 5.6%, it\'s the Tree House beer you can drink all day and still make it home for dinner.',
    flavorTags: ['Citrus', 'Tropical', 'Juicy', 'Crisp', 'Crushable', 'Sessionable'],
    foodPairings: [
      'New England clam chowder',
      'Grilled fish and chips',
      'Caprese salad with fresh mozzarella',
      'Chicken tenders with honey mustard',
    ],
  },

  // ============================================================
  // TRILLIUM
  // ============================================================
  {
    slug: 'trillium-congress-street',
    description:
      'Congress Street is Trillium\'s flagship IPA — a Boston-born hazy that helped define the New England IPA movement. Packed with Citra, Simcoe, and Galaxy hops, it delivers layers of orange juice, mango, and stone fruit through a creamy, oat-forward body. The finish is clean and dry, pulling you back for another sip before you\'ve finished processing the first. South Boston\'s finest.',
    flavorTags: ['Citrus', 'Tropical', 'Juicy', 'Smooth', 'Dank', 'Crisp'],
    foodPairings: [
      'Lobster roll with warm butter',
      'Ginger-sesame ahi tuna',
      'Burrata with heirloom tomatoes and basil',
      'Vietnamese pho with fresh herbs',
    ],
  },
  {
    slug: 'trillium-ddh-fort-point',
    description:
      'DDH Fort Point is Congress Street\'s more intensely hopped cousin — a double dry-hopped pale ale that squeezes every last drop of aroma and flavor from the hop bill. Expect amplified tropical fruit, melon, and citrus zest with a body that stays remarkably light at 6.6%. It\'s the session-strength hazy that doesn\'t compromise on flavor intensity.',
    flavorTags: ['Tropical', 'Citrus', 'Juicy', 'Dank', 'Crisp', 'Crushable'],
    foodPairings: [
      'Fried clam belly plate',
      'Grilled peach and goat cheese salad',
      'Korean BBQ short ribs',
      'Avocado toast with everything seasoning',
    ],
  },
  {
    slug: 'trillium-permutation-45',
    description:
      'Permutation 45 is part of Trillium\'s wild and barrel-aged series — a testament to the brewery\'s range beyond hazy IPAs. This barrel-aged wild ale blends complex oak character with tart, funky fermentation and subtle fruit notes. Each batch is a unique expression of time, wood, and wild yeast. It\'s contemplative, layered, and proof that Trillium\'s ambitions extend far beyond juice.',
    flavorTags: ['Barrel-Aged', 'Funk', 'Tart', 'Complex', 'Dry', 'Brett'],
    foodPairings: [
      'Aged Gruyere with honeycomb',
      'Pan-seared foie gras with fig compote',
      'Charcuterie with pickled vegetables',
      'Wild mushroom risotto with truffle oil',
    ],
  },

  // ============================================================
  // WEIHENSTEPHANER
  // ============================================================
  {
    slug: 'weihenstephaner-hefeweissbier',
    description:
      'From the world\'s oldest brewery, founded in 1040, comes the world\'s definitive hefeweizen. Weihenstephaner\'s Hefeweissbier is a golden, cloudy masterpiece of banana, clove, and bread dough with a creamy body and effervescent carbonation that lifts every sip. Nearly a thousand years of brewing tradition in every glass — and it hasn\'t missed a step.',
    flavorTags: ['Banana', 'Clove', 'Bread', 'Crisp', 'Smooth', 'Crushable'],
    foodPairings: [
      'Weisswurst with sweet Bavarian mustard',
      'Banana Nutella crepes',
      'Grilled lemon-herb chicken',
      'Waldorf salad with fresh apples and walnuts',
    ],
  },
  {
    slug: 'weihenstephaner-vitus',
    description:
      'Vitus is the hefeweizen\'s bigger, bolder sibling — a weizenbock that takes the classic banana and clove character and amplifies it with boozy warmth, ripe stone fruit, and a rich, bready maltiness. At 7.7%, it drinks dangerously smooth, with a complexity that reveals new layers with every sip. Nearly a millennium of expertise, distilled into wheat beer perfection.',
    flavorTags: ['Banana', 'Clove', 'Bread', 'Boozy', 'Sweet', 'Complex'],
    foodPairings: [
      'Roasted pork knuckle with dumplings',
      'Apple strudel with vanilla sauce',
      'Baked brie with walnuts and honey',
      'Braised rabbit with mustard cream sauce',
    ],
  },

  // ============================================================
  // WICKED WEED
  // ============================================================
  {
    slug: 'wicked-weed-pernicious',
    description:
      'Pernicious is Wicked Weed\'s flagship IPA — an Asheville-born West Coast-style bruiser that leads with bold citrus, tropical, and pine hop character over a lean, dry malt body. It\'s bitter, bright, and refreshingly old-school in its directness. In a town overflowing with breweries, Pernicious remains the one that visitors ask about by name.',
    flavorTags: ['Citrus', 'Pine', 'Tropical', 'Bitter', 'Dry', 'Crisp'],
    foodPairings: [
      'Smoky pulled pork with vinegar slaw',
      'Grilled chicken with lemon and oregano',
      'Sharp white cheddar with apple butter',
      'Wood-fired pepperoni pizza',
    ],
  },
  {
    slug: 'wicked-weed-angel-of-darkness',
    description:
      'Angel of Darkness is Wicked Weed\'s barrel-aged imperial stout — a pitch-black, 13% behemoth aged in bourbon barrels until it develops layers of vanilla, dark chocolate, charred oak, and dried dark fruit. The body is thick and syrupy, with a warming booziness that lingers like embers in a fireplace. Darkness never tasted so divine.',
    flavorTags: ['Barrel-Aged', 'Chocolate', 'Vanilla', 'Boozy', 'Roast', 'Complex'],
    foodPairings: [
      'Bourbon-glazed baby back ribs',
      'Molten chocolate lava cake',
      'Smoked cheddar with bourbon-soaked cherries',
      'Braised beef short ribs with red wine jus',
    ],
  },
  {
    slug: 'wicked-weed-serenity',
    description:
      'Serenity is Wicked Weed\'s Funkatorium at its finest — a Brett saison that walks the tightrope between farmhouse funk and elegant restraint. Dry, effervescent, and laced with lemon, hay, and earthy Brettanomyces character, it tastes like a rustic French countryside fermented into a glass. Patient, complex, and utterly serene — exactly as advertised.',
    flavorTags: ['Brett', 'Farmhouse', 'Dry', 'Funk', 'Citrus', 'Complex'],
    foodPairings: [
      'Aged chèvre with herbes de Provence',
      'Grilled quail with thyme and lemon',
      'Wild mushroom and gruyere tart',
      'Steamed mussels with white wine and shallots',
    ],
  },
];

async function main() {
  console.log(`Updating ${beerUpdates.length} beers with rich descriptions, flavor tags, and food pairings...\n`);

  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const beer of beerUpdates) {
    try {
      await prisma.beer.update({
        where: { slug: beer.slug },
        data: {
          description: beer.description,
          flavorTags: beer.flavorTags,
          foodPairings: beer.foodPairings,
        },
      });
      updated++;
      console.log(`  [${updated}/${beerUpdates.length}] Updated: ${beer.slug}`);
    } catch (error: any) {
      if (error.code === 'P2025') {
        skipped++;
        console.log(`  SKIPPED (not found): ${beer.slug}`);
      } else {
        errors.push(`${beer.slug}: ${error.message}`);
        console.error(`  ERROR: ${beer.slug} - ${error.message}`);
      }
    }
  }

  console.log(`\nDone!`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);
  if (errors.length > 0) {
    console.log(`  Errors: ${errors.length}`);
    errors.forEach((e) => console.log(`    - ${e}`));
  }
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
