export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string; // 1-2 sentences explaining the answer, brand voice
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  regionId?: string;
  guideId?: string;
  journeyId?: string;
  questions: QuizQuestion[];
}

export const quizzes: Quiz[] = [
  // ── QUIZ 1: Wine Basics ───────────────────────────────────────────────────────
  {
    id: "wine-basics",
    title: "Wine Basics",
    description:
      "Think you've got the fundamentals covered? Test your knowledge of terroir, winemaking, and the core concepts behind every great bottle.",
    guideId: "what-is-terroir",
    questions: [
      {
        id: "wb-q1",
        question: "What does the French word 'terroir' most accurately describe?",
        options: [
          "The winemaker's specific technique for fermenting grapes",
          "The combined influence of soil, climate, and place on a wine's character",
          "A legal classification system used in Bordeaux",
          "The type of oak barrel used during aging",
        ],
        correctIndex: 1,
        explanation:
          "Terroir encompasses everything about a place — soil, climate, aspect, altitude — that leaves its fingerprint on the wine. It's the reason the same grape tastes completely different depending on where it grows.",
      },
      {
        id: "wb-q2",
        question: "Why are well-drained soils (like gravel or chalk) often found in great wine regions?",
        options: [
          "They retain more water, keeping vines hydrated in hot summers",
          "They produce more grapes per vine, increasing quantity",
          "They stress the vine, forcing deep roots and concentrating flavors",
          "They add mineral compounds directly to the wine's flavor",
        ],
        correctIndex: 2,
        explanation:
          "Well-drained soils force vine roots to reach deep into the subsoil in search of water and nutrients — the resulting stress concentrates flavors in the fruit and creates more complex wines.",
      },
      {
        id: "wb-q3",
        question: "What is the primary job of acidity in wine?",
        options: [
          "To add sweetness and body",
          "To provide freshness, balance, and aging potential",
          "To create the tannins that dry your mouth",
          "To give wine its color",
        ],
        correctIndex: 1,
        explanation:
          "Acidity is wine's backbone — it provides the refreshing, mouth-watering quality that keeps wine lively, balances other elements, and allows wines to age gracefully over many years.",
      },
      {
        id: "wb-q4",
        question: "Tannins in red wine primarily come from which source?",
        options: [
          "Added sugar during fermentation",
          "The winemaker's oak barrels",
          "The skins, seeds, and stems of grapes",
          "Sulfur dioxide added at bottling",
        ],
        correctIndex: 2,
        explanation:
          "Tannins are polyphenolic compounds found naturally in grape skins, seeds, and stems — that's why red wines have tannins (they ferment with the skins) and most white wines don't.",
      },
      {
        id: "wb-q5",
        question:
          "A wine region described as 'maritime' most likely experiences which type of climate?",
        options: [
          "Very hot summers and cold winters with little rain",
          "Moderate temperatures year-round, influenced by proximity to the ocean",
          "A sunny, dry Mediterranean climate with minimal frost risk",
          "Extreme cold snaps that kill most vines in winter",
        ],
        correctIndex: 1,
        explanation:
          "Maritime climates — like Bordeaux's — are moderated by the ocean, which buffers extreme temperature swings, making summers warm rather than hot and preventing killing winter frosts.",
      },
    ],
  },

  // ── QUIZ 2: Name That Grape ───────────────────────────────────────────────────
  {
    id: "name-that-grape",
    title: "Name That Grape",
    description:
      "From Nebbiolo to Assyrtiko, do you know your grapes? Test your varietal knowledge across reds, whites, and everything in between.",
    questions: [
      {
        id: "ntg-q1",
        question: "Which red grape is responsible for Barolo and Barbaresco in Piedmont, Italy?",
        options: ["Sangiovese", "Barbera", "Nebbiolo", "Dolcetto"],
        correctIndex: 2,
        explanation:
          "Nebbiolo is Piedmont's king — the high-acid, high-tannin grape behind Barolo and Barbaresco, wines of extraordinary complexity that can age for decades before they fully open.",
      },
      {
        id: "ntg-q2",
        question: "What is Shiraz, as it's labeled in Australia?",
        options: [
          "A completely different grape variety from Syrah",
          "The same grape as Syrah, just called by its Australian name",
          "A hybrid crossing of Syrah and Grenache",
          "A local Australian grape variety with no European equivalent",
        ],
        correctIndex: 1,
        explanation:
          "Shiraz and Syrah are identical — same grape, different names depending on where you are. In Australia and South Africa it's Shiraz; in France and most of Europe it's Syrah.",
      },
      {
        id: "ntg-q3",
        question:
          "Assyrtiko is a white grape native to which Greek island, famous for its volcanic soils?",
        options: ["Crete", "Rhodes", "Corfu", "Santorini"],
        correctIndex: 3,
        explanation:
          "Santorini's Assyrtiko grows in ancient volcanic soil in basket-shaped vine formations, producing white wines of searingly mineral, electric character unlike anything else in the wine world.",
      },
      {
        id: "ntg-q4",
        question:
          "Albariño in Spain is called by which name when grown across the border in Portugal's Vinho Verde region?",
        options: ["Alvarinho", "Loureiro", "Arinto", "Trajadura"],
        correctIndex: 0,
        explanation:
          "Albariño and Alvarinho are the same grape — the Spanish and Portuguese names for the signature variety of the Atlantic coast, producing fresh, aromatic whites perfect with seafood.",
      },
      {
        id: "ntg-q5",
        question: "Which white grape is described as the 'shape-shifter' — capable of producing everything from steely Chablis to rich, buttery California barrel-fermented wine?",
        options: ["Riesling", "Sauvignon Blanc", "Chardonnay", "Pinot Grigio"],
        correctIndex: 2,
        explanation:
          "Chardonnay is the world's most versatile white grape, adapting dramatically to different climates and winemaking styles — from lean and mineral to rich and opulent — while always retaining its core character.",
      },
    ],
  },

  // ── QUIZ 3: Bordeaux Challenge ────────────────────────────────────────────────
  {
    id: "bordeaux-challenge",
    title: "Bordeaux Challenge",
    description:
      "Châteaux, classifications, grapes, and geography — how well do you really know one of the world's most famous wine regions?",
    regionId: "bordeaux",
    questions: [
      {
        id: "bx-q1",
        question: "What are the two main rivers that divide Bordeaux into its Left Bank and Right Bank?",
        options: [
          "The Seine and the Loire",
          "The Gironde estuary and the Dordogne",
          "The Garonne and the Dordogne (forming the Gironde estuary)",
          "The Rhine and the Moselle",
        ],
        correctIndex: 2,
        explanation:
          "The Garonne and Dordogne rivers join to form the Gironde estuary — the natural boundary separating the Cabernet-dominated Left Bank from the Merlot-friendly Right Bank.",
      },
      {
        id: "bx-q2",
        question: "Which grape variety dominates the Left Bank of Bordeaux (Pauillac, Margaux, Saint-Julien)?",
        options: ["Merlot", "Syrah", "Cabernet Sauvignon", "Cabernet Franc"],
        correctIndex: 2,
        explanation:
          "The Left Bank's gravelly soils are ideal for Cabernet Sauvignon, which makes the structured, long-lived wines of estates like Château Lafite, Mouton Rothschild, and Margaux.",
      },
      {
        id: "bx-q3",
        question: "Pétrus, one of the world's most expensive wines, is made almost entirely from which grape variety?",
        options: ["Cabernet Sauvignon", "Petit Verdot", "Cabernet Franc", "Merlot"],
        correctIndex: 3,
        explanation:
          "Pétrus in Pomerol is nearly 100% Merlot, grown on a unique button of blue clay. It proves that Merlot — often dismissed as simple — can produce world-class wine in the right conditions.",
      },
      {
        id: "bx-q4",
        question: "The 1855 Classification of Bordeaux was originally created at whose request?",
        options: [
          "Louis XIV, the Sun King",
          "Napoleon III, for the Paris Universal Exhibition",
          "Queen Victoria, during a state visit to France",
          "Thomas Jefferson, during his time as US Ambassador to France",
        ],
        correctIndex: 1,
        explanation:
          "Napoleon III requested the classification for the 1855 Paris Universal Exhibition to showcase the finest wines of Bordeaux — and the ranking has barely changed in the 170 years since.",
      },
      {
        id: "bx-q5",
        question: "What style of wine is Sauternes, made within the broader Bordeaux region?",
        options: [
          "A dry, tannic red dominated by Cabernet Sauvignon",
          "A sparkling wine made using the traditional method",
          "A lusciously sweet white wine made from botrytized grapes",
          "A light, fresh rosé drunk young",
        ],
        correctIndex: 2,
        explanation:
          "Sauternes is made from Sémillon and Sauvignon Blanc affected by 'noble rot' (Botrytis cinerea), which concentrates sugars and creates golden, honeyed dessert wines of extraordinary complexity and longevity.",
      },
    ],
  },

  // ── QUIZ 4: Burgundy Challenge ────────────────────────────────────────────────
  {
    id: "burgundy-challenge",
    title: "Burgundy Challenge",
    description:
      "Grand Cru, Premier Cru, the Côte d'Or, monks, and million-dollar bottles — Burgundy is one of wine's most complex regions. How deep does your knowledge go?",
    regionId: "burgundy",
    questions: [
      {
        id: "bu-q1",
        question: "Burgundy is famous for producing wines almost exclusively from which two grape varieties?",
        options: [
          "Cabernet Sauvignon and Sauvignon Blanc",
          "Pinot Noir and Chardonnay",
          "Grenache and Viognier",
          "Gamay and Aligoté",
        ],
        correctIndex: 1,
        explanation:
          "Burgundy's genius lies in its single-minded focus on two grapes — Pinot Noir for reds and Chardonnay for whites — varieties that are perfectly suited to its limestone soils and continental climate.",
      },
      {
        id: "bu-q2",
        question: "In Burgundy's four-tier quality hierarchy, what is the highest level of vineyard classification?",
        options: ["Village", "Premier Cru", "Grand Cru", "Communal"],
        correctIndex: 2,
        explanation:
          "Grand Cru is the pinnacle of Burgundy's quality system — just 33 vineyards hold this designation, representing about 1% of total production. Famous examples include Romanée-Conti, Chambertin, and Le Montrachet.",
      },
      {
        id: "bu-q3",
        question: "Which monastic order is credited with first systematically mapping Burgundy's vineyards in the Middle Ages?",
        options: ["The Benedictines", "The Cistercians", "The Dominicans", "The Jesuits"],
        correctIndex: 1,
        explanation:
          "Cistercian monks, working from Cîteaux Abbey from the 11th century onward, tasted wine from different vineyard plots, identified the best sites, and walled them off as 'clos' — their work underpins the modern vineyard classification.",
      },
      {
        id: "bu-q4",
        question: "Chablis, the famous dry white wine at the northern tip of Burgundy, is made from which grape?",
        options: ["Sauvignon Blanc", "Riesling", "Chardonnay", "Aligoté"],
        correctIndex: 2,
        explanation:
          "Chablis is 100% Chardonnay, but on Kimmeridgian chalk and limestone soils in a very cool climate, producing wines that are steely, mineral, and austere — far removed from the buttery, oaked versions associated with warmer regions.",
      },
      {
        id: "bu-q5",
        question: "DRC (Domaine de la Romanée-Conti) produces wine from a single 1.8-hectare Grand Cru plot. Approximately how many bottles per year does it produce?",
        options: ["Around 6,000 bottles", "Around 60,000 bottles", "Around 600,000 bottles", "Around 600 bottles"],
        correctIndex: 0,
        explanation:
          "The Romanée-Conti vineyard produces around 6,000 bottles per year from its tiny 1.8-hectare plot — intense scarcity combined with extraordinary quality is why individual bottles sell for tens of thousands of dollars.",
      },
    ],
  },

  // ── QUIZ 5: Italy Wine Quiz ───────────────────────────────────────────────────
  {
    id: "italy-wine-quiz",
    title: "Italy Wine Quiz",
    description:
      "From Barolo to Brunello, from the Veneto to Sicily — Italy has more indigenous grape varieties than any other country. Test your knowledge of the peninsula's incredible wine diversity.",
    questions: [
      {
        id: "it-q1",
        question: "What is Amarone della Valpolicella, and what makes it unique in Italian winemaking?",
        options: [
          "A sparkling wine from the Veneto, made using the traditional method",
          "A light, refreshing red from Sicily, made for early drinking",
          "A powerful red wine made from dried grapes, concentrated in flavor and high in alcohol",
          "A sweet dessert wine from Piedmont, made with Moscato Bianco",
        ],
        correctIndex: 2,
        explanation:
          "Amarone is made from partially dried Corvina and other grapes — the drying process (called appassimento) concentrates sugars, flavors, and alcohol, producing one of Italy's most powerful and distinctive wines.",
      },
      {
        id: "it-q2",
        question: "Barolo is sometimes called the 'King of Wines and Wine of Kings.' Which grape variety is it made from?",
        options: ["Barbera", "Dolcetto", "Sangiovese", "Nebbiolo"],
        correctIndex: 3,
        explanation:
          "Barolo is made from Nebbiolo — a demanding, high-tannin, high-acid grape that produces wines of extraordinary complexity and longevity in the hills of Piedmont's Langhe region.",
      },
      {
        id: "it-q3",
        question: "What are 'Super Tuscans,' and why were they originally classified as humble table wine?",
        options: [
          "Wines made from Sangiovese aged for longer than legally required in Chianti",
          "International variety wines (like Cabernet Sauvignon) that broke DOC rules and were classified as Vino da Tavola",
          "Organic wines from Tuscany certified under a special sustainable scheme",
          "Wines from the Super Tuscan microclimate in the hills above Florence",
        ],
        correctIndex: 1,
        explanation:
          "Pioneering producers like Sassicaia planted Cabernet Sauvignon and used new French oak barrels — practices not permitted by existing DOC rules — so their wines were paradoxically labeled as basic table wine despite being world-class.",
      },
      {
        id: "it-q4",
        question: "Mount Etna in Sicily has become one of wine's most exciting new frontiers. What makes its volcanic vineyards especially remarkable?",
        options: [
          "The elevation keeps temperatures cool despite Sicily's Mediterranean climate, and some pre-phylloxera vines survive in volcanic soil",
          "The ash from recent eruptions fertilizes the soil, producing unusually high yields",
          "Etna is the only region where grapes are harvested in winter rather than autumn",
          "The lava rock is ground into wine during fermentation, adding unique minerals",
        ],
        correctIndex: 0,
        explanation:
          "Etna's altitude creates surprisingly cool conditions, and volcanic soil repels phylloxera — meaning some vines are over 100 years old, ungrafted, producing wines of haunting mineral complexity.",
      },
      {
        id: "it-q5",
        question: "Which wine region produces Prosecco, Italy's widely beloved sparkling wine?",
        options: ["Tuscany", "Piedmont", "The Veneto", "Sicily"],
        correctIndex: 2,
        explanation:
          "Prosecco comes from the Veneto in northeastern Italy, made from the Glera grape using the Charmat (tank) method — producing a fresh, fruit-forward sparkling wine with softer bubbles than Champagne.",
      },
    ],
  },

  // ── QUIZ 6: Old World vs New World ───────────────────────────────────────────
  {
    id: "old-world-vs-new-world",
    title: "Old World vs New World",
    description:
      "Two philosophies of wine, many ways to express them. Can you tell your Bordeaux from your Napa, your Mosel from your Marlborough?",
    journeyId: "old-world-vs-new-world",
    questions: [
      {
        id: "ow-q1",
        question: "Which of the following best describes the traditional 'Old World' approach to wine labeling?",
        options: [
          "Labels feature the grape variety as the primary information",
          "Labels feature the region or appellation as the primary information",
          "Labels always include the winemaker's personal score out of 100",
          "Labels must include the alcohol percentage in large font",
        ],
        correctIndex: 1,
        explanation:
          "Old World (European) labeling emphasizes place over grape — because the assumption is that knowing the region tells you the style, the permitted grapes, and the quality level.",
      },
      {
        id: "ow-q2",
        question: "The 1976 'Judgment of Paris' is famous in wine history because:",
        options: [
          "French wines were proven superior to all other wine regions in a blind tasting",
          "California wines beat top Bordeaux and Burgundy in a blind tasting judged by French critics",
          "Champagne was officially recognized as France's greatest wine region",
          "Robert Parker gave his first perfect 100-point score to a Bordeaux",
        ],
        correctIndex: 1,
        explanation:
          "The 1976 Judgment of Paris — organized by Steven Spurrier — saw California Cabernet and Chardonnay beat the best of Bordeaux and Burgundy in a blind tasting, proving the New World could compete at the highest level.",
      },
      {
        id: "ow-q3",
        question: "Generally speaking, which characteristic most distinguishes a cool-climate wine from a warm-climate wine of the same grape variety?",
        options: [
          "Cool-climate wines are always lighter in color",
          "Cool-climate wines have higher acidity and more restrained fruit; warm-climate wines are riper with more alcohol",
          "Warm-climate wines always have more tannin",
          "Cool-climate wines must be drunk young; warm-climate wines always age better",
        ],
        correctIndex: 1,
        explanation:
          "Temperature during growing season directly shapes ripeness: cooler climates produce grapes with more acidity, lower alcohol, and more restrained fruit; warmer climates produce riper, richer wines with higher alcohol.",
      },
      {
        id: "ow-q4",
        question: "Willamette Valley in Oregon is most closely compared to which European region, and for which grape variety?",
        options: [
          "The Rhône Valley — for Syrah",
          "Rioja — for Tempranillo",
          "Burgundy — for Pinot Noir",
          "Champagne — for sparkling wine",
        ],
        correctIndex: 2,
        explanation:
          "Willamette Valley took Burgundy's cool-climate Pinot Noir as its model and has built a world-class reputation for elegant, site-expressive Pinot Noir that competes with Burgundy's finest.",
      },
      {
        id: "ow-q5",
        question: "What does 'Reserva' mean on a Spanish Rioja label compared to the same wine without that designation?",
        options: [
          "It was made from a reserved single vineyard plot",
          "The wine has been aged for a legally specified minimum period in oak and bottle before release",
          "It contains a higher percentage of Tempranillo than standard blends",
          "It was made using the same traditional method as Champagne",
        ],
        correctIndex: 1,
        explanation:
          "Rioja Reserva must age at least 3 years (minimum 1 year in oak, 2 in bottle) before release — a legally mandated process that develops complexity and means the wine is ready to enjoy on purchase.",
      },
    ],
  },

  // ── QUIZ 7: Sparkling Wine Quiz ───────────────────────────────────────────────
  {
    id: "sparkling-wine-quiz",
    title: "Sparkling Wine Quiz",
    description:
      "Champagne, Prosecco, Cava, Crémant — the world of sparkling wine is bigger and more diverse than most people realize. Let's see how much you know.",
    journeyId: "sparkling-around-the-world",
    questions: [
      {
        id: "sp-q1",
        question: "What is the key difference between the 'traditional method' (used in Champagne) and the 'Charmat method' (used for Prosecco)?",
        options: [
          "Traditional method uses red grapes; Charmat uses white grapes",
          "Traditional method involves secondary fermentation in each individual bottle; Charmat ferments in large pressurized tanks",
          "Traditional method wines are always sweeter than Charmat wines",
          "Charmat method is only legal in Italy, not France",
        ],
        correctIndex: 1,
        explanation:
          "In the traditional method, CO2 from secondary fermentation is trapped inside each bottle, creating fine, persistent bubbles and lees-aging complexity. Charmat's tank fermentation is faster and produces a fresher, more fruit-forward style.",
      },
      {
        id: "sp-q2",
        question: "What does 'Blanc de Blancs' mean on a Champagne label?",
        options: [
          "A rosé Champagne made from red grapes only",
          "A Champagne made exclusively from white (Chardonnay) grapes",
          "A sweet, dessert-style Champagne from a single vintage",
          "A Champagne with no added sugar (zero dosage)",
        ],
        correctIndex: 1,
        explanation:
          "Blanc de Blancs ('white from whites') means the Champagne is made exclusively from white grapes — in practice, almost always 100% Chardonnay — producing a leaner, more mineral, more age-worthy style.",
      },
      {
        id: "sp-q3",
        question: "English sparkling wine has surprised the world by beating Champagne in blind tastings. What geological feature connects English vineyards to Champagne's terroir?",
        options: [
          "Both regions have volcanic basalt soils that create the same minerality",
          "The same chalk deposits that underlie Champagne's vineyards continue under the English Channel and appear in southern England",
          "Both regions import special limestone gravel from the same French quarry",
          "There is no geological connection — English wine succeeds despite its terroir",
        ],
        correctIndex: 1,
        explanation:
          "The chalk belt that defines Champagne's unique terroir literally runs under the English Channel — the same geological formation appears in Sussex, Kent, and Hampshire, giving English vineyards remarkably similar soil conditions.",
      },
      {
        id: "sp-q4",
        question: "Which Spanish grape varieties are traditionally used in Cava production?",
        options: [
          "Tempranillo, Grenache, and Monastrell",
          "Albariño, Verdejo, and Godello",
          "Macabeo, Xarel·lo, and Parellada",
          "Palomino, Pedro Ximénez, and Moscatel",
        ],
        correctIndex: 2,
        explanation:
          "Traditional Cava blends are built on three indigenous Catalan varieties — Macabeo (the aromatic backbone), Xarel·lo (body and structure), and Parellada (freshness and floral notes).",
      },
      {
        id: "sp-q5",
        question: "What does 'Brut Nature' or 'Zero Dosage' mean on a sparkling wine label?",
        options: [
          "The wine is made from organically farmed grapes",
          "No sugar was added after the second fermentation (dosage step) — the driest style of sparkling wine",
          "The wine was made without any yeast additions, relying on natural wild fermentation",
          "The wine was produced in very small quantities, without machine assistance",
        ],
        correctIndex: 1,
        explanation:
          "After secondary fermentation, a small amount of sugar solution (dosage) is typically added to balance the wine's acidity. 'Brut Nature' or 'Zero Dosage' means no sugar was added at all — making it the driest, most austere style.",
      },
    ],
  },

  // ── QUIZ 8: Tasting Terms ─────────────────────────────────────────────────────
  {
    id: "tasting-terms",
    title: "Tasting Terms",
    description:
      "From 'finish' to 'phenolic ripeness' to 'reduction' — tasting vocabulary can be a maze. This quiz tests the terms that actually matter when evaluating a glass of wine.",
    guideId: "how-to-taste-wine",
    questions: [
      {
        id: "tt-q1",
        question:
          "What does 'finish' refer to in wine tasting terminology?",
        options: [
          "The color at the rim of the wine when tilted in the glass",
          "How long the flavor of the wine lingers in your mouth after swallowing",
          "The final step of the winemaking process — bottling",
          "Whether the wine is dry (no residual sugar) at the end of fermentation",
        ],
        correctIndex: 1,
        explanation:
          "Finish is one of the most reliable indicators of quality — a long, evolving finish (30+ seconds to a minute or more) generally indicates greater complexity and more interesting wine.",
      },
      {
        id: "tt-q2",
        question: "A wine described as 'tannic' will most noticeably produce which sensation?",
        options: [
          "A sweet, fruity impression on the front of the palate",
          "A sharp, sour sensation at the sides of the tongue",
          "A drying, gripping feeling on the gums and inside of the cheeks",
          "A hot, burning sensation in the back of the throat",
        ],
        correctIndex: 2,
        explanation:
          "Tannins are polyphenolic compounds that bind to proteins in your saliva and mouth tissue — causing a drying, astringent sensation. This is why tannic reds pair so well with protein-rich foods.",
      },
      {
        id: "tt-q3",
        question: "What does it mean if a sommelier says a wine is 'closed' or 'tight'?",
        options: [
          "The wine has a faulty cork that's been compromised",
          "The wine is young and its aromas and flavors are not yet fully expressing themselves",
          "The wine has been sealed without any added sulfites",
          "The wine is so concentrated that it needs to be diluted before drinking",
        ],
        correctIndex: 1,
        explanation:
          "A 'closed' wine is simply too young — its aromatic compounds are bound up in tannins and structure and haven't yet opened up. Decanting or several more years in the cellar often reveals extraordinary wine underneath.",
      },
      {
        id: "tt-q4",
        question: "Which of the following best describes 'body' in wine?",
        options: [
          "The wine's color intensity, from pale to deep purple",
          "The weight and texture of the wine in your mouth, influenced mainly by alcohol",
          "The number of different flavors detectable in a single glass",
          "How many years the wine has been aged before release",
        ],
        correctIndex: 1,
        explanation:
          "Body refers to the weight and viscosity of wine on the palate — primarily driven by alcohol level, with higher-alcohol wines feeling fuller and richer. Think of comparing skim milk (light body) to whole milk (full body).",
      },
      {
        id: "tt-q5",
        question:
          "A 'primary' aroma in wine most accurately refers to:",
        options: [
          "The most important and highest-quality aroma in the wine",
          "Aromas that come directly from the grape variety itself — fruit, floral, and herbal notes",
          "Aromas developed during fermentation from yeast activity",
          "Aromas acquired from oak barrel aging — vanilla, toast, cedar",
        ],
        correctIndex: 1,
        explanation:
          "Primary aromas come from the grape itself — the varietal character, like Sauvignon Blanc's gooseberry or Gewürztraminer's lychee. Secondary aromas come from fermentation; tertiary from aging.",
      },
    ],
  },

  // ── QUIZ 9: Wine Labels & Scores ─────────────────────────────────────────────
  {
    id: "wine-labels-scores",
    title: "Wine Labels & Scores",
    description:
      "Can you decode the information on a wine label? Do you know what wine scores mean — and what they don't? Let's find out.",
    guideId: "reading-wine-labels",
    questions: [
      {
        id: "ls-q1",
        question: "A French wine labeled 'Gevrey-Chambertin' tells you primarily:",
        options: [
          "The grape variety (Gevrey Chambertin is a French red grape)",
          "That the wine comes from the village of Gevrey-Chambertin in Burgundy and is made from Pinot Noir",
          "That the wine was awarded a gold medal at a regional competition",
          "That it's a blend of multiple grape varieties from different regions",
        ],
        correctIndex: 1,
        explanation:
          "Old World labels prioritize place over grape — Gevrey-Chambertin is a village in Burgundy where only Pinot Noir is permitted. Knowing the appellation tells you the grape, the style, and the quality standards.",
      },
      {
        id: "ls-q2",
        question: "In the United States, if a wine label states a grape variety (e.g., 'Merlot'), what is the minimum percentage of that grape the wine must contain?",
        options: ["51%", "75%", "85%", "100%"],
        correctIndex: 1,
        explanation:
          "US regulations require at least 75% of the stated variety (Oregon raises this to 90%). This means a California 'Merlot' could legally contain up to 25% of other grapes — worth keeping in mind.",
      },
      {
        id: "ls-q3",
        question: "What does 'NV' (Non-Vintage) on a Champagne label mean?",
        options: [
          "The wine is of lower quality and not suitable for aging",
          "The wine was made without any added sulfites",
          "The wine is a blend of multiple years, creating a consistent house style",
          "The vintage was too poor to be declared, so no date is shown",
        ],
        correctIndex: 2,
        explanation:
          "NV Champagne is intentionally blended across multiple years to achieve a consistent 'house style' — this is a deliberate art form, not a compromise. The blending process itself is extraordinarily skilled.",
      },
      {
        id: "ls-q4",
        question: "Robert Parker's 100-point wine scale considers scores above which threshold as 'outstanding'?",
        options: ["80 points", "85 points", "90 points", "95 points"],
        correctIndex: 2,
        explanation:
          "On Parker's (and most major critics') 100-point scale, 90+ indicates outstanding quality, 85-89 is very good, 80-84 is good. Scores below 80 rarely appear in major publications.",
      },
      {
        id: "ls-q5",
        question:
          "In Spain, what does 'Gran Reserva' on a Rioja label guarantee about the wine?",
        options: [
          "The wine was made from a single grand cru vineyard plot",
          "The wine has aged for a minimum of 5 years (at least 18 months in oak, the rest in bottle)",
          "The wine contains the highest legally permitted concentration of Tempranillo",
          "The wine was awarded a gold medal at the national wine competition",
        ],
        correctIndex: 1,
        explanation:
          "Rioja Gran Reserva has strict legal aging requirements — minimum 5 years total (at least 18 months in oak barrel plus 36 months in bottle) — ensuring substantial complexity and development before release.",
      },
    ],
  },

  // ── QUIZ 10: World Wine Explorer ─────────────────────────────────────────────
  {
    id: "world-wine-explorer",
    title: "World Wine Explorer",
    description:
      "How wide is your wine world? This quiz takes you from Georgia to New Zealand, Chile to Lebanon — testing your geography, history, and general wine knowledge.",
    questions: [
      {
        id: "ww-q1",
        question:
          "Archaeological evidence suggests wine was first made approximately 8,000 years ago in which country?",
        options: ["France", "Italy", "Georgia", "Egypt"],
        correctIndex: 2,
        explanation:
          "Remains of winemaking in clay vessels (qvevri) found in the Caucasus region of Georgia date back to approximately 6000 BCE, making it the oldest confirmed wine culture in the world.",
      },
      {
        id: "ww-q2",
        question:
          "Malbec was a minor blending grape in Bordeaux before finding its true home in which country, where altitude and sunshine transformed it into a star?",
        options: ["Chile", "Argentina", "South Africa", "Australia"],
        correctIndex: 1,
        explanation:
          "Argentina's Mendoza region — at high altitude in the Andes foothills — turned Malbec into one of the world's most popular red varieties, offering lush dark fruit and velvety texture at excellent value.",
      },
      {
        id: "ww-q3",
        question: "New Zealand's Marlborough region revolutionized global wine with which style?",
        options: [
          "World-class Pinot Noir rivaling Burgundy",
          "Pungent, intensely aromatic Sauvignon Blanc",
          "Cool-climate Riesling in the Mosel tradition",
          "Rich, barrel-fermented Chardonnay",
        ],
        correctIndex: 1,
        explanation:
          "Cloudy Bay's 1985 debut practically invented a global category — Marlborough Sauvignon Blanc's gooseberry, passionfruit intensity became one of wine's most recognizable and widely imitated styles.",
      },
      {
        id: "ww-q4",
        question:
          "Château Musar, one of Lebanon's most celebrated wineries, makes its red blend from which unusual combination of grapes?",
        options: [
          "Cabernet Sauvignon and Chardonnay",
          "Grenache, Syrah, and Mourvèdre",
          "Cabernet Sauvignon, Cinsault, and Carignan",
          "Nebbiolo, Sangiovese, and Barbera",
        ],
        correctIndex: 2,
        explanation:
          "Château Musar's legendary red blends Cabernet Sauvignon with traditional southern French varieties Cinsault and Carignan — an unusual combination that produces wines of extraordinary complexity that age magnificently for decades.",
      },
      {
        id: "ww-q5",
        question:
          "What makes the Finger Lakes region of New York State able to grow cold-sensitive European grape varieties like Riesling and Gewürztraminer?",
        options: [
          "Specially developed frost-resistant hybrid vine rootstocks",
          "Deep, narrow glacial lakes that moderate temperatures and prevent killing winter frosts",
          "Underground geothermal heating that keeps vine roots warm year-round",
          "A warm ocean current from the Gulf Stream that moderates the local climate",
        ],
        correctIndex: 1,
        explanation:
          "The deep Finger Lakes — formed by glaciers thousands of years ago — store summer warmth and release it in autumn, preventing the killing spring and autumn frosts that would otherwise make European varieties impossible to grow.",
      },
    ],
  },
];
