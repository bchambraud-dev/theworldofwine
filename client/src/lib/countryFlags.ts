// ISO 3166-1 alpha-2 codes for wine-producing countries
export const WINE_COUNTRIES: { name: string; code: string }[] = [
  { name: "France", code: "FR" },
  { name: "Italy", code: "IT" },
  { name: "Spain", code: "ES" },
  { name: "Portugal", code: "PT" },
  { name: "Germany", code: "DE" },
  { name: "Austria", code: "AT" },
  { name: "Greece", code: "GR" },
  { name: "Hungary", code: "HU" },
  { name: "Croatia", code: "HR" },
  { name: "Georgia", code: "GE" },
  { name: "Turkey", code: "TR" },
  { name: "Lebanon", code: "LB" },
  { name: "USA", code: "US" },
  { name: "Argentina", code: "AR" },
  { name: "Chile", code: "CL" },
  { name: "Brazil", code: "BR" },
  { name: "Mexico", code: "MX" },
  { name: "Australia", code: "AU" },
  { name: "New Zealand", code: "NZ" },
  { name: "South Africa", code: "ZA" },
  { name: "China", code: "CN" },
  { name: "Japan", code: "JP" },
  { name: "England", code: "GB" },
  { name: "Canada", code: "CA" },
];

// Map region text to a country name. Uses keyword matching for common appellations.
export function regionToCountry(regionText: string | null | undefined): string | null {
  if (!regionText) return null;
  const r = regionText.toLowerCase();

  // Direct country name matches
  const directMatch = WINE_COUNTRIES.find(c => r.includes(c.name.toLowerCase()));
  if (directMatch) return directMatch.name;

  // Region keyword -> country mapping (covers common appellations Sommy might use)
  const REGION_MAP: Record<string, string> = {
    // France
    bordeaux: "France", burgundy: "France", bourgogne: "France", champagne: "France",
    loire: "France", rhone: "France", alsace: "France", languedoc: "France",
    provence: "France", beaujolais: "France", chablis: "France", medoc: "France",
    pauillac: "France", margaux: "France", "saint-emilion": "France", sauternes: "France",
    "cotes du": "France", hermitage: "France",
    // Italy
    piedmont: "Italy", tuscany: "Italy", veneto: "Italy", sicily: "Italy",
    barolo: "Italy", barbaresco: "Italy", chianti: "Italy", brunello: "Italy",
    amarone: "Italy", soave: "Italy", prosecco: "Italy", etna: "Italy",
    "alto adige": "Italy", friuli: "Italy", abruzzo: "Italy", puglia: "Italy",
    campania: "Italy", sardinia: "Italy", umbria: "Italy",
    // Spain
    rioja: "Spain", ribera: "Spain", priorat: "Spain", jerez: "Spain",
    sherry: "Spain", cava: "Spain", "rias baixas": "Spain", penedes: "Spain",
    galicia: "Spain", navarra: "Spain", rueda: "Spain", toro: "Spain",
    // Portugal
    douro: "Portugal", alentejo: "Portugal", dao: "Portugal", vinho: "Portugal",
    madeira: "Portugal", port: "Portugal",
    // Germany
    mosel: "Germany", rheingau: "Germany", pfalz: "Germany", rheinhessen: "Germany",
    baden: "Germany", nahe: "Germany", franken: "Germany",
    // Austria
    wachau: "Austria", burgenland: "Austria", kamptal: "Austria", kremstal: "Austria",
    // Greece
    santorini: "Greece", naoussa: "Greece", nemea: "Greece", crete: "Greece",
    // USA
    napa: "USA", sonoma: "USA", california: "USA", oregon: "USA",
    willamette: "USA", "paso robles": "USA", "santa barbara": "USA",
    "finger lakes": "USA", "washington state": "USA", walla: "USA",
    // Argentina
    mendoza: "Argentina", salta: "Argentina", patagonia: "Argentina", cafayate: "Argentina",
    // Chile
    maipo: "Chile", colchagua: "Chile", casablanca: "Chile", "central valley": "Chile",
    rapel: "Chile", aconcagua: "Chile",
    // Australia
    barossa: "Australia", "hunter valley": "Australia", "mclaren vale": "Australia",
    yarra: "Australia", coonawarra: "Australia", margaret: "Australia",
    "clare valley": "Australia", eden: "Australia", adelaide: "Australia",
    // New Zealand
    marlborough: "New Zealand", "central otago": "New Zealand",
    "hawke's bay": "New Zealand", martinborough: "New Zealand",
    // South Africa
    stellenbosch: "South Africa", franschhoek: "South Africa", swartland: "South Africa",
    constantia: "South Africa", paarl: "South Africa", walker: "South Africa",
    // Others
    tokaj: "Hungary", slavonia: "Croatia", istria: "Croatia",
    kakheti: "Georgia", bekaa: "Lebanon",
    okanagan: "Canada", niagara: "Canada",
    "baja california": "Mexico",
    // England
    sussex: "England", kent: "England", hampshire: "England",
  };

  for (const [keyword, country] of Object.entries(REGION_MAP)) {
    if (r.includes(keyword)) return country;
  }

  return null;
}

// Get the code for a country name
export function countryCode(name: string | null | undefined): string | null {
  if (!name) return null;
  const match = WINE_COUNTRIES.find(c => c.name.toLowerCase() === name.toLowerCase());
  return match?.code || null;
}

// Country fun facts for achievement messages
export const COUNTRY_FACTS: Record<string, string> = {
  France: "Home to more than 3,000 years of winemaking tradition.",
  Italy: "More grape varieties than any other country on Earth.",
  Spain: "The largest vineyard area in the world.",
  Portugal: "From port to vinho verde, a country of extraordinary range.",
  Germany: "The steep slopes of the Mosel produce some of the world's finest Rieslings.",
  Austria: "Gruner Veltliner put this country on the modern wine map.",
  Greece: "One of the oldest wine-producing regions, with indigenous grapes found nowhere else.",
  Hungary: "Tokaj was the world's first classified wine region, centuries before Bordeaux.",
  Croatia: "Zinfandel's ancestral home, with a Mediterranean coast full of native varieties.",
  Georgia: "The birthplace of wine — 8,000 years of qvevri tradition.",
  Turkey: "Where some of the world's oldest cultivated grape vines were first grown.",
  Lebanon: "The Bekaa Valley has been producing wine since Phoenician times.",
  USA: "From Napa's Cabernets to Oregon's Pinots, a continent of wine diversity.",
  Argentina: "Malbec found its true home in the high-altitude vineyards of Mendoza.",
  Chile: "Protected by the Andes and Pacific, producing remarkably pure fruit.",
  Brazil: "A rising star, especially for sparkling wines from the southern highlands.",
  Mexico: "Home to the oldest winery in the Americas, Valle de Guadalupe.",
  Australia: "Some of the oldest vines in the world survive in the Barossa Valley.",
  "New Zealand": "Marlborough Sauvignon Blanc redefined a grape variety for the world.",
  "South Africa": "Pinotage and Chenin Blanc from one of the most beautiful wine regions on Earth.",
  China: "The fastest-growing wine industry, with ancient roots and modern ambition.",
  Japan: "Koshu and precision winemaking in a country known for meticulous craft.",
  England: "Sparkling wines that rival Champagne, from the chalk soils of Sussex and Kent.",
  Canada: "World-class ice wine and cool-climate elegance from Niagara and the Okanagan.",
};

// Sommy suggestion for first unexplored country
export const COUNTRY_SUGGESTIONS: Record<string, string> = {
  France: "The foundation of modern wine. Start with a Burgundy or Bordeaux.",
  Italy: "Try a Barolo or Chianti — Italian wines are built for the table.",
  Spain: "Rioja is a great entry point. Incredible value across the board.",
  Portugal: "Beyond port — try a Douro red or a crisp Vinho Verde.",
  Germany: "A great Riesling will change how you think about white wine.",
  Austria: "Gruner Veltliner is one of the most food-friendly whites you'll find.",
  Greece: "Assyrtiko from Santorini is unlike any other white wine.",
  Hungary: "Tokaji Aszu is one of the great sweet wines of the world.",
  Croatia: "Plavac Mali from the Dalmatian coast is bold and distinctive.",
  Georgia: "Try an amber wine — the original winemaking style.",
  Turkey: "Narince whites and Kalecik Karasi reds are worth seeking out.",
  Lebanon: "Chateau Musar is legendary — a must-try for any wine lover.",
  USA: "Napa Cabernet or Oregon Pinot Noir are world-class benchmarks.",
  Argentina: "A Mendoza Malbec at altitude is something special.",
  Chile: "Carmenere from Colchagua is Chile's signature grape at its best.",
  Brazil: "Try a sparkling from Serra Gaucha — surprisingly elegant.",
  Mexico: "Valle de Guadalupe is producing exciting, modern wines.",
  Australia: "Barossa Shiraz is bold and generous — quintessentially Australian.",
  "New Zealand": "Marlborough Sauvignon Blanc is crisp, electric, and unmistakable.",
  "South Africa": "Swartland Chenin Blanc is one of the great values in wine right now.",
  China: "Look for wines from Ningxia — China's most promising region.",
  Japan: "Koshu from Yamanashi is delicate and perfectly balanced.",
  England: "English sparkling is turning heads — try one from Sussex.",
  Canada: "Niagara Riesling and BC Pinot Noir punch well above their weight.",
};
