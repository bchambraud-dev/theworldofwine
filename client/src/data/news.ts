export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  regionIds: string[];
  producerIds: string[];
  tags: string[];
  url: string;
}

export const newsItems: NewsItem[] = [
  {
    id: "n1",
    title: "Bordeaux 2024 Vintage Declared 'Exceptional' by Union des Grands Crus",
    summary: "The 2024 vintage in Bordeaux is being hailed as one of the finest in recent memory, with ideal harvest conditions producing wines of remarkable balance and concentration across both banks.",
    source: "Decanter",
    date: "2026-03-28",
    regionIds: ["bordeaux"],
    producerIds: ["chateau-lafite", "chateau-margaux", "petrus"],
    tags: ["red", "vintage report"],
    url: "#"
  },
  {
    id: "n2",
    title: "DRC Announces New Sustainability Initiatives for Romanée-Conti Vineyard",
    summary: "Domaine de la Romanée-Conti is expanding its biodynamic practices with a comprehensive biodiversity program, including the planting of native hedgerows and insect habitats around its grand cru vineyards.",
    source: "Wine Spectator",
    date: "2026-03-25",
    regionIds: ["burgundy"],
    producerIds: ["drc"],
    tags: ["sustainability", "biodynamic"],
    url: "#"
  },
  {
    id: "n3",
    title: "Champagne Faces Frost Challenges in Early Spring",
    summary: "Growers across Champagne are battling unexpected late frosts that threaten the 2026 vintage. Emergency measures including candles and wind turbines are being deployed in affected vineyards.",
    source: "The Drinks Business",
    date: "2026-03-22",
    regionIds: ["champagne"],
    producerIds: ["dom-perignon", "krug", "bollinger"],
    tags: ["sparkling", "climate"],
    url: "#"
  },
  {
    id: "n4",
    title: "Napa Valley Cult Wine Screaming Eagle Releases 2023 Vintage at Record Price",
    summary: "Screaming Eagle's 2023 Cabernet Sauvignon has been released at $1,200 per bottle, making it the most expensive first-release domestic wine. The mailing list reportedly has a 15-year waitlist.",
    source: "Wine Advocate",
    date: "2026-03-20",
    regionIds: ["napa-valley"],
    producerIds: ["screaming-eagle"],
    tags: ["red", "luxury", "award winner"],
    url: "#"
  },
  {
    id: "n5",
    title: "Penfolds Grange 2022 Earns Highest Score in Two Decades",
    summary: "The Penfolds Grange 2022 has received near-perfect scores from major critics, with many calling it the finest Grange since the legendary 1971 vintage.",
    source: "James Halliday",
    date: "2026-03-18",
    regionIds: ["barossa-valley"],
    producerIds: ["penfolds"],
    tags: ["red", "award winner"],
    url: "#"
  },
  {
    id: "n6",
    title: "Natural Wine Movement Gains Formal EU Recognition",
    summary: "The European Union has announced draft regulations defining 'natural wine' for the first time, requiring zero additives beyond minimal sulfites. The move has been celebrated by producers like Marcel Lapierre and Frank Cornelissen.",
    source: "Financial Times",
    date: "2026-03-15",
    regionIds: ["burgundy", "tuscany", "loire"],
    producerIds: ["marcel-lapierre", "frank-cornelissen", "nicolas-joly"],
    tags: ["natural", "regulation"],
    url: "#"
  },
  {
    id: "n7",
    title: "Marlborough Sauvignon Blanc Exports Hit Record High",
    summary: "New Zealand's Marlborough region has reported record export volumes for 2025, with Sauvignon Blanc shipments growing 12% year-over-year. The US and UK remain the top markets.",
    source: "New Zealand Winegrowers",
    date: "2026-03-12",
    regionIds: ["marlborough"],
    producerIds: ["cloudy-bay"],
    tags: ["white", "market"],
    url: "#"
  },
  {
    id: "n8",
    title: "Barolo 2022 Vintage Preview: 'A Generational Classic'",
    summary: "Early tastings of the 2022 Barolo vintage suggest wines of exceptional depth and structure. Giacomo Conterno's Monfortino and Gaja's Sori Tildin are generating particular excitement.",
    source: "Vinous",
    date: "2026-03-10",
    regionIds: ["piedmont"],
    producerIds: ["giacomo-conterno", "gaja"],
    tags: ["red", "vintage report"],
    url: "#"
  },
  {
    id: "n9",
    title: "López de Heredia Releases 2004 Gran Reserva After Two Decades of Aging",
    summary: "Spain's most traditional bodega has finally released its 2004 Viña Tondonia Gran Reserva, a wine that has spent 20 years between barrel and bottle. Critics call it 'a time machine.'",
    source: "Jancis Robinson",
    date: "2026-03-08",
    regionIds: ["rioja"],
    producerIds: ["lopez-de-heredia"],
    tags: ["red", "luxury"],
    url: "#"
  },
  {
    id: "n10",
    title: "Argentine Malbec Day Celebrated Worldwide on April 17",
    summary: "World Malbec Day, marking the day in 1853 when Argentina began its mission to transform its wine industry, continues to grow in global recognition. Catena Zapata is leading celebrations with a global tasting event.",
    source: "Wines of Argentina",
    date: "2026-03-05",
    regionIds: ["mendoza"],
    producerIds: ["catena-zapata"],
    tags: ["red", "event"],
    url: "#"
  },
  {
    id: "n11",
    title: "Mosel Riesling Producers Report Best Vintage in Years",
    summary: "The 2025 Mosel vintage is showing exceptional quality across all Prädikat levels, with J.J. Prüm and Egon Müller leading the charge. The combination of a warm summer and cool September produced ideal conditions.",
    source: "Wine & Spirits",
    date: "2026-03-02",
    regionIds: ["mosel"],
    producerIds: ["jj-prum", "egon-muller"],
    tags: ["white", "vintage report"],
    url: "#"
  },
  {
    id: "n12",
    title: "Priorat's Álvaro Palacios Named World's Best Winemaker",
    summary: "Álvaro Palacios has been named the world's most influential winemaker by Wine Enthusiast, recognizing his role in revitalizing Priorat and Bierzo while producing some of Spain's most thrilling wines.",
    source: "Wine Enthusiast",
    date: "2026-02-28",
    regionIds: ["priorat"],
    producerIds: ["alvaro-palacios"],
    tags: ["red", "award winner"],
    url: "#"
  },
  {
    id: "n13",
    title: "South Africa's Stellenbosch Emerges as Fine Wine Destination",
    summary: "A new wave of precision-focused winemakers is putting Stellenbosch on the global fine wine map, with Kanonkop leading a group of estates now competing with Bordeaux and Napa at a fraction of the price.",
    source: "Decanter",
    date: "2026-02-25",
    regionIds: ["stellenbosch"],
    producerIds: ["kanonkop"],
    tags: ["red", "market"],
    url: "#"
  },
  {
    id: "n14",
    title: "Oregon Pinot Noir Gains Ground in Global Fine Wine Market",
    summary: "Willamette Valley Pinot Noir is increasingly appearing on the wine lists of Michelin-starred restaurants worldwide, with Domaine Drouhin Oregon and a new generation of producers driving the momentum.",
    source: "Wine Spectator",
    date: "2026-02-22",
    regionIds: ["willamette"],
    producerIds: ["domaine-drouhin"],
    tags: ["red", "market"],
    url: "#"
  },
  {
    id: "n15",
    title: "Douro Valley Port Shipments Decline as Dry Reds Surge",
    summary: "Port shipments fell 5% in 2025 while dry red wine exports from the Douro Valley grew 18%, reflecting a broader shift in consumer preferences. Taylor's reports strong demand for their dry wine range.",
    source: "Port Wine Institute",
    date: "2026-02-18",
    regionIds: ["douro"],
    producerIds: ["taylors"],
    tags: ["red", "fortified", "market"],
    url: "#"
  },
  {
    id: "n16",
    title: "Krug Launches First-Ever Single-Ingredient Champagne Pairing Series",
    summary: "Krug has unveiled a new dining concept pairing each bottling with a single ingredient — potato, egg, mushroom — to showcase the versatility of Champagne as a food wine.",
    source: "Robb Report",
    date: "2026-02-15",
    regionIds: ["champagne"],
    producerIds: ["krug"],
    tags: ["sparkling", "food"],
    url: "#"
  },
  {
    id: "n17",
    title: "Felton Road Named New Zealand's Top Winery for Fifth Consecutive Year",
    summary: "Central Otago's Felton Road has been named New Zealand's top winery by Bob Campbell MW for the fifth year running, with Block 5 Pinot Noir receiving a perfect score.",
    source: "Bob Campbell MW",
    date: "2026-02-12",
    regionIds: ["central-otago"],
    producerIds: ["felton-road"],
    tags: ["red", "award winner"],
    url: "#"
  },
  {
    id: "n18",
    title: "Global Wine Tourism Rebounds: Top 10 Regions to Visit in 2026",
    summary: "Wine tourism has fully recovered from pandemic-era lows, with Tuscany, Napa Valley, and the Douro Valley topping the list of most-visited wine destinations worldwide.",
    source: "Travel + Leisure",
    date: "2026-02-08",
    regionIds: ["tuscany", "napa-valley", "douro"],
    producerIds: ["antinori", "opus-one", "taylors"],
    tags: ["tourism"],
    url: "#"
  },
  {
    id: "n19",
    title: "Climate Change Pushes Wine Frontier: England and Denmark Show Promise",
    summary: "Rising temperatures are opening new wine frontiers in Northern Europe. English sparkling wine continues to gain prestige while Denmark planted its first commercial Pinot Noir vineyards.",
    source: "The Guardian",
    date: "2026-02-05",
    regionIds: [],
    producerIds: [],
    tags: ["climate", "sparkling"],
    url: "#"
  },
  {
    id: "n20",
    title: "Rhône Valley Guigal 'La-La' Trilogy Achieves Perfect Scores Again",
    summary: "E. Guigal's legendary single-vineyard Côte-Rôties — La Mouline, La Landonne, and La Turque — from the 2022 vintage have all received perfect or near-perfect scores, cementing their status among France's greatest wines.",
    source: "Robert Parker's Wine Advocate",
    date: "2026-02-01",
    regionIds: ["rhone"],
    producerIds: ["guigal"],
    tags: ["red", "award winner"],
    url: "#"
  }
];
