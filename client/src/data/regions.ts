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
    image: "./regions/bordeaux.webp",
    name: "Bordeaux",
    country: "France",
    lat: 44.84,
    lng: -0.58,
    zoom: 8,
    description: "The most iconic wine region in the world. Bordeaux produces legendary red blends based on Cabernet Sauvignon and Merlot, alongside exquisite sweet wines from Sauternes. The classification system dating to 1855 remains a global benchmark for wine prestige. The Left Bank favors Cabernet Sauvignon on gravel soils, while the Right Bank is Merlot country on clay and limestone.",
    facts: [
      "Home to over 7,000 wine producers and 60 appellations",
      "The 1855 Classification still defines the hierarchy of top estates",
      "Produces roughly 700 million bottles per year",
      "Saint-Émilion was the first wine region designated a UNESCO World Heritage Site"
    ],
    grapes: ["Cabernet Sauvignon", "Merlot", "Cabernet Franc", "Petit Verdot", "Sémillon", "Sauvignon Blanc"],
    climate: "Maritime, moderated by the Atlantic Ocean and the Gironde estuary",
    flavorProfile: "Structured reds with blackcurrant, cedar, tobacco, and graphite. Right Bank wines show plum, truffle, and earthy richness.",
    notableStyles: ["Red Blends", "Sweet Whites (Sauternes)", "Dry Whites"]
  },
  {
    id: "burgundy",
    image: "./regions/burgundy.webp",
    name: "Burgundy",
    country: "France",
    lat: 47.04,
    lng: 4.84,
    zoom: 8,
    description: "Burgundy is the spiritual home of Pinot Noir and Chardonnay. Nowhere else on earth is the concept of terroir — the idea that specific plots of land impart unique character — more revered. From the grand crus of Gevrey-Chambertin to the pristine whites of Puligny-Montrachet, Burgundy represents the pinnacle of single-varietal winemaking.",
    facts: [
      "Over 100 appellations in a relatively small area",
      "Grand Cru vineyards account for just 1% of total production",
      "The climat system of vineyard parcels is a UNESCO World Heritage Site",
      "Some plots have been continuously cultivated for over 1,000 years"
    ],
    grapes: ["Pinot Noir", "Chardonnay", "Gamay", "Aligoté"],
    climate: "Continental with cold winters and warm summers",
    flavorProfile: "Reds offer cherry, raspberry, earth, and mushroom. Whites show lemon, butter, hazelnut, and mineral tension.",
    notableStyles: ["Pinot Noir", "Chardonnay", "Chablis", "Beaujolais (Gamay)"]
  },
  {
    id: "champagne",
    image: "./regions/champagne.webp",
    name: "Champagne",
    country: "France",
    lat: 49.05,
    lng: 3.95,
    zoom: 8,
    description: "The northernmost major wine region in France, Champagne is synonymous with celebration. The méthode champenoise — secondary fermentation in the bottle — creates the world's most famous sparkling wine. Only sparkling wines produced here can legally bear the name Champagne.",
    facts: [
      "Only about 34,000 hectares planted — fiercely protected",
      "Chalk soils up to 200 meters deep provide perfect drainage and minerality",
      "Non-vintage Champagne must age at least 15 months on lees",
      "The pressure inside a bottle is roughly 6 atmospheres — three times a car tire"
    ],
    grapes: ["Chardonnay", "Pinot Noir", "Pinot Meunier"],
    climate: "Cool continental, at the northern limit of grape ripening",
    flavorProfile: "Citrus, green apple, brioche, toast, and chalky minerality. Vintage Champagnes develop honey and dried fruit.",
    notableStyles: ["Brut NV", "Blanc de Blancs", "Blanc de Noirs", "Rosé", "Prestige Cuvée"]
  },
  {
    id: "rhone",
    image: "./regions/rhone.webp",
    name: "Rhône Valley",
    country: "France",
    lat: 44.13,
    lng: 4.81,
    zoom: 8,
    description: "Stretching from the steep granite slopes of Côte-Rôtie in the north to the sun-baked plains of Châteauneuf-du-Pape in the south, the Rhône Valley offers dramatic diversity. Northern Rhône focuses on Syrah; Southern Rhône is a playground of blends, with Grenache taking the lead.",
    facts: [
      "Châteauneuf-du-Pape allows 13 different grape varieties in its blend",
      "Hermitage has been prized since Roman times",
      "The Mistral wind keeps vineyards dry and disease-free",
      "Condrieu produces some of the world's finest Viognier"
    ],
    grapes: ["Syrah", "Grenache", "Mourvèdre", "Viognier", "Marsanne", "Roussanne"],
    climate: "Continental in the north, Mediterranean in the south",
    flavorProfile: "Northern: dark fruit, pepper, smoked meat, violet. Southern: ripe red fruit, herbs, lavender, garrigue.",
    notableStyles: ["Syrah (Northern)", "GSM Blends (Southern)", "Viognier", "Rosé"]
  },
  {
    id: "loire",
    image: "./regions/loire.webp",
    name: "Loire Valley",
    country: "France",
    lat: 47.38,
    lng: 0.69,
    zoom: 7,
    description: "Stretching 600 miles along France's longest river, the Loire Valley is astonishingly diverse. From the flinty Sauvignon Blanc of Sancerre to the honeyed Chenin Blanc of Vouvray, from the light Cabernet Franc of Chinon to the briny Muscadet by the Atlantic — the Loire offers something for every palate at often surprisingly accessible prices.",
    facts: [
      "France's third-largest wine region by volume",
      "The château-dotted valley is a UNESCO World Heritage Site",
      "A hotbed of the natural wine movement, especially in Anjou and Touraine",
      "Muscadet sur lie aging on yeast gives the wine its distinctive breadth"
    ],
    grapes: ["Sauvignon Blanc", "Chenin Blanc", "Cabernet Franc", "Melon de Bourgogne", "Gamay"],
    climate: "Cool maritime (west) to cool continental (east)",
    flavorProfile: "Sancerre: gunflint, citrus, gooseberry. Vouvray: quince, honey, beeswax. Chinon: raspberry, pencil shavings, violet.",
    notableStyles: ["Sancerre", "Vouvray", "Chinon", "Muscadet", "Crémant de Loire"]
  },
  {
    id: "alsace",
    image: "./regions/alsace.webp",
    name: "Alsace",
    country: "France",
    lat: 48.17,
    lng: 7.30,
    zoom: 8,
    description: "Tucked between the Vosges Mountains and the Rhine River, Alsace is France's most Germanic wine region. The rain shadow created by the Vosges makes it one of the driest areas in France, and producers craft intensely aromatic white wines — Riesling, Gewurztraminer, Pinot Gris — that are among the most food-friendly in the world.",
    facts: [
      "51 Grand Cru vineyards, each with distinct geological character",
      "The only French region where wines are labeled by grape variety, not appellation",
      "The Route des Vins d'Alsace is one of the world's oldest wine routes (established 1953)",
      "Vendange Tardive (late harvest) wines offer extraordinary richness"
    ],
    grapes: ["Riesling", "Gewurztraminer", "Pinot Gris", "Muscat", "Pinot Blanc"],
    climate: "Cool continental, sheltered by the Vosges — one of the driest in France",
    flavorProfile: "Riesling: lime, petrol, mineral. Gewurztraminer: lychee, rose, ginger. Pinot Gris: smoke, honey, pear.",
    notableStyles: ["Riesling Grand Cru", "Gewurztraminer", "Vendange Tardive", "Crémant d'Alsace"]
  },
  // ── ITALY ────────────────────────────────────────────────────────────────────
  {
    id: "tuscany",
    image: "./regions/tuscany.webp",
    name: "Tuscany",
    country: "Italy",
    lat: 43.35,
    lng: 11.32,
    zoom: 8,
    description: "Tuscany is Italy's most prestigious wine region, where Sangiovese reigns supreme. From the elegant Brunello di Montalcino to the rustic charm of Chianti Classico, and the bold Super Tuscans that broke all the rules, Tuscany blends centuries of tradition with a rebel spirit.",
    facts: [
      "Brunello di Montalcino must be aged at least 5 years before release",
      "Super Tuscans emerged in the 1970s when producers defied local regulations",
      "Chianti Classico's black rooster symbol dates to a medieval legend",
      "Bolgheri, home to Sassicaia, was only awarded DOC status in 1994"
    ],
    grapes: ["Sangiovese", "Cabernet Sauvignon", "Merlot", "Vernaccia"],
    climate: "Mediterranean with hot, dry summers and mild winters",
    flavorProfile: "Sangiovese: cherry, leather, tobacco, dried herbs, and firm acidity. Super Tuscans add cassis and chocolate depth.",
    notableStyles: ["Brunello di Montalcino", "Chianti Classico", "Super Tuscan", "Vernaccia di San Gimignano"]
  },
  {
    id: "piedmont",
    image: "./regions/piedmont.webp",
    name: "Piedmont",
    country: "Italy",
    lat: 44.69,
    lng: 8.04,
    zoom: 8,
    description: "Nestled at the foot of the Alps, Piedmont produces Italy's most age-worthy wines. Barolo and Barbaresco, both made from the Nebbiolo grape, are known as the 'King and Queen of Italian wine.' The region also excels with Barbera, Dolcetto, and the beloved sparkling Moscato d'Asti.",
    facts: [
      "Barolo must be aged at least 38 months, with 18 in oak",
      "The Langhe wine landscape is a UNESCO World Heritage Site",
      "White truffles from Alba are among the world's most expensive foods",
      "Nebbiolo gets its name from 'nebbia' (fog), which blankets the hills in autumn"
    ],
    grapes: ["Nebbiolo", "Barbera", "Dolcetto", "Moscato"],
    climate: "Continental with significant diurnal temperature variation",
    flavorProfile: "Nebbiolo: rose petal, tar, cherry, truffle, and powerful tannins. Barbera offers bright acidity with dark fruit.",
    notableStyles: ["Barolo", "Barbaresco", "Barbera d'Asti", "Moscato d'Asti"]
  },
  {
    id: "sicily",
    image: "./regions/sicily.webp",
    name: "Sicily",
    country: "Italy",
    lat: 37.73,
    lng: 14.80,
    zoom: 8,
    description: "Italy's sun-drenched island is experiencing a remarkable wine renaissance, led by the volcanic slopes of Mount Etna. Etna Rosso and Bianco, from pre-phylloxera vines planted at altitude on black lava soil, have captivated the world's finest sommeliers. Alongside Etna, the traditional Nero d'Avola grape produces rich, spicy reds while native whites like Catarratto and Carricante shine with salty minerality.",
    facts: [
      "Mount Etna's vineyards sit at 600–1,000 metres — among Europe's highest",
      "Many Etna vines are pre-phylloxera, planted directly in volcanic soil",
      "Marsala, Sicily's historic fortified wine, was invented in 1796",
      "Sicily is now one of Italy's most dynamic regions for premium wine"
    ],
    grapes: ["Nero d'Avola", "Nerello Mascalese", "Nerello Cappuccio", "Catarratto", "Carricante", "Grillo"],
    climate: "Mediterranean — hot, dry summers; mild, wet winters; cool nights on Etna",
    flavorProfile: "Etna Rosso: wild cherry, blood orange, volcanic ash, herbs. Nero d'Avola: dark plum, chocolate, spice. Etna Bianco: saline, citrus, almond.",
    notableStyles: ["Etna Rosso", "Etna Bianco", "Nero d'Avola", "Marsala (Fortified)"]
  },
  // ── SPAIN ────────────────────────────────────────────────────────────────────
  {
    id: "rioja",
    image: "./regions/rioja.webp",
    name: "Rioja",
    country: "Spain",
    lat: 42.47,
    lng: -2.45,
    zoom: 8,
    description: "Spain's most famous wine region, Rioja is synonymous with Tempranillo and extended oak aging. The traditional classification system — Crianza, Reserva, Gran Reserva — rewards patience. A new wave of producers is also championing single-vineyard wines that spotlight terroir over oak influence.",
    facts: [
      "Gran Reserva wines must age at least 5 years, with 2 in oak",
      "Rioja was Spain's first DOCa (highest classification) in 1991",
      "Three sub-regions: Rioja Alta, Rioja Alavesa, and Rioja Oriental",
      "American oak barrels (vanilla, coconut) are traditional; French oak is the modern choice"
    ],
    grapes: ["Tempranillo", "Garnacha", "Graciano", "Mazuelo", "Viura"],
    climate: "Mix of Atlantic, Continental, and Mediterranean influences",
    flavorProfile: "Vanilla, leather, cherry, strawberry, and tobacco from oak aging. Modern styles emphasize fruit purity.",
    notableStyles: ["Crianza", "Reserva", "Gran Reserva", "White Rioja"]
  },
  {
    id: "priorat",
    image: "./regions/priorat.webp",
    name: "Priorat",
    country: "Spain",
    lat: 41.20,
    lng: 0.81,
    zoom: 9,
    description: "A rugged, mountainous enclave in Catalonia, Priorat is Spain's other DOCa (alongside Rioja). The unique llicorella soil — black slate and quartz — forces vines deep for water, producing tiny yields of extraordinary concentration. Old-vine Garnacha and Cariñena create wines of immense power and mineral complexity.",
    facts: [
      "One of only two Spanish DOCa regions",
      "Llicorella (slate) soil can be up to 2 meters deep",
      "The region was virtually abandoned until the late 1980s renaissance",
      "Average vine age is among the highest in Spain"
    ],
    grapes: ["Garnacha", "Cariñena", "Cabernet Sauvignon", "Syrah"],
    climate: "Mediterranean with extreme continental influence — hot days, cold nights",
    flavorProfile: "Intense mineral, blackberry, cherry, licorice, and schist-driven savory character with immense concentration.",
    notableStyles: ["Old Vine Garnacha", "Garnacha-Cariñena Blends", "Vi de Vila (Village Wines)"]
  },
  // ── GERMANY ─────────────────────────────────────────────────────────────────
  {
    id: "mosel",
    image: "./regions/mosel.webp",
    name: "Mosel",
    country: "Germany",
    lat: 49.97,
    lng: 7.11,
    zoom: 8,
    description: "The Mosel's impossibly steep, slate-covered vineyards produce some of the world's most electrifying Rieslings. The river's hairpin bends create sun-trap amphitheaters where Riesling achieves a thrilling balance of sweetness and acidity. These are wines of crystalline purity and extraordinary longevity.",
    facts: [
      "Some vineyards have slopes exceeding 65 degrees — the steepest in the world",
      "Blue and red slate soils give wines their distinctive mineral character",
      "Riesling from top sites can age for decades, even centuries",
      "Alcohol levels often hover around 7-9%, among the lowest for still wine"
    ],
    grapes: ["Riesling", "Müller-Thurgau", "Elbling"],
    climate: "Cool continental, at the northern margin of viticulture",
    flavorProfile: "Riesling: lime, green apple, white peach, wet slate, and petrol with age. Tension between sweetness and razor-sharp acidity.",
    notableStyles: ["Kabinett", "Spätlese", "Auslese", "Trockenbeerenauslese", "Trocken (Dry)"]
  },
  // ── PORTUGAL ─────────────────────────────────────────────────────────────────
  {
    id: "douro",
    image: "./regions/douro.webp",
    name: "Douro Valley",
    country: "Portugal",
    lat: 41.16,
    lng: -7.79,
    zoom: 8,
    description: "The Douro is one of the oldest demarcated wine regions in the world (1756). Its terraced, schist-laden hillsides along the Douro River produce Portugal's legendary Port wine, but the region's dry reds are increasingly winning global acclaim. Over 80 indigenous grape varieties thrive here.",
    facts: [
      "UNESCO World Heritage cultural landscape since 2001",
      "The Marquis of Pombal established the world's first wine appellation here in 1756",
      "Over 80 indigenous grape varieties are authorized",
      "The terraced vineyards represent centuries of human sculpting of the landscape"
    ],
    grapes: ["Touriga Nacional", "Touriga Franca", "Tinta Roriz", "Tinta Barroca", "Tinto Cão"],
    climate: "Hot continental summers, cold winters, sheltered from Atlantic influence",
    flavorProfile: "Port: rich, fortified, with blackberry, chocolate, spice. Dry reds: dense, violet-scented, with wild berry and schist minerality.",
    notableStyles: ["Vintage Port", "Tawny Port", "Vintage Dry Red", "White Port"]
  },
  // ── AUSTRIA ──────────────────────────────────────────────────────────────────
  {
    id: "wachau",
    image: "./regions/wachau.webp",
    name: "Wachau",
    country: "Austria",
    lat: 48.37,
    lng: 15.42,
    zoom: 9,
    description: "The Wachau, a stunning stretch of the Danube River between Melk and Krems, is Austria's most celebrated wine region. Terraced vineyards carved from steep, rocky slopes of gneiss and granite produce Grüner Veltliner and Riesling of remarkable purity and mineral intensity. The region's own classification system — Steinfeder, Federspiel, Smaragd — is named after local wildlife and defines wine style by ripeness level.",
    facts: [
      "UNESCO World Heritage landscape encompassing vineyards, monasteries, and castles",
      "Smaragd (named after the emerald lizard) is the highest and ripest Wachau classification",
      "The Danube moderates temperatures, enabling fine, complex wines",
      "Vines on slopes as steep as 65 degrees must be worked entirely by hand"
    ],
    grapes: ["Grüner Veltliner", "Riesling", "Pinot Blanc"],
    climate: "Cool continental with the warming influence of the Danube River gorge",
    flavorProfile: "Grüner Veltliner: white pepper, citrus, green herb, and mineral. Riesling: lime, stone fruit, slate, and great longevity.",
    notableStyles: ["Grüner Veltliner Smaragd", "Riesling Smaragd", "Federspiel (medium-bodied)"]
  },
  // ── HUNGARY ──────────────────────────────────────────────────────────────────
  {
    id: "tokaj",
    image: "./regions/tokaj.webp",
    name: "Tokaj",
    country: "Hungary",
    lat: 48.12,
    lng: 21.40,
    zoom: 9,
    description: "Tokaj, in northeastern Hungary, is the birthplace of one of the world's greatest sweet wines. Tokaji Aszú, made from botrytis-affected Furmint grapes, has been produced since at least 1571 and was described by King Louis XIV as 'the wine of kings, the king of wines.' The volcanic soils of the Tokaj hills, combined with the misty autumns that encourage noble rot, create conditions for liquid gold.",
    facts: [
      "Tokaj was the world's first legally demarcated wine region, classified in 1730",
      "Tokaji Aszú is rated in puttonyos (baskets) from 3 to 6 — higher is sweeter",
      "Eszencia, the rarest expression, can contain up to 800 g/L of residual sugar",
      "Louis XIV called Tokaji 'Vinum Regum, Rex Vinorum' — wine of kings, king of wines"
    ],
    grapes: ["Furmint", "Hárslevelű", "Yellow Muscat", "Zéta"],
    climate: "Continental with warm summers and misty autumns — ideal for botrytis",
    flavorProfile: "Aszú: marmalade, apricot, saffron, honey, ginger, and razor-sharp acidity. Dry Furmint: lime, chamomile, grapefruit, and smoky mineral.",
    notableStyles: ["Tokaji Aszú", "Tokaji Eszencia", "Dry Furmint", "Szamorodni"]
  },
  // ── CROATIA ──────────────────────────────────────────────────────────────────
  {
    id: "istria-dalmatia",
    image: "./regions/istria-dalmatia.webp",
    name: "Istria & Dalmatia",
    country: "Croatia",
    lat: 43.50,
    lng: 16.40,
    zoom: 7,
    description: "Croatia's Adriatic coast shelters two of Europe's most exciting emerging wine regions. Istria, the peninsula to the north, is celebrated for its golden Malvasia Istriana — a fragrant, mineral white unlike any other. Dalmatia, running south past Split and Dubrovnik, is home to Plavac Mali, a close genetic relative of Zinfandel, producing bold, sun-drenched reds. Ancient Greek settlers planted vines on these shores over 2,500 years ago.",
    facts: [
      "Plavac Mali is genetically related to Zinfandel (and California's Primitivo)",
      "Croatia has over 130 indigenous grape varieties, many still undiscovered",
      "Dingač, on the Pelješac Peninsula, was Yugoslavia's first controlled-origin wine",
      "Croatian wine culture dates to Greek colonists settling the Dalmatian coast around 400 BC"
    ],
    grapes: ["Malvasia Istriana", "Plavac Mali", "Posip", "Bogdanuša", "Babić", "Teran"],
    climate: "Mediterranean along the coast — hot, dry summers with strong Bora and Jugo winds",
    flavorProfile: "Malvasia: aromatic, floral, apricot, almond. Plavac Mali: dark cherry, leather, tobacco, spice, and sun-baked earthiness.",
    notableStyles: ["Malvasia Istriana (White)", "Dingač (Red)", "Plavac Mali", "Orange Wines"]
  },
  // ── GEORGIA ──────────────────────────────────────────────────────────────────
  {
    id: "kakheti",
    image: "./regions/kakheti.webp",
    name: "Kakheti",
    country: "Georgia",
    lat: 41.65,
    lng: 45.70,
    zoom: 8,
    description: "Georgia is the cradle of wine civilization, with evidence of winemaking dating back 8,000 years, and Kakheti is its viticultural heart. The region's defining tradition is qvevri winemaking — fermenting and aging wine in large clay vessels buried underground — producing amber/orange wines of extraordinary complexity and history. Over 500 indigenous grape varieties grow in this ancient Caucasian terroir.",
    facts: [
      "Georgia has 8,000-year-old winemaking history, confirmed by genetic and archaeological evidence",
      "UNESCO recognized Georgian qvevri winemaking as an Intangible Cultural Heritage in 2013",
      "Over 500 indigenous grape varieties grow in Georgia — more diversity than any country in Europe",
      "Rkatsiteli is one of the world's oldest known cultivated grape varieties"
    ],
    grapes: ["Rkatsiteli", "Saperavi", "Kakhuri Mtsvane", "Chinuri", "Tavkveri"],
    climate: "Continental with hot summers, cold winters, and the moderating influence of the Alazani River valley",
    flavorProfile: "Amber/qvevri whites: dried apricot, chamomile, walnut, tannin, oxidative richness. Saperavi reds: intense black fruit, ink, tobacco, and firm tannin.",
    notableStyles: ["Amber (Skin-Contact) White", "Saperavi Red", "Qvevri Natural Wine", "Rkatsiteli"]
  },
  // ── GREECE ───────────────────────────────────────────────────────────────────
  {
    id: "santorini",
    image: "./regions/santorini.webp",
    name: "Santorini",
    country: "Greece",
    lat: 36.39,
    lng: 25.46,
    zoom: 10,
    description: "Santorini's volcanic Aegean island is home to one of the world's most unique wine terroirs. Vines trained in low-coiled baskets (kouloura) hug the ground to withstand fierce Meltemi winds on ash and pumice soils that have never been touched by phylloxera. The Assyrtiko grape achieves extraordinary concentration, searing acidity, and a mineral salinity unlike any white wine on earth.",
    facts: [
      "Santorini's vineyards have never been afflicted by phylloxera, thanks to volcanic soil",
      "Vines are trained in the traditional kouloura (basket) method to withstand 100+ km/h winds",
      "Some bush vines are over 200 years old — uncovered by grafting records",
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
    image: "./regions/english-sparkling.webp",
    name: "English Sparkling Wine",
    country: "England",
    lat: 51.05,
    lng: -0.18,
    zoom: 7,
    description: "In the rolling hills of Sussex, Kent, and Hampshire, England has built a sparkling wine industry that is astonishing the world. The same chalk seam that underlies Champagne extends under the English Channel to the South Downs, and the cool maritime climate creates wines of searingly precise acidity and delicate fruit. English sparkling wine has beaten Champagne in blind tastings and is increasingly found in the world's finest restaurants.",
    facts: [
      "The South Downs chalk is geologically identical to Champagne's Côte des Blancs",
      "England's vineyard area has tripled in the last decade, surpassing 4,000 hectares",
      "Several English sparkling wines have beaten Champagne in blind tastings",
      "Climate change is making southern England viable for traditional-method sparkling wine"
    ],
    grapes: ["Chardonnay", "Pinot Noir", "Pinot Meunier", "Bacchus", "Seyval Blanc"],
    climate: "Cool, damp maritime — long growing season with high acidity retention",
    flavorProfile: "Crisp green apple, citrus zest, brioche, chalk minerality, and focused elegance. Less tropical than Champagne, more linear.",
    notableStyles: ["Traditional Method Sparkling", "Blanc de Blancs", "Vintage Rosé", "Bacchus Still White"]
  },
  // ── SOUTH AFRICA ─────────────────────────────────────────────────────────────
  {
    id: "stellenbosch",
    image: "./regions/stellenbosch.webp",
    name: "Stellenbosch",
    country: "South Africa",
    lat: -33.93,
    lng: 18.86,
    zoom: 9,
    description: "Stellenbosch is the crown jewel of South African wine, producing world-class Cabernet Sauvignon, bold Bordeaux-style blends, and distinctive Chenin Blanc. The region benefits from cooling ocean breezes from False Bay and soils ranging from decomposed granite to ancient sandstone.",
    facts: [
      "South Africa's first wine estate was established here in 1679",
      "The Cape Winemakers Guild annual auction is Africa's premier wine event",
      "Old-vine Chenin Blanc (called Steen locally) is a uniquely South African treasure",
      "Pinotage, a Pinot Noir x Cinsault cross, was created here in 1925"
    ],
    grapes: ["Cabernet Sauvignon", "Chenin Blanc", "Pinotage", "Syrah", "Merlot"],
    climate: "Mediterranean with cooling ocean influence",
    flavorProfile: "Cab: blackcurrant, cedar, fynbos herbs. Chenin: quince, honey, lanolin. Pinotage: smoky, earthy, dark fruit.",
    notableStyles: ["Cabernet Sauvignon", "Bordeaux Blends", "Chenin Blanc", "Pinotage"]
  },
  {
    id: "swartland",
    image: "./regions/swartland.webp",
    name: "Swartland",
    country: "South Africa",
    lat: -33.45,
    lng: 18.84,
    zoom: 8,
    description: "Swartland is South Africa's most exciting wine region, a dry, sun-baked landscape north of Cape Town that has become the global epicenter of the natural wine movement outside Europe. Ancient, unirrigated Chenin Blanc vines — some over 50 years old — grow on slate, granite, and schist soils, producing wines of extraordinary depth and concentration. The Swartland Revolution, championed by winemakers Eben Sadie and others, has transformed this former wheat-farming region into a world-class wine destination.",
    facts: [
      "Home to some of the world's oldest Chenin Blanc vines, over 50 years old",
      "The Swartland Revolution (annual event) coined the international natural wine movement ethos",
      "The name 'Swartland' means 'black land,' after the dark renosterveld shrubland",
      "Predominantly dry-farmed on ancient soils — no irrigation, extreme vine stress"
    ],
    grapes: ["Chenin Blanc", "Grenache", "Syrah", "Cinsault", "Mourvèdre", "Carignan"],
    climate: "Hot, dry Mediterranean with cooling Benguela Current winds from the Atlantic",
    flavorProfile: "Old-vine Chenin: beeswax, yellow apple, quince, savory herbs, and electrifying acidity. Reds: earthy, dried herb, dark fruit, and dusty tannins.",
    notableStyles: ["Old-Vine Chenin Blanc", "Rhône-Style Blends", "Natural Wine", "White Blends"]
  },
  // ── ARGENTINA ────────────────────────────────────────────────────────────────
  {
    id: "mendoza",
    image: "./regions/mendoza.webp",
    name: "Mendoza",
    country: "Argentina",
    lat: -33.00,
    lng: -68.50,
    zoom: 8,
    description: "In the shadow of the Andes at altitudes up to 1,500 meters, Mendoza has made Malbec its own. Originally from Cahors, France, the Malbec grape found its true home in Argentina's sunny, dry climate. The high altitude provides intense UV light and cool nighttime temperatures, producing wines of remarkable color, concentration, and freshness.",
    facts: [
      "Vineyards sit at 800-1,500 meters above sea level — among the highest in the world",
      "Argentina is the world's largest producer of Malbec",
      "Snowmelt from the Andes provides irrigation through an ancient canal system",
      "The Uco Valley sub-region is driving the premium quality revolution"
    ],
    grapes: ["Malbec", "Cabernet Sauvignon", "Bonarda", "Torrontés"],
    climate: "High-altitude desert with intense sun and dramatic day-night temperature swings",
    flavorProfile: "Malbec: plum, blackberry, violet, dark chocolate, and velvety tannins. Torrontés: floral, peachy, aromatic.",
    notableStyles: ["Malbec", "High-Altitude Cabernet", "Torrontés", "Malbec-Cab Blends"]
  },
  // ── CHILE ────────────────────────────────────────────────────────────────────
  {
    id: "maipo-colchagua",
    image: "./regions/maipo-colchagua.webp",
    name: "Maipo & Colchagua Valleys",
    country: "Chile",
    lat: -34.50,
    lng: -71.00,
    zoom: 7,
    description: "Chile's twin pillars of fine wine production, Maipo and Colchagua, are responsible for the country's most celebrated reds. Maipo, surrounding Santiago in the Andes foothills, is Chile's spiritual home of Cabernet Sauvignon. Colchagua, further south, is known for plush, ripe Carménère — a grape effectively lost in Bordeaux but thriving in Chile. Don Melchor and Montes Alpha are global ambassadors for Chile's fine wine ambitions.",
    facts: [
      "Carménère was thought extinct after phylloxera wiped it from France in the 1860s",
      "It was rediscovered in Chile in 1994 — DNA analysis confirmed it had been mislabeled as Merlot",
      "Maipo Alto's Andes-foothill vineyards sit at 700–1,000 metres for premium Cabernet",
      "Chile has some of the world's lowest intervention costs — almost no phylloxera, little disease pressure"
    ],
    grapes: ["Cabernet Sauvignon", "Carménère", "Merlot", "Syrah", "Chardonnay", "Sauvignon Blanc"],
    climate: "Mediterranean — warm, dry summers; cool Pacific and Andean influences",
    flavorProfile: "Cabernet: cassis, eucalyptus, cedar, and firm structure. Carménère: dark fruit, coffee, dark chocolate, green pepper, and plush body.",
    notableStyles: ["Cabernet Sauvignon", "Carménère", "Bordeaux-Style Blends", "Icon Wines"]
  },
  // ── USA ──────────────────────────────────────────────────────────────────────
  {
    id: "napa-valley",
    image: "./regions/napa-valley.webp",
    name: "Napa Valley",
    country: "USA",
    lat: 38.50,
    lng: -122.27,
    zoom: 9,
    description: "Napa Valley put American wine on the world map with the 1976 'Judgment of Paris,' where Napa wines bested top French bottlings in a blind tasting. Today it's among the most coveted (and expensive) wine regions globally, known for powerful, opulent Cabernet Sauvignon and world-class Chardonnay.",
    facts: [
      "Only about 4% of California's total wine production comes from Napa",
      "16 distinct AVAs within the valley, each with unique character",
      "The average bottle price is the highest of any wine region globally",
      "The famous fog from San Pablo Bay moderates temperatures dramatically"
    ],
    grapes: ["Cabernet Sauvignon", "Chardonnay", "Merlot", "Sauvignon Blanc", "Zinfandel"],
    climate: "Mediterranean with warm days and cool nights",
    flavorProfile: "Rich, concentrated Cabernet with blackberry, cassis, dark chocolate, vanilla, and cedar. Chardonnay ranges from crisp to buttery.",
    notableStyles: ["Cabernet Sauvignon", "Chardonnay", "Meritage Blends", "Cult Wines"]
  },
  {
    id: "sonoma",
    image: "./regions/sonoma.webp",
    name: "Sonoma County",
    country: "USA",
    lat: 38.48,
    lng: -122.72,
    zoom: 9,
    description: "Sonoma is Napa's more laid-back neighbor, but no less impressive in quality. With diverse microclimates from the cool Sonoma Coast to the warm Alexander Valley, Sonoma excels across a wider range of varieties. Pinot Noir and Chardonnay from the cooler zones rival the best in the world.",
    facts: [
      "Sonoma is roughly three times the size of Napa Valley",
      "18 AVAs with dramatically different climates",
      "Home to California's oldest commercial winery (Buena Vista, 1857)",
      "Russian River Valley Pinot Noir is internationally celebrated"
    ],
    grapes: ["Pinot Noir", "Chardonnay", "Cabernet Sauvignon", "Zinfandel", "Syrah"],
    climate: "Highly varied — coastal fog to warm inland valleys",
    flavorProfile: "Cool-climate Pinot: cherry, cranberry, earth, spice. Warm-area Zin: brambly, peppery, ripe fruit.",
    notableStyles: ["Pinot Noir", "Chardonnay", "Old Vine Zinfandel", "Sparkling"]
  },
  {
    id: "willamette",
    image: "./regions/willamette.webp",
    name: "Willamette Valley",
    country: "USA",
    lat: 45.12,
    lng: -123.09,
    zoom: 8,
    description: "Oregon's Willamette Valley has earned its place among the world's great Pinot Noir regions. The climate — remarkably similar to Burgundy — and volcanic and sedimentary soils produce Pinot Noir of extraordinary elegance. A tight-knit community of passionate winemakers has built this region's reputation over four decades.",
    facts: [
      "First Pinot Noir vines were planted in 1965 by David Lett",
      "The 1979 Gault Millau 'Olympiades du Vin' tasting shocked the wine world when Oregon Pinot placed in the top 10",
      "11 distinct AVAs within the valley, each with unique geology",
      "Oregon mandates 90% minimum varietal content, stricter than most US regions"
    ],
    grapes: ["Pinot Noir", "Chardonnay", "Pinot Gris", "Riesling"],
    climate: "Cool maritime with mild, wet winters and warm, dry summers",
    flavorProfile: "Pinot: red cherry, cranberry, forest floor, baking spice, with silky texture and bright acidity.",
    notableStyles: ["Pinot Noir", "Chardonnay", "Pinot Gris", "Sparkling"]
  },
  {
    id: "finger-lakes",
    image: "./regions/finger-lakes.webp",
    name: "Finger Lakes",
    country: "USA",
    lat: 42.65,
    lng: -76.95,
    zoom: 8,
    description: "The Finger Lakes, a cluster of long, narrow glacial lakes in upstate New York, is America's most compelling cool-climate wine region. The deep lakes moderate the frigid continental winters, and their slate and shale hillside soils produce Riesling of remarkable finesse and complexity — regularly compared to Germany's finest. A thriving community of small, artisan producers is also pioneering Cabernet Franc, Pinot Noir, and even Blaufränkisch.",
    facts: [
      "Dr. Konstantin Frank planted the first Vitis vinifera in the region in 1962, defying conventional wisdom",
      "The Finger Lakes produce the majority of America's finest Riesling",
      "Seneca and Cayuga Lakes, the deepest, create the most favorable microclimates",
      "The region has evolved from labrusca grape varieties to world-class European cultivars"
    ],
    grapes: ["Riesling", "Cabernet Franc", "Pinot Noir", "Gewurztraminer", "Grüner Veltliner", "Blaufränkisch"],
    climate: "Cool continental, significantly moderated by deep lake water temperatures",
    flavorProfile: "Riesling: lime, green apple, slate, ginger, and electric acidity. Cab Franc: raspberry, bell pepper, smoked earth, violet.",
    notableStyles: ["Dry Riesling", "Off-Dry Riesling", "Cabernet Franc", "Sparkling"]
  },
  // ── CANADA ───────────────────────────────────────────────────────────────────
  {
    id: "okanagan-valley",
    image: "./regions/okanagan-valley.webp",
    name: "Okanagan Valley",
    country: "Canada",
    lat: 49.80,
    lng: -119.50,
    zoom: 8,
    description: "British Columbia's Okanagan Valley is one of the world's most northerly and climatically dramatic wine regions. A semi-arid desert landscape stretches south from Kelowna to Osoyoos, where Canada's only true desert allows Bordeaux varieties to thrive at the southern end while Riesling and Pinot Gris excel in the cooler north. Ice wine production, made from naturally freeze-dried grapes, has brought Okanagan international acclaim.",
    facts: [
      "Canada is the world's largest commercial producer of Icewine",
      "Osoyoos, at the southern tip, has Canada's only officially designated desert",
      "The valley spans nearly 200 km from north to south — with dramatically different climates",
      "Okanagan wine production has grown from 17 wineries in 1990 to over 200 today"
    ],
    grapes: ["Merlot", "Cabernet Franc", "Syrah", "Pinot Gris", "Chardonnay", "Riesling", "Gewurztraminer"],
    climate: "Semi-arid continental — cold winters, hot summers, long days, cold nights",
    flavorProfile: "Merlot: dark plum, black cherry, vanilla, cedar. Riesling: lime, apple, ginger. Icewine: honey, apricot, peach nectar.",
    notableStyles: ["Icewine", "Merlot", "Bordeaux Blends", "Riesling", "Pinot Gris"]
  },
  // ── MEXICO ────────────────────────────────────────────────────────────────────
  {
    id: "valle-de-guadalupe",
    image: "./regions/valle-de-guadalupe.webp",
    name: "Valle de Guadalupe",
    country: "Mexico",
    lat: 32.02,
    lng: -116.60,
    zoom: 9,
    description: "Just 90 minutes south of San Diego across the Mexican border, Baja California's Valle de Guadalupe has emerged as one of the world's most exciting wine destinations. The valley's combination of cool Pacific fog, granite and clay soils, and warm afternoons mirrors northern California conditions. Its dynamic food and wine scene — anchored by world-class chefs and rustic wineries — has made it a pilgrimage site for wine lovers across the Americas.",
    facts: [
      "The Valle de Guadalupe produces approximately 90% of Mexico's total wine output",
      "The valley's Nebbiolo and Tempranillo are gaining particular international recognition",
      "Rustic winery-restaurants (some in shipping containers) have become a culinary phenomenon",
      "Russian immigrants in the early 20th century planted the first vineyards in the valley"
    ],
    grapes: ["Cabernet Sauvignon", "Nebbiolo", "Tempranillo", "Grenache", "Syrah", "Chardonnay", "Sauvignon Blanc"],
    climate: "Mediterranean influenced by Pacific coastal fog — warm, dry summers with cool nights",
    flavorProfile: "Reds: ripe dark fruit, sun-baked earth, dried herbs. Whites: crisp, mineral, tropical notes from the Pacific influence.",
    notableStyles: ["Cabernet Sauvignon", "Bordeaux Blends", "Nebbiolo", "Mediterranean Blends"]
  },
  // ── AUSTRALIA ────────────────────────────────────────────────────────────────
  {
    id: "barossa-valley",
    image: "./regions/barossa-valley.webp",
    name: "Barossa Valley",
    country: "Australia",
    lat: -34.56,
    lng: 138.95,
    zoom: 9,
    description: "Australia's most iconic wine region, the Barossa is home to some of the oldest Shiraz vines on the planet — some over 170 years old. These ancient, gnarled vines produce incredibly concentrated, powerful wines that are uniquely Barossa. German settlers in the 1840s laid the foundation for a culture that marries Old World tradition with New World boldness.",
    facts: [
      "Contains pre-phylloxera vines over 170 years old — some of the oldest in the world",
      "Penfolds Grange, Australia's most celebrated wine, is born here",
      "German heritage is visible in food, architecture, and winemaking traditions",
      "Over 150 wineries within a compact, easily explorable area"
    ],
    grapes: ["Shiraz", "Grenache", "Cabernet Sauvignon", "Riesling", "Mataro"],
    climate: "Warm Mediterranean with hot summers and mild winters",
    flavorProfile: "Old vine Shiraz: chocolate, blackberry, plum, eucalyptus, and black pepper. Grenache offers rose, spice, and red fruit.",
    notableStyles: ["Old Vine Shiraz", "GSM Blends", "Eden Valley Riesling", "Fortified"]
  },
  {
    id: "yarra-valley",
    image: "./regions/yarra-valley.webp",
    name: "Yarra Valley",
    country: "Australia",
    lat: -37.66,
    lng: 145.56,
    zoom: 9,
    description: "Just an hour east of Melbourne in the Great Dividing Range, the Yarra Valley is Australia's premier cool-climate wine region. The Yarra Valley's elevation and southerly latitude produce Pinot Noir of exceptional delicacy, Chardonnay of Burgundian finesse, and sparkling wines that rival Champagne. A new generation of small producers is pushing quality to extraordinary levels.",
    facts: [
      "The Yarra Valley's Upper Yarra sub-region has soils similar to Burgundy's Côte de Nuits",
      "It was one of the first regions planted in Victoria, with vines from 1838",
      "Coldstream Hills, founded by wine critic James Halliday, helped establish its reputation",
      "The region is a key source of grapes for Australia's finest traditional-method sparkling wines"
    ],
    grapes: ["Pinot Noir", "Chardonnay", "Cabernet Sauvignon", "Shiraz", "Pinot Gris"],
    climate: "Cool maritime-influenced continental — significant rainfall and moderate temperatures",
    flavorProfile: "Pinot Noir: red cherry, plum, forest floor, silky tannin. Chardonnay: stone fruit, hazelnut, mineral, fine acidity.",
    notableStyles: ["Pinot Noir", "Chardonnay", "Traditional Method Sparkling", "Cabernet Sauvignon"]
  },
  // ── NEW ZEALAND ──────────────────────────────────────────────────────────────
  {
    id: "marlborough",
    image: "./regions/marlborough.webp",
    name: "Marlborough",
    country: "New Zealand",
    lat: -41.52,
    lng: 173.95,
    zoom: 9,
    description: "Marlborough redefined Sauvignon Blanc for the modern wine world. When Cloudy Bay launched in 1985, its explosive, pungent style took the world by storm. Today Marlborough is synonymous with vibrant, aromatic Sauvignon Blanc, though excellent Pinot Noir and Chardonnay are increasingly gaining recognition.",
    facts: [
      "Produces over 75% of all New Zealand wine",
      "Cloudy Bay's 1985 debut put New Zealand on the global wine map",
      "Sunshine hours among the highest in New Zealand",
      "The Wairau and Awatere sub-regions produce distinctly different styles"
    ],
    grapes: ["Sauvignon Blanc", "Pinot Noir", "Chardonnay", "Pinot Gris"],
    climate: "Cool maritime with high sunshine and significant diurnal range",
    flavorProfile: "Sauvignon: passionfruit, gooseberry, grapefruit, fresh-cut grass. Pinot: red cherry, herb, and silky elegance.",
    notableStyles: ["Sauvignon Blanc", "Pinot Noir", "Sparkling"]
  },
  {
    id: "central-otago",
    image: "./regions/central-otago.webp",
    name: "Central Otago",
    country: "New Zealand",
    lat: -45.03,
    lng: 169.13,
    zoom: 8,
    description: "The world's southernmost wine region of significance, Central Otago in New Zealand's South Island produces Pinot Noir of haunting beauty. The semi-continental climate — rare in New Zealand — and dramatic schist and loess soils create wines that combine power with finesse in a style uniquely their own.",
    facts: [
      "The southernmost significant wine region on earth",
      "Dramatic gold-mining history — vines were first planted during the 1860s gold rush",
      "New Zealand's only wine region with a continental (not maritime) climate",
      "Six distinct sub-regions: Bannockburn, Gibbston, Bendigo, Cromwell Basin, Wanaka, and Waitaki"
    ],
    grapes: ["Pinot Noir", "Pinot Gris", "Riesling", "Chardonnay"],
    climate: "Semi-continental with extreme diurnal temperature variation",
    flavorProfile: "Pinot Noir: dark cherry, thyme, rosemary, with a distinctive savoury/mineral undertone and vibrant acidity.",
    notableStyles: ["Pinot Noir", "Pinot Gris", "Riesling"]
  },
  // ── CHINA ────────────────────────────────────────────────────────────────────
  {
    id: "ningxia",
    image: "./regions/ningxia.webp",
    name: "Ningxia",
    country: "China",
    lat: 38.47,
    lng: 106.27,
    zoom: 8,
    description: "On the eastern foothills of the Helan Mountains in northern China, Ningxia has emerged as the country's most ambitious fine wine region. The high-altitude desert terroir — with its gravel alluvial soils, intense sunshine, dramatic diurnal temperature variation, and extremely low rainfall — bears a striking resemblance to Mendoza. Over 100 wineries now operate in the region, producing Cabernet Sauvignon and Bordeaux blends that are winning major international competitions.",
    facts: [
      "Ningxia hosts over 100 wineries and is the fastest-growing quality wine region in Asia",
      "The Helan Mountain range blocks cold Siberian winds and creates a sheltered, dry growing environment",
      "LVMH's Ao Yun project in Yunnan has drawn global attention to Chinese terroir ambitions",
      "Grapevines must be buried in winter to protect from temperatures dropping below -20°C"
    ],
    grapes: ["Cabernet Sauvignon", "Merlot", "Cabernet Franc", "Marselan", "Chardonnay"],
    climate: "High-altitude continental desert — dry, sunny, extreme diurnal variation, severe winters",
    flavorProfile: "Cabernet: ripe blackcurrant, plum, dark spice, cedar, with good structure. Marselan (a Cab-Grenache cross): floral, dark fruit, silky.",
    notableStyles: ["Cabernet Sauvignon", "Bordeaux-Style Blends", "Marselan", "Chardonnay"]
  },
  // ── LEBANON ──────────────────────────────────────────────────────────────────
  {
    id: "bekaa-valley",
    image: "./regions/bekaa-valley.webp",
    name: "Bekaa Valley",
    country: "Lebanon",
    lat: 33.85,
    lng: 35.90,
    zoom: 8,
    description: "Lebanon's Bekaa Valley, sitting at 1,000 metres above sea level between the Lebanon and Anti-Lebanon mountain ranges, has one of the most ancient winemaking histories on earth — Phoenicians were trading wine from this region 4,000 years ago. Despite decades of war and political turmoil, Château Musar and a new generation of Lebanese producers have produced wines of astonishing quality and resilience, bringing the Bekaa Valley to the world's finest wine lists.",
    facts: [
      "The Bekaa Valley is one of the world's oldest winemaking regions, with a history spanning 4,000+ years",
      "Château Musar continued producing wine through the 1975–1990 Lebanese Civil War",
      "Cinsault vines, some over 100 years old, are a unique Bekaa heritage variety",
      "Over 300 days of sunshine per year with cool nights at high altitude"
    ],
    grapes: ["Cinsault", "Cabernet Sauvignon", "Merlot", "Syrah", "Tempranillo", "Obaideh", "Merwah"],
    climate: "Continental Mediterranean at altitude — very hot, dry summers; cold winters with snow",
    flavorProfile: "Musar-style blends: complex, oxidative, with dark fruit, tobacco, earth, dried herbs, and extraordinary savory depth. White Obaideh: nutty, oxidative, textured.",
    notableStyles: ["Cinsault-Cabernet Blends", "Musar-Style Reds", "Indigenous White Varieties"]
  },
  // ── FRANCE (CONTINUED) ──────────────────────────────────────────────────────
  {
    id: "provence",
    image: "./regions/provence.webp",
    name: "Provence",
    country: "France",
    lat: 43.53,
    lng: 5.45,
    zoom: 8,
    description: "Provence is the undisputed rosé capital of the world, responsible for over 40% of France's total rosé production. Stretching from the Mediterranean coast inland toward the Alps, its sun-drenched hillsides produce pale, dry rosés of extraordinary elegance. The region's star appellation, Bandol, also crafts bold reds from Mourvèdre aged in oak for years before release. Provence's wine culture dates back over 2,600 years, making it France's oldest wine region.",
    facts: [
      "Provence produces over 160 million bottles of rosé per year",
      "Bandol Mourvèdre must be aged a minimum of 18 months in wood",
      "The region has 9 AOC appellations including Cassis and Les Baux-de-Provence",
      "Provence rosé commands premium prices globally — led by Whispering Angel"
    ],
    grapes: ["Grenache", "Cinsault", "Syrah", "Mourvèdre", "Rolle (Vermentino)", "Ugni Blanc"],
    climate: "Mediterranean, with hot dry summers, mild winters, and the cooling mistral wind",
    flavorProfile: "Dry, pale rosés with strawberry, peach, white pepper, and Provençal herbs. Bandol reds deliver earthy dark fruit, garrigue, leather, and remarkable longevity.",
    notableStyles: ["Dry Rosé", "Red Blends (Bandol)", "Crisp Whites"]
  },
  {
    id: "languedoc-roussillon",
    image: "./regions/languedoc-roussillon.webp",
    name: "Languedoc-Roussillon",
    country: "France",
    lat: 43.20,
    lng: 2.95,
    zoom: 7,
    description: "Languedoc-Roussillon is France's largest wine region by area and production volume, stretching 250 kilometres along the Mediterranean coast from the Rhône delta to the Spanish border. Once synonymous with cheap bulk wine, the region has undergone a dramatic quality revolution since the 1990s. Appellations like Pic Saint-Loup, Faugères, and Corbières now rival Rhône Valley wines for complexity and value. The sun-baked schist and limestone hillsides deliver wines of real terroir character at often astonishing prices.",
    facts: [
      "France's largest wine region — over 230,000 hectares of vines",
      "Produces approximately one-third of all French wine by volume",
      "Roussillon is France's top source of naturally sweet Muscat and Banyuls",
      "Over 20 AOC/AOP appellations including Pic Saint-Loup and La Clape"
    ],
    grapes: ["Grenache", "Syrah", "Mourvèdre", "Carignan", "Cinsault", "Muscat", "Roussanne", "Marsanne"],
    climate: "Hot Mediterranean with the lowest rainfall in France; mitigated by altitude in hillside appellations",
    flavorProfile: "Robust reds with dark berry, garrigue, chocolate, and spice. Banyuls offers luscious dried-fruit richness. Whites show southern stone-fruit warmth with herbal freshness.",
    notableStyles: ["Red Blends", "Banyuls (Fortified)", "Muscat de Rivesaltes", "Dry Whites"]
  },
  // ── ITALY (CONTINUED) ────────────────────────────────────────────────────────
  {
    id: "veneto",
    image: "./regions/veneto.webp",
    name: "Veneto",
    country: "Italy",
    lat: 45.44,
    lng: 11.99,
    zoom: 8,
    description: "The Veneto is Italy's most prolific quality wine region, producing more DOC/DOCG wine than any other Italian region. It is home to three globally famous styles: the rich, raisined Amarone della Valpolicella, the vivacious sparkling Prosecco from Valdobbiadene, and the delicate dry Soave Classico. The unique appassimento technique — drying harvested grapes on bamboo racks to concentrate sugars — gives Amarone its extraordinary depth and power. The region's diversity of soils and microclimates, from the Dolomite foothills to the Verona plains, supports an extraordinary range of wine styles.",
    facts: [
      "Veneto produces over 1 billion bottles of wine per year — Italy's largest by volume",
      "Amarone della Valpolicella DOCG requires grapes to be dried for 90–120 days",
      "Prosecco di Valdobbiadene DOCG was awarded UNESCO World Heritage status in 2019",
      "Soave is one of Italy's most exported white wines"
    ],
    grapes: ["Corvina", "Corvinone", "Rondinella", "Glera (Prosecco)", "Garganega (Soave)", "Pinot Grigio"],
    climate: "Continental in the foothills, Mediterranean near Lake Garda; frost risk in spring",
    flavorProfile: "Amarone: intense dark cherry, dried fig, dark chocolate, and spice with velvety tannins. Prosecco: fresh pear, apple blossom, and cream. Soave: almond, white flower, and citrus zest.",
    notableStyles: ["Amarone della Valpolicella", "Prosecco DOCG", "Soave Classico", "Recioto"]
  },
  // ── SPAIN (CONTINUED) ────────────────────────────────────────────────────────
  {
    id: "ribera-del-duero",
    image: "./regions/ribera-del-duero.webp",
    name: "Ribera del Duero",
    country: "Spain",
    lat: 41.63,
    lng: -3.68,
    zoom: 8,
    description: "Perched on a high plateau at 800–900 metres above sea level, Ribera del Duero is Spain's most prestigious red wine region after Rioja. The extreme continental climate — blazing summers, freezing winters, and dramatic day-night temperature swings during harvest — forces the Tempranillo vine (here called Tinto Fino) to produce wines of exceptional concentration and aromatic complexity. The region was formally established as a DO in 1982, but its quality was long anchored by Vega Sicilia, founded in 1864. Today it is home to some of Spain's most collectible and expensive wines.",
    facts: [
      "Vineyards sit at 800–900 metres altitude, creating some of Spain's greatest diurnal temperature ranges",
      "Vega Sicilia Único can spend up to 10 years in oak and bottle before release",
      "Dominio de Pingus 'Pingus' is considered Spain's most expensive cult wine",
      "The DO spans 4 provinces along the Duero River valley"
    ],
    grapes: ["Tinto Fino (Tempranillo)", "Cabernet Sauvignon", "Merlot", "Malbec", "Albillo Mayor"],
    climate: "Extreme continental — long cold winters, very hot summers, large diurnal temperature variation",
    flavorProfile: "Dense black fruit, violets, graphite, toasted oak, and leather. Age reveals tertiary complexity of tobacco, cedar, and earthy mineral depth.",
    notableStyles: ["Crianza", "Reserva", "Gran Reserva", "Roble"]
  },
  {
    id: "jerez",
    image: "./regions/jerez.webp",
    name: "Jerez (Sherry)",
    country: "Spain",
    lat: 36.68,
    lng: -6.14,
    zoom: 8,
    description: "Jerez de la Frontera in Andalusia is the birthplace of Sherry — one of the world's most complex and misunderstood wines. The chalky albariza soil, unique solera aging system, and the flor yeast veil collectively create a spectrum of styles unmatched anywhere else: bone-dry Fino, nutty Amontillado, oxidative Oloroso, and lusciously sweet Pedro Ximénez. Sherry was once England's favourite wine, referenced by Shakespeare, and is experiencing a powerful global renaissance driven by sommeliers championing its extraordinary value and versatility with food.",
    facts: [
      "Sherry is produced under the 'Sherry Triangle' of Jerez, El Puerto de Santa María, and Sanlúcar de Barrameda",
      "The solera system blends vintages across multiple barrels, creating consistent 'average age' wines",
      "Fino Sherry is protected by a living yeast veil called flor",
      "Pedro Ximénez grapes are sun-dried to create raisin-like sweetness"
    ],
    grapes: ["Palomino", "Pedro Ximénez", "Moscatel"],
    climate: "Hot and dry Mediterranean, tempered by Atlantic winds; the Levante and Poniente winds play crucial roles",
    flavorProfile: "Fino: saline, yeasty, almond, and chamomile. Oloroso: walnut, dried fruit, and toffee. PX: raisin, fig, chocolate, and molasses.",
    notableStyles: ["Fino", "Manzanilla", "Amontillado", "Oloroso", "Palo Cortado", "Pedro Ximénez"]
  },
  // ── AUSTRALIA (CONTINUED) ────────────────────────────────────────────────────
  {
    id: "margaret-river",
    image: "./regions/margaret-river.webp",
    name: "Margaret River",
    country: "Australia",
    lat: -33.95,
    lng: 115.07,
    zoom: 8,
    description: "Margaret River, on the remote southwestern tip of Australia, punches far above its weight as one of the country's premier wine regions. Though it produces less than 3% of Australia's total wine volume, it accounts for over 20% of its premium wine by value. The narrow cape's unique maritime climate — moderated by the Indian and Southern Oceans — bears remarkable similarities to Bordeaux and Burgundy, making it ideal for Cabernet Sauvignon, Chardonnay, and their classic blending partners. The region was only planted commercially from the 1960s, making its rapid ascent to global prestige even more remarkable.",
    facts: [
      "Produces less than 3% of Australian wine but over 20% of its premium wine segment",
      "Viticulture began here only in 1967 after a scientific report identified ideal growing conditions",
      "The Cape Naturaliste to Cape Leeuwin peninsula creates two-ocean maritime moderation",
      "Semillon-Sauvignon Blanc blends from Margaret River are considered Australia's finest dry whites"
    ],
    grapes: ["Cabernet Sauvignon", "Merlot", "Chardonnay", "Sauvignon Blanc", "Semillon", "Shiraz"],
    climate: "Mediterranean maritime — warm dry summers, mild wet winters, cooled by Indian and Southern Ocean breezes",
    flavorProfile: "Cabernet: cassis, graphite, olive, and dusty tannins. Chardonnay: white peach, grapefruit, and toasted oak. SSB blends: lemongrass, passionfruit, and cut grass.",
    notableStyles: ["Cabernet Sauvignon", "Chardonnay", "Semillon-Sauvignon Blanc", "Red Bordeaux Blends"]
  },
  {
    id: "hunter-valley",
    image: "./regions/hunter-valley.webp",
    name: "Hunter Valley",
    country: "Australia",
    lat: -32.75,
    lng: 151.28,
    zoom: 8,
    description: "The Hunter Valley is Australia's oldest wine region, with vineyards dating back to the 1820s. Located north of Sydney, it is renowned for two unique wine styles found virtually nowhere else: Hunter Semillon — harvested early and bone-dry, it transforms over decades into honeyed complexity — and Hunter Shiraz, a medium-bodied, earthy style quite different from the powerhouse Shiraz of the Barossa. The region's hot, humid climate would seem unsuitable for fine wine, yet the red volcanic soils and sea breezes conspire to produce some of Australia's most distinctive and age-worthy whites.",
    facts: [
      "Australia's oldest commercial wine region — vines planted in the 1820s",
      "Hunter Semillon is arguably Australia's most distinctive and original wine style",
      "Wines labeled 'Hermitage' in older vintages refer to Shiraz, a local historical naming tradition",
      "Over 150 wineries and 120+ cellar doors make it Australia's most visited wine region"
    ],
    grapes: ["Semillon", "Shiraz", "Chardonnay", "Verdelho", "Cabernet Sauvignon"],
    climate: "Hot and humid subtropical with summer rainfall — unusual for fine wine production",
    flavorProfile: "Semillon: lemon curd and grass when young; honey, toast, and lanolin with 10+ years age. Shiraz: earthy, leathery, with red berry, black pepper, and soft tannins.",
    notableStyles: ["Hunter Semillon", "Hunter Shiraz", "Unoaked Chardonnay"]
  },
  // ── NEW ZEALAND (CONTINUED) ───────────────────────────────────────────────────
  {
    id: "hawkes-bay",
    image: "./regions/hawkes-bay.webp",
    name: "Hawke's Bay",
    country: "New Zealand",
    lat: -39.49,
    lng: 176.91,
    zoom: 8,
    description: "Hawke's Bay on New Zealand's North Island is the country's premier red wine region and second-largest wine area. The region's crown jewel is the Gimblett Gravels — a uniquely free-draining shingle riverbed that radiates heat and produces New Zealand's finest Cabernet Sauvignon, Merlot, and Syrah. The Bay's sunny, warm climate is consistently one of New Zealand's driest and most reliable, giving it a significant advantage for ripening red varieties that Marlborough's cooler South Island cannot match. Hawke's Bay is also producing world-class Chardonnay and increasingly exciting Syrah.",
    facts: [
      "Gimblett Gravels is New Zealand's most celebrated wine sub-appellation",
      "The region receives over 2,200 hours of sunshine per year — the most in New Zealand",
      "Hawke's Bay has New Zealand's second-largest planted area with ~5,000 hectares of vines",
      "Bordeaux varieties have been grown here since Mission Estate planted them in the 1850s"
    ],
    grapes: ["Merlot", "Cabernet Sauvignon", "Syrah", "Chardonnay", "Sauvignon Blanc", "Viognier"],
    climate: "Warm, sunny maritime — New Zealand's most reliable ripening conditions for red varieties",
    flavorProfile: "Gimblett Gravels reds: dark berry, plum, dusty tannins, and subtle spice. Chardonnay: stone fruit, citrus, and toasted oak. Syrah: black pepper, smoked meat, and violets.",
    notableStyles: ["Red Bordeaux Blends", "Gimblett Gravels Syrah", "Chardonnay"]
  },
  // ── USA (CONTINUED) ───────────────────────────────────────────────────────────
  {
    id: "paso-robles",
    image: "./regions/paso-robles.webp",
    name: "Paso Robles",
    country: "USA",
    lat: 35.63,
    lng: -120.69,
    zoom: 8,
    description: "Paso Robles on California's Central Coast has evolved from a bulk wine producer into one of America's most exciting premium wine regions. Its defining characteristic is an extraordinary diurnal temperature swing — days can reach 40°C while nights plunge to near 10°C — which preserves freshness and acidity in fruit while achieving full ripeness. The region's Rhône and Bordeaux varietals are gaining national recognition, and its AVA system was expanded in 2014 to recognize distinct sub-appellations. Paso's wine scene has an approachable, unpretentious spirit that contrasts sharply with Napa's formality.",
    facts: [
      "Paso Robles experiences one of California's most extreme diurnal temperature swings — up to 50\u00b0F difference",
      "The region has over 40 different soil types, creating remarkable diversity",
      "DAOU's Soul of a Lion is California's fastest-growing cult Cabernet in recent years",
      "Paso Robles has 40+ sub-AVAs including Adelaida District and Templeton Gap"
    ],
    grapes: ["Cabernet Sauvignon", "Zinfandel", "Grenache", "Syrah", "Mourvèdre", "Viognier", "Chardonnay"],
    climate: "Semi-arid Mediterranean with dramatic diurnal temperature variation; cooled by Pacific fog and wind",
    flavorProfile: "Bold Cabernet with dark cherry, cassis, and mocha. Rhône blends show earthy spice, lavender, and wild berry. Zinfandel delivers jammy plum, pepper, and vanilla.",
    notableStyles: ["Cabernet Sauvignon", "Rhône Blends", "Zinfandel", "GSM Blends"]
  },
  // ── GERMANY (CONTINUED) ───────────────────────────────────────────────────────
  {
    id: "rheingau",
    image: "./regions/rheingau.webp",
    name: "Rheingau",
    country: "Germany",
    lat: 50.02,
    lng: 8.05,
    zoom: 8,
    description: "The Rheingau is Germany's most historically prestigious wine region, where the Rhine River flows westward — an unusual geographic quirk that creates a perfect south-facing slope of sun-drenched vineyards protected from northern winds. Riesling finds one of its purest expressions here, with wines from top estates like Schloss Johannisberg, Kloster Eberbach, and Weingut Leitz combining crystalline mineral precision with extraordinary age-worthiness. The region also pioneered the Spätlese style — legend holds that the 1775 vintage at Schloss Johannisberg was accidentally harvested late, creating the first intentionally late-picked wine.",
    facts: [
      "Schloss Johannisberg is credited with the invention of Spätlese in 1775",
      "Kloster Eberbach was the model for Umberto Eco's monastery in 'The Name of the Rose'",
      "The Rheingau is 80% Riesling — Germany's most Riesling-dominated region",
      "Rüdesheimer Berg Schlossberg is considered one of Germany's greatest Riesling sites"
    ],
    grapes: ["Riesling", "Spätburgunder (Pinot Noir)"],
    climate: "Cool continental, moderated by the Rhine River and Taunus Mountains; south-facing slopes maximize sun exposure",
    flavorProfile: "Riesling: steely minerality, lime, green apple, and white peach. Aged Auslesen develop honey, petrol, and dried apricot. Spätburgunder offers silky red cherry and earthy elegance.",
    notableStyles: ["Riesling Spätlese", "Riesling Auslese", "Sekt (Sparkling)", "Spätburgunder"]
  },
  // ── PORTUGAL (CONTINUED) ─────────────────────────────────────────────────────
  {
    id: "vinho-verde",
    image: "./regions/vinho-verde.webp",
    name: "Vinho Verde",
    country: "Portugal",
    lat: 41.70,
    lng: -8.30,
    zoom: 8,
    description: "Vinho Verde — literally 'green wine' — is one of Portugal's largest and most unique wine regions, spanning the entire northwestern corner of the country from Porto to the Spanish border. The name refers not to the wine's colour but to its youthful freshness. The region's Atlantic climate delivers high rainfall and humidity, and its rambling pergola-trained vines produce an extraordinary variety of indigenous grapes. While light, spritzy Alvarinho-Loureiro blends at pocket-friendly prices made the region famous globally, single-varietal Alvarinho from the Monção e Melgaço sub-region is one of the world's great mineral whites.",
    facts: [
      "Vinho Verde covers over 21,000 hectares — one of Europe's largest DOC wine regions",
      "Alvarinho from Monção e Melgaço is considered Portugal's finest dry white wine",
      "The region has over 50 authorized indigenous grape varieties",
      "Traditional 'green wine' has slight natural effervescence from residual CO2"
    ],
    grapes: ["Alvarinho", "Loureiro", "Arinto", "Trajadura", "Azal", "Avesso"],
    climate: "Atlantic oceanic — high rainfall, cool temperatures, high humidity; perfect for crisp, high-acid whites",
    flavorProfile: "Lime zest, green apple, white peach, and a distinctive saline minerality. Alvarinho adds stone fruit depth and textural richness. Light effervescence adds freshness.",
    notableStyles: ["Alvarinho", "Multi-varietal Blends", "Sparkling Vinho Verde"]
  },
  // ── SOUTH AFRICA (CONTINUED) ─────────────────────────────────────────────────
  {
    id: "franschhoek",
    image: "./regions/franschhoek.webp",
    name: "Franschhoek",
    country: "South Africa",
    lat: -33.91,
    lng: 19.12,
    zoom: 8,
    description: "Franschhoek — 'French Corner' in Dutch — was settled by Huguenot refugees fleeing religious persecution in France in 1688, and it retains a deeply French character to this day. Enclosed by dramatic granite mountain ranges on three sides, the valley's climate is cooled by altitude and mountain air, allowing for elegant, finely structured wines. The valley is South Africa's premier food and wine tourism destination, home to some of the country's finest restaurants and estates. Boekenhoutskloof's The Chocolate Block and Semillon from Huguenot estates are particularly celebrated.",
    facts: [
      "Huguenot settlers arrived in 1688, bringing French winemaking traditions",
      "The valley sits at 200–300 metres altitude, creating cooler conditions than surrounding Winelands",
      "Franschhoek is home to South Africa's highest concentration of fine-dining restaurants",
      "Old vine Semillon from Franschhoek represents some of South Africa's rarest wine treasures"
    ],
    grapes: ["Semillon", "Chardonnay", "Shiraz", "Cabernet Sauvignon", "Grenache", "Chenin Blanc"],
    climate: "Mediterranean with altitude cooling — warm dry summers, cool wet winters; mountain breezes moderate heat",
    flavorProfile: "Semillon: waxy lemon, beeswax, and herbal complexity with age. Reds show dark fruit, violet, and fine-grained tannins. Chardonnay: stone fruit, hazelnut, and creamy texture.",
    notableStyles: ["Semillon", "Red Blends", "Chardonnay", "Méthode Cap Classique Sparkling"]
  },
  // ── BRAZIL ───────────────────────────────────────────────────────────────────
  {
    id: "serra-gaucha",
    image: "./regions/serra-gaucha.webp",
    name: "Serra Gaúcha",
    country: "Brazil",
    lat: -29.17,
    lng: -51.18,
    zoom: 8,
    description: "Serra Gaúcha in the mountainous southern state of Rio Grande do Sul is Brazil's most important wine region, responsible for over 85% of the country's total wine production. Italian immigrants settled these highland valleys in the late 19th century, planting the familiar varieties of northern Italy. Today the region has reinvented itself as a producer of serious sparkling wines using the traditional Champagne method, earning international recognition. The high-altitude Vale dos Vinhedos sub-appellation, Brazil's first DOC, is producing still reds and whites of impressive finesse.",
    facts: [
      "Serra Gaúcha produces over 85% of Brazil's wine — approximately 300 million litres annually",
      "Italian immigrants first planted vines here in 1875",
      "Vale dos Vinhedos was Brazil's first DOC appellation, awarded in 2012",
      "Brazilian sparkling wine (espumante) is winning international awards at growing pace"
    ],
    grapes: ["Moscato Giallo", "Chardonnay", "Pinot Noir", "Merlot", "Cabernet Sauvignon", "Tannat"],
    climate: "Highland subtropical — cool nights, high rainfall; the most temperate climate in Brazil for wine",
    flavorProfile: "Sparkling: fresh citrus, brioche, and cream. Merlot shows plum, herbs, and soft tannins. Moscato delivers sweet, floral grape richness with effervescence.",
    notableStyles: ["Espumante (Sparkling)", "Merlot", "Moscato", "Tannat"]
  },
  // ── JAPAN ─────────────────────────────────────────────────────────────────────
  {
    id: "yamanashi",
    image: "./regions/yamanashi.webp",
    name: "Yamanashi",
    country: "Japan",
    lat: 35.66,
    lng: 138.57,
    zoom: 8,
    description: "Yamanashi Prefecture, nestled in the mountains southwest of Tokyo with Mount Fuji on its western border, is Japan's most celebrated wine region. The region is home to Koshu — a pink-skinned grape brought along the Silk Road over 1,000 years ago — which produces Japan's most distinctive white wine: delicate, dry, and marked by subtle citrus, mineral, and umami notes that pair flawlessly with Japanese cuisine. The region's winemakers are now exporting Koshu globally, and it has become one of the most fashionable wine varieties in international fine-dining circles.",
    facts: [
      "Koshu grapes have been grown in Yamanashi for over 1,000 years — Japan's oldest known wine grape",
      "Japan's first commercial winery was established in Katsunuma, Yamanashi in 1877",
      "Yamanashi accounts for over 30% of Japan's total wine production",
      "Grace Wine's Koshu Kayagatake is Japan's most internationally awarded white wine"
    ],
    grapes: ["Koshu", "Muscat Bailey A", "Merlot", "Cabernet Sauvignon", "Chardonnay"],
    climate: "Humid continental — warm summers with typhoon season rainfall, cold dry winters; challenging but character-building",
    flavorProfile: "Koshu: pale and delicate with yuzu, peach, white flower, and saline mineral finish. Red varieties show soft red fruit and earthiness.",
    notableStyles: ["Koshu (Dry White)", "Sparkling Koshu", "Muscat Bailey A Red"]
  },
  // ── TURKEY ───────────────────────────────────────────────────────────────────
  {
    id: "cappadocia",
    image: "./regions/cappadocia.webp",
    name: "Cappadocia",
    country: "Turkey",
    lat: 38.64,
    lng: 34.83,
    zoom: 8,
    description: "Cappadocia in central Anatolia is one of the world's most ancient and dramatically scenic wine regions. The volcanic landscape of fairy chimneys and underground cave cities has been home to viticulture for over 4,000 years. At 1,000–1,200 metres altitude, the region's high plateau experiences extreme temperature variation that concentrates flavour in indigenous varieties like Öküzgözü and Boğazkere. Modern producers — led by Turasan — are reviving ancient grape varieties and aging wine in the same cave cellars that have sheltered Cappadocians for millennia. Turkey has the world's fifth-largest planted vineyard area, yet much of its wine potential remains unexplored.",
    facts: [
      "Winemaking in Cappadocia dates back over 4,000 years to Hittite civilization",
      "Turkey has the world's 5th largest planted vineyard area with over 500 indigenous grape varieties",
      "Wines are aged in natural volcanic cave cellars, maintaining perfect temperature and humidity",
      "Cappadocia's volcanic tuff soil (ignimbrite) is unique among the world's wine soils"
    ],
    grapes: ["Öküzgözü", "Boğazkere", "Emir", "Narince", "Kalecik Karas\u0131"],
    climate: "Semi-arid continental at high altitude — hot summers, cold winters, dramatic diurnal swings",
    flavorProfile: "Öküzgözü: cherry, mulberry, and earthy spice with medium tannins. Boğazkere: intense dark fruit, black pepper, and firm tannic structure. Emir: crisp citrus and mineral freshness.",
    notableStyles: ["Öküzgözü Red", "Boğazkere Red", "Emir White", "Indigenous Variety Blends"]
  }
];

