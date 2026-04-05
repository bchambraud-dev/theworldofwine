export interface WineRegion {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  zoom: number;
  description: string;
  facts: string[];
  grapes: string[];
  climate: string;
  flavorProfile: string;
  notableStyles: string[];
  image?: string;
}

export const wineRegions: WineRegion[] = [
  // ── FRANCE ──────────────────────────────────────────────────────────────────
  {
    id: "bordeaux",
    image: "/regions/bordeaux.webp",
    name: "Bordeaux",
    country: "France",
    lat: 44.84,
    lng: -0.58,
    zoom: 8,
    description: "When people picture a <strong>wine cellar</strong> — candlelit, cobwebbed, bottles stretching into the dark — they're picturing Bordeaux. This is the region that invented the modern concept of a wine estate, a wine classification, and a wine investment. The <strong>Left Bank</strong> is Cabernet country, all <strong>gravel soils</strong> and cassis and cedar; the Right Bank is softer, rounder Merlot territory. And somewhere in Sauternes, grapes are <strong>rotting in exactly the right way</strong> to become something golden and transcendent.",
    facts: [
      "Over 7,000 wine producers and 60 appellations — you could spend a lifetime exploring it",
      "The 1855 Classification ranked 61 châteaux and has barely changed since Napoleon III requested it",
      "Around 700 million bottles per year flow from these river-crossed plains",
      "Saint-Émilion became the world's first wine region named a UNESCO World Heritage Site"
    ],
    grapes: ["Cabernet Sauvignon", "Merlot", "Cabernet Franc", "Petit Verdot", "Sémillon", "Sauvignon Blanc"],
    climate: "Maritime, moderated by the Atlantic Ocean and the Gironde estuary",
    flavorProfile: "Structured reds with blackcurrant, cedar, tobacco, and graphite. Right Bank wines show plum, truffle, and earthy richness.",
    notableStyles: ["Red Blends", "Sweet Whites (Sauternes)", "Dry Whites"]
  },
  {
    id: "burgundy",
    image: "/regions/burgundy.webp",
    name: "Burgundy",
    country: "France",
    lat: 47.04,
    lng: 4.84,
    zoom: 8,
    description: "Burgundy is where wine gets <strong>almost spiritual</strong>. A single vineyard — sometimes just a few rows of vines — can produce something that haunts you for years. The monks who mapped these plots <strong>a thousand years ago</strong> weren't messing around. <strong>Pinot Noir</strong> and Chardonnay are the only grapes grown here, but the <strong>variations between villages, between plots, between vintages</strong> are almost infinite. That's the whole point — and the obsession.",
    facts: [
      "Over 100 appellations squeezed into a region smaller than many wine counties elsewhere",
      "Grand Cru vineyards make up just 1% of total production — and command 100% of the mystique",
      "The system of individually mapped vineyard plots is a UNESCO World Heritage Site",
      "Some of these plots have been cultivated continuously for more than 1,000 years"
    ],
    grapes: ["Pinot Noir", "Chardonnay", "Gamay", "Aligoté"],
    climate: "Continental with cold winters and warm summers",
    flavorProfile: "Reds offer cherry, raspberry, earth, and mushroom. Whites show lemon, butter, hazelnut, and mineral tension.",
    notableStyles: ["Pinot Noir", "Chardonnay", "Chablis", "Beaujolais (Gamay)"]
  },
  {
    id: "champagne",
    image: "/regions/champagne.webp",
    name: "Champagne",
    country: "France",
    lat: 49.05,
    lng: 3.95,
    zoom: 8,
    description: "No other wine in the world carries the <strong>weight of human celebration</strong> the way Champagne does. Weddings, victories, new years, apologies — Champagne is there for all of it. But here's the thing: the reason it tastes so good isn't magic, it's geography. These <strong>northern chalk soils</strong> sit right at the edge of where grapes can ripen, creating wines with <strong>electric acidity</strong> that survive — and thrive after — years of aging. The bubbles are <strong>just the beginning</strong>.",
    facts: [
      "Only 34,000 hectares are planted — and every one of them is fiercely protected",
      "The chalk beneath these vineyards runs up to 200 meters deep, providing perfect drainage and signature minerality",
      "Non-vintage Champagne must spend at least 15 months aging on its lees",
      "The pressure inside a Champagne bottle is roughly 6 atmospheres — three times a car tire"
    ],
    grapes: ["Chardonnay", "Pinot Noir", "Pinot Meunier"],
    climate: "Cool continental, at the northern limit of grape ripening",
    flavorProfile: "Citrus, green apple, brioche, toast, and chalky minerality. Vintage Champagnes develop honey and dried fruit.",
    notableStyles: ["Brut NV", "Blanc de Blancs", "Blanc de Noirs", "Rosé", "Prestige Cuvée"]
  },
  {
    id: "rhone",
    image: "/regions/rhone.webp",
    name: "Rhône Valley",
    country: "France",
    lat: 44.13,
    lng: 4.81,
    zoom: 8,
    description: "Two completely different wine worlds share a river. In the north, Syrah clings to <strong>near-vertical granite slopes</strong> at Côte-Rôtie and Hermitage — wines of <strong>smoked meat and violet and iron</strong> that can age for decades. Head south and the whole thing opens up: sunshine, garrigue, and the wide plains of Châteauneuf-du-Pape, where Grenache takes the lead in blends that can involve <strong>up to thirteen different grapes</strong>. <strong>One valley, two completely different bottles</strong>.",
    facts: [
      "Châteauneuf-du-Pape permits 13 different grape varieties in its blend — a creative playground",
      "Hermitage has been celebrated wine country since Roman times — they knew what they had",
      "The Mistral wind rips through regularly, keeping vineyards bone-dry and disease-free",
      "Condrieu produces some of the world's most seductively aromatic Viognier"
    ],
    grapes: ["Syrah", "Grenache", "Mourvèdre", "Viognier", "Marsanne", "Roussanne"],
    climate: "Continental in the north, Mediterranean in the south",
    flavorProfile: "Northern: dark fruit, pepper, smoked meat, violet. Southern: ripe red fruit, herbs, lavender, garrigue.",
    notableStyles: ["Syrah (Northern)", "GSM Blends (Southern)", "Viognier", "Rosé"]
  },
  {
    id: "loire",
    image: "/regions/loire.webp",
    name: "Loire Valley",
    country: "France",
    lat: 47.38,
    lng: 0.69,
    zoom: 7,
    description: "France's longest river winds through a valley so beautiful it's lined with actual châteaux, but the wines are the real treasure. The Loire is a <strong>shape-shifter</strong> — <strong>bone-dry, flinty Sancerre</strong> at one end; <strong>honeyed, almost immortal Chenin Blanc</strong> from Vouvray in the middle; earthy, raspberry-scented Cabernet Franc from Chinon further west; and briny Muscadet right where the river meets the Atlantic. Four completely different styles, one extraordinary valley. And the prices? <strong>Often shockingly fair</strong>.",
    facts: [
      "France's third-largest wine region by volume — somehow still underrated",
      "The château-dotted valley is a UNESCO World Heritage Site for its Renaissance architecture alone",
      "A hotbed of the natural wine movement, especially in the villages of Anjou and Touraine",
      "Muscadet aged sur lie — on its spent yeast — develops a distinctive biscuity richness"
    ],
    grapes: ["Sauvignon Blanc", "Chenin Blanc", "Cabernet Franc", "Melon de Bourgogne", "Gamay"],
    climate: "Cool maritime (west) to cool continental (east)",
    flavorProfile: "Sancerre: gunflint, citrus, gooseberry. Vouvray: quince, honey, beeswax. Chinon: raspberry, pencil shavings, violet.",
    notableStyles: ["Sancerre", "Vouvray", "Chinon", "Muscadet", "Crémant de Loire"]
  },
  {
    id: "alsace",
    image: "/regions/alsace.webp",
    name: "Alsace",
    country: "France",
    lat: 48.17,
    lng: 7.30,
    zoom: 8,
    description: "Wedged between the <strong>Vosges Mountains</strong> and the Rhine, Alsace is <strong>France's great anomaly</strong> — a region where wines are <strong>named after their grapes</strong> instead of their villages, where the food leans German but the wine laws are French, and where dry Riesling achieves a stony, petrol-edged complexity that takes years to fully understand. The Vosges act as a giant umbrella, making this one of the driest places in France — and those sunny, dry conditions build intensity in every grape that grows here.",
    facts: [
      "51 Grand Cru vineyards, each with its own distinct geological personality",
      "The only French wine region where labels name the grape rather than the village — revolutionary in France",
      "The Route des Vins d'Alsace has been drawing visitors since 1953 — one of the world's oldest wine tourism routes",
      "Vendange Tardive — late harvest — produces whites of extraordinary concentration and sweetness"
    ],
    grapes: ["Riesling", "Gewurztraminer", "Pinot Gris", "Muscat", "Pinot Blanc"],
    climate: "Cool continental, sheltered by the Vosges — one of the driest in France",
    flavorProfile: "Riesling: lime, petrol, mineral. Gewurztraminer: lychee, rose, ginger. Pinot Gris: smoke, honey, pear.",
    notableStyles: ["Riesling Grand Cru", "Gewurztraminer", "Vendange Tardive", "Crémant d'Alsace"]
  },
  // ── ITALY ────────────────────────────────────────────────────────────────────
  {
    id: "tuscany",
    image: "/regions/tuscany.webp",
    name: "Tuscany",
    country: "Italy",
    lat: 43.35,
    lng: 11.32,
    zoom: 8,
    description: "Rolling cypress-lined hills, ancient hilltop villages, and <strong>Sangiovese</strong> vines as far as the eye can see — Tuscany is Italy's wine heartland, and it wears that crown with swagger. <strong>Brunello di Montalcino</strong> needs years of patience before it opens; Chianti Classico delivers rustic charm with genuine depth. And then there are the Super Tuscans — wines born in the 1970s when certain producers got fed up with local rules and started blending <strong>Cabernet Sauvignon</strong> in ways that were technically illegal and absolutely world-class.",
    facts: [
      "Brunello di Montalcino must age at least 5 years before you're allowed to touch it",
      "Super Tuscans were born in the 1970s when producers rebelled against restrictive local regulations",
      "Chianti Classico's black rooster symbol dates back to a medieval rivalry between Florence and Siena",
      "Bolgheri, birthplace of Sassicaia, was only awarded its own DOC status in 1994"
    ],
    grapes: ["Sangiovese", "Cabernet Sauvignon", "Merlot", "Vernaccia"],
    climate: "Mediterranean with hot, dry summers and mild winters",
    flavorProfile: "Sangiovese: cherry, leather, tobacco, dried herbs, and firm acidity. Super Tuscans add cassis and chocolate depth.",
    notableStyles: ["Brunello di Montalcino", "Chianti Classico", "Super Tuscan", "Vernaccia di San Gimignano"]
  },
  {
    id: "piedmont",
    image: "/regions/piedmont.webp",
    name: "Piedmont",
    country: "Italy",
    lat: 44.69,
    lng: 8.04,
    zoom: 8,
    description: "At the foot of the Alps, in the misty, truffle-scented hills of the Langhe, Italy's most serious wine country begins. <strong>Barolo and Barbaresco</strong> — both from the proud, uncompromising <strong>Nebbiolo</strong> grape — are the King and Queen of Italian wine, and they earn those titles. They're tannic, perfumed, and slow to reveal themselves. But patience is rewarded with something extraordinary: tar and roses, dried cherry and tobacco, and a complexity that keeps unfolding in the glass for hours.",
    facts: [
      "Barolo must age at least 38 months before release — including a minimum of 18 months in oak",
      "The Langhe wine landscape, including its hilltop villages and cellars, is a UNESCO World Heritage Site",
      "White truffles from nearby Alba are among the most expensive foods in the world — and the wines were made for them",
      "Nebbiolo gets its name from 'nebbia,' the fog that blankets these hills every harvest season"
    ],
    grapes: ["Nebbiolo", "Barbera", "Dolcetto", "Moscato"],
    climate: "Continental with significant diurnal temperature variation",
    flavorProfile: "Nebbiolo: rose petal, tar, cherry, truffle, and powerful tannins. Barbera offers bright acidity with dark fruit.",
    notableStyles: ["Barolo", "Barbaresco", "Barbera d'Asti", "Moscato d'Asti"]
  },
  {
    id: "sicily",
    image: "/regions/sicily.webp",
    name: "Sicily",
    country: "Italy",
    lat: 37.73,
    lng: 14.80,
    zoom: 8,
    description: "For years, Sicily was Italy's forgotten giant — producing vast quantities of wine mostly destined to beef up blends further north. Then Mount Etna changed everything. The world's top sommeliers discovered that ancient, gnarled vines planted at <strong>altitude</strong> on black volcanic lava could produce something haunting — wild cherry, blood orange, volcanic mineral, with a lightness that defied the hot southern sun. The Etna revolution spread outward, and now the whole island is buzzing with possibility.",
    facts: [
      "Etna's vineyards sit at 600–1,000 metres above sea level — some of Europe's highest",
      "Many Etna vines pre-date phylloxera, planted directly in volcanic soil on their own roots",
      "Marsala, Sicily's historic fortified wine, was invented by a British merchant in 1796",
      "Sicily is now one of Italy's most dynamic regions for premium wine — and one of the most exciting anywhere"
    ],
    grapes: ["Nero d'Avola", "Nerello Mascalese", "Nerello Cappuccio", "Catarratto", "Carricante", "Grillo"],
    climate: "Mediterranean — hot, dry summers; mild, wet winters; cool nights on Etna",
    flavorProfile: "Etna Rosso: wild cherry, blood orange, volcanic ash, herbs. Nero d'Avola: dark plum, chocolate, spice. Etna Bianco: saline, citrus, almond.",
    notableStyles: ["Etna Rosso", "Etna Bianco", "Nero d'Avola", "Marsala (Fortified)"]
  },
  // ── SPAIN ────────────────────────────────────────────────────────────────────
  {
    id: "rioja",
    image: "/regions/rioja.webp",
    name: "Rioja",
    country: "Spain",
    lat: 42.47,
    lng: -2.45,
    zoom: 8,
    description: "Rioja is Spain's wine heartland — and it's been aging its wines in oak longer than almost anywhere else on earth. The result is a style of red that's unlike anything from France or Italy: warm vanilla, dried cherry, old leather, and a smoothness that comes from years spent in <strong>American oak</strong> barrels. A Rioja Gran Reserva has been sitting in a cellar for years before you even get to buy it. Increasingly, a new generation of producers is also doing something different — single vineyards, old vines, terroir front and center.",
    facts: [
      "Gran Reserva must age at least 5 years total, with 2 of those in oak — patience is built into the law",
      "Rioja was Spain's first DOCa (the highest quality classification) back in 1991",
      "Three distinct sub-regions — Rioja Alta, Alavesa, and Oriental — each with their own personality",
      "American oak gives traditional Rioja its vanilla-coconut signature; French oak is the modern producer's choice"
    ],
    grapes: ["<strong>Tempranillo</strong>", "Garnacha", "Graciano", "Mazuelo", "Viura"],
    climate: "Mix of Atlantic, Continental, and Mediterranean influences",
    flavorProfile: "Vanilla, leather, cherry, strawberry, and tobacco from oak aging. Modern styles emphasize fruit purity.",
    notableStyles: ["Crianza", "Reserva", "Gran Reserva", "White Rioja"]
  },
  {
    id: "priorat",
    image: "/regions/priorat.webp",
    name: "Priorat",
    country: "Spain",
    lat: 41.20,
    lng: 0.81,
    zoom: 9,
    description: "Hidden in the Catalan mountains, Priorat is dramatic in every sense — steep black slate hillsides, terraced vines that look practically vertical, and wines of almost shocking concentration and mineral intensity. The special <strong>llicorella</strong> soil — black slate and quartz — doesn't retain water, so vines sink their roots impossibly deep to survive. The result is tiny yields of ferociously concentrated Garnacha and Cariñena. For most of the 20th century, this place was all but abandoned. Then, in the late 1980s, a handful of visionaries arrived and changed everything.",
    facts: [
      "One of only two Spanish wine regions to hold the DOCa classification — the highest level",
      "Llicorella slate soil can run up to 2 meters deep — vines have no choice but to work for it",
      "The region was essentially ghost country until its late-1980s renaissance",
      "Average vine age here is among the highest in Spain — decades of struggle make extraordinary wine"
    ],
    grapes: ["Garnacha", "Cariñena", "Cabernet Sauvignon", "Syrah"],
    climate: "Mediterranean with extreme continental influence — hot days, cold nights",
    flavorProfile: "Intense mineral, blackberry, cherry, licorice, and schist-driven savory character with immense concentration.",
    notableStyles: ["Old Vine Garnacha", "Garnacha-Cariñena Blends", "Vi de Vila (Village Wines)"]
  },
  // ── GERMANY ─────────────────────────────────────────────────────────────────
  {
    id: "mosel",
    image: "/regions/mosel.webp",
    name: "Mosel",
    country: "Germany",
    lat: 49.97,
    lng: 7.11,
    zoom: 8,
    description: "The Mosel is one of wine's great wonders. The river coils through impossibly steep, slate-covered hills in hairpin bends that create south-facing sun traps — the only reason Riesling can ripen this far north. The wines that emerge are unlike anything else: featherlight in alcohol (sometimes just 7%), with a tightrope balance of sweetness and crystalline acidity that makes them seem to float rather than sit in the glass. Some of the greatest bottles in the world come from here, and they'll still be alive a century from now.",
    facts: [
      "Some vineyards exceed 65-degree slopes — the steepest viticultural sites on earth, worked entirely by hand",
      "Blue and red slate soils absorb heat by day and radiate it back at night, keeping vines warm",
      "Riesling from great Mosel sites can age for decades — even a century in exceptional cases",
      "Alcohol levels of 7–9% make these some of the lightest — and most food-friendly — still wines in the world"
    ],
    grapes: ["Riesling", "Müller-Thurgau", "Elbling"],
    climate: "Cool continental, at the northern margin of viticulture",
    flavorProfile: "Riesling: lime, green apple, white peach, wet slate, and petrol with age. Tension between sweetness and razor-sharp acidity.",
    notableStyles: ["Kabinett", "Spätlese", "Auslese", "Trockenbeerenauslese", "Trocken (Dry)"]
  },
  // ── PORTUGAL ─────────────────────────────────────────────────────────────────
  {
    id: "douro",
    image: "/regions/douro.webp",
    name: "Douro Valley",
    country: "Portugal",
    lat: 41.16,
    lng: -7.79,
    zoom: 8,
    description: "The Douro is ancient, dramatic, and utterly unlike anywhere else. The terraced hillsides carved into schist bedrock above a serpentine river were built by hand over centuries — a UNESCO landscape that doubles as some of the world's most spectacular wine country. Port made this place famous, and Port is still magnificent here. But the dry table wines — dense, violet-scented, structured beauties made from over 80 indigenous grape varieties — are increasingly turning heads among the world's most discerning palates.",
    facts: [
      "UNESCO World Heritage cultural landscape since 2001 — and it earns every word of that designation",
      "The Marquis of Pombal established the world's first formally demarcated wine region here in 1756",
      "Over 80 indigenous grape varieties are authorized — a living library of viticultural diversity",
      "Those terraced walls represent centuries of backbreaking human effort to tame near-vertical slopes"
    ],
    grapes: ["Touriga Nacional", "Touriga Franca", "Tinta Roriz", "Tinta Barroca", "Tinto Cão"],
    climate: "Hot continental summers, cold winters, sheltered from Atlantic influence",
    flavorProfile: "Port: rich, fortified, with blackberry, chocolate, spice. Dry reds: dense, violet-scented, with wild berry and schist minerality.",
    notableStyles: ["Vintage Port", "Tawny Port", "Vintage Dry Red", "White Port"]
  },
  // ── AUSTRIA ──────────────────────────────────────────────────────────────────
  {
    id: "wachau",
    image: "/regions/wachau.webp",
    name: "Wachau",
    country: "Austria",
    lat: 48.37,
    lng: 15.42,
    zoom: 9,
    description: "Imagine a postcard: castle ruins on a cliff, a bend in the Danube, and <strong>terraced vineyards</strong> carved from sheer rock face glowing gold in the afternoon sun. That's the Wachau — Austria's most jaw-dropping wine region. The <strong>Grüner Veltliner</strong> and Riesling that emerge from these gneiss and granite slopes have a purity and mineral intensity that's genuinely breathtaking. The Wachau even invented its own classification — Steinfeder, Federspiel, <strong>Smaragd</strong> — named after local wildlife. The <strong>Smaragd</strong>, named after a green lizard that suns itself in the vineyards, is the one you want.",
    facts: [
      "UNESCO World Heritage site — vineyards, medieval monasteries, and baroque castles all in one valley",
      "Smaragd is the highest ripeness classification, named after the local emerald-green lizard",
      "The Danube gorge creates a microclimate that moderates temperatures dramatically in both directions",
      "Slopes as steep as 65 degrees mean every vine must be tended entirely by hand"
    ],
    grapes: ["Grüner Veltliner", "Riesling", "Pinot Blanc"],
    climate: "Cool continental with the warming influence of the Danube River gorge",
    flavorProfile: "Grüner Veltliner: white pepper, citrus, green herb, and mineral. Riesling: lime, stone fruit, slate, and great longevity.",
    notableStyles: ["Grüner Veltliner Smaragd", "Riesling Smaragd", "Federspiel (medium-bodied)"]
  },
  // ── HUNGARY ──────────────────────────────────────────────────────────────────
  {
    id: "tokaj",
    image: "/regions/tokaj.webp",
    name: "Tokaj",
    country: "Hungary",
    lat: 48.12,
    lng: 21.40,
    zoom: 9,
    description: "When Louis XIV called Tokaji 'the wine of kings, the king of wines,' he wasn't being diplomatic — he genuinely meant it. The sweet wines made in these northeastern Hungarian hills from botrytis-infected Furmint grapes are among the most extraordinary liquids ever produced. The <strong>noble rot</strong> concentrates everything — sugars, acids, aromas — into something between wine and poetry. They've been doing this here since at least the 16th century, and the volcanic soils and misty autumn conditions still create the same liquid gold today.",
    facts: [
      "Tokaj was the world's first legally demarcated wine region, classified all the way back in 1730",
      "Tokaji Aszú is rated in puttonyos — 'baskets' of shriveled grapes — from 3 to 6; higher means sweeter",
      "Eszencia, the most extreme expression, can reach 800 grams of residual sugar per liter — more a syrup than a wine",
      "Louis XIV's famous verdict — 'Vinum Regum, Rex Vinorum' — has stuck for 350 years"
    ],
    grapes: ["Furmint", "Hárslevelű", "Yellow Muscat", "Zéta"],
    climate: "Continental with warm summers and misty autumns — ideal for botrytis",
    flavorProfile: "Aszú: marmalade, apricot, saffron, honey, ginger, and razor-sharp acidity. Dry Furmint: lime, chamomile, grapefruit, and smoky mineral.",
    notableStyles: ["Tokaji Aszú", "Tokaji Eszencia", "Dry Furmint", "Szamorodni"]
  },
  // ── CROATIA ──────────────────────────────────────────────────────────────────
  {
    id: "istria-dalmatia",
    image: "/regions/istria-dalmatia.webp",
    name: "Istria & Dalmatia",
    country: "Croatia",
    lat: 43.50,
    lng: 16.40,
    zoom: 7,
    description: "The Adriatic coast of Croatia is one of Europe's best-kept wine secrets — though the secret is rapidly getting out. In Istria, the peninsula to the north, a golden-skinned grape called Malvasia Istriana produces fragrant, saline whites that pair almost obscenely well with truffles and seafood. Down the Dalmatian coast, past islands that make you want to stay forever, Plavac Mali — a grape that turns out to be genetically related to California's Zinfandel — makes bold, sun-drenched reds. Ancient Greek settlers planted vines here over 2,500 years ago. They knew something.",
    facts: [
      "Plavac Mali is genetically related to Zinfandel — the same family, different coastline",
      "Croatia harbors over 130 indigenous grape varieties — many still barely explored",
      "Dingač, on the Pelješac Peninsula, was Yugoslavia's first controlled-origin wine designation",
      "Croatian winemaking history goes back to Greek colonists who arrived around 400 BC"
    ],
    grapes: ["Malvasia Istriana", "Plavac Mali", "Posip", "Bogdanuša", "Babić", "Teran"],
    climate: "Mediterranean along the coast — hot, dry summers with strong Bora and Jugo winds",
    flavorProfile: "Malvasia: aromatic, floral, apricot, almond. Plavac Mali: dark cherry, leather, tobacco, spice, and sun-baked earthiness.",
    notableStyles: ["Malvasia Istriana (White)", "Dingač (Red)", "Plavac Mali", "Orange Wines"]
  },
  // ── GEORGIA ──────────────────────────────────────────────────────────────────
  {
    id: "kakheti",
    image: "/regions/kakheti.webp",
    name: "Kakheti",
    country: "Georgia",
    lat: 41.65,
    lng: 45.70,
    zoom: 8,
    description: "If you want to understand where wine really comes from — not just historically, but spiritually — go to Georgia. The evidence of winemaking here is 8,000 years old. And Kakheti, the heartland of Georgian wine, still practices the ancient qvevri tradition: fermenting and aging wine in large clay vessels buried underground, often with extended skin contact, producing amber-hued wines of extraordinary texture and complexity. These aren't just wines; they're a living link to the beginning of human civilization's relationship with the vine.",
    facts: [
      "Winemaking here dates back 8,000 years — confirmed by genetic and archaeological evidence, not just legend",
      "UNESCO recognized Georgian qvevri winemaking as an Intangible Cultural Heritage in 2013",
      "Over 500 indigenous grape varieties grow in Georgia — more diversity than any country in Europe",
      "Rkatsiteli is one of the oldest known cultivated grape varieties on earth"
    ],
    grapes: ["Rkatsiteli", "Saperavi", "Kakhuri Mtsvane", "Chinuri", "Tavkveri"],
    climate: "Continental with hot summers, cold winters, and the moderating influence of the Alazani River valley",
    flavorProfile: "Amber/qvevri whites: dried apricot, chamomile, walnut, tannin, oxidative richness. Saperavi reds: intense black fruit, ink, tobacco, and firm tannin.",
    notableStyles: ["Amber (Skin-Contact) White", "Saperavi Red", "Qvevri Natural Wine", "Rkatsiteli"]
  },
  // ── GREECE ───────────────────────────────────────────────────────────────────
  {
    id: "santorini",
    image: "/regions/santorini.webp",
    name: "Santorini",
    country: "Greece",
    lat: 36.39,
    lng: 25.46,
    zoom: 10,
    description: "Everything about Santorini's wines is extreme. The vines are trained in tight baskets close to the ground to survive the fierce Meltemi winds. The soil is volcanic ash and pumice — no phylloxera has ever touched it. The island barely gets any rain, so the vines pull moisture from sea fog. And the <strong>Assyrtiko</strong> grape that grows here produces whites of ferocious concentration and acidity, with a saline mineral quality that tastes almost literally like the Aegean. Some of those basket-shaped vines are over 200 years old and still producing.",
    facts: [
      "Santorini's volcanic soils have never been touched by phylloxera — the vines grow ungrafted",
      "The traditional kouloura basket training protects vines from winds exceeding 100 km/h",
      "Some of these coiled bush vines are over 200 years old — pre-dating many famous European vineyards",
      "Vinsanto, a luscious sun-dried sweet wine, has been made here since Byzantine times"
    ],
    grapes: ["Assyrtiko", "Athiri", "Aidani", "Mavrotragano"],
    climate: "Arid Mediterranean — very low rainfall, strong winds, volcanic ash soils retain moisture",
    flavorProfile: "Assyrtiko: lemon, white peach, saline minerality, wet stone, and fiery acidity with great aging potential. Vinsanto: fig, raisin, honey, saffron.",
    notableStyles: ["Assyrtiko (Dry White)", "Vinsanto (Sweet)", "Nykteri (Oak-Aged White)"]
  },
  // ── ENGLAND ──────────────────────────────────────────────────────────────────
  {
    id: "english-sparkling",
    image: "/regions/english-sparkling.webp",
    name: "English Sparkling Wine",
    country: "England",
    lat: 51.05,
    lng: -0.18,
    zoom: 7,
    description: "England making world-class sparkling wine sounds like a punchline — until you actually taste it. The South Downs chalk is geologically identical to Champagne's best vineyards; it just happens to be under Sussex instead of France. The cool, damp maritime climate creates exactly the searingly precise acidity that traditional-method sparkling wine needs. Several English bottles have already beaten Champagne in blind tastings. A decade ago, there were a handful of producers. Now there are hundreds. Something real is happening here.",
    facts: [
      "The chalk seam under Sussex is geologically identical to Champagne's Côte des Blancs — same terroir, different postcode",
      "England's vineyard area has tripled in the last decade, now surpassing 4,000 hectares",
      "English sparkling wines have beaten Champagne in multiple major blind tastings — not a fluke",
      "Climate change is quietly but dramatically expanding what southern England can grow"
    ],
    grapes: ["Chardonnay", "Pinot Noir", "Pinot Meunier", "Bacchus", "Seyval Blanc"],
    climate: "Cool, damp maritime — long growing season with high acidity retention",
    flavorProfile: "Crisp green apple, citrus zest, brioche, chalk minerality, and focused elegance. Less tropical than Champagne, more linear.",
    notableStyles: ["Traditional Method Sparkling", "Blanc de Blancs", "Vintage Rosé", "Bacchus Still White"]
  },
  // ── SOUTH AFRICA ─────────────────────────────────────────────────────────────
  {
    id: "stellenbosch",
    image: "/regions/stellenbosch.webp",
    name: "Stellenbosch",
    country: "South Africa",
    lat: -33.93,
    lng: 18.86,
    zoom: 9,
    description: "Stellenbosch is the Cape's wine capital — a gorgeous university town surrounded by granite mountains, ancient oaks, and some of the most beautiful wine estates on earth. The cooling influence of False Bay keeps things honest despite the African sun, and the soils here range from ancient decomposed granite to sandstone in ways that create real differences between estates. <strong>Cabernet Sauvignon</strong> is serious business here. So is old-vine Chenin Blanc — called Steen locally — which at its best is one of the world's great white wines.",
    facts: [
      "South Africa's first wine estate was established here in 1679 — making it the New World's oldest wine heartland",
      "The Cape Winemakers Guild annual auction is the premier wine event on the African continent",
      "Old-vine Chenin Blanc — locally called Steen — is a uniquely South African treasure",
      "Pinotage, a cross between Pinot Noir and Cinsault, was created in Stellenbosch in 1925"
    ],
    grapes: ["Cabernet Sauvignon", "Chenin Blanc", "Pinotage", "Syrah", "Merlot"],
    climate: "Mediterranean with cooling ocean influence",
    flavorProfile: "Cab: blackcurrant, cedar, fynbos herbs. Chenin: quince, honey, lanolin. Pinotage: smoky, earthy, dark fruit.",
    notableStyles: ["Cabernet Sauvignon", "Bordeaux Blends", "Chenin Blanc", "Pinotage"]
  },
  {
    id: "swartland",
    image: "/regions/swartland.webp",
    name: "Swartland",
    country: "South Africa",
    lat: -33.45,
    lng: 18.84,
    zoom: 8,
    description: "An hour north of Cape Town, the Swartland looks like it shouldn't make wine — sun-baked, almost desert-dry, scattered with old wheat farms and ancient schist outcrops. But this is exactly the kind of place great wine sneaks up on you. Ancient, unirrigated Chenin Blanc vines — some over 50 years old — dig deep into granite and <strong>slate soils</strong> and produce whites of extraordinary depth and character. Eben Sadie and a band of like-minded iconoclasts turned this forgotten landscape into the global epicenter of the natural wine movement.",
    facts: [
      "Home to some of the world's oldest Chenin Blanc vines — unirrigated, over 50 years old",
      "The annual Swartland Revolution event helped define the international natural wine movement ethos",
      "'Swartland' means 'black land' in Afrikaans, after the dark renosterveld shrubland that covers the hills",
      "Almost exclusively dry-farmed on ancient soils — extreme vine stress creates extraordinary concentration"
    ],
    grapes: ["Chenin Blanc", "Grenache", "Syrah", "Cinsault", "Mourvèdre", "Carignan"],
    climate: "Hot, dry Mediterranean with cooling Benguela Current winds from the Atlantic",
    flavorProfile: "Old-vine Chenin: beeswax, yellow apple, quince, savory herbs, and electrifying acidity. Reds: earthy, dried herb, dark fruit, and dusty tannins.",
    notableStyles: ["Old-Vine Chenin Blanc", "Rhône-Style Blends", "Natural Wine", "White Blends"]
  },
  // ── ARGENTINA ────────────────────────────────────────────────────────────────
  {
    id: "mendoza",
    image: "/regions/mendoza.webp",
    name: "Mendoza",
    country: "Argentina",
    lat: -33.00,
    lng: -68.50,
    zoom: 8,
    description: "<strong>Malbec</strong> is French by birth, but it belongs to Argentina now. This grape — once a minor blending variety in Bordeaux — found the conditions it had always been looking for in the <strong>Andes</strong> foothills: <strong>altitude</strong>, sunshine, dramatic temperature swings between day and night, and those extraordinary views of snowcapped mountains. Mendoza's high-<strong>altitude</strong> vineyards produce <strong>Malbec</strong> of saturated color, velvety tannins, and a richness that French <strong>Malbec</strong> rarely approaches. This is one of the great wine regions of the New World — and the most exciting thing is, it's still evolving.",
    facts: [
      "Vineyards sit at 800–1,500 metres above sea level — among the highest wine country in the world",
      "Argentina is the world's largest producer of Malbec — by a very large margin",
      "Snowmelt from the Andes provides irrigation through a pre-Columbian canal system",
      "The Uco Valley sub-region is leading a premium quality revolution that's rewriting what Malbec can be"
    ],
    grapes: ["Malbec", "Cabernet Sauvignon", "Bonarda", "Torrontés"],
    climate: "High-altitude desert with intense sun and dramatic day-night temperature swings",
    flavorProfile: "Malbec: plum, blackberry, violet, dark chocolate, and velvety tannins. Torrontés: floral, peachy, aromatic.",
    notableStyles: ["Malbec", "High-Altitude Cabernet", "Torrontés", "Malbec-Cab Blends"]
  },
  // ── CHILE ────────────────────────────────────────────────────────────────────
  {
    id: "maipo-colchagua",
    image: "/regions/maipo-colchagua.webp",
    name: "Maipo & Colchagua Valleys",
    country: "Chile",
    lat: -34.50,
    lng: -71.00,
    zoom: 7,
    description: "Chile has one of wine's great origin stories: a grape thought extinct in Europe was quietly growing here all along, mislabeled as Merlot for over a century. <strong>Carménère</strong> was finally identified in 1994 — it had been wiped out in France by phylloxera in the 1860s but survived in Chilean nurseries. Now it's Chile's signature variety. Meanwhile, Maipo Valley <strong>Cabernet Sauvignon</strong>, grown in <strong>Andes</strong> foothills soils with a signature eucalyptus note, has been turning heads globally for decades. Chile is brilliant, underrated, and still full of surprises.",
    facts: [
      "Carménère was thought extinct after phylloxera destroyed it in France in the 1860s",
      "It was rediscovered growing in Chile in 1994 — DNA analysis confirmed it had been mislabeled as Merlot for over 100 years",
      "Maipo Alto's Andes-foothill vineyards sit at 700–1,000 metres — ideal for premium Cabernet Sauvignon",
      "Chile has almost no phylloxera and minimal disease pressure — some of the cleanest vineyards in the world"
    ],
    grapes: ["Cabernet Sauvignon", "Carménère", "Merlot", "Syrah", "Chardonnay", "Sauvignon Blanc"],
    climate: "Mediterranean — warm, dry summers; cool Pacific and Andean influences",
    flavorProfile: "Cabernet: cassis, eucalyptus, cedar, and firm structure. Carménère: dark fruit, coffee, dark chocolate, green pepper, and plush body.",
    notableStyles: ["Cabernet Sauvignon", "Carménère", "Bordeaux-Style Blends", "Icon Wines"]
  },
  // ── USA ──────────────────────────────────────────────────────────────────────
  {
    id: "napa-valley",
    image: "/regions/napa-valley.webp",
    name: "Napa Valley",
    country: "USA",
    lat: 38.50,
    lng: -122.27,
    zoom: 9,
    description: "Napa Valley's defining moment came in 1976, when California wines beat the best of Bordeaux and Burgundy in a blind tasting in Paris. The French judges were mortified. The world was stunned. And Napa hasn't looked back since. Today it's home to some of the most coveted and expensive wines on earth — powerful, opulent <strong>Cabernet Sauvignon</strong>s that rival anything in the world. The average bottle price here is the highest of any wine region globally. Whether that makes you excited or skeptical, the wines are genuinely extraordinary.",
    facts: [
      "Only about 4% of all California wine comes from Napa — scarcity is part of the story",
      "16 distinct AVAs within the valley, each with genuinely different soil and character",
      "The average bottle price from Napa is the highest of any wine region in the world",
      "Coastal fog rolling in from San Pablo Bay every morning moderates what would otherwise be brutal summer heat"
    ],
    grapes: ["Cabernet Sauvignon", "Chardonnay", "Merlot", "Sauvignon Blanc", "Zinfandel"],
    climate: "Mediterranean with warm days and cool nights",
    flavorProfile: "Rich, concentrated Cabernet with blackberry, cassis, dark chocolate, vanilla, and cedar. Chardonnay ranges from crisp to buttery.",
    notableStyles: ["Cabernet Sauvignon", "Chardonnay", "Meritage Blends", "Cult Wines"]
  },
  {
    id: "sonoma",
    image: "/regions/sonoma.webp",
    name: "Sonoma County",
    country: "USA",
    lat: 38.48,
    lng: -122.72,
    zoom: 9,
    description: "Sonoma is everything Napa is, minus the attitude. Bigger, cooler, more diverse, and considerably more relaxed, Sonoma stretches from the warm Alexander Valley to the fog-soaked Sonoma Coast — and both extremes produce excellent wine. Russian River Valley <strong>Pinot Noir</strong>, grown in cool coastal conditions, is some of the finest in the world. Dry Creek Zinfandel is old-vine, brambly, and joyful. And Sonoma Coast Chardonnay, lean and mineral, can rival Burgundy. Three very different wines, one very likable county.",
    facts: [
      "Sonoma is roughly three times the size of Napa Valley — you can get genuinely lost in it",
      "18 AVAs with dramatically different climates, from foggy coast to warm, dry inland",
      "California's oldest commercial winery — Buena Vista — was established here back in 1857",
      "Russian River Valley Pinot Noir is internationally celebrated, and for very good reason"
    ],
    grapes: ["Pinot Noir", "Chardonnay", "Cabernet Sauvignon", "Zinfandel", "Syrah"],
    climate: "Highly varied — coastal fog to warm inland valleys",
    flavorProfile: "Cool-climate Pinot: cherry, cranberry, earth, spice. Warm-area Zin: brambly, peppery, ripe fruit.",
    notableStyles: ["Pinot Noir", "Chardonnay", "Old Vine Zinfandel", "Sparkling"]
  },
  {
    id: "willamette",
    image: "/regions/willamette.webp",
    name: "Willamette Valley",
    country: "USA",
    lat: 45.12,
    lng: -123.09,
    zoom: 8,
    description: "Oregon's Willamette Valley is the American answer to Burgundy — and it's a genuine one. The climate here is eerily similar to the Côte d'Or: cool, marginal, with that nail-biting uncertainty every vintage whether the <strong>Pinot Noir</strong> will ripen in time. It usually does, and when it does, it's something special — silky, cherry-red, with a forest floor earthiness and bright acidity that's distinctly Oregonian. A tight-knit community of passionate winemakers has been building this reputation for four decades, and the wines keep getting better.",
    facts: [
      "David Lett planted the first Pinot Noir vines here in 1965 — most people thought he was crazy",
      "A 1979 Oregon Pinot shocked the wine world by placing in the top ten at Paris's prestigious Olympiades du Vin",
      "11 distinct AVAs within the valley, each with genuinely different volcanic and sedimentary geology",
      "Oregon law demands 90% varietal content minimum — stricter standards than almost anywhere else in the US"
    ],
    grapes: ["Pinot Noir", "Chardonnay", "Pinot Gris", "Riesling"],
    climate: "Cool maritime with mild, wet winters and warm, dry summers",
    flavorProfile: "Pinot: red cherry, cranberry, forest floor, baking spice, with silky texture and bright acidity.",
    notableStyles: ["Pinot Noir", "Chardonnay", "Pinot Gris", "Sparkling"]
  },
  {
    id: "finger-lakes",
    image: "/regions/finger-lakes.webp",
    name: "Finger Lakes",
    country: "USA",
    lat: 42.65,
    lng: -76.95,
    zoom: 8,
    description: "Long, narrow, and impossibly deep, the Finger Lakes of upstate New York were carved by glaciers — and those same glaciers accidentally created ideal conditions for one of America's most thrilling Riesling regions. The deep lake water moderates what would otherwise be brutal winters, and the shale hillsides produce wines of remarkable finesse. Dr. Konstantin Frank proved in 1962 that European grapes could survive here, defying what everyone believed. Now the Finger Lakes is home to a vibrant community of small producers making Riesling that stands comparison with Germany's finest — and pioneering Cabernet Franc, <strong>Pinot Noir</strong>, and beyond.",
    facts: [
      "Dr. Konstantin Frank planted the first European Vitis vinifera vines here in 1962 — considered reckless at the time",
      "The Finger Lakes produces the majority of America's finest Riesling",
      "Seneca and Cayuga Lakes — the deepest — create the most favorable growing microclimates",
      "The region has transformed from native labrusca grapes to world-class European varieties within a generation"
    ],
    grapes: ["Riesling", "Cabernet Franc", "Pinot Noir", "Gewurztraminer", "Grüner Veltliner", "Blaufränkisch"],
    climate: "Cool continental, significantly moderated by deep lake water temperatures",
    flavorProfile: "Riesling: lime, green apple, slate, ginger, and electric acidity. Cab Franc: raspberry, bell pepper, smoked earth, violet.",
    notableStyles: ["Dry Riesling", "Off-Dry Riesling", "Cabernet Franc", "Sparkling"]
  },
  // ── CANADA ───────────────────────────────────────────────────────────────────
  {
    id: "okanagan-valley",
    image: "/regions/okanagan-valley.webp",
    name: "Okanagan Valley",
    country: "Canada",
    lat: 49.80,
    lng: -119.50,
    zoom: 8,
    description: "Canada making serious wine surprises people, until they see a map. British Columbia's Okanagan Valley is a dramatic semi-arid corridor stretching nearly 200 kilometres from Kelowna south to Osoyoos — home to Canada's only genuine desert, where Merlot and Cabernet Franc ripen in blazing summer heat. Meanwhile, the cooler north produces elegant Riesling and Pinot Gris. And in the depths of winter, when temperatures plummet below freezing, the grapes still hanging on the vine are destined for one of Canada's most celebrated gifts to the wine world: Icewine.",
    facts: [
      "Canada is the world's largest commercial producer of Icewine — it's partly a function of reliably cold winters",
      "Osoyoos at the southern tip has Canada's only officially designated desert — arid and genuinely hot",
      "The valley spans nearly 200 km from north to south, with dramatically different climates at each end",
      "The Okanagan has grown from 17 wineries in 1990 to over 200 today — one of the world's fastest-growing fine wine regions"
    ],
    grapes: ["Merlot", "Cabernet Franc", "Syrah", "Pinot Gris", "Chardonnay", "Riesling", "Gewurztraminer"],
    climate: "Semi-arid continental — cold winters, hot summers, long days, cold nights",
    flavorProfile: "Merlot: dark plum, black cherry, vanilla, cedar. Riesling: lime, apple, ginger. Icewine: honey, apricot, peach nectar.",
    notableStyles: ["Icewine", "Merlot", "Bordeaux Blends", "Riesling", "Pinot Gris"]
  },
  // ── MEXICO ────────────────────────────────────────────────────────────────────
  {
    id: "valle-de-guadalupe",
    image: "/regions/valle-de-guadalupe.webp",
    name: "Valle de Guadalupe",
    country: "Mexico",
    lat: 32.02,
    lng: -116.60,
    zoom: 9,
    description: "Just 90 minutes south of San Diego, across the Mexican border in Baja California, one of the world's most improbable and wonderful wine scenes has quietly taken root. Valle de Guadalupe has the feel of Napa circa 1975 — rustic, joyful, slightly chaotic, with winemakers taking real risks and landing somewhere genuinely exciting. <strong>Pacific fog</strong> rolls in from the coast, moderating the California-adjacent sun. The food and wine culture is electric — farm-to-table long before it was a concept, with winery-restaurants in converted shipping containers and cooking over open fire.",
    facts: [
      "Valle de Guadalupe produces approximately 90% of Mexico's total wine output",
      "The valley's Nebbiolo and <strong>Tempranillo</strong> are gaining particular international recognition",
      "Rustic winery-restaurants — some housed in shipping containers — have become a culinary destination in their own right",
      "Russian immigrants in the early 20th century were the first to plant vineyards here"
    ],
    grapes: ["Cabernet Sauvignon", "Nebbiolo", "<strong>Tempranillo</strong>", "Grenache", "Syrah", "Chardonnay", "Sauvignon Blanc"],
    climate: "Mediterranean influenced by Pacific coastal fog — warm, dry summers with cool nights",
    flavorProfile: "Reds: ripe dark fruit, sun-baked earth, dried herbs. Whites: crisp, mineral, tropical notes from the Pacific influence.",
    notableStyles: ["Cabernet Sauvignon", "Bordeaux Blends", "Nebbiolo", "Mediterranean Blends"]
  },
  // ── AUSTRALIA ────────────────────────────────────────────────────────────────
  {
    id: "barossa-valley",
    image: "/regions/barossa-valley.webp",
    name: "Barossa Valley",
    country: "Australia",
    lat: -34.56,
    lng: 138.95,
    zoom: 9,
    description: "The Barossa Valley is Australia's wine heartland — big, bold, generous, and deeply proud of it. German settlers arrived in the 1840s and planted Shiraz vines that, because phylloxera never reached here, have been growing ever since. Some of those original vines are still producing — ancient, gnarled, impossible-looking things standing in red dirt. The wine they make is extraordinary: deep purple, lush with blackberry and dark chocolate, with a richness that wraps around you. This is not subtle wine. It's not trying to be.",
    facts: [
      "Home to pre-phylloxera Shiraz vines over 170 years old — some of the oldest on the planet",
      "Penfolds Grange, Australia's most celebrated wine, is born from these Barossa vineyards",
      "German heritage is visible everywhere — in the food, the architecture, and the winemaking traditions",
      "Over 150 wineries packed into a compact valley you can explore properly in a long weekend"
    ],
    grapes: ["Shiraz", "Grenache", "Cabernet Sauvignon", "Riesling", "Mataro"],
    climate: "Warm Mediterranean with hot summers and mild winters",
    flavorProfile: "Old vine Shiraz: chocolate, blackberry, plum, eucalyptus, and black pepper. Grenache offers rose, spice, and red fruit.",
    notableStyles: ["Old Vine Shiraz", "GSM Blends", "Eden Valley Riesling", "Fortified"]
  },
  {
    id: "yarra-valley",
    image: "/regions/yarra-valley.webp",
    name: "Yarra Valley",
    country: "Australia",
    lat: -37.66,
    lng: 145.56,
    zoom: 9,
    description: "An hour from Melbourne in the misty hills of the Great Dividing Range, the Yarra Valley is Australia's answer to Burgundy — and it takes that comparison seriously. The elevation, the southerly latitude, the cool temperatures: all of it conspires to produce <strong>Pinot Noir</strong> of real delicacy and Chardonnay of real precision. A new generation of small producers is pushing things further — more transparency in the winery, more expression of individual vineyard sites. The Yarra is exciting in the way only a region on the rise can be.",
    facts: [
      "The Upper Yarra sub-region has soils similar to Burgundy's Côte de Nuits — the comparison isn't just flattery",
      "Victoria's wine history started here — vines were first planted in 1838",
      "Wine critic James Halliday founded Coldstream Hills here and helped establish the region's reputation",
      "The Yarra supplies grapes to Australia's finest traditional-method sparkling wine houses"
    ],
    grapes: ["Pinot Noir", "Chardonnay", "Cabernet Sauvignon", "Shiraz", "Pinot Gris"],
    climate: "Cool maritime-influenced continental — significant rainfall and moderate temperatures",
    flavorProfile: "Pinot Noir: red cherry, plum, forest floor, silky tannin. Chardonnay: stone fruit, hazelnut, mineral, fine acidity.",
    notableStyles: ["Pinot Noir", "Chardonnay", "Traditional Method Sparkling", "Cabernet Sauvignon"]
  },
  // ── NEW ZEALAND ──────────────────────────────────────────────────────────────
  {
    id: "marlborough",
    image: "/regions/marlborough.webp",
    name: "Marlborough",
    country: "New Zealand",
    lat: -41.52,
    lng: 173.95,
    zoom: 9,
    description: "Marlborough didn't just put New Zealand wine on the map — it invented a new style of <strong>Sauvignon Blanc</strong> that the whole world fell in love with. When Cloudy Bay released its first vintage in 1985, the wine world got a jolt: something this aromatic, this vivid, this unapologetically pungent had never been bottled before. Passionfruit, gooseberry, fresh-cut grass, and a racy acidity that made it irresistible with food. The imitations came fast. The original remains the benchmark.",
    facts: [
      "Marlborough produces over 75% of all New Zealand wine — the rest of the country is scrambling to catch up",
      "Cloudy Bay's 1985 debut vintage essentially put New Zealand on the global wine map overnight",
      "Sunshine hours here are among the highest in New Zealand, despite the maritime cool",
      "The Wairau and Awatere sub-regions produce distinctly different styles — same grape, different story"
    ],
    grapes: ["Sauvignon Blanc", "Pinot Noir", "Chardonnay", "Pinot Gris"],
    climate: "Cool maritime with high sunshine and significant diurnal range",
    flavorProfile: "Sauvignon: passionfruit, gooseberry, grapefruit, fresh-cut grass. Pinot: red cherry, herb, and silky elegance.",
    notableStyles: ["Sauvignon Blanc", "Pinot Noir", "Sparkling"]
  },
  {
    id: "central-otago",
    image: "/regions/central-otago.webp",
    name: "Central Otago",
    country: "New Zealand",
    lat: -45.03,
    lng: 169.13,
    zoom: 8,
    description: "The world's southernmost significant wine region, and one of the most dramatically beautiful — schist rock gorges, turquoise lakes, and snow-capped peaks framing vineyards that have no business being this good at this latitude. But Central Otago's semi-continental climate (New Zealand's only one) delivers the extreme diurnal swings that <strong>Pinot Noir</strong> loves: blazing daytime sun building ripeness, cold nights locking in freshness and acidity. The <strong>Pinot Noir</strong> from Bannockburn, Gibbston, and Cromwell Basin is haunting. Once you've had it, you understand.",
    facts: [
      "The southernmost significant wine region on earth — genuinely at the edge of where viticulture works",
      "Vines were first planted here during the gold rush of the 1860s — prospectors needed wine too",
      "New Zealand's only wine region with a continental rather than maritime climate",
      "Six distinct sub-regions — Bannockburn, Gibbston, Bendigo, Cromwell Basin, Wanaka, Waitaki — each with their own character"
    ],
    grapes: ["Pinot Noir", "Pinot Gris", "Riesling", "Chardonnay"],
    climate: "Semi-continental with extreme diurnal temperature variation",
    flavorProfile: "Pinot Noir: dark cherry, thyme, rosemary, with a distinctive savoury/mineral undertone and vibrant acidity.",
    notableStyles: ["Pinot Noir", "Pinot Gris", "Riesling"]
  },
  // ── CHINA ────────────────────────────────────────────────────────────────────
  {
    id: "ningxia",
    image: "/regions/ningxia.webp",
    name: "Ningxia",
    country: "China",
    lat: 38.47,
    lng: 106.27,
    zoom: 8,
    description: "In the shadow of the Helan Mountains in northern China, something unexpected is happening. Over 100 wineries have set up shop in what looks, honestly, a lot like Mendoza — high-<strong>altitude</strong> desert, <strong>gravel soils</strong>, blazing sunshine, dramatic temperature swings between day and night. The wines from Ningxia's best producers are winning major international competitions, and the wine world is paying attention. The vines get buried in winter to survive temperatures that would kill them above ground. That kind of dedication produces a particular kind of intensity.",
    facts: [
      "Ningxia now has over 100 wineries and is the fastest-growing quality wine region in Asia",
      "The Helan Mountain range blocks cold Siberian winds, creating a sheltered, dry growing environment",
      "LVMH's Ao Yun project has drawn global attention to China's serious fine wine ambitions",
      "Grapevines must be buried underground each winter to survive temperatures dropping below -20°C"
    ],
    grapes: ["Cabernet Sauvignon", "Merlot", "Cabernet Franc", "Marselan", "Chardonnay"],
    climate: "High-altitude continental desert — dry, sunny, extreme diurnal variation, severe winters",
    flavorProfile: "Cabernet: ripe blackcurrant, plum, dark spice, cedar, with good structure. Marselan (a Cab-Grenache cross): floral, dark fruit, silky.",
    notableStyles: ["Cabernet Sauvignon", "Bordeaux-Style Blends", "Marselan", "Chardonnay"]
  },
  // ── LEBANON ──────────────────────────────────────────────────────────────────
  {
    id: "bekaa-valley",
    image: "/regions/bekaa-valley.webp",
    name: "Bekaa Valley",
    country: "Lebanon",
    lat: 33.85,
    lng: 35.90,
    zoom: 8,
    description: "The Bekaa Valley has been making wine for 4,000 years, through Phoenician traders, Roman conquerors, Crusaders, and Ottoman rule — and through a 15-year civil war that barely interrupted production. That last part is the key to understanding what Lebanese wine is: stubborn, resilient, profound. Château Musar missed just two vintages during the entire civil war. The wines that emerge from this high plateau at 1,000 metres — deep-colored, complex, capable of decades of aging — are among the most soulful and underrated in the world.",
    facts: [
      "Winemaking in the Bekaa has a continuous history spanning over 4,000 years",
      "Château Musar continued producing wine through the 1975–1990 Lebanese Civil War — missing only 2 vintages",
      "Cinsault vines over 100 years old are a unique Bekaa heritage that survived everything",
      "Over 300 days of sunshine per year, with cool nights at altitude — a natural gift for viticulture"
    ],
    grapes: ["Cinsault", "Cabernet Sauvignon", "Merlot", "Syrah", "<strong>Tempranillo</strong>", "Obaideh", "Merwah"],
    climate: "Continental Mediterranean at altitude — very hot, dry summers; cold winters with snow",
    flavorProfile: "Musar-style blends: complex, oxidative, with dark fruit, tobacco, earth, dried herbs, and extraordinary savory depth. White Obaideh: nutty, oxidative, textured.",
    notableStyles: ["Cinsault-Cabernet Blends", "Musar-Style Reds", "Indigenous White Varieties"]
  },
  // ── FRANCE (CONTINUED) ──────────────────────────────────────────────────────
  {
    id: "provence",
    image: "/regions/provence.webp",
    name: "Provence",
    country: "France",
    lat: 43.53,
    lng: 5.45,
    zoom: 8,
    description: "Provence invented the idea that rosé could be elegant, complex, and worth drinking slowly rather than gulping poolside. Before the Provence revolution, most rosé was sweet and forgettable. Now those pale, dry, herb-scented bottles from the hills of Bandol and the plains around Aix-en-Provence have colonized restaurants and wine shops worldwide. But don't sleep on Bandol's reds — Mourvèdre aged for years in oak, earthy and profound, one of France's most underrated serious wines. Provence has been making wine for 2,600 years. It knows what it's doing.",
    facts: [
      "Provence produces over 160 million bottles of rosé per year — and somehow the market still wants more",
      "Bandol Mourvèdre must age a minimum of 18 months in wood — patience that shows in the glass",
      "9 AOC appellations including the coastal Cassis and the rugged Les Baux-de-Provence",
      "Whispering Angel and its Provence peers have made pale dry rosé one of the world's fastest-growing premium wine categories"
    ],
    grapes: ["Grenache", "Cinsault", "Syrah", "Mourvèdre", "Rolle (Vermentino)", "Ugni Blanc"],
    climate: "Mediterranean, with hot dry summers, mild winters, and the cooling mistral wind",
    flavorProfile: "Dry, pale rosés with strawberry, peach, white pepper, and Provençal herbs. Bandol reds deliver earthy dark fruit, garrigue, leather, and remarkable longevity.",
    notableStyles: ["Dry Rosé", "Red Blends (Bandol)", "Crisp Whites"]
  },
  {
    id: "languedoc-roussillon",
    image: "/regions/languedoc-roussillon.webp",
    name: "Languedoc-Roussillon",
    country: "France",
    lat: 43.20,
    lng: 2.95,
    zoom: 7,
    description: "Stretching 250 kilometres along the Mediterranean from the Rhône delta to the Spanish border, Languedoc-Roussillon is France's largest wine region by far — and its most underrated. This was the land of cheap bulk wine until a quality revolution in the 1990s changed everything. Adventurous producers realized that those sun-baked schist and limestone hillsides in Pic Saint-Loup, Faugères, and Corbières could produce wines of genuine complexity and character — often at a fraction of the price of Rhône Valley equivalents. The savvy drinker's France.",
    facts: [
      "France's largest wine region — over 230,000 hectares of vines stretching across the sun-drenched south",
      "Produces approximately one-third of all French wine by volume — the engine of French wine production",
      "Roussillon is France's top source of naturally sweet Muscat wines and the fortified Banyuls",
      "Over 20 AOC/AOP appellations, including the fast-rising Pic Saint-Loup and the coastal La Clape"
    ],
    grapes: ["Grenache", "Syrah", "Mourvèdre", "Carignan", "Cinsault", "Muscat", "Roussanne", "Marsanne"],
    climate: "Hot Mediterranean with the lowest rainfall in France; mitigated by altitude in hillside appellations",
    flavorProfile: "Robust reds with dark berry, garrigue, chocolate, and spice. Banyuls offers luscious dried-fruit richness. Whites show southern stone-fruit warmth with herbal freshness.",
    notableStyles: ["Red Blends", "Banyuls (Fortified)", "Muscat de Rivesaltes", "Dry Whites"]
  },
  // ── ITALY (CONTINUED) ────────────────────────────────────────────────────────
  {
    id: "veneto",
    image: "/regions/veneto.webp",
    name: "Veneto",
    country: "Italy",
    lat: 45.44,
    lng: 11.99,
    zoom: 8,
    description: "Italy's most prolific quality wine region doesn't just produce volume — it produces icons. <strong>Amarone</strong> della Valpolicella, made from grapes dried for months on bamboo racks until they shrivel into concentrated flavor bombs, is one of the world's most powerful and seductive red wines. <strong>Prosecco</strong>, from the DOCG hills of Valdobbiadene, is now the world's most popular sparkling wine. And Soave Classico, at its best, is a quietly brilliant dry white that never gets the credit it deserves. Three completely different wines, one remarkable region.",
    facts: [
      "The Veneto produces over 1 billion bottles per year — Italy's largest wine region by volume",
      "Amarone requires grapes to be dried for 90–120 days before fermentation — one of wine's most labor-intensive processes",
      "The Prosecco hills of Valdobbiadene earned UNESCO World Heritage status in 2019",
      "Soave is one of Italy's most exported white wines — though the finest examples are still underappreciated"
    ],
    grapes: ["Corvina", "Corvinone", "Rondinella", "Glera (Prosecco)", "Garganega (Soave)", "Pinot Grigio"],
    climate: "Continental in the foothills, Mediterranean near Lake Garda; frost risk in spring",
    flavorProfile: "Amarone: intense dark cherry, dried fig, dark chocolate, and spice with velvety tannins. Prosecco: fresh pear, apple blossom, and cream. Soave: almond, white flower, and citrus zest.",
    notableStyles: ["Amarone della Valpolicella", "Prosecco DOCG", "Soave Classico", "Recioto"]
  },
  // ── SPAIN (CONTINUED) ────────────────────────────────────────────────────────
  {
    id: "ribera-del-duero",
    image: "/regions/ribera-del-duero.webp",
    name: "Ribera del Duero",
    country: "Spain",
    lat: 41.63,
    lng: -3.68,
    zoom: 8,
    description: "Spain's high plateau wine country — sitting at 800 to 900 metres, where winters are brutal, summers are blazing, and the diurnal temperature swings between day and night are among Europe's most extreme. Those extremes are the point: they build concentration and aromatic complexity in <strong>Tinto Fino</strong> (the local name for <strong><strong>Tempranillo</strong></strong>) that you simply can't replicate in gentler climates. <strong>Vega Sicilia</strong> anchored this region's prestige for a century. Then Pingus arrived in 1995 and proved that something even more extraordinary was possible.",
    facts: [
      "Vineyards at 800–900 metres altitude create some of Spain's greatest day-night temperature variations",
      "Vega Sicilia's Único can spend up to 10 years in various oak vessels before release",
      "Dominio de Pingus 'Pingus' is considered Spain's most expensive and sought-after cult wine",
      "The DO spans 4 provinces along the dramatic Duero River valley"
    ],
    grapes: ["Tinto Fino (<strong>Tempranillo</strong>)", "Cabernet Sauvignon", "Merlot", "Malbec", "Albillo Mayor"],
    climate: "Extreme continental — long cold winters, very hot summers, large diurnal temperature variation",
    flavorProfile: "Dense black fruit, violets, graphite, toasted oak, and leather. Age reveals tertiary complexity of tobacco, cedar, and earthy mineral depth.",
    notableStyles: ["Crianza", "Reserva", "Gran Reserva", "Roble"]
  },
  {
    id: "jerez",
    image: "/regions/jerez.webp",
    name: "Jerez (Sherry)",
    country: "Spain",
    lat: 36.68,
    lng: -6.14,
    zoom: 8,
    description: "Sherry is wine's greatest misunderstood masterpiece. For decades it was associated with grandmothers and sweet cream versions that gave the whole category a bad name. But the real Sherry — bone-dry Fino with its saline, chamomile-and-almond bite; nutty Amontillado with decades of oxidative depth; brooding Oloroso with dried fruit and toffee — is among the most complex and food-versatile wine in the world. Shakespeare wrote about it. The world's best sommeliers are obsessed with it. And it still sells for a fraction of what it deserves.",
    facts: [
      "Sherry is produced in the 'Sherry Triangle' of Jerez, El Puerto de Santa María, and Sanlúcar de Barrameda",
      "The solera system blends wines across multiple vintages and barrels — creating consistent style with extraordinary complexity",
      "Fino Sherry develops under a living yeast veil called flor — without it, the wine doesn't exist",
      "Pedro Ximénez grapes are sun-dried on mats to create a raisin-like sweetness before pressing"
    ],
    grapes: ["Palomino", "Pedro Ximénez", "Moscatel"],
    climate: "Hot and dry Mediterranean, tempered by Atlantic winds; the Levante and Poniente winds play crucial roles",
    flavorProfile: "Fino: saline, yeasty, almond, and chamomile. Oloroso: walnut, dried fruit, and toffee. PX: raisin, fig, chocolate, and molasses.",
    notableStyles: ["Fino", "Manzanilla", "Amontillado", "Oloroso", "Palo Cortado", "Pedro Ximénez"]
  },
  // ── AUSTRALIA (CONTINUED) ────────────────────────────────────────────────────
  {
    id: "margaret-river",
    image: "/regions/margaret-river.webp",
    name: "Margaret River",
    country: "Australia",
    lat: -33.95,
    lng: 115.07,
    zoom: 8,
    description: "At the very southwestern tip of Australia, a narrow cape jutting into two oceans produces less than 3% of the country's wine — but over 20% of its premium wine. That ratio tells you everything about Margaret River. The Indian and Southern Oceans wrap around Cape Naturaliste and create a climate that's eerily similar to Bordeaux: maritime, moderate, and perfect for <strong>Cabernet Sauvignon</strong> and Chardonnay. Commercial viticulture only started here in the late 1960s, after a scientific report identified the ideal conditions. The ascent to world-class status has been remarkably swift.",
    facts: [
      "Produces less than 3% of Australian wine by volume but over 20% of premium wine by value",
      "Commercial viticulture began only in 1967 after a scientific report identified ideal growing conditions",
      "The Cape Naturaliste to Cape Leeuwin peninsula is flanked by two oceans — double the maritime moderation",
      "Semillon-Sauvignon Blanc blends from Margaret River are considered Australia's finest dry whites"
    ],
    grapes: ["Cabernet Sauvignon", "Merlot", "Chardonnay", "Sauvignon Blanc", "Semillon", "Shiraz"],
    climate: "Mediterranean maritime — warm dry summers, mild wet winters, cooled by Indian and Southern Ocean breezes",
    flavorProfile: "Cabernet: cassis, graphite, olive, and dusty tannins. Chardonnay: white peach, grapefruit, and toasted oak. SSB blends: lemongrass, passionfruit, and cut grass.",
    notableStyles: ["Cabernet Sauvignon", "Chardonnay", "Semillon-Sauvignon Blanc", "Red Bordeaux Blends"]
  },
  {
    id: "hunter-valley",
    image: "/regions/hunter-valley.webp",
    name: "Hunter Valley",
    country: "Australia",
    lat: -32.75,
    lng: 151.28,
    zoom: 8,
    description: "Australia's oldest wine region makes wine in a way that defies logic — a hot, humid climate north of Sydney that should, by rights, produce heavy, blowsy stuff. Instead, the Hunter Valley has given the world one of winedom's greatest originals: Hunter Semillon. Harvested early, bone-dry, tasting almost crisp and simple when young, it transforms over a decade in the bottle into something honeyed and toasty and beeswax-rich — one of the most distinctive white wine styles anywhere. You just have to be patient. And in the Hunter Valley, patience is rewarded.",
    facts: [
      "Australia's oldest commercial wine region — vines were planted in the 1820s",
      "Hunter Semillon is arguably Australia's most distinctive and original contribution to the wine world",
      "Older vintages were sometimes labeled 'Hermitage' — a local historical name for Shiraz",
      "Over 150 wineries and 120+ cellar doors make this Australia's most visited wine region"
    ],
    grapes: ["Semillon", "Shiraz", "Chardonnay", "Verdelho", "Cabernet Sauvignon"],
    climate: "Hot and humid subtropical with summer rainfall — unusual for fine wine production",
    flavorProfile: "Semillon: lemon curd and grass when young; honey, toast, and lanolin with 10+ years age. Shiraz: earthy, leathery, with red berry, black pepper, and soft tannins.",
    notableStyles: ["Hunter Semillon", "Hunter Shiraz", "Unoaked Chardonnay"]
  },
  // ── NEW ZEALAND (CONTINUED) ───────────────────────────────────────────────────
  {
    id: "hawkes-bay",
    image: "/regions/hawkes-bay.webp",
    name: "Hawke's Bay",
    country: "New Zealand",
    lat: -39.49,
    lng: 176.91,
    zoom: 8,
    description: "While Marlborough gets all the headlines, Hawke's Bay is quietly making New Zealand's most compelling red wines. The Gimblett Gravels is the key: a uniquely free-draining shingle riverbed that was once a dry riverbed and now radiates heat in a way that lets <strong>Cabernet Sauvignon</strong>, Merlot, and Syrah ripen fully in what would otherwise be too cool a climate. The results are seriously impressive — especially the Syrah, which has a northern Rhône-like character of smoked meat and black pepper that takes you completely by surprise.",
    facts: [
      "Gimblett Gravels is New Zealand's most celebrated and internationally recognized wine sub-appellation",
      "Over 2,200 sunshine hours per year — the most in New Zealand, giving red grapes the best possible chance",
      "Hawke's Bay has New Zealand's second-largest planted area with around 5,000 hectares of vines",
      "Bordeaux varieties have been grown here since Mission Estate first planted them in the 1850s"
    ],
    grapes: ["Merlot", "Cabernet Sauvignon", "Syrah", "Chardonnay", "Sauvignon Blanc", "Viognier"],
    climate: "Warm, sunny maritime — New Zealand's most reliable ripening conditions for red varieties",
    flavorProfile: "Gimblett Gravels reds: dark berry, plum, dusty tannins, and subtle spice. Chardonnay: stone fruit, citrus, and toasted oak. Syrah: black pepper, smoked meat, and violets.",
    notableStyles: ["Red Bordeaux Blends", "Gimblett Gravels Syrah", "Chardonnay"]
  },
  // ── USA (CONTINUED) ───────────────────────────────────────────────────────────
  {
    id: "paso-robles",
    image: "/regions/paso-robles.webp",
    name: "Paso Robles",
    country: "USA",
    lat: 35.63,
    lng: -120.69,
    zoom: 8,
    description: "Paso Robles is what Napa might have been if it had stayed a little more relaxed. California's Central Coast region has an extraordinary natural asset: one of the most extreme diurnal temperature swings in any wine region on earth — days can top 40°C while nights drop close to 10°C. That means full ripeness and fresh acidity in the same bottle. The Rhône varieties love it here. So does <strong>Cabernet Sauvignon</strong>. And the whole scene has an unpretentious, roll-up-your-sleeves energy that makes it genuinely fun to explore.",
    facts: [
      "Paso Robles experiences one of California's most extreme diurnal temperature swings — sometimes up to 50°F in a single day",
      "Over 40 different soil types within the region create remarkable vineyard-to-vineyard diversity",
      "DAOU's Soul of a Lion became California's fastest-rising cult Cabernet of recent years",
      "The region has 40+ sub-AVAs including the cooler Adelaida District and the fog-channeling Templeton Gap"
    ],
    grapes: ["Cabernet Sauvignon", "Zinfandel", "Grenache", "Syrah", "Mourvèdre", "Viognier", "Chardonnay"],
    climate: "Semi-arid Mediterranean with dramatic diurnal temperature variation; cooled by Pacific fog and wind",
    flavorProfile: "Bold Cabernet with dark cherry, cassis, and mocha. Rhône blends show earthy spice, lavender, and wild berry. Zinfandel delivers jammy plum, pepper, and vanilla.",
    notableStyles: ["Cabernet Sauvignon", "Rhône Blends", "Zinfandel", "GSM Blends"]
  },
  // ── GERMANY (CONTINUED) ───────────────────────────────────────────────────────
  {
    id: "rheingau",
    image: "/regions/rheingau.webp",
    name: "Rheingau",
    country: "Germany",
    lat: 50.02,
    lng: 8.05,
    zoom: 8,
    description: "The Rheingau is where German Riesling first found its aristocratic identity. The Rhine makes an unusual westward turn here, creating a long south-facing slope of sun-drenched vineyards protected from northern winds by the Taunus Mountains — ideal conditions for producing wines of crystalline precision and extraordinary longevity. Legend has it that Spätlese — the late-harvest style — was accidentally invented here in 1775 when a courier to Schloss Johannisberg was delayed, and the grapes had already overripened by the time harvest was permitted. The accident tasted magnificent.",
    facts: [
      "Schloss Johannisberg is credited with accidentally inventing the Spätlese style in 1775 — history's happiest mistake",
      "The Kloster Eberbach monastery inspired the setting for Umberto Eco's famous novel 'The Name of the Rose'",
      "The Rheingau is 80% Riesling — Germany's most Riesling-dominated major region",
      "Rüdesheimer Berg Schlossberg is widely considered one of Germany's greatest individual Riesling sites"
    ],
    grapes: ["Riesling", "Spätburgunder (Pinot Noir)"],
    climate: "Cool continental, moderated by the Rhine River and Taunus Mountains; south-facing slopes maximize sun exposure",
    flavorProfile: "Riesling: steely minerality, lime, green apple, and white peach. Aged Auslesen develop honey, petrol, and dried apricot. Spätburgunder offers silky red cherry and earthy elegance.",
    notableStyles: ["Riesling Spätlese", "Riesling Auslese", "Sekt (Sparkling)", "Spätburgunder"]
  },
  // ── PORTUGAL (CONTINUED) ─────────────────────────────────────────────────────
  {
    id: "vinho-verde",
    image: "/regions/vinho-verde.webp",
    name: "Vinho Verde",
    country: "Portugal",
    lat: 41.70,
    lng: -8.30,
    zoom: 8,
    description: "The name means 'green wine' — not green in color, but green in spirit: young, fresh, alive. The lush, rainy, intensely green northwest corner of Portugal produces whites of vibrant acidity and natural effervescence, perfect for hot evenings and seafood. Most of the world knows the light, affordable Alvarinho-Loureiro blends. But there's a secret at the top: single-varietal Alvarinho from the Monção e Melgaço sub-region, close to the Spanish border, is one of Portugal's great mineral whites — textured, stone-fruited, and genuinely profound.",
    facts: [
      "Vinho Verde covers over 21,000 hectares — one of Europe's largest DOC wine regions",
      "Alvarinho from Monção e Melgaço is widely considered Portugal's finest dry white wine",
      "Over 50 authorized indigenous grape varieties — a treasure chest of genetic diversity",
      "Traditional Vinho Verde has slight natural effervescence from residual CO2 retained in the bottle"
    ],
    grapes: ["Alvarinho", "Loureiro", "Arinto", "Trajadura", "Azal", "Avesso"],
    climate: "Atlantic oceanic — high rainfall, cool temperatures, high humidity; perfect for crisp, high-acid whites",
    flavorProfile: "Lime zest, green apple, white peach, and a distinctive saline minerality. Alvarinho adds stone fruit depth and textural richness. Light effervescence adds freshness.",
    notableStyles: ["Alvarinho", "Multi-varietal Blends", "Sparkling Vinho Verde"]
  },
  // ── SOUTH AFRICA (CONTINUED) ─────────────────────────────────────────────────
  {
    id: "franschhoek",
    image: "/regions/franschhoek.webp",
    name: "Franschhoek",
    country: "South Africa",
    lat: -33.91,
    lng: 19.12,
    zoom: 8,
    description: "Franschhoek means 'French Corner' in Dutch — and it earned the name honestly. Huguenot refugees fleeing persecution arrived here in 1688, bringing French winemaking traditions and naming their farms after the regions they'd left behind: La Motte, Chamonix, Haute Cabrière. The valley they settled is enclosed on three sides by dramatic granite mountains, the <strong>altitude</strong> and mountain breezes keeping it elegantly cool. Today Franschhoek is South Africa's most beautiful wine valley and arguably its finest food destination — and the old-vine Semillon from its hillside estates is one of South Africa's most distinctive white wine treasures.",
    facts: [
      "Huguenot settlers arrived in 1688, bringing French winemaking traditions to southern Africa",
      "The valley sits at 200–300 metres altitude, creating cooler conditions than the surrounding Winelands",
      "Franschhoek has the highest concentration of fine-dining restaurants in South Africa",
      "Old-vine Semillon from Franschhoek is one of South Africa's rarest and most distinctive wine styles"
    ],
    grapes: ["Semillon", "Chardonnay", "Shiraz", "Cabernet Sauvignon", "Grenache", "Chenin Blanc"],
    climate: "Mediterranean with altitude cooling — warm dry summers, cool wet winters; mountain breezes moderate heat",
    flavorProfile: "Semillon: waxy lemon, beeswax, and herbal complexity with age. Reds show dark fruit, violet, and fine-grained tannins. Chardonnay: stone fruit, hazelnut, and creamy texture.",
    notableStyles: ["Semillon", "Red Blends", "Chardonnay", "Méthode Cap Classique Sparkling"]
  },
  // ── BRAZIL ───────────────────────────────────────────────────────────────────
  {
    id: "serra-gaucha",
    image: "/regions/serra-gaucha.webp",
    name: "Serra Gaúcha",
    country: "Brazil",
    lat: -29.17,
    lng: -51.18,
    zoom: 8,
    description: "Brazil making serious wine? The country isn't exactly what most people picture when they think of fine viticulture — but the highland valleys of Rio Grande do Sul in the far south are a different story entirely. Italian immigrants arrived here in the 1870s, planted the varieties they knew from home, and established a wine culture that has been quietly refining itself ever since. The big news now is sparkling wine: traditional-method espumante from these misty highland valleys is winning international awards and turning heads among those who've tried it.",
    facts: [
      "Serra Gaúcha produces over 85% of Brazil's wine — around 300 million litres annually",
      "Italian immigrants first planted vines here in 1875, and their descendants are still making wine",
      "Vale dos Vinhedos became Brazil's first DOC appellation in 2012",
      "Brazilian sparkling wine (espumante) is winning international medals at an increasingly impressive rate"
    ],
    grapes: ["Moscato Giallo", "Chardonnay", "Pinot Noir", "Merlot", "Cabernet Sauvignon", "Tannat"],
    climate: "Highland subtropical — cool nights, high rainfall; the most temperate climate in Brazil for wine",
    flavorProfile: "Sparkling: fresh citrus, brioche, and cream. Merlot shows plum, herbs, and soft tannins. Moscato delivers sweet, floral grape richness with effervescence.",
    notableStyles: ["Espumante (Sparkling)", "Merlot", "Moscato", "Tannat"]
  },
  // ── JAPAN ─────────────────────────────────────────────────────────────────────
  {
    id: "yamanashi",
    image: "/regions/yamanashi.webp",
    name: "Yamanashi",
    country: "Japan",
    lat: 35.66,
    lng: 138.57,
    zoom: 8,
    description: "In the mountains southwest of Tokyo, with Mount Fuji's snow-capped cone on the western horizon, Japan's most celebrated wine region has been quietly producing one of the wine world's most singular varieties. Koshu — a pink-skinned grape that traveled the Silk Road over a thousand years ago — makes whites unlike anything else: delicate, bone-dry, subtly citrus-and-mineral, with an umami quality that makes them pair with Japanese cuisine in a way that no other wine quite manages. The world's best sommeliers are discovering it. You should too.",
    facts: [
      "Koshu grapes have been cultivated in Yamanashi for over 1,000 years — Japan's oldest known wine grape",
      "Japan's first commercial winery opened in Katsunuma, Yamanashi in 1877",
      "Yamanashi accounts for over 30% of Japan's total wine production",
      "Grace Wine's Koshu Kayagatake is Japan's most internationally decorated white wine"
    ],
    grapes: ["Koshu", "Muscat Bailey A", "Merlot", "Cabernet Sauvignon", "Chardonnay"],
    climate: "Humid continental — warm summers with typhoon season rainfall, cold dry winters; challenging but character-building",
    flavorProfile: "Koshu: pale and delicate with yuzu, peach, white flower, and saline mineral finish. Red varieties show soft red fruit and earthiness.",
    notableStyles: ["Koshu (Dry White)", "Sparkling Koshu", "Muscat Bailey A Red"]
  },
  // ── TURKEY ───────────────────────────────────────────────────────────────────
  {
    id: "cappadocia",
    image: "/regions/cappadocia.webp",
    name: "Cappadocia",
    country: "Turkey",
    lat: 38.64,
    lng: 34.83,
    zoom: 8,
    description: "Winemaking has been practiced in Cappadocia for over 4,000 years — in the same volcanic landscape of fairy chimneys and underground cave cities that makes this one of the world's most otherworldly travel destinations. Today's producers age their wines in those same cave cellars, at perfect natural temperature and humidity. The indigenous grapes here — Öküzgözü, Boğazkere, Emir — are varieties the rest of the world barely knows, and they produce wines with a distinctive character that you genuinely cannot find anywhere else. Turkey has the world's fifth-largest planted vineyard area. Most of its wine potential is still untapped.",
    facts: [
      "Winemaking in Cappadocia dates back over 4,000 years to Hittite civilization",
      "Turkey has the world's 5th largest planted vineyard area with over 500 indigenous grape varieties",
      "Wines are aged in natural volcanic cave cellars that maintain perfect temperature and humidity year-round",
      "Cappadocia's volcanic tuff soil (ignimbrite) is uniquely mineral — found nowhere else in wine country"
    ],
    grapes: ["Öküzgözü", "Boğazkere", "Emir", "Narince", "Kalecik Karası"],
    climate: "Semi-arid continental at high altitude — hot summers, cold winters, dramatic diurnal swings",
    flavorProfile: "Öküzgözü: cherry, mulberry, and earthy spice with medium tannins. Boğazkere: intense dark fruit, black pepper, and firm tannic structure. Emir: crisp citrus and mineral freshness.",
    notableStyles: ["Öküzgözü Red", "Boğazkere Red", "Emir White", "Indigenous Variety Blends"]
  }
];
