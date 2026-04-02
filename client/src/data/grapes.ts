export interface GrapeVariety {
  id: string;
  name: string;
  color: "red" | "white";
  aliases: string[];
  description: string; // 3-4 sentences, brand voice
  flavorProfile: string[];
  bodyLevel: "light" | "medium" | "full";
  acidityLevel: "low" | "medium" | "high";
  tanninLevel: "low" | "medium" | "high"; // for reds
  regionIds: string[]; // where it's primarily grown (use existing region IDs)
  foodPairings: string[];
  funFact: string; // one surprising/memorable fact
  servingTemp: string; // e.g. "16-18°C"
}

export const grapes: GrapeVariety[] = [
  // ── RED GRAPES ───────────────────────────────────────────────────────────────

  {
    id: "cabernet-sauvignon",
    name: "Cabernet Sauvignon",
    color: "red",
    aliases: ["Cab Sauv", "Cab"],
    description:
      "The undisputed king of red wine — structured, powerful, built for the long haul. Cabernet Sauvignon is the backbone of Bordeaux's legendary First Growths and Napa Valley's most celebrated bottles, producing wines of architectural precision: blackcurrant, cedar, graphite, and tannins that need time to soften but reward every year of patience. It's a grape that travels well — planted successfully in virtually every wine-producing country — yet always retains that core of dark fruit and authority. If you're new to wine and want to understand why people get so serious about it, open a good Cabernet Sauvignon and wait.",
    flavorProfile: [
      "Blackcurrant",
      "Cedar",
      "Graphite",
      "Dark Cherry",
      "Tobacco",
      "Black Olive",
      "Mint",
    ],
    bodyLevel: "full",
    acidityLevel: "medium",
    tanninLevel: "high",
    regionIds: ["bordeaux", "napa-valley", "tuscany", "ribera-del-duero", "maipo-colchagua", "margaret-river"],
    foodPairings: [
      "Aged beef",
      "Lamb chops",
      "Hard cheeses",
      "Mushroom dishes",
      "Dark chocolate",
    ],
    funFact:
      "Cabernet Sauvignon is a natural genetic cross between Cabernet Franc and Sauvignon Blanc that happened spontaneously in 17th-century Bordeaux — nobody planned the world's most famous grape variety.",
    servingTemp: "17-19°C",
  },

  {
    id: "pinot-noir",
    name: "Pinot Noir",
    color: "red",
    aliases: ["Pinot", "PN"],
    description:
      "The most transparent grape in the world — and the most heartbreaking. Pinot Noir shows everything: the soil, the weather, the vintage, the winemaker's every decision. At its best, in Burgundy's Côte d'Or or Willamette Valley or Central Otago, it produces wines of haunting complexity — cherry, raspberry, dried rose, forest floor, an almost ethereal silkiness that doesn't seem possible from fermented fruit. Thin-skinned and demanding, it's notoriously difficult to grow and make. People dedicate their lives to understanding it, and the best bottles justify that devotion entirely.",
    flavorProfile: [
      "Red Cherry",
      "Raspberry",
      "Dried Rose",
      "Earth",
      "Forest Floor",
      "Mushroom",
      "Vanilla",
    ],
    bodyLevel: "light",
    acidityLevel: "high",
    tanninLevel: "low",
    regionIds: ["burgundy", "champagne", "willamette", "central-otago", "yarra-valley", "sonoma"],
    foodPairings: [
      "Duck breast",
      "Roast chicken",
      "Salmon",
      "Truffle pasta",
      "Soft cheeses",
    ],
    funFact:
      "Pinot Noir is genetically one of the oldest cultivated grape varieties — it has more than 1,000 documented genetic descendants, including Chardonnay, Gamay, and Aligoté.",
    servingTemp: "14-16°C",
  },

  {
    id: "merlot",
    name: "Merlot",
    color: "red",
    aliases: [],
    description:
      "Merlot got a bad reputation from a movie scene (the Miles rant in 'Sideways'), and it has been quietly overcoming that injustice ever since. At its best — in Pomerol and Saint-Émilion on Bordeaux's Right Bank — Merlot produces wines of extraordinary richness and complexity: plum, truffle, chocolate, velvet. Pétrus is Merlot. The world's most sought-after wine is Merlot. It's also one of the most food-friendly red grapes: naturally round and soft, with lower tannins than Cabernet Sauvignon, it pairs with almost anything. When it's made well, there's nothing quite like it.",
    flavorProfile: [
      "Plum",
      "Dark Cherry",
      "Chocolate",
      "Mocha",
      "Truffle",
      "Herbs",
      "Velvet",
    ],
    bodyLevel: "full",
    acidityLevel: "medium",
    tanninLevel: "medium",
    regionIds: ["bordeaux", "tuscany", "napa-valley", "sonoma"],
    foodPairings: [
      "Roast pork",
      "Beef stew",
      "Pizza",
      "Mushroom risotto",
      "Aged cheddar",
    ],
    funFact:
      "Pétrus — one of the world's most expensive wines, fetching tens of thousands of dollars per bottle — is made almost entirely from Merlot, the grape that 'Sideways' taught a generation to dismiss.",
    servingTemp: "16-18°C",
  },

  {
    id: "syrah",
    name: "Syrah",
    color: "red",
    aliases: ["Shiraz"],
    description:
      "Same grape, two completely different personalities depending on where it grows — and that duality is what makes Syrah so fascinating. In the northern Rhône (Côte-Rôtie, Hermitage), it's a wine of brooding intensity: dark fruit, black pepper, bacon fat, iron, violet. Austere and age-worthy, requiring patience. In the Barossa Valley, going by the name Shiraz, it becomes something else entirely: ripe, generous, chocolatey, immediately inviting. Both are legitimate expressions of an extraordinary grape that has traveled the world — to Australia, South Africa, Washington State — and adapted brilliantly to each new home.",
    flavorProfile: [
      "Dark Berry",
      "Black Pepper",
      "Bacon",
      "Violet",
      "Chocolate",
      "Licorice",
      "Iron",
    ],
    bodyLevel: "full",
    acidityLevel: "medium",
    tanninLevel: "high",
    regionIds: ["rhone", "barossa-valley", "stellenbosch", "swartland", "paso-robles"],
    foodPairings: [
      "Lamb",
      "Grilled meats",
      "Game birds",
      "Hard aged cheeses",
      "Black olive tapenade",
    ],
    funFact:
      "For centuries, people believed Shiraz originated in the Persian city of Shiraz, making it wine's most romantic origin myth — but DNA analysis has proven it's actually native to the Rhône Valley in France.",
    servingTemp: "17-19°C",
  },

  {
    id: "tempranillo",
    name: "Tempranillo",
    color: "red",
    aliases: ["Tinto Fino", "Tinta del País", "Aragonez", "Cencibel"],
    description:
      "Spain's greatest native red grape and the soul of two of the country's most important wine regions: Rioja and Ribera del Duero, where it goes by local names but expresses a consistent character — earthy red fruit, leather, tobacco, vanilla from oak — that is unmistakably Spanish. Tempranillo's name comes from 'temprano' (early) because it ripens earlier than other Spanish varieties. It's a grape that loves oak, often spending years in barrel and bottle before release, emerging with a dried fruit, leathery complexity that is deeply traditional. But it also responds brilliantly to modern shorter aging, producing more immediately fruity styles.",
    flavorProfile: [
      "Dried Cherry",
      "Leather",
      "Tobacco",
      "Vanilla",
      "Strawberry",
      "Earth",
      "Cedar",
    ],
    bodyLevel: "medium",
    acidityLevel: "medium",
    tanninLevel: "medium",
    regionIds: ["rioja", "ribera-del-duero", "douro"],
    foodPairings: [
      "Lamb chops",
      "Ibérico ham",
      "Aged Manchego",
      "Suckling pig",
      "Lentil stew",
    ],
    funFact:
      "Traditional Rioja Gran Reserva wines must spend at least 5 years aging (18 months of which are in oak barrel) before release — meaning the wine on the shelf was made years before you were even thinking about buying it.",
    servingTemp: "16-18°C",
  },

  {
    id: "sangiovese",
    name: "Sangiovese",
    color: "red",
    aliases: ["Brunello", "Morellino", "Prugnolo Gentile"],
    description:
      "Sangiovese is Italy's most-planted red grape and Tuscany's soul — the grape behind Chianti, Brunello di Montalcino, Morellino di Scansano, and dozens of other beloved styles. Its character is unmistakable: bright cherry fruit, high acidity, firm tannins, and a slightly bitter, drying finish that makes it absolutely perfect with food — especially tomato-based dishes and anything with olive oil. Brunello di Montalcino, made from a single Sangiovese clone called Brunello, is one of Italy's most prestigious and age-worthy wines, developing extraordinary complexity over decades. The grape's bitterness and tartness, which can read as fault in poor examples, become vivid virtues in the right hands.",
    flavorProfile: [
      "Tart Cherry",
      "Red Plum",
      "Leather",
      "Dried Herbs",
      "Espresso",
      "Violet",
      "Tobacco",
    ],
    bodyLevel: "medium",
    acidityLevel: "high",
    tanninLevel: "high",
    regionIds: ["tuscany"],
    foodPairings: [
      "Pasta with tomato sauce",
      "Bistecca fiorentina",
      "Wild boar ragu",
      "Pizza Margherita",
      "Pecorino cheese",
    ],
    funFact:
      "The name Sangiovese may derive from 'Sanguis Jovis' — 'Blood of Jupiter' in Latin — suggesting it's been romanticized since at least the Roman period, possibly for thousands of years.",
    servingTemp: "16-18°C",
  },

  {
    id: "nebbiolo",
    name: "Nebbiolo",
    color: "red",
    aliases: ["Spanna", "Chiavennasca"],
    description:
      "Nebbiolo is not for the faint-hearted — it's the most demanding, most tannic, most age-requiring grape in the winemaking world, and it rewards patience that most modern wine drinkers struggle to summon. In Barolo and Barbaresco in Piedmont, it produces wines of staggering depth: dried roses, tar, licorice, leather, cherry, earth — an experience that unfolds in the glass for hours and in the cellar for decades. It's also notoriously temperamental in the vineyard: prone to oxidation, disease-sensitive, yielding low crops. But when Nebbiolo is great, it's among the most profound and moving wine experiences available. It just asks you to wait — and wait, and wait.",
    flavorProfile: [
      "Dried Rose",
      "Tar",
      "Cherry",
      "Licorice",
      "Leather",
      "Tobacco",
      "Earth",
    ],
    bodyLevel: "full",
    acidityLevel: "high",
    tanninLevel: "high",
    regionIds: ["piedmont"],
    foodPairings: [
      "Braised beef",
      "Truffles",
      "Aged Parmigiano",
      "Wild mushroom risotto",
      "Lamb stew",
    ],
    funFact:
      "Barolo is sometimes called 'the wine of kings and the king of wines' — and it takes its name from the village where Catherine de' Medici supposedly brought the grape to the attention of Italian nobility.",
    servingTemp: "17-20°C",
  },

  {
    id: "malbec",
    name: "Malbec",
    color: "red",
    aliases: ["Côt", "Auxerrois"],
    description:
      "Malbec found its destiny not in Bordeaux, where it was a bit player in blends, but in the Argentine Andes, where high altitude and intense sunshine transformed it into something extraordinary. In Mendoza, Malbec produces wines of deep purple color, velvety texture, and dark fruit concentration — plum, blueberry, blackberry — with a freshness from altitude that keeps them from feeling heavy. It's also one of wine's greatest accessibility stories: genuinely delicious young, friendly with food, easy to love without a sommelier's guide. The best examples — from old vines in Luján de Cuyo at serious elevation — show real complexity and age-worthiness.",
    flavorProfile: [
      "Plum",
      "Blueberry",
      "Blackberry",
      "Violet",
      "Chocolate",
      "Tobacco",
      "Vanilla",
    ],
    bodyLevel: "full",
    acidityLevel: "medium",
    tanninLevel: "medium",
    regionIds: ["mendoza", "maipo-colchagua"],
    foodPairings: [
      "Asado (Argentine BBQ)",
      "Empanadas",
      "Beef ribs",
      "Burgers",
      "Blue cheese",
    ],
    funFact:
      "In 2013, Argentina officially declared Malbec its 'national grape' — fitting recognition for a variety that barely registers in its French homeland but built an entire country's wine reputation.",
    servingTemp: "16-18°C",
  },

  {
    id: "grenache",
    name: "Grenache",
    color: "red",
    aliases: ["Garnacha", "Grenache Noir", "Cannonau"],
    description:
      "Grenache is the workhorse that became a thoroughbred — originally planted everywhere for bulk production, now recognized as one of the world's genuinely great red varieties when grown in the right place. In Châteauneuf-du-Pape and the southern Rhône, it's the dominant grape in legendary blends: ripe red fruit, garrigue, spice, warmth. In Spain as Garnacha, especially in Priorat, it achieves extraordinary mineral depth from old vines on slate soils. It's naturally low in acid and high in alcohol, which means it can be flabby in the wrong hands but gloriously opulent when everything lines up right. In Sardinia, as Cannonau, it's reportedly the local longevity secret — which makes for a good excuse to drink more of it.",
    flavorProfile: [
      "Strawberry",
      "Raspberry",
      "Orange Peel",
      "White Pepper",
      "Herbs",
      "Kirsch",
      "Spice",
    ],
    bodyLevel: "medium",
    acidityLevel: "low",
    tanninLevel: "low",
    regionIds: ["rhone", "priorat", "rioja", "languedoc-roussillon"],
    foodPairings: [
      "Grilled lamb",
      "Tapas",
      "Roasted vegetables",
      "Charcuterie",
      "Spiced dishes",
    ],
    funFact:
      "Some of the world's oldest producing grapevines are Grenache — there are examples in Spain's Calatayud region exceeding 100 years old, and in Sardinia vines said to be over 200 years old still produce fruit.",
    servingTemp: "16-18°C",
  },

  {
    id: "gamay",
    name: "Gamay",
    color: "red",
    aliases: ["Gamay Noir"],
    description:
      "Gamay is Beaujolais — light, bright, joyously drinkable, with an exuberance that makes serious wine people either dismiss it or love it completely. Fresh red cherry, raspberry, a slight floral lift, low tannins, refreshing acidity — this is wine for Tuesday lunch, for picnics, for the first glass of the evening when you just want something delicious without overthinking it. But here's what most people miss: the ten Beaujolais Crus (Moulin-à-Vent, Morgon, Fleurie, Chiroubles, and others) make genuinely serious Gamay that ages well and develops real complexity. Morgon in particular can be as haunting as a good Burgundy. Gamay contains multitudes.",
    flavorProfile: [
      "Red Cherry",
      "Raspberry",
      "Violet",
      "Banana",
      "Black Pepper",
      "Light Earth",
    ],
    bodyLevel: "light",
    acidityLevel: "high",
    tanninLevel: "low",
    regionIds: ["burgundy", "loire"],
    foodPairings: [
      "Charcuterie",
      "Roast chicken",
      "Tuna salad",
      "Light pasta dishes",
      "Brie",
    ],
    funFact:
      "In 1395, Philip the Bold, Duke of Burgundy, banned Gamay from Burgundy's finest vineyards by royal decree, calling it a 'disloyal plant' — which is how it ended up concentrated in Beaujolais to the south.",
    servingTemp: "12-14°C",
  },

  {
    id: "mourvedre",
    name: "Mourvèdre",
    color: "red",
    aliases: ["Monastrell", "Mataro"],
    description:
      "Mourvèdre is the wild card in any blend — deep in color, powerful in tannins, laden with savory, almost animal flavors that can make you think of a barnyard in the best possible way. It loves heat and hates cool climates; in Bandol on the Provence coast it reaches its purest expression, making dense, structured wines of extraordinary complexity that need a decade to truly open. As Monastrell in Spain, it's more immediately accessible but still distinctive — meaty, earthy, dark-fruited. It's a key component in Châteauneuf-du-Pape blends and the Grenache-Syrah-Mourvèdre ('GSM') blends that are the signature of the southern Rhône.",
    flavorProfile: [
      "Blackberry",
      "Meat",
      "Earth",
      "Dark Chocolate",
      "Herbs",
      "Iron",
      "Leather",
    ],
    bodyLevel: "full",
    acidityLevel: "medium",
    tanninLevel: "high",
    regionIds: ["rhone", "languedoc-roussillon", "provence"],
    foodPairings: [
      "Bouillabaisse",
      "Grilled lamb",
      "Game meat",
      "Hard sheep's milk cheese",
      "Tapenade",
    ],
    funFact:
      "Mourvèdre ripens so late in the season that it requires coastal proximity to moderate temperatures — in cooler inland sites it stubbornly refuses to ripen properly, making it one of viticulture's most demanding divas.",
    servingTemp: "17-19°C",
  },

  {
    id: "zinfandel",
    name: "Zinfandel",
    color: "red",
    aliases: ["Primitivo", "Crljenak Kaštelanski"],
    description:
      "For decades, Zinfandel was considered America's grape — California's own, a source of national wine pride. Then DNA testing revealed it was genetically identical to Primitivo from southern Italy and Crljenak Kaštelanski from Croatia, making it one of wine's great identity stories. In California, especially in Sonoma's Dry Creek Valley and Amador County in the Sierra Foothills, old-vine Zinfandel makes wines of extraordinary richness: jammy blackberry, black pepper, spice, sometimes almost Port-like in concentration. Primitivo in Puglia is denser, more rustic, and can be extraordinary value. Both styles share the grape's characteristic exuberance — this is wine that announces itself.",
    flavorProfile: [
      "Blackberry Jam",
      "Raspberry",
      "Black Pepper",
      "Spice",
      "Chocolate",
      "Tobacco",
    ],
    bodyLevel: "full",
    acidityLevel: "medium",
    tanninLevel: "medium",
    regionIds: ["sonoma", "paso-robles"],
    foodPairings: [
      "BBQ ribs",
      "Spicy sausages",
      "Pizza",
      "Aged cheddar",
      "Beef brisket",
    ],
    funFact:
      "White Zinfandel — the pink, slightly sweet style that became America's best-selling wine in the 1980s — was invented by accident when a fermentation at Sutter Home stopped early, leaving residual sugar in what was meant to be a dry rosé.",
    servingTemp: "16-18°C",
  },

  // ── WHITE GRAPES ─────────────────────────────────────────────────────────────

  {
    id: "chardonnay",
    name: "Chardonnay",
    color: "white",
    aliases: [],
    description:
      "Chardonnay is the shape-shifter — the most versatile white grape on the planet, capable of making everything from bone-dry, searingly mineral Chablis to rich, buttery California barrel-fermented blockbusters. That versatility is both its greatest strength and the source of all its controversy: 'ABC' (Anything But Chardonnay) was a whole movement of people who were tired of over-oaked, over-extracted versions. But great Chardonnay — white Burgundy at its best, Blanc de Blancs Champagne, serious Chablis, Yarra Valley cool-climate expressions — is among the most profound white wine experiences possible. The grape isn't the problem. The misuse of it is.",
    flavorProfile: [
      "Lemon",
      "Apple",
      "Butter",
      "Cream",
      "Hazelnut",
      "Brioche",
      "Tropical Fruit",
    ],
    bodyLevel: "full",
    acidityLevel: "medium",
    tanninLevel: "low",
    regionIds: ["burgundy", "champagne", "napa-valley", "sonoma", "yarra-valley", "margaret-river"],
    foodPairings: [
      "Roast chicken",
      "Lobster",
      "Creamy pasta",
      "Grilled fish",
      "Brie",
    ],
    funFact:
      "Chardonnay is a direct genetic offspring of Pinot Noir and Gouais Blanc, an ancient variety — making it, in a sense, Burgundy's native child, perfectly adapted to the soils where it has grown for over a thousand years.",
    servingTemp: "10-13°C",
  },

  {
    id: "sauvignon-blanc",
    name: "Sauvignon Blanc",
    color: "white",
    aliases: ["Sauv Blanc", "Fumé Blanc"],
    description:
      "If Chardonnay is the shape-shifter, Sauvignon Blanc is the loud one who makes friends immediately. You know it from the first whiff — gooseberry, freshly cut grass, sometimes passionfruit or even capsicum, always with a piercingly fresh acidity. In the Loire Valley (Sancerre, Pouilly-Fumé), it has a mineral, flinty restraint. In Marlborough, New Zealand, it opened with guns blazing and changed what mass-market white wine could taste like. In Bordeaux, it blends with Sémillon for wines both dry and lusciously sweet (Sauternes). It's an opinionated grape — some people love that assertiveness, some find it exhausting. But there's no pretending you don't notice it.",
    flavorProfile: [
      "Gooseberry",
      "Citrus",
      "Freshly Cut Grass",
      "Passionfruit",
      "White Peach",
      "Flint",
    ],
    bodyLevel: "light",
    acidityLevel: "high",
    tanninLevel: "low",
    regionIds: ["loire", "marlborough", "bordeaux", "sonoma"],
    foodPairings: [
      "Goat cheese",
      "Oysters",
      "Green salads",
      "White fish",
      "Asparagus",
    ],
    funFact:
      "Cloudy Bay's 1985 debut vintage in Marlborough is widely credited with creating the 'New Zealand Sauvignon Blanc' category that now represents the country's most recognizable wine export — one bottle helped build an industry.",
    servingTemp: "8-10°C",
  },

  {
    id: "riesling",
    name: "Riesling",
    color: "white",
    aliases: ["Rhine Riesling", "Johannisberg Riesling"],
    description:
      "Riesling may be the most misunderstood great grape in the world — and the most underappreciated. People hear 'Riesling' and assume sweet, but in the Mosel and Rheingau, the great Rieslings are bone-dry or just off-dry, and they're extraordinary: electric acidity, crystalline clarity, peach blossom, apricot, wet slate, a whisper of petrol that develops with age. Low in alcohol (often 7-9% in the Mosel), it preserves the grape's natural tension between ripeness and acidity. And Riesling ages magnificently — decades in the cellar, developing honey, toast, and a complexity that puts many more famous wines to shame. Give it a proper chance.",
    flavorProfile: [
      "Peach",
      "Apricot",
      "Citrus",
      "Petrol",
      "Wet Slate",
      "Honey",
      "Floral",
    ],
    bodyLevel: "light",
    acidityLevel: "high",
    tanninLevel: "low",
    regionIds: ["mosel", "rheingau", "alsace", "finger-lakes"],
    foodPairings: [
      "Spicy Thai food",
      "Grilled salmon",
      "Sushi",
      "Pork with apple sauce",
      "Soft cheeses",
    ],
    funFact:
      "The famous 'petrol' or 'kerosene' aroma that develops in aged Riesling comes from a compound called TDN (trimethyl-dihydronaphthalene) — it's not a fault, it's a hallmark of quality, and Riesling enthusiasts seek it out.",
    servingTemp: "8-10°C",
  },

  {
    id: "pinot-grigio",
    name: "Pinot Grigio",
    color: "white",
    aliases: ["Pinot Gris", "Rulander"],
    description:
      "Two grapes in one name — and the difference is enormous. Italian Pinot Grigio (especially cheap versions from the Veneto) has become shorthand for neutral, easy, forgettable white wine: pale, lean, vaguely citrusy, perfectly inoffensive. But that's one expression of a remarkable grape. Alsatian Pinot Gris is a completely different creature — rich, smoky, almost honeyed, with real body and depth, capable of serious aging. And Oregon Pinot Gris falls somewhere beautifully between the two: richer than Italian versions, more fruit-forward than Alsatian. The grape itself is extraordinary; the industrial version of it is just evidence of what happens when demand outstrips ambition.",
    flavorProfile: [
      "Pear",
      "White Peach",
      "Melon",
      "Almond",
      "Smoke",
      "Honey",
      "Citrus",
    ],
    bodyLevel: "medium",
    acidityLevel: "medium",
    tanninLevel: "low",
    regionIds: ["veneto", "alsace", "willamette"],
    foodPairings: [
      "Antipasti",
      "Light pasta",
      "Grilled fish",
      "Prosciutto",
      "Mild cheeses",
    ],
    funFact:
      "Pinot Grigio/Gris is actually a color mutation of Pinot Noir — the grapes grow in grayish-pink-blue clusters rather than classic green, a genetic accident that produced one of the world's most popular white varieties.",
    servingTemp: "8-10°C",
  },

  {
    id: "gewurztraminer",
    name: "Gewürztraminer",
    color: "white",
    aliases: ["Gewurz"],
    description:
      "Nobody is neutral about Gewürztraminer. It's the most aromatic white grape in the world — lychee, rose petal, ginger, spice, sometimes even Turkish delight — and it announces itself with a perfume so intense that you can smell the glass from a meter away. In Alsace, where it reaches its finest expression, Gewürztraminer makes wines of complex, almost theatrical richness: full-bodied, often slightly off-dry, with a long, lingering finish. The challenge is matching food to something so assertively flavored — but it finds its perfect companion in spicy cuisine, especially Alsatian choucroute and Asian dishes. It's a wine that demands attention, which is either wonderful or overwhelming depending on your mood.",
    flavorProfile: [
      "Lychee",
      "Rose Petal",
      "Ginger",
      "Spice",
      "Orange Blossom",
      "Mango",
      "Honey",
    ],
    bodyLevel: "full",
    acidityLevel: "low",
    tanninLevel: "low",
    regionIds: ["alsace"],
    foodPairings: [
      "Foie gras",
      "Spicy Thai curry",
      "Alsatian choucroute",
      "Sushi",
      "Soft-ripened cheeses",
    ],
    funFact:
      "Gewürztraminer was first documented in the village of Tramin (Termeno) in northern Italy — 'Gewürz' simply means 'spiced' in German, added to distinguish the aromatic variety from the blander standard Traminer.",
    servingTemp: "8-10°C",
  },

  {
    id: "viognier",
    name: "Viognier",
    color: "white",
    aliases: [],
    description:
      "In 1965, only 14 hectares of Viognier existed in the entire world — it had come close to extinction. Today it's on menus and wine lists globally, which is one of wine's great comeback stories. Viognier makes some of the world's most seductively aromatic white wines: peach blossom, apricot, honeysuckle, a full, oily richness that coats the palate. In Condrieu in the northern Rhône, it's a benchmark for white wine luxury — intensely floral, slightly fat, finished dry but feeling almost sweet. It's technically demanding (harvesting window is narrow, over-ripeness kills the freshness), which is why great Viognier is still relatively rare. When it's right, it's intoxicating before you've taken a sip.",
    flavorProfile: [
      "Peach",
      "Apricot",
      "Honeysuckle",
      "Tangerine",
      "Ginger",
      "White Flowers",
    ],
    bodyLevel: "full",
    acidityLevel: "low",
    tanninLevel: "low",
    regionIds: ["rhone", "languedoc-roussillon"],
    foodPairings: [
      "Lobster bisque",
      "Scallops",
      "Roasted white fish",
      "Mild curry",
      "Hard aged cheeses",
    ],
    funFact:
      "A centuries-old tradition in Côte-Rôtie allows winemakers to co-ferment up to 20% white Viognier with Syrah — the combination produces a more aromatic, stable red wine with a longer, more perfumed finish.",
    servingTemp: "10-12°C",
  },

  {
    id: "chenin-blanc",
    name: "Chenin Blanc",
    color: "white",
    aliases: ["Steen", "Pineau de la Loire"],
    description:
      "Chenin Blanc is one of wine's most versatile grapes — capable of producing bone-dry wines of extraordinary mineral tension, off-dry versions with lovely fruit, luscious sweet wines from botrytized grapes, and world-class sparkling wine. All from the same variety. In the Loire Valley, Vouvray and Savennières are the benchmarks: tense, honeyed in good vintages, aging magnificently for decades. In South Africa, where it goes by the old name Steen and is the country's most planted variety, it has long been underappreciated — but a new generation of producers in Swartland and Stellenbosch is making Chenin that competes with the Loire's best. This is a grape worth knowing deeply.",
    flavorProfile: [
      "Quince",
      "Apple",
      "Honey",
      "Chamomile",
      "Ginger",
      "Wet Wool",
      "Beeswax",
    ],
    bodyLevel: "medium",
    acidityLevel: "high",
    tanninLevel: "low",
    regionIds: ["loire", "stellenbosch", "swartland"],
    foodPairings: [
      "Roast pork",
      "River fish",
      "Goat cheese",
      "Apple tart",
      "Mild curries",
    ],
    funFact:
      "Vouvray wines from exceptional vintages have been known to age for 50-100 years — long after most white wines have collapsed into memory, Chenin Blanc's fierce acidity keeps them alive and evolving.",
    servingTemp: "8-12°C",
  },

  {
    id: "gruner-veltliner",
    name: "Grüner Veltliner",
    color: "white",
    aliases: ["Grüner", "GV"],
    description:
      "Austria's signature white grape is one of wine's unsung heroes — a variety that produces everything from simple, refreshing everyday whites to profound, structured wines capable of aging for 20 years. The calling card is white pepper: a spicy, almost herbal finish that's unique among white wines and immediately recognizable once you know it. In the Wachau, on those dramatically terraced slopes above the Danube, top Grüner Veltliner (Smaragd classification) achieves extraordinary depth: mineral, complex, genuinely great. It's also one of the world's most food-friendly white wines — its freshness and spice make it a natural match for almost any cuisine. Vienna's wine bars, serving local Grüner on tap, are one of the wine world's great experiences.",
    flavorProfile: [
      "White Pepper",
      "Citrus",
      "Grapefruit",
      "Green Herbs",
      "Stone Fruit",
      "Mineral",
    ],
    bodyLevel: "medium",
    acidityLevel: "high",
    tanninLevel: "low",
    regionIds: ["wachau"],
    foodPairings: [
      "Wiener Schnitzel",
      "White asparagus",
      "Grilled fish",
      "Sushi",
      "Light pasta",
    ],
    funFact:
      "Grüner Veltliner regularly beats Burgundy's finest Chardonnay in blind tastings — most famously in the 2002 'Vienna Tasting' organized by Jancis Robinson, where Austrian Grüner outperformed white Burgundy Premiers Crus.",
    servingTemp: "8-12°C",
  },

  {
    id: "albarino",
    name: "Albariño",
    color: "white",
    aliases: ["Alvarinho"],
    description:
      "Albariño is the perfect summer white — fresh, aromatic, slightly briny, with peach and citrus flavors and a crisp acidity that makes you want to drink it while looking at the ocean. In Rías Baixas in Galicia, northwest Spain, it pairs with that region's extraordinary seafood in a combination so natural it seems almost ordained. The Atlantic breezes keep the wines fresh, the granite soils add minerality, and the grape's thick skins mean it handles humidity well. In Portugal as Alvarinho — especially in the Monção e Melgaço sub-region of Vinho Verde — it reaches another level entirely: richer, more complex, genuinely profound. This is a white wine that every seafood lover needs in their life.",
    flavorProfile: [
      "White Peach",
      "Apricot",
      "Citrus",
      "Salinity",
      "Jasmine",
      "Grapefruit",
    ],
    bodyLevel: "medium",
    acidityLevel: "high",
    tanninLevel: "low",
    regionIds: ["vinho-verde"],
    foodPairings: [
      "Grilled octopus",
      "Oysters",
      "Bacalhau",
      "Prawn dishes",
      "Ceviche",
    ],
    funFact:
      "Rías Baixas' most sought-after single-vineyard Albariños can age for 10 or more years, developing complexity and richness that challenges the idea that this grape is only for early drinking.",
    servingTemp: "8-10°C",
  },

  {
    id: "assyrtiko",
    name: "Assyrtiko",
    color: "white",
    aliases: [],
    description:
      "Greece's greatest white grape and one of the most distinctive varieties in the world — growing in volcanic soils on Santorini that are unlike any other terroir on earth. Assyrtiko combines something rare in a hot-climate grape: high natural acidity with concentrated, mineral-driven flavor. The result is a wine of extraordinary tension — citrus, saline, flint, with a depth and richness from the ancient vines. There's no other wine that tastes quite like Santorini Assyrtiko. Nykteri, the premium oxidative style, is aged on skins and in oak, producing something that can age for decades. As Greek wine exports increase and more people discover this variety, its reputation is growing rapidly — and deservedly.",
    flavorProfile: [
      "Citrus",
      "Saline",
      "Flint",
      "White Flowers",
      "Peach",
      "Volcanic Mineral",
    ],
    bodyLevel: "medium",
    acidityLevel: "high",
    tanninLevel: "low",
    regionIds: ["santorini"],
    foodPairings: [
      "Grilled octopus",
      "Fresh feta",
      "Lobster",
      "Clams",
      "Grilled sea bass",
    ],
    funFact:
      "Some Assyrtiko vines on Santorini are estimated to be 200+ years old — surviving because volcanic soil repels phylloxera, making these among the oldest producing vines in the world.",
    servingTemp: "8-11°C",
  },

  {
    id: "muscat",
    name: "Muscat",
    color: "white",
    aliases: ["Moscato", "Muscat Blanc à Petits Grains", "Moscatel"],
    description:
      "Muscat is the oldest cultivated grape family in the world — and almost uniquely, the only variety whose wine actually tastes like fresh grapes. That immediate, floral, grapey charm is Muscat's defining characteristic, showing up across an enormous range of styles: from delicate, slightly fizzy Moscato d'Asti with its low alcohol and peach-blossom sweetness, to rich, fortified Muscat de Beaumes-de-Venise, to bone-dry Muscat Blanc from Alsace. The grape is grown in nearly every wine region on earth and adapts its character to each climate, but always retains that signature freshness and floral perfume. If you want to understand what a grape actually tastes like, start with Muscat.",
    flavorProfile: [
      "Grape",
      "Peach Blossom",
      "Rose",
      "Orange Blossom",
      "Apricot",
      "Ginger",
    ],
    bodyLevel: "light",
    acidityLevel: "medium",
    tanninLevel: "low",
    regionIds: ["alsace", "piedmont"],
    foodPairings: [
      "Fresh fruit desserts",
      "Almond cake",
      "Light pastries",
      "Mild blue cheese",
      "Aperitivo",
    ],
    funFact:
      "Muscat is the only major white grape variety whose wine literally smells and tastes of fresh grape — most wines develop their aromas through fermentation, but Muscat carries its perfume directly from the fruit.",
    servingTemp: "6-9°C",
  },

  {
    id: "semillon",
    name: "Sémillon",
    color: "white",
    aliases: ["Semillon"],
    description:
      "Sémillon is one of wine's great chameleons and one of its most undervalued grapes. In Bordeaux's Sauternes, affected by noble rot (Botrytis cinerea), it produces the world's most celebrated sweet wines: golden, honeyed, complex, capable of aging for 50 years or more. Dry Bordeaux Blanc blends it with Sauvignon Blanc for freshness. In Australia's Hunter Valley, something completely different: old-vine, unoaked Sémillon aged for a decade in bottle develops an extraordinary character — toast, lemon curd, lanolin — from a wine bottled with just 10% alcohol. Two completely different styles, both extraordinary. Sémillon's low profile in most wine education is one of wine's greatest injustices.",
    flavorProfile: [
      "Lemon",
      "Fig",
      "Honey",
      "Toast",
      "Lanolin",
      "Beeswax",
      "Botrytis Spice",
    ],
    bodyLevel: "medium",
    acidityLevel: "medium",
    tanninLevel: "low",
    regionIds: ["bordeaux", "hunter-valley"],
    foodPairings: [
      "Foie gras (sweet versions)",
      "Grilled fish (dry versions)",
      "Sautéed scallops",
      "Roast chicken",
      "Roquefort cheese",
    ],
    funFact:
      "Château d'Yquem, the world's most celebrated sweet wine and sole First Growth Saguterne, is primarily Sémillon — a wine that regularly fetches thousands of dollars per bottle and ages magnificently for a century.",
    servingTemp: "10-13°C",
  },
];
