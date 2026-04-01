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
  // ── EXISTING 20 ARTICLES ─────────────────────────────────────────────────────
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
    regionIds: ["english-sparkling"],
    producerIds: ["nyetimber"],
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
  },
  // ── NEW ARTICLES FOR NEW REGIONS ─────────────────────────────────────────────
  {
    id: "n21",
    title: "Santorini Assyrtiko Declared 'The World's Most Distinctive White Wine' by Decanter",
    summary: "Decanter's annual World Wine Awards have elevated Santorini Assyrtiko to a category of its own, with judges citing its unique combination of volcanic minerality, electric acidity, and saline depth as unmatched by any other white grape. Domaine Sigalas' Kavalieros bottling received the top score in the category.",
    source: "Decanter",
    date: "2026-03-27",
    regionIds: ["santorini"],
    producerIds: ["domaine-sigalas"],
    tags: ["white", "award winner", "Greece"],
    url: "#"
  },
  {
    id: "n22",
    title: "Georgia's Qvevri Wines Take Michelin-Starred Wine Lists by Storm",
    summary: "Georgian amber wines fermented in traditional clay qvevri vessels are now appearing on wine lists at restaurants across New York, London, and Tokyo. Pheasant's Tears' Rkatsiteli has become the most-requested natural wine in several major cities, as sommeliers champion the cradle of wine civilization's unique heritage styles.",
    source: "Wine Enthusiast",
    date: "2026-03-24",
    regionIds: ["kakheti"],
    producerIds: ["pheasants-tears"],
    tags: ["white", "natural", "amber wine", "Georgia"],
    url: "#"
  },
  {
    id: "n23",
    title: "Château Musar Marks 95th Anniversary — Lebanon's Winemaking Legend Endures",
    summary: "Château Musar is celebrating its 95th anniversary, a milestone made all the more extraordinary by the political and military turbulence Lebanon has endured. The winery, which continued producing wine through a 15-year civil war, has released a special 1995 retrospective vertical spanning five decades of Bekaa Valley vintages. The Hochar family describe each bottle as 'a testament to human persistence.'",
    source: "Decanter",
    date: "2026-03-21",
    regionIds: ["bekaa-valley"],
    producerIds: ["chateau-musar"],
    tags: ["red", "anniversary", "Lebanon", "heritage"],
    url: "#"
  },
  {
    id: "n24",
    title: "English Sparkling Wine Beats Champagne in Major London Blind Tasting",
    summary: "For the fourth consecutive year, an English sparkling wine has topped a major blind tasting against prestigious Champagne houses. Nyetimber's 2018 Classic Cuvée outscored a panel of non-vintage Champagnes from five top houses, with judges praising its chalk-driven precision, fine bubbles, and brioche complexity. The result further cements England's place on the world sparkling wine map.",
    source: "The Times",
    date: "2026-03-19",
    regionIds: ["english-sparkling", "champagne"],
    producerIds: ["nyetimber"],
    tags: ["sparkling", "award winner", "England"],
    url: "#"
  },
  {
    id: "n25",
    title: "Wachau Smaragd Riesling: Austria's Gift to the World of White Wine",
    summary: "F.X. Pichler and Domäne Wachau are leading a surge of international interest in Austria's Wachau Valley, where Grüner Veltliner and Riesling from impossibly steep Danube terraces are being recognized as among the world's finest white wines. Pichler's Unendlich Grüner Veltliner received a perfect score from two major critics, and allocation demand is outstripping supply.",
    source: "Wine Spectator",
    date: "2026-03-16",
    regionIds: ["wachau"],
    producerIds: ["fx-pichler", "domane-wachau"],
    tags: ["white", "award winner", "Austria"],
    url: "#"
  },
  {
    id: "n26",
    title: "Tokaj's Royal Tokaji Achieves Record Prices at Christie's Auction",
    summary: "Royal Tokaji's 1999 Eszencia — one of the rarest and most extraordinary sweet wines on earth — fetched a record £18,000 per bottle at Christie's London spring auction, surpassing Sauternes and German TBA in the dessert wine category. The auction result signals growing global recognition for Hungary's historic wine treasure.",
    source: "Christie's Wine Department",
    date: "2026-03-14",
    regionIds: ["tokaj"],
    producerIds: ["royal-tokaji"],
    tags: ["dessert", "luxury", "auction", "Hungary"],
    url: "#"
  },
  {
    id: "n27",
    title: "China's Ao Yun Named 'Asian Wine of the Decade' at Hong Kong Fine Wine Forum",
    summary: "LVMH's Himalayan wine project Ao Yun has been named Asian Wine of the Decade at the Hong Kong Fine Wine Forum, with judges citing its breathtaking 2,400-metre vineyard altitude, Bordeaux-trained precision, and the sheer audacity of producing world-class wine at the foot of the Himalayas. The 2020 vintage was poured alongside First Growth Bordeaux — and held its own.",
    source: "South China Morning Post",
    date: "2026-03-11",
    regionIds: ["ningxia"],
    producerIds: ["ao-yun"],
    tags: ["red", "award winner", "China", "luxury"],
    url: "#"
  },
  {
    id: "n28",
    title: "Swartland Revolution: Sadie Family Wines Cement South Africa's Natural Wine Crown",
    summary: "Eben Sadie's Swartland Revolution — the annual winemaker gathering that sparked South Africa's natural wine movement — has celebrated its 15th edition, with the Sadie Family Wines' Columella 2023 receiving the highest score ever given to a South African red wine by Jancis Robinson MW. The Swartland is now attracting international winemakers who come to study its ancient dry-farmed Chenin and Syrah vines.",
    source: "Jancis Robinson",
    date: "2026-03-09",
    regionIds: ["swartland"],
    producerIds: ["sadie-family"],
    tags: ["red", "natural", "award winner", "South Africa"],
    url: "#"
  },
  {
    id: "n29",
    title: "Sicily's Etna Volcano Wines: The Burgundy of the Mediterranean",
    summary: "Etna Rosso and Bianco continue their spectacular rise in global wine consciousness, with Benanti and a new generation of Etna producers now appearing on the lists of Michelin three-star restaurants worldwide. Wine critics are increasingly drawing parallels between Etna's volcanic terroir and Burgundy's limestone, calling Nerello Mascalese 'Pinot Noir's volcanic cousin.' The 2022 Etna vintage is being called historic.",
    source: "Vinous",
    date: "2026-03-07",
    regionIds: ["sicily"],
    producerIds: ["benanti", "frank-cornelissen"],
    tags: ["red", "white", "Italy", "volcanic"],
    url: "#"
  },
  {
    id: "n30",
    title: "Finger Lakes Riesling: America's Cool-Climate Wine Secret Breaks Through",
    summary: "Dr. Konstantin Frank Winery and a new wave of Finger Lakes producers are finally receiving the global recognition wine insiders have long believed they deserve. The 2024 vintage — marked by a long, cool growing season and brilliant autumn — produced Rieslings that critics are comparing to the Mosel at its finest. The region's Dry Riesling was named 'Best American White Wine' by Wine & Spirits magazine.",
    source: "Wine & Spirits",
    date: "2026-03-04",
    regionIds: ["finger-lakes"],
    producerIds: ["dr-konstantin-frank"],
    tags: ["white", "award winner", "USA", "Riesling"],
    url: "#"
  },
  {
    id: "n31",
    title: "Valle de Guadalupe: Mexico's Wine Valley Conquers the World's Best Restaurants",
    summary: "Baja California's Valle de Guadalupe is no longer a curiosity — it's a destination. L.A. Cetto and a new generation of artisan producers are landing their wines on the lists of New York and London's finest restaurants, while the valley's culinary scene — combining world-class food with rustic outdoor dining — has been featured in the New York Times, Condé Nast Traveller, and Food & Wine. The 2025 Nebbiolo from the region is drawing comparisons to Piedmont.",
    source: "Food & Wine",
    date: "2026-03-01",
    regionIds: ["valle-de-guadalupe"],
    producerIds: ["la-cetto"],
    tags: ["red", "tourism", "Mexico", "emerging"],
    url: "#"
  },
  {
    id: "n32",
    title: "Yarra Valley Named Australia's Most Exciting Wine Region for 2026",
    summary: "The Yarra Valley has been named Australia's wine region of the year by James Halliday's Australian Wine Companion, with Giant Steps and a cluster of small biodynamic producers being cited for their extraordinary Pinot Noir and Chardonnay. The region's cooler vintages — favored by climate trends — are delivering wines of exceptional finesse that are winning major international trophies.",
    source: "James Halliday Australian Wine Companion",
    date: "2026-02-26",
    regionIds: ["yarra-valley"],
    producerIds: ["giant-steps"],
    tags: ["red", "white", "award winner", "Australia"],
    url: "#"
  }
];
