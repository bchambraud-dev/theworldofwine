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
  {
    id: "bordeaux",
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
    id: "tuscany",
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
    id: "rioja",
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
    id: "napa-valley",
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
    id: "barossa-valley",
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
    id: "marlborough",
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
    id: "mosel",
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
  {
    id: "douro",
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
  {
    id: "stellenbosch",
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
    id: "mendoza",
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
  {
    id: "willamette",
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
    id: "loire",
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
  {
    id: "priorat",
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
  {
    id: "central-otago",
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
  }
];
