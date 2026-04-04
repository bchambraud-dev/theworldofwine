export interface JourneyStop {
  id: string;
  type: "region" | "producer" | "concept";
  targetId?: string; // region or producer ID from existing data
  title: string;
  narrative: string; // 2-4 sentences in brand voice. This is the storytelling between stops.
  mapCenter?: { lat: number; lng: number; zoom: number };
}

export interface Journey {
  id: string;
  title: string;
  subtitle: string;
  description: string; // 2-3 sentences, brand voice
  category: "region" | "grape" | "style" | "theme";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  stopCount: number;
  coverGradient: string; // CSS gradient for card (use brand colors)
  icon: string; // icon ID for JourneyIcon component
  stops: JourneyStop[];
}

export const journeys: Journey[] = [
  // ── JOURNEY 1 ────────────────────────────────────────────────────────────────
  {
    id: "six-grapes-that-changed-everything",
    title: "Start Here: The 6 Grapes That Changed Everything",
    subtitle: "The essential varieties behind most of the wine you'll ever drink",
    description:
      "Six grape varieties dominate wine lists, wine shops, and wine conversations worldwide — and for good reason. This journey takes you to the regions that made them famous, explains what makes each one special, and sends you off with the kind of knowledge that actually helps at a dinner table.",
    category: "grape",
    difficulty: "beginner",
    estimatedMinutes: 15,
    stopCount: 6,
    coverGradient: "linear-gradient(135deg, #6b2039 0%, #8c2840 50%, #a4415a 100%)",
    icon: "grapes",
    stops: [
      {
        id: "cab-sauv-bordeaux",
        type: "region",
        targetId: "bordeaux",
        title: "Cabernet Sauvignon — Bordeaux, France",
        narrative:
          "If wine had a king, Cabernet Sauvignon would be wearing the crown. It's the backbone of some of the most celebrated bottles in history — Château Lafite, Château Margaux, the legendary 1982 First Growths. But here's what's interesting: Cabernet Sauvignon is actually a genetic accident, a natural cross between Cabernet Franc and Sauvignon Blanc that happened somewhere in 17th-century Bordeaux. Nobody planned it. The grape just happened, and it happened to be extraordinary. Thick-skinned and late-ripening, it produces wines of structure, depth, and incredible aging potential — that classic blackcurrant, cedar, graphite profile that wine writers reach for purple adjectives to describe.",
        mapCenter: { lat: 44.84, lng: -0.58, zoom: 8 },
      },
      {
        id: "pinot-noir-burgundy",
        type: "region",
        targetId: "burgundy",
        title: "Pinot Noir — Burgundy, France",
        narrative:
          "Pinot Noir is the grape that drives wine people slightly mad — and for good reason. It's the <strong>most transparent grape in the world</strong>, meaning it shows every detail of where it was grown and how it was made. There's nowhere to hide. In Burgundy, on those ancient limestone and clay slopes, Pinot Noir makes wines of haunting beauty: cherry, raspberry, dried rose, forest floor, a silkiness that seems impossible for something made from fermented grape juice. The same grape in the wrong hands? Thin, jammy, forgettable. That tension — between transcendence and disaster — is what makes it so fascinating.",
        mapCenter: { lat: 47.04, lng: 4.84, zoom: 8 },
      },
      {
        id: "chardonnay-champagne",
        type: "region",
        targetId: "champagne",
        title: "Chardonnay — Champagne, France",
        narrative:
          "Chardonnay is the shape-shifter — probably the most adaptable white grape on the planet. In Champagne it becomes something electric: lean, mineral, bright with acidity, the engine behind the world's most iconic bubbles. Blanc de Blancs Champagne is 100% Chardonnay, and it's worth seeking out — you'll taste the chalk in the soil through every sip. But Chardonnay is also the grape behind creamy, buttery white Burgundy, rich Australian examples, and everything in between. Wherever it grows, it absorbs the character of its place. That's a skill not every grape has.",
        mapCenter: { lat: 49.05, lng: 3.95, zoom: 8 },
      },
      {
        id: "sauv-blanc-loire",
        type: "region",
        targetId: "loire",
        title: "Sauvignon Blanc — Loire Valley, France",
        narrative:
          "Before Marlborough, New Zealand made Sauvignon Blanc famous worldwide, the Loire Valley was doing it quietly for centuries. Sancerre and Pouilly-Fumé — those are the benchmark expressions: grassy, citrusy, almost electric with acidity, carrying a flinty mineral quality from the local soils. Sauvignon Blanc is an opinionated grape — it doesn't pretend to be something it's not. You know it immediately. That assertiveness is polarizing (some people love it, some don't), but you'll never mistake it for anything else. Loire Sauvignon Blanc has a restraint and precision that New World versions often don't — it's worth comparing them side by side.",
        mapCenter: { lat: 47.3, lng: 0.68, zoom: 7 },
      },
      {
        id: "riesling-mosel",
        type: "region",
        targetId: "mosel",
        title: "Riesling — Mosel, Germany",
        narrative:
          "Here's a confession: Riesling is probably the most misunderstood great grape in the world. People hear 'Riesling' and think sweet — but in the Mosel, on those impossibly steep slate slopes above the river, Riesling makes wines of almost painful beauty: low in alcohol, high in acidity, intensely aromatic, ranging from bone-dry to gloriously sweet. The slate soil here retains heat during the day and releases it at night, letting grapes ripen slowly while keeping freshness. The result is wines with decades of aging potential that smell like peach blossom and taste like liquid crystalline precision. Give Riesling another chance.",
        mapCenter: { lat: 49.96, lng: 7.13, zoom: 9 },
      },
      {
        id: "syrah-rhone",
        type: "region",
        targetId: "rhone",
        title: "Syrah — Rhône Valley, France",
        narrative:
          "Syrah is the dramatic one. On the steep granite terraces of Côte-Rôtie in the northern Rhône — and at Hermitage, one of France's most hallowed vineyards — Syrah produces wines of extraordinary depth: dark fruit, black pepper, bacon fat, violet, iron. These are not subtle wines. And in Australia, where the same grape goes by Shiraz, it takes on a different personality entirely: richer, more fruit-forward, often with chocolate and licorice notes. Same grape, two completely different stories — one told by France, one by the sun-baked Barossa. Both are worth knowing.",
        mapCenter: { lat: 45.5, lng: 4.8, zoom: 8 },
      },
    ],
  },

  // ── JOURNEY 2 ────────────────────────────────────────────────────────────────
  {
    id: "old-world-vs-new-world",
    title: "Old World vs New World",
    subtitle: "Two philosophies of wine, explained through the regions that define them",
    description:
      "The Old World/New World divide is one of wine's most useful concepts — and one of its most oversimplified ones. This journey explores the real differences through five head-to-head comparisons, showing you what the terms actually mean in the glass rather than just on a map.",
    category: "theme",
    difficulty: "beginner",
    estimatedMinutes: 12,
    stopCount: 6,
    coverGradient: "linear-gradient(135deg, #7a4a2a 0%, #96633e 50%, #b8845c 100%)",
    icon: "globe",
    stops: [
      {
        id: "ow-nw-concept",
        type: "concept",
        title: "What Do These Terms Actually Mean?",
        narrative:
          "Old World means Europe — France, Italy, Spain, Germany, Portugal and their wine traditions stretching back millennia. New World means everywhere else: the Americas, Australia, New Zealand, South Africa, and other newer wine-producing nations. But the distinction isn't just about geography or age — it's about philosophy. Old World winemaking traditionally emphasizes the land, the place, the terroir: the wine expresses where it comes from, and the grape variety is almost secondary. New World winemaking — at least historically — led with the grape variety and the winemaker's vision. That's changing on both sides, but the difference is still worth understanding.",
        mapCenter: { lat: 30, lng: 10, zoom: 2 },
      },
      {
        id: "bordeaux-vs-napa",
        type: "region",
        targetId: "bordeaux",
        title: "Bordeaux vs Napa Valley",
        narrative:
          "Cabernet Sauvignon's two greatest stages couldn't be more different. Bordeaux, on the Atlantic coast of France, makes wines of restrained power — elegant, structured, with blackcurrant and cedar and graphite, built to age for decades. You open a Bordeaux and it takes time to reveal itself, like a conversation that gets better as the evening goes on. Napa Valley Cabernet? It walks into the room and announces itself. Riper, richer, more opulent, often with a lushness of fruit that's immediately appealing. Both are magnificent in different ways. The question is what you're looking for — a sprinter or a long-distance runner.",
        mapCenter: { lat: 44.84, lng: -0.58, zoom: 7 },
      },
      {
        id: "burgundy-vs-willamette",
        type: "region",
        targetId: "burgundy",
        title: "Burgundy vs Willamette Valley",
        narrative:
          "For Pinot Noir, these are the two poles of the universe. Burgundy — the original, the template — makes wines of extraordinary finesse: light in color, haunting in aroma, with a complexity that unfolds over hours in the glass. The best examples are among the most expensive wines in the world, and people will debate individual vineyard plots with the intensity of sports fans discussing their team. Willamette Valley in Oregon took Burgundy as its model and ran with it — slightly riper, a touch more fruit-forward, but sharing that cool-climate elegance. The best Willamette Pinots are world-class by any measure, and they're easier on the wallet.",
        mapCenter: { lat: 47.04, lng: 4.84, zoom: 7 },
      },
      {
        id: "rioja-vs-mendoza",
        type: "region",
        targetId: "rioja",
        title: "Rioja vs Mendoza",
        narrative:
          "Spanish Tempranillo and Argentine Malbec share certain qualities — both are deeply colored, both respond beautifully to oak aging — but the wines couldn't be more different in character. Rioja, at elevation in northern Spain, produces wines with earthy complexity, leather, dried herbs, and red fruit that evolve beautifully with time. Traditional Rioja spends years in barrel and bottle before release. Mendoza's Malbec, at high altitude in the Andes foothills, is more immediately gratifying: plush, dark-fruited, velvety, with a freshness from altitude that keeps it lively. Old World patience versus New World exuberance — both rewarding in different moods.",
        mapCenter: { lat: 42.46, lng: -2.45, zoom: 8 },
      },
      {
        id: "mosel-vs-marlborough",
        type: "region",
        targetId: "mosel",
        title: "Mosel vs Marlborough",
        narrative:
          "Sauvignon Blanc and Riesling couldn't be more different grapes, but this comparison illuminates something important about Old vs New World. Mosel Riesling — restrained, precise, mineral, ethereal — represents Old World winemaking at its most extreme: the wine is almost transparent, showing every detail of those slate slopes. Marlborough Sauvignon Blanc went the opposite direction — bold, pungent, immediately expressive, a style that invented an entirely new global category. Neither is better; they represent genuinely different ideas about what wine should do. Old World: speak quietly and let terroir shout. New World: be unmistakable from the first sip.",
        mapCenter: { lat: 49.96, lng: 7.13, zoom: 9 },
      },
      {
        id: "ow-nw-conclusion",
        type: "concept",
        title: "The Lines Are Blurring",
        narrative:
          "Here's the plot twist: the Old World/New World divide is dissolving. European winemakers are increasingly making riper, more immediately appealing wines. New World producers — especially in places like Willamette, Yarra Valley, and Marlborough — are making wines of increasing restraint and terroir expression. The next generation of winemakers doesn't feel bound by either tradition. Which means the most interesting wine conversations happening right now are the ones asking: what happens when these two philosophies meet in the middle?",
        mapCenter: { lat: 30, lng: 10, zoom: 2 },
      },
    ],
  },

  // ── JOURNEY 3 ────────────────────────────────────────────────────────────────
  {
    id: "france-in-five-regions",
    title: "France in Five Regions",
    subtitle: "The essential tour of the country that wrote wine's rulebook",
    description:
      "France didn't invent wine — but it arguably perfected the idea of matching grape to place. This tour of five iconic regions gives you the foundation for understanding not just French wine, but the entire way the wine world thinks about quality and terroir.",
    category: "region",
    difficulty: "beginner",
    estimatedMinutes: 15,
    stopCount: 5,
    coverGradient: "linear-gradient(135deg, #3d4a5c 0%, #566880 50%, #7a8da3 100%)",
    icon: "france",
    stops: [
      {
        id: "france-bordeaux",
        type: "region",
        targetId: "bordeaux",
        title: "Bordeaux — Where Wine Became Serious Business",
        narrative:
          "We start in Bordeaux because this is where wine became a global commodity, a collector's obsession, and an art form simultaneously. The Gironde estuary splits the region into Left Bank and Right Bank, and the two sides produce wines as different as night and day — Cabernet Sauvignon-dominant on the gravelly Left Bank, Merlot-led on the clay soils of the Right. In between, Sauternes makes golden, honeyed dessert wines from grapes deliberately infected with noble rot. This is a region that does nothing by halves. The 1855 Classification — still largely intact today — ranked the greatest châteaux on the Left Bank in a single dramatic gesture that the wine world is still arguing about.",
        mapCenter: { lat: 44.84, lng: -0.58, zoom: 8 },
      },
      {
        id: "france-burgundy",
        type: "region",
        targetId: "burgundy",
        title: "Burgundy — Where Wine Gets Philosophical",
        narrative:
          "Head north and east from Bordeaux and things get quieter, smaller, and infinitely more obsessive. Burgundy is the region that gave us the concept of terroir — the idea that a specific piece of land, worked by specific hands, expresses something irreducible in the wine. The Côte d'Or stretches just 40 kilometers but contains some of the most valuable agricultural land on earth. Individual plots — called 'lieux-dits' — are mapped with extraordinary precision. Two vineyards separated by a dirt track can produce wines that taste completely different. That's the magic and the madness of Burgundy: it insists that place matters more than anything else.",
        mapCenter: { lat: 47.04, lng: 4.84, zoom: 8 },
      },
      {
        id: "france-champagne",
        type: "region",
        targetId: "champagne",
        title: "Champagne — The Science Behind the Celebration",
        narrative:
          "Champagne is famous for the bubbles, but let's talk about what's underneath them. This is one of the world's most northerly major wine regions — so cold that grapes barely ripen, producing wines with ferocious acidity and relatively low sugar. That acidity is precisely what makes Champagne so brilliant: it's the architecture that allows the wine to age for years, developing extraordinary complexity. The <strong>méthode champenoise</strong> — the painstaking process of secondary fermentation in bottle — traps carbon dioxide and creates those persistent, fine bubbles. The chalk soils here are so distinctive that you can taste the minerality through every glass. There's a reason 'Champagne' as a word means celebration.",
        mapCenter: { lat: 49.05, lng: 3.95, zoom: 8 },
      },
      {
        id: "france-rhone",
        type: "region",
        targetId: "rhone",
        title: "Rhône Valley — Where the South Begins",
        narrative:
          "As you travel south from Lyon, the landscape changes dramatically — and so does the wine. The northern Rhône is a world of granite cliffs and concentrated Syrah: Côte-Rôtie, Hermitage, Cornas. These are wines of power and elegance, often needing a decade before they really open up. Then the valley widens and the Mediterranean influence takes over: sunshine, wild herbs, the lavender-scented garrigue. Châteauneuf-du-Pape in the south is a massive, sun-baked appellation where blends of up to thirteen grapes produce rich, spicy, deeply colored wines. The two ends of this valley feel like different countries — which is part of what makes it so endlessly interesting.",
        mapCenter: { lat: 44.13, lng: 4.81, zoom: 8 },
      },
      {
        id: "france-loire",
        type: "region",
        targetId: "loire",
        title: "Loire Valley — The Wine World's Best-Kept Secret",
        narrative:
          "The Loire stretches for 1,000 kilometers from the Atlantic coast deep into central France, and at every point along the river it produces something different and remarkable. Muscadet in the west: salty, mineral, perfect with oysters. Sancerre and Pouilly-Fumé in the center: steely Sauvignon Blanc of extraordinary precision. Vouvray and the Chenin Blanc appellations: wines that range from bone-dry to lusciously sweet, with decades of aging potential. And then there's the reds — Chinon, Bourgueil, Saumur — where Cabernet Franc makes its most elegant case. The Loire is a wine lover's paradise precisely because it's underrated, diverse, and endlessly surprising.",
        mapCenter: { lat: 47.3, lng: 0.68, zoom: 7 },
      },
    ],
  },

  // ── JOURNEY 4 ────────────────────────────────────────────────────────────────
  {
    id: "italy-north-to-south",
    title: "Italy: From North to South",
    subtitle: "A peninsula of impossible diversity, from alpine elegance to Mediterranean fire",
    description:
      "Italy has more indigenous grape varieties than any other country on earth — over a thousand documented varieties, and probably more lurking in old vineyards nobody has catalogued yet. This north-to-south journey hits the essential stops, but consider it just the beginning of a very long love affair.",
    category: "region",
    difficulty: "intermediate",
    estimatedMinutes: 12,
    stopCount: 4,
    coverGradient: "linear-gradient(135deg, #3a5a3a 0%, #4a7a52 50%, #6b9a6b 100%)",
    icon: "italy",
    stops: [
      {
        id: "italy-piedmont",
        type: "region",
        targetId: "piedmont",
        title: "Piedmont — The Land of Barolo and Truffle Dinners",
        narrative:
          "In the northwest, tucked against the Alps, Piedmont produces what many consider Italy's greatest wines. The king here is Nebbiolo — a brutal, tannic, high-acid grape that makes Barolo and Barbaresco, wines of extraordinary complexity and longevity. The locals call Barolo the 'King of Wines and Wine of Kings,' and when you taste a great one at ten or fifteen years old, you understand why. But Piedmont isn't just Nebbiolo. Barbera brings everyday pleasure with its deep fruit and refreshing acidity. Dolcetto is rustic and beautiful. And then there's white Moscato d'Asti, delicately sweet and fizzy, made to pair with almonds and dessert. This is a region for people who believe that wine should match the food — which in Piedmont is always extraordinary.",
        mapCenter: { lat: 44.7, lng: 8.03, zoom: 9 },
      },
      {
        id: "italy-veneto",
        type: "region",
        targetId: "veneto",
        title: "Veneto — Prosecco, Amarone, and Soave",
        narrative:
          "The Veneto, in northeastern Italy, is one of the country's largest wine producers by volume — and one of its most polarizing. At the cheap end, industrial Soave and Pinot Grigio have given the region a mixed reputation. But look beyond the bargain-bin stuff and you find something remarkable. Amarone della Valpolicella is one of Italy's most powerful and distinctive wines: made from dried grapes, enormous in alcohol and concentration, tasting of dried cherry, chocolate, and forest floor. Valpolicella Ripasso — a richer, more structured version of regular Valpolicella — offers a middle ground that overdelivers for the price. And Prosecco? Yes, it's everywhere, but the best examples from Cartizze and Valdobbiadene are genuinely lovely.",
        mapCenter: { lat: 45.44, lng: 11.93, zoom: 8 },
      },
      {
        id: "italy-tuscany",
        type: "region",
        targetId: "tuscany",
        title: "Tuscany — Chianti, Super Tuscans, and the Rolling Hills",
        narrative:
          "Tuscany is where Italian wine got modern. The landscape — those cypress-lined roads, medieval hill towns, terracotta and golden stone — is so beautiful it almost distracts from the wine. Almost. Chianti Classico, made from Sangiovese in the hills between Florence and Siena, is the classic expression: tart cherry, leather, herbs, high acidity, with a bitter finish that's perfect with tomato sauce. Then in the 1970s and '80s, maverick producers started breaking the rules — planting Cabernet Sauvignon and Merlot, aging in small French barriques — and creating the 'Super Tuscans': Sassicaia, Ornellaia, Masseto. These wines were technically too innovative for the existing appellation system, so they were labeled as humble table wine. And they changed Italian wine forever.",
        mapCenter: { lat: 43.52, lng: 11.1, zoom: 8 },
      },
      {
        id: "italy-sicily",
        type: "region",
        targetId: "sicily",
        title: "Sicily — The Island That Reinvented Itself",
        narrative:
          "For most of the 20th century, Sicily was Italy's wine workhorse — producing oceans of anonymous red wine shipped north to bulk up thinner French and northern Italian blends. Then something changed. Producers started paying attention to the extraordinary old-vine Nero d'Avola and Nerello Mascalese growing on this Mediterranean island, and realized they had something special. Etna — Mount Etna, the active volcano — became one of wine's most exciting new frontiers: volcanic soils, extreme altitude, pre-phylloxera vines sometimes over 100 years old. The wines from Etna have a haunting mineral quality unlike anything else, and the region has attracted winemakers from all over Italy and beyond. Sicily's reinvention is one of the great wine stories of our time.",
        mapCenter: { lat: 37.6, lng: 14.01, zoom: 8 },
      },
    ],
  },

  // ── JOURNEY 5 ────────────────────────────────────────────────────────────────
  {
    id: "natural-wine-movement",
    title: "The Natural Wine Movement",
    subtitle: "Minimum intervention, maximum conversation — what natural wine is really about",
    description:
      "Natural wine is the most debated topic in the wine world right now — loved by some, dismissed by others, misunderstood by most. This journey goes to the regions where it's happening and explores what it actually means in the vineyard and in the glass.",
    category: "style",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    stopCount: 5,
    coverGradient: "linear-gradient(135deg, #2d4a3a 0%, #3d6b50 50%, #5a8a6a 100%)",
    icon: "leaf",
    stops: [
      {
        id: "natural-concept",
        type: "concept",
        title: "What Is Natural Wine?",
        narrative:
          "There's no legal definition of 'natural wine' — which is part of what makes the conversation so heated. In broad terms, natural wine means grapes grown without synthetic pesticides or herbicides, harvested by hand, fermented with ambient wild yeasts rather than commercial cultured yeasts, and produced with minimal additions in the cellar — no added sugar, minimal to no sulfur dioxide, no fining agents. The philosophy is about letting the grape and the place speak without interference. The result? At best, wines of extraordinary aliveness and expression. At worst — wines that taste like kombucha that went wrong. The range is genuinely huge, which is worth knowing before you dive in.",
        mapCenter: { lat: 45, lng: 10, zoom: 3 },
      },
      {
        id: "natural-kakheti",
        type: "region",
        targetId: "kakheti",
        title: "Kakheti, Georgia — Where It All Began",
        narrative:
          "Before natural wine was a movement, it was just what people in Georgia did. In Kakheti, in the eastern part of this ancient country, winemakers have been fermenting grapes in clay vessels called qvevri for at least 8,000 years — making this the oldest wine culture we know of. The qvevri are buried in the earth, where temperature stays naturally stable. Grapes — including skins, seeds, and stems — ferment together for months. The result is 'orange wine': amber in color, tannic for a white wine, oxidative in character, deeply complex. This is wine before technology got involved. It's strange and beautiful and surprisingly compelling.",
        mapCenter: { lat: 41.64, lng: 45.99, zoom: 8 },
      },
      {
        id: "natural-loire",
        type: "region",
        targetId: "loire",
        title: "Loire Valley — Natural Wine's French Heartland",
        narrative:
          "The Loire is where the modern natural wine movement found its French voice. Producers like Nicolas Joly — champion of biodynamic viticulture — and Marcel Lapierre in Beaujolais (just south of the Loire proper) sparked a revolution in the 1980s and '90s that spread across France and eventually the world. The Loire's Chenin Blanc is particularly well-suited to natural production: the grape's naturally high acidity acts as a preservative, reducing the need for sulfur additions. Today, a generation of young winemakers in Vouvray, Anjou, and Muscadet are making some of the most compelling bottles in France — bottles that taste alive in a way that's hard to explain but immediately recognizable.",
        mapCenter: { lat: 47.3, lng: 0.68, zoom: 7 },
      },
      {
        id: "natural-swartland",
        type: "region",
        targetId: "swartland",
        title: "Swartland, South Africa — The New Frontier",
        narrative:
          "If you want to understand where natural wine is happening right now, look at Swartland — a hot, dry inland region north of Cape Town that was largely ignored until a group of iconoclastic producers decided that its ancient, unirrigated bush vines growing in granite and slate soils were producing something special. The Swartland Revolution (an annual gathering of like-minded producers) became one of wine's most exciting annual events. Eben Sadie and the Sadie Family wines set the standard — complex, textured blends that feel both ancient and utterly contemporary. This is a wine region being invented in real time, and it's thrilling to watch.",
        mapCenter: { lat: -33.46, lng: 18.95, zoom: 9 },
      },
      {
        id: "natural-conclusion",
        type: "concept",
        title: "Is Natural Always Better?",
        narrative:
          "Here's the honest answer: no, not automatically. Natural wine is a philosophy and a set of practices — like organic farming or artisan bread-making — that produces exceptional results in skilled hands and disappointing results in careless ones. A beautifully made 'conventional' wine from a thoughtful producer can be far superior to a flawed natural wine that tastes of vinegar and instability. The most interesting producers today are those who apply the principles of natural winemaking rigorously — healthy vineyards, minimal intervention — without being dogmatic about it. The goal is always the wine, not the certification.",
        mapCenter: { lat: 45, lng: 10, zoom: 3 },
      },
    ],
  },

  // ── JOURNEY 6 ────────────────────────────────────────────────────────────────
  {
    id: "sparkling-around-the-world",
    title: "Sparkling Around the World",
    subtitle: "Bubbles, but make it a world tour",
    description:
      "Champagne might be the most famous sparkling wine, but it's far from the only story. From Italian Prosecco to English fizz to Brazilian sparkling — every major wine region has its own answer to the question of how to make wine with bubbles. This journey explores the best of them.",
    category: "style",
    difficulty: "beginner",
    estimatedMinutes: 12,
    stopCount: 5,
    coverGradient: "linear-gradient(135deg, #7a6530 0%, #9a8040 50%, #b89a55 100%)",
    icon: "sparkle",
    stops: [
      {
        id: "sparkling-champagne",
        type: "region",
        targetId: "champagne",
        title: "Champagne — The Standard by Which All Others Are Judged",
        narrative:
          "Everything in sparkling wine comes back to Champagne — the reference point, the benchmark, the wine that other regions aspire to or deliberately avoid comparison with. What makes it special? The combination of cool climate (wines with naturally high acidity, perfect for aging), chalk soils (intense minerality), a unique blending tradition (combining multiple vintages and grape varieties to achieve a consistent 'house style'), and the painstaking <strong>méthode champenoise</strong> that creates bubbles inside each individual bottle. Non-vintage Champagne represents the winemaker's art of consistency. Vintage Champagne shows what one exceptional year can achieve. Prestige cuvées — Dom Pérignon, Krug, Cristal — are the pinnacle. All of it is worth understanding.",
        mapCenter: { lat: 49.05, lng: 3.95, zoom: 8 },
      },
      {
        id: "sparkling-prosecco",
        type: "region",
        targetId: "veneto",
        title: "Prosecco — The Everyday Celebration",
        narrative:
          "Prosecco has conquered the world's aperitivo hour, and honestly? Good for it. Made in the Veneto from the Glera grape, Prosecco uses the Charmat method — secondary fermentation happens in large pressurized tanks rather than individual bottles — which produces a softer, fruitier, less complex style with larger, less persistent bubbles. The best Prosecco comes from Conegliano Valdobbiadene, where steep hillside vineyards produce wines with genuine character. Look for 'Superiore di Cartizze' on the label — this tiny sub-zone produces Prosecco's most refined and complex expressions. Chill it hard, drink it immediately, and enjoy it for what it is: Italian sunshine in a glass.",
        mapCenter: { lat: 45.44, lng: 11.93, zoom: 8 },
      },
      {
        id: "sparkling-cava",
        type: "region",
        targetId: "priorat",
        title: "Cava — Spain's Bubbles, Spain's Rules",
        narrative:
          "Spain has been making serious sparkling wine in Catalonia since the 1870s — using the same traditional method as Champagne but with Spanish indigenous grapes: Macabeo, Xarel·lo, Parellada. The result is Cava: crisp, slightly earthy, with a savory quality that comes from longer lees aging. Most Cava comes from the Penedès region near Barcelona, but the appellation actually spans several regions. The new classification system — Cava de Paraje Calificado — has elevated single-vineyard Cavas to a whole new level of quality. For a fraction of the price of Champagne, you can find Cava that holds its own in serious company.",
        mapCenter: { lat: 41.46, lng: 1.01, zoom: 8 },
      },
      {
        id: "sparkling-english",
        type: "region",
        targetId: "english-sparkling",
        title: "English Sparkling — The Surprise of the Century",
        narrative:
          "Twenty years ago, the idea of England producing world-class sparkling wine would have been a punchline. Now it's a serious conversation. The chalk soils of Sussex, Kent, and Hampshire are geologically similar to Champagne's terroir — in fact, the chalk belt literally runs under the English Channel and continues on the English side. The same cool climate creates high-acid base wines perfect for the traditional method. And the same grape varieties — Chardonnay, Pinot Noir, Pinot Meunier — thrive here. Producers like Nyetimber and Chapel Down have won blind tastings against Champagne. Climate change is making English summers warmer, and the English sparkling industry is growing every year. This is the most surprising success story in modern wine.",
        mapCenter: { lat: 51.05, lng: 0.1, zoom: 8 },
      },
      {
        id: "sparkling-serra-gaucha",
        type: "region",
        targetId: "serra-gaucha",
        title: "Serra Gaúcha — Brazil's Unexpected Fizz",
        narrative:
          "In the mountains of southern Brazil, Italian immigrant families planted vines in the highlands of Rio Grande do Sul — cool enough at altitude for sparkling wine production that nobody outside Brazil was paying attention to for decades. That's changing. Serra Gaúcha's traditional method sparkling wines, made from Chardonnay, Pinot Noir, and Portuguese varieties, have started winning international recognition. The style is fresh, lively, and often more fruit-forward than European examples. Brazil as a sparkling wine country? Yes, really — and it makes complete sense once you understand the geography. The wine world keeps getting larger.",
        mapCenter: { lat: -29.17, lng: -51.18, zoom: 9 },
      },
    ],
  },

  // ── JOURNEY 7 ────────────────────────────────────────────────────────────────
  {
    id: "big-reds-world-tour",
    title: "Big Reds: A World Tour",
    subtitle: "The boldest, most structured red wines from six continents of excellence",
    description:
      "Some wines whisper. These ones don't. This journey tours the world's great regions for powerful, age-worthy red wines — from the gravelly Left Bank of Bordeaux to the sun-scorched Barossa — showing what 'big' means in different cultural and climatic contexts.",
    category: "grape",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    stopCount: 6,
    coverGradient: "linear-gradient(135deg, #4a1a2e 0%, #6b2540 50%, #8c3a58 100%)",
    icon: "glass",
    stops: [
      {
        id: "big-reds-bordeaux",
        type: "region",
        targetId: "bordeaux",
        title: "Bordeaux — Cabernet's Greatest Stage",
        narrative:
          "When people talk about 'serious' red wine, this is almost always where the conversation begins. Left Bank Bordeaux — Pauillac, Saint-Julien, Margaux, Saint-Estèphe — is Cabernet Sauvignon country, and the great châteaux here produce wines of structural precision that can age for 50 years or more. The power here isn't brute force — it's architectural. Tannins, acidity, fruit, and oak in perfect calibration. A great young Bordeaux often tastes tight, almost austere — it needs time to reveal what it truly is. Decant for hours or wait for decades. Either way, the patience is rewarded.",
        mapCenter: { lat: 44.84, lng: -0.58, zoom: 8 },
      },
      {
        id: "big-reds-piedmont",
        type: "region",
        targetId: "piedmont",
        title: "Piedmont — Barolo's Brutal Beauty",
        narrative:
          "Nebbiolo is not a grape for the impatient. It's the most tannic, most acid, most uncompromising major variety in the wine world — and in the hills of La Morra, Barolo, and Castiglione Falletto, it makes wines of staggering complexity. A traditional Barolo needs 10 years minimum; 20 years is better. When it finally opens, you get dried roses, tar, leather, cherry, earth, licorice — an experience that evolves in the glass for hours. Modern Barolo (shorter maceration, French barriques) is more immediately approachable. The debate between traditionalists and modernists in Barolo is one of wine's great ongoing arguments. Both sides are making magnificent wine.",
        mapCenter: { lat: 44.7, lng: 8.03, zoom: 9 },
      },
      {
        id: "big-reds-ribera",
        type: "region",
        targetId: "ribera-del-duero",
        title: "Ribera del Duero — Spain's Dark Horse",
        narrative:
          "Drive four hours north of Madrid along the Duero River, through a high plateau that locals call 'nine months of winter and three of hell,' and you find one of Spain's most exciting wine regions. Tempranillo here — often called Tinto Fino or Tinta del País — makes wines completely different from Rioja: darker, more structured, more concentrated. The continental climate means scorching summers and frigid winters, and the resulting wines have a power that Rioja rarely matches. Vega Sicilia has been making legendary wine here since 1864. Dominio de Pingus, established just in 1995, immediately became one of Spain's most coveted bottles. The elevation keeps acidity high and elegance intact.",
        mapCenter: { lat: 41.65, lng: -3.69, zoom: 9 },
      },
      {
        id: "big-reds-mendoza",
        type: "region",
        targetId: "mendoza",
        title: "Mendoza — Malbec at Altitude",
        narrative:
          "Malbec was a minor player in Bordeaux blends — included for color, basically — before it found its true home in the Andes foothills of Mendoza, Argentina. At high altitude, with the Andes blocking Pacific moisture and intense UV radiation from the sun, Malbec develops thick skins and concentrated flavors while maintaining surprising freshness. The result is a dark, plush, velvety wine with black fruit, violet, and chocolate — deeply satisfying and accessible in youth, but capable of aging beautifully. Luján de Cuyo and Tupungato have established themselves as Mendoza's finest sub-regions, producing Malbec that has permanently elevated Argentina's wine reputation.",
        mapCenter: { lat: -32.89, lng: -68.84, zoom: 8 },
      },
      {
        id: "big-reds-barossa",
        type: "region",
        targetId: "barossa-valley",
        title: "Barossa Valley — Old Vine Shiraz",
        narrative:
          "The Barossa Valley in South Australia has some of the oldest commercially producing grapevines in the world — Shiraz vines planted in the 1840s that survived because Australia never had phylloxera. Old vines produce little fruit, but extraordinary fruit: concentrated, complex, deeply expressive. Barossa Shiraz is a force of nature — dense, rich, with dark berry, chocolate, and black pepper, often finishing with leather and licorice. Penfolds Grange — the Barossa's most famous wine — is one of the world's iconic bottles, a Shiraz (with a touch of Cabernet) that ages magnificently for decades. This is wine from old vines in hot country, and it shows.",
        mapCenter: { lat: -34.53, lng: 138.96, zoom: 9 },
      },
      {
        id: "big-reds-napa",
        type: "region",
        targetId: "napa-valley",
        title: "Napa Valley — California's Finest Hour",
        narrative:
          "The 1976 Judgment of Paris changed everything. When California wines — specifically Napa Cabernet and Chardonnay — beat the finest Bordeaux and Burgundy in a blind tasting by French judges, the wine world had to reckon with the fact that greatness didn't have a European monopoly. Napa Valley Cabernet Sauvignon is a particular creature: riper and more opulent than Bordeaux, with velvety tannins, lush fruit, and a generosity that makes it immediately appealing. The best examples — Opus One, Screaming Eagle, Ridge, Stag's Leap — are as complex and age-worthy as any Bordeaux. Different, yes. Lesser? Absolutely not.",
        mapCenter: { lat: 38.5, lng: -122.38, zoom: 9 },
      },
    ],
  },

  // ── JOURNEY 8 ────────────────────────────────────────────────────────────────
  {
    id: "hidden-gems-uncommon-regions",
    title: "Hidden Gems: Uncommon Wine Regions",
    subtitle: "Six wine regions that most people overlook — and shouldn't",
    description:
      "The wine world is vastly larger than the handful of famous regions that dominate restaurant wine lists. This journey takes you to six extraordinary regions that are flying under the radar — producing exceptional wine from ancient traditions, unusual grapes, and remarkable landscapes.",
    category: "region",
    difficulty: "advanced",
    estimatedMinutes: 15,
    stopCount: 6,
    coverGradient: "linear-gradient(135deg, #2a4a50 0%, #3a6a6e 50%, #5a8a8c 100%)",
    icon: "gem",
    stops: [
      {
        id: "hidden-santorini",
        type: "region",
        targetId: "santorini",
        title: "Santorini, Greece — Volcanic Beauty",
        narrative:
          "The images everyone knows from Santorini are whitewashed buildings and blue domes. But this volcanic island also produces one of Greece's most distinctive wines: Assyrtiko, a white grape that grows in basket-shaped 'kouloura' formations to protect from the Aegean winds. The vines are ancient — some pre-phylloxera — growing in ashy volcanic soil on an island with almost no rainfall. The wines are extraordinary: searingly mineral, electric with acidity, deeply concentrated. Assyrtiko is one of the world's genuinely great white grapes, and almost nobody outside Greece knew about it until recently. That's changing rapidly.",
        mapCenter: { lat: 36.39, lng: 25.46, zoom: 10 },
      },
      {
        id: "hidden-kakheti",
        type: "region",
        targetId: "kakheti",
        title: "Kakheti, Georgia — The Cradle of Wine",
        narrative:
          "Georgia makes a serious claim to being where wine was invented — archaeological evidence of winemaking here dates back 8,000 years. In Kakheti, in the east of the country, the ancient qvevri tradition (clay vessels buried in the earth) is still practiced alongside modern winemaking. The country has hundreds of indigenous grape varieties, most unknown outside its borders. Rkatsiteli, Saperavi, Mtsvane — these are fascinating, distinct varieties producing wines unlike anything from Western Europe. Georgia is a wine country of genuine historical depth, and it's producing increasingly impressive modern expressions alongside the ancient orange wine tradition. Add it to your list.",
        mapCenter: { lat: 41.64, lng: 45.99, zoom: 8 },
      },
      {
        id: "hidden-finger-lakes",
        type: "region",
        targetId: "finger-lakes",
        title: "Finger Lakes, New York — America's Riesling Country",
        narrative:
          "If you told most Americans that some of the world's finest Riesling comes from New York State, they'd be skeptical. They shouldn't be. The deep glacial lakes of the Finger Lakes region moderate the otherwise brutal winters, creating growing conditions cool enough for Riesling, Gewürztraminer, and Cabernet Franc — the classic cool-climate grapes. Dr. Konstantin Frank pioneered European grape varieties here in the 1960s when everyone said it couldn't be done. Today, producers like Hermann J. Wiemer and Forge Cellars are making Riesling that competes with the Mosel. It's one of America's most exciting wine stories, and it's still being written.",
        mapCenter: { lat: 42.6, lng: -76.9, zoom: 9 },
      },
      {
        id: "hidden-guadalupe",
        type: "region",
        targetId: "valle-de-guadalupe",
        title: "Valle de Guadalupe, Mexico — Baja's Wine Renaissance",
        narrative:
          "Just 90 minutes south of San Diego, in a dry valley in Baja California, something extraordinary has been happening. Valle de Guadalupe has gone from anonymous bulk wine production to one of Latin America's most talked-about wine destinations — home to inventive producers, destination restaurants, and a wine culture that feels entirely its own. Mediterranean varieties like Tempranillo, Grenache, and Nebbiolo thrive in the dry heat. The wines are often bold, earthy, and food-driven, reflecting the valley's strong culinary culture. This is one of those places where you can still arrive at the beginning of something — and that early-adopter feeling is part of the appeal.",
        mapCenter: { lat: 32.01, lng: -116.67, zoom: 10 },
      },
      {
        id: "hidden-bekaa",
        type: "region",
        targetId: "bekaa-valley",
        title: "Bekaa Valley, Lebanon — Winemaking Against the Odds",
        narrative:
          "Lebanon has been making wine for at least 5,000 years — Phoenician traders spread wine culture across the Mediterranean — and the Bekaa Valley's high altitude and limestone soils are perfect for viticulture. What makes Lebanese wine remarkable isn't just quality (Château Musar, in particular, is one of the world's genuinely great wine producers) but the resilience of the people making it. Winemaking has continued through wars, economic crises, and political instability that would have ended most wine industries. That determination is in the wine. Musar's red blends — Cabernet Sauvignon, Cinsault, Carignan — age magnificently and taste like nothing else on earth.",
        mapCenter: { lat: 33.85, lng: 36.0, zoom: 9 },
      },
      {
        id: "hidden-cappadocia",
        type: "region",
        targetId: "cappadocia",
        title: "Cappadocia, Turkey — Ancient Vines, Modern Revival",
        narrative:
          "Cappadocia — famous for its extraordinary lunar landscape, fairy chimneys, and hot air balloons at dawn — is also home to one of the oldest wine traditions in the world. Anatolia has been growing grapes for at least 6,000 years. The volcanic soils, extreme continental climate, and high altitude create conditions for genuinely distinctive wine. Öküzgözü and Boğazkere are the key indigenous red varieties: robust, earthy, deeply colored, with a character that is unmistakably Anatolian. Turkish wine is experiencing a serious renaissance — producers are investing in quality, international varietals are arriving alongside indigenous ones, and international critics are starting to pay attention. This one is worth tracking.",
        mapCenter: { lat: 38.65, lng: 34.84, zoom: 9 },
      },
    ],
  },

  // ── JOURNEY 9 ────────────────────────────────────────────────────────────────
  {
    id: "white-wine-deep-dive",
    title: "White Wine Deep Dive",
    subtitle: "Five regions, five completely different expressions of what white wine can be",
    description:
      "White wine is vastly underestimated as a category for serious drinking. This journey explores five regions and styles that show the full spectrum — from rich, oaky Chardonnay to bone-dry <strong>Grüner Veltliner</strong>, from peach-blossom Riesling to zingy Sauvignon Blanc — and argues that the best whites can be as profound as any red.",
    category: "grape",
    difficulty: "intermediate",
    estimatedMinutes: 12,
    stopCount: 5,
    coverGradient: "linear-gradient(135deg, #6a5a3a 0%, #8a7a50 50%, #a89a6a 100%)",
    icon: "drop",
    stops: [
      {
        id: "white-burgundy",
        type: "region",
        targetId: "burgundy",
        title: "Burgundy — Chardonnay as High Art",
        narrative:
          "Great white Burgundy — Meursault, Puligny-Montrachet, Chassagne-Montrachet — is one of wine's most complete experiences. This is Chardonnay with nowhere to hide: the grape's natural tendencies (lemon, apple, cream) become something extraordinary on these limestone slopes, developing hazelnut, brioche, mineral tension, and a richness that has nothing to do with oak. The best examples improve for 15-20 years in bottle, gaining depth and complexity at every stage. Then there's Chablis, up in the cool north: steely, flinty, the most austere and mineral Chardonnay expression in the world. Two completely different styles from the same region, the same grape. That's Burgundy.",
        mapCenter: { lat: 47.04, lng: 4.84, zoom: 8 },
      },
      {
        id: "white-alsace",
        type: "region",
        targetId: "alsace",
        title: "Alsace — The Aromatic Capital of France",
        narrative:
          "Alsace sits in France's northeastern corner, sheltered from Atlantic rain by the Vosges mountains — which gives it a surprisingly sunny, dry microclimate. The result is intensely aromatic white wines of real depth: Riesling with extraordinary mineral precision, Gewürztraminer with its signature lychee and rose petal intensity, Pinot Gris with smoky, honeyed richness. Alsace wines are usually dry (though the late-harvest 'Vendange Tardive' and 'Sélection de Grains Nobles' selections are stunning dessert wines), and labeled by grape variety rather than village — rare in France's appellation system. These are wines for thinking about, for pairing thoughtfully with food, for serious drinking.",
        mapCenter: { lat: 48.35, lng: 7.44, zoom: 8 },
      },
      {
        id: "white-marlborough",
        type: "region",
        targetId: "marlborough",
        title: "Marlborough — How One Region Changed the World",
        narrative:
          "In 1985, Cloudy Bay released its first vintage of Sauvignon Blanc and essentially created a global category. Marlborough, at the top of New Zealand's South Island, has an extreme cool-climate character: long sunny days, cold nights, very intense UV radiation. The result is Sauvignon Blanc of explosive pungency — gooseberry, passionfruit, freshly cut grass, sometimes capsicum — with high acidity and absolutely unmistakable varietal character. Cloudy Bay made Marlborough Sauvignon the first 'cult' Sauvignon Blanc, and the style was so successful it was immediately copied around the world. The originals — the best Marlborough producers — still make the definitive versions.",
        mapCenter: { lat: -41.51, lng: 173.96, zoom: 9 },
      },
      {
        id: "white-vinho-verde",
        type: "region",
        targetId: "vinho-verde",
        title: "Vinho Verde — Portugal's Freshness in a Glass",
        narrative:
          "The name means 'green wine' — not because of the color (it's white, or sometimes rosé or red), but because it's drunk young and fresh. From Portugal's lush, rainy northwest, Vinho Verde is made from indigenous varieties like Alvarinho (Albariño), Loureiro, and Arinto: low in alcohol, high in acidity, often with a slight spritz from a gentle secondary fermentation. This is the perfect summer wine — cold, fresh, citrusy, effortlessly food-friendly. Mono-varietal Alvarinho from the Monção e Melgaço sub-region reaches another level entirely: more concentrated, more structured, seriously complex. It's one of Portugal's greatest white grapes, and most people still don't know it.",
        mapCenter: { lat: 41.8, lng: -8.39, zoom: 8 },
      },
      {
        id: "white-wachau",
        type: "region",
        targetId: "wachau",
        title: "Wachau — <strong>Grüner Veltliner</strong>'s Dramatic Home",
        narrative:
          "The Wachau is a UNESCO World Heritage Site — and when you see those impossibly steep terraced vineyards above the Danube, you understand why. <strong>Grüner Veltliner</strong>, Austria's signature white grape, reaches its peak on these rocky terraces: dry, mineral, with a distinctive white pepper spice, refreshing acidity, and real body and depth. The three-tier Wachau classification — Steinfeder (lightest), Federspiel (medium), Smaragd (richest, from the finest sites) — gives you a useful roadmap. The best Smaragd <strong>Grüner Veltliner</strong> from producers like FX Pichler and Domäne Wachau are genuinely world-class wines that can age for a decade or more. Austria's wine renaissance is real and the Wachau is its crown jewel.",
        mapCenter: { lat: 48.37, lng: 15.43, zoom: 9 },
      },
    ],
  },

  // ── JOURNEY 10 ───────────────────────────────────────────────────────────────
  {
    id: "how-terroir-works",
    title: "How Terroir Works",
    subtitle: "The single most important concept in wine, explained through five places",
    description:
      "Terroir is a French word with no perfect English translation — it means something like 'the taste of a place.' This journey unpacks the concept through five vivid examples: soil types, climate effects, topography, and the human element that binds it all together.",
    category: "theme",
    difficulty: "beginner",
    estimatedMinutes: 10,
    stopCount: 6,
    coverGradient: "linear-gradient(135deg, #5a4a3a 0%, #7a6a52 50%, #9a8a6a 100%)",
    icon: "earth",
    stops: [
      {
        id: "terroir-concept",
        type: "concept",
        title: "What Is Terroir?",
        narrative:
          "Here's the idea: place matters. Not in an abstract or romantic way, but in a measurable, tasted, proven way. Terroir encompasses everything about a place that affects the wine — the soil composition, the climate, the aspect (which direction the vines face), the altitude, the proximity to water. But it also includes something less tangible: the accumulated human knowledge of that place, the centuries of learning which plots grow the best fruit, which varieties thrive, which methods work. When you taste a great Riesling from the Mosel, you're tasting the slate. When you taste a great <strong>Assyrtiko from Santorini</strong>, you're tasting the volcano. Terroir is real, and once you start noticing it, you can't stop.",
        mapCenter: { lat: 45, lng: 10, zoom: 3 },
      },
      {
        id: "terroir-burgundy",
        type: "region",
        targetId: "burgundy",
        title: "Burgundy — Soil Tells the Story",
        narrative:
          "Nowhere illustrates terroir more precisely than Burgundy's Côte d'Or. Two vineyards separated by a few meters of path can produce wines that taste completely different — and this has been documented, mapped, and debated for over a thousand years. The soil here is limestone-rich, but its composition changes at every level of the slope: more clay in the valley, more limestone at altitude, different proportions at every point. These differences in soil drainage, mineral composition, and water retention translate directly into different wine characters. Grands Crus (the best sites) tend to sit at mid-slope, where drainage is ideal and limestone is perfectly balanced with clay. It's not magic — it's geology.",
        mapCenter: { lat: 47.04, lng: 4.84, zoom: 9 },
      },
      {
        id: "terroir-mosel",
        type: "region",
        targetId: "mosel",
        title: "Mosel — When Slope and Slate Change Everything",
        narrative:
          "The Mosel's dramatic terroir lesson is about two things: the angle of the slope and the color of the soil. Riesling vines here grow on slopes so steep (up to 65%) that machinery can't access them — everything must be done by hand, making it among the most expensive viticulture in the world. That steep angle means vines face directly south, maximizing every hour of weak northern European sunlight. The blue-grey slate soil absorbs heat during the day and releases it at night, helping grapes ripen in a region that would otherwise be too cold. It also drains freely, stressing the vines and concentrating flavor. The wine tastes like minerality with feet — you can taste the rock.",
        mapCenter: { lat: 49.96, lng: 7.13, zoom: 9 },
      },
      {
        id: "terroir-santorini",
        type: "region",
        targetId: "santorini",
        title: "Santorini — Volcanic Soil, Extreme Character",
        narrative:
          "Santorini's terroir story starts 3,600 years ago, when a volcanic eruption of almost unimaginable violence covered the island in meters of ash. That ash became the soil: pumice, volcanic rock, almost no water retention, no organic matter. Vines here are trained in a unique basket shape (kouloura) to protect the grapes from the Aegean winds and create a microclimate of shade and moisture around the fruit. There's no topsoil to speak of, no irrigation allowed — the vines find water through volcanic rock. Phylloxera, the louse that destroyed almost every European vineyard in the 19th century, can't survive in volcanic soil. So Santorini's vines are often pre-phylloxera: some over 200 years old. The resulting Assyrtiko has a searing, volcanic mineral quality that is absolutely site-specific.",
        mapCenter: { lat: 36.39, lng: 25.46, zoom: 10 },
      },
      {
        id: "terroir-barossa",
        type: "region",
        targetId: "barossa-valley",
        title: "Barossa — Old Vines in Hot Country",
        narrative:
          "Terroir isn't just about soil and climate — it's also about vine age. In the Barossa Valley, old Shiraz vines (some planted in the 1840s, pre-phylloxera) produce dramatically different wine than young vines would. Old vines have root systems that reach meters deep into the subsoil, finding water and minerals in ways younger vines can't. They produce far less fruit per vine, but that fruit is extraordinarily concentrated and complex. The hot, dry continental climate of the Barossa adds another dimension: grapes ripen quickly and fully, producing wines of density and power. But the best old-vine producers manage that heat through elevation (cooler Eden Valley) and dry farming. Terroir, vine age, and human wisdom working together.",
        mapCenter: { lat: -34.53, lng: 138.96, zoom: 9 },
      },
      {
        id: "terroir-conclusion",
        type: "concept",
        title: "The Human Element",
        narrative:
          "Here's the piece that often gets left out of terroir discussions: people. Terroir doesn't express itself automatically — it requires generations of human observation, experimentation, and accumulated knowledge to reveal what a place is capable of. The Burgundian monks who mapped individual vineyard plots over centuries were scientists as much as religious men. The families who have farmed the same Mosel slopes for generations understand their land in ways that no outside expert ever could. Terroir is a collaboration between place and people — the place provides the raw material, and the people learn, over generations, how to let it speak. That's why wine is cultural history as much as agriculture.",
        mapCenter: { lat: 45, lng: 10, zoom: 3 },
      },
    ],
  },
];
