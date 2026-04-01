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
    image: "/regions/bordeaux.png",
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
    image: "/regions/burgundy.png",
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
    image: "/regions/champagne.png",
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
    image: "/regions/rhone.png",
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
    image: "/regions/loire.png",
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
    image: "/regions/alsace.png",
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
    image: "/regions/tuscany.png",
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
    image: "/regions/piedmont.png",
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
    image: "/regions/sicily.png",
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
    image: "/regions/rioja.png",
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
    image: "/regions/priorat.png",
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
    image: "/regions/mosel.png",
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
    image: "/regions/douro.png",
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
    image: "/regions/wachau.png",
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
    image: "/regions/tokaj.png",
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
    image: "/regions/istria-dalmatia.png",
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
    image: "/regions/kakheti.png",
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
    image: "/regions/santorini.png",
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
    image: "/regions/english-sparkling.png",
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
    image: "/regions/stellenbosch.png",
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
    image: "/regions/swartland.png",
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
    image: "/regions/mendoza.png",
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
    image: "/regions/maipo-colchagua.png",
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
    image: "/regions/napa-valley.png",
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
    image: "/regions/sonoma.png",
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
    image: "/regions/willamette.png",
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
    image: "/regions/finger-lakes.png",
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
    image: "/regions/okanagan-valley.png",
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
    image: "/regions/valle-de-guadalupe.png",
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
    image: "/regions/barossa-valley.png",
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
    image: "/regions/yarra-valley.png",
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
    image: "/regions/marlborough.png",
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
    image: "/regions/central-otago.png",
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
    image: "/regions/ningxia.png",
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
    image: "/regions/bekaa-valley.png",
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
  }
];
