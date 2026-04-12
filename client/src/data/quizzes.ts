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
  // ── QUIZ 1: Terroir ─────────────────────────────────────────────────────────
  {
    id: "terroir-quiz",
    title: "What is Terroir?",
    description:
      "Soil, climate, aspect, altitude — how well do you understand the invisible forces that shape every great wine?",
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

  // ── QUIZ 8: How to Taste Wine ────────────────────────────────────────────────
  {
    id: "how-to-taste-quiz",
    title: "How to Taste Wine Like You Mean It",
    description:
      "Finish, body, tannin, primary aromas — this quiz tests the sensory vocabulary and systematic approach you need to evaluate any wine with confidence.",
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

  // ── QUIZ 9a: Reading a Wine Label ────────────────────────────────────────────
  {
    id: "reading-labels-quiz",
    title: "Reading a Wine Label",
    description:
      "From Old World appellations to New World varietal labelling — this quiz tests whether you can decode what a label actually tells you (and what it doesn't).",
    guideId: "reading-wine-labels",
    questions: [
      {
        id: "rl-q1",
        question: "What is the fundamental difference between how most French or Italian wines are labelled compared to most Australian or American wines?",
        options: [
          "French and Italian labels always show the alcohol percentage in larger type",
          "Australian and American labels lead with the grape variety; French and Italian labels lead with the region or appellation",
          "Australian and American wines don't need to include a vintage year",
          "French and Italian labels are required by law to display a quality medal",
        ],
        correctIndex: 1,
        explanation:
          "Old World labelling assumes you know that 'Gevrey-Chambertin' means Pinot Noir from Burgundy. New World labelling assumes you don't — so it tells you the grape variety upfront. Two different philosophies for two different audiences.",
      },
      {
        id: "rl-q2",
        question: "A Bordeaux label reads 'Mis en bouteille au château.' What does this phrase tell you?",
        options: [
          "The château grew the grapes, made the wine, and bottled it on site — an indication of full producer control",
          "The wine was aged for the maximum permitted time in the château's cellars",
          "The wine was blended from the château's oldest vines, planted before 1945",
          "The label was officially approved by the château's owner before printing",
        ],
        correctIndex: 0,
        explanation:
          "'Estate bottled' (mis en bouteille au château) means the château controlled the entire process — from growing to bottling. This is significant because it signals full traceability and quality commitment, as opposed to wines bottled by a négociant elsewhere.",
      },
      {
        id: "rl-q3",
        question: "What does the vintage year printed on a wine label actually tell you?",
        options: [
          "The year the wine was commercially released for sale",
          "The year the winery was founded or first produced wine",
          "The year barrel ageing began",
          "The year the grapes were grown and harvested",
        ],
        correctIndex: 3,
        explanation:
          "The vintage is always the harvest year — the year the grapes were picked. Since grape ripeness varies dramatically year to year (especially in variable climates like Bordeaux or Burgundy), the vintage is one of the most important pieces of information on the label.",
      },
      {
        id: "rl-q4",
        question: "'Reserve' appears on a California Chardonnay label. In most New World wine countries, what does this term legally guarantee?",
        options: [
          "Nothing specific — 'Reserve' is unregulated in most New World countries and means different things to different producers",
          "The wine was aged for a minimum of 24 months in American oak barrels",
          "The wine was produced from the winery's oldest estate-grown vines only",
          "The wine received a gold medal at an officially recognised wine competition",
        ],
        correctIndex: 0,
        explanation:
          "In countries like the US, Australia, and New Zealand, 'Reserve' has no legal definition. A producer can put it on any wine they choose. Some use it meaningfully; others use it as marketing. Compare this to Spain's Reserva, which IS legally defined.",
      },
      {
        id: "rl-q5",
        question: "An Italian wine label reads 'Brunello di Montalcino DOCG.' What does the DOCG designation indicate?",
        options: [
          "The wine was aged in oak barrels for a minimum of ten years before release",
          "It is a blended wine from multiple approved regions across central Italy",
          "The wine received a gold medal at Italy's national competition",
          "Italy's highest quality classification tier, with specific production rules and mandatory government tasting approval before sale",
        ],
        correctIndex: 3,
        explanation:
          "DOCG (Denominazione di Origine Controllata e Garantita) is Italy's highest classification — stricter than DOC, with compulsory tasting by an official government panel before every wine can be released. Brunello di Montalcino was one of the first to receive this status.",
      },
    ],
  },

  // ── QUIZ 9b: Understanding Wine Scores ───────────────────────────────────────
  {
    id: "wine-scores-quiz",
    title: "Understanding Wine Scores",
    description:
      "Parker, Jancis, Wine Spectator — who invented what, what the numbers really mean, and why a 92 and a 93 might not be as different as they sound.",
    guideId: "understanding-wine-scores",
    questions: [
      {
        id: "sc-q1",
        question: "The 100-point wine scoring system was popularised by which American critic, whose palate and publications transformed the global wine market from the 1980s?",
        options: [
          "Hugh Johnson — the British author of the World Atlas of Wine",
          "Michael Broadbent — Christie's head of wine and legendary blind taster",
          "Robert Parker — the Maryland lawyer turned independent critic who founded The Wine Advocate",
          "James Suckling — longtime Wine Spectator editor based in Italy",
        ],
        correctIndex: 2,
        explanation:
          "Robert Parker applied the 100-point system (borrowed from the American school grading scale) to wine in his newsletter The Wine Advocate. His outsized influence meant wineries began making wines to please his palate — for better and worse.",
      },
      {
        id: "sc-q2",
        question: "On the Parker / Wine Spectator 100-point scale, why do scores below 80 almost never appear in publications?",
        options: [
          "Most publications focus on recommendable wines — reviewing and scoring poor wines provides no useful guidance to readers",
          "Critics consider 80 the legal minimum score a wine must achieve to be exported internationally",
          "Wines below 80 are automatically disqualified from importation in major markets",
          "The scale runs from 80-100 by design — lower numbers are not used",
        ],
        correctIndex: 0,
        explanation:
          "Publications exist to guide readers toward wines worth buying. Spending column inches on mediocre wines serves no one. The effective floor of 80 means what looks like a narrow 80-100 scale actually covers the full range of commercially serious wines.",
      },
      {
        id: "sc-q3",
        question: "Jancis Robinson MW, one of Britain's most respected wine authorities, uses a different scoring system. What is it?",
        options: [
          "A five-star system adapted from restaurant and hotel reviews",
          "A 20-point scale inherited from the academic Oxford tasting tradition",
          "A buy/hold/sell recommendation system with no numerical scores at all",
          "A 50-point scale designed to give her more nuance than the 100-point version",
        ],
        correctIndex: 1,
        explanation:
          "Robinson uses the 20-point Oxford scale — her scores run from 12 (faulty) to 20 (perfect), with 17+ indicating an outstanding wine. It's a more compressed, academic system that resists the false precision of the 100-point scale.",
      },
      {
        id: "sc-q4",
        question: "Which of the following is the most widely cited criticism of numerical wine scores?",
        options: [
          "They unfairly advantage European wines over New World wines in international competition",
          "They make wine so expensive that ordinary consumers can no longer afford good bottles",
          "They discourage producers from experimenting with unusual or unconventional wine styles",
          "They imply a false objectivity — a single number suggests precision in something that is inherently subjective and context-dependent",
        ],
        correctIndex: 3,
        explanation:
          "Scoring wine to the point (e.g. 92 vs 93) implies a level of scientific precision that doesn't exist. Wine tasted cold vs. warm, with or without food, in different moods — will score differently. Critics themselves can score the same wine 5+ points apart.",
      },
      {
        id: "sc-q5",
        question: "When a major wine publication awards a wine 92 points, this generally indicates:",
        options: [
          "A technically correct but unremarkable wine suitable for everyday occasions",
          "A wine with some interesting qualities but with noticeable flaws that reduce its score",
          "An outstanding wine of distinct character, well worth seeking out and likely to reward cellaring",
          "A wine that should be drunk immediately and will not improve with further ageing",
        ],
        correctIndex: 2,
        explanation:
          "On the 100-point scale, 90-94 indicates an outstanding wine — complex, characterful, and highly recommended. 95-100 is reserved for extraordinary or historic wines. 85-89 is very good; 80-84 is sound and pleasant. 92 points is a serious endorsement.",
      },
    ],
  },

  // ── QUIZ 9c: Wine and Food Pairing ───────────────────────────────────────────
  {
    id: "wine-pairing-quiz",
    title: "Wine and Food: The Art of Pairing",
    description:
      "More than rules — pairing is about balance, contrast, and the magic that happens when wine and food make each other taste better.",
    guideId: "wine-and-food-pairing",
    questions: [
      {
        id: "wp-q1",
        question: "The classic pairing principle 'what grows together goes together' means:",
        options: [
          "Wines and food should only be paired if they were produced in the same calendar year",
          "Wines should be matched only with food that shares the same primary ingredient",
          "Regional wines and regional cuisines make natural partners because they evolved alongside each other over centuries",
          "Only wines grown in warm climates should be paired with warm food, and vice versa",
        ],
        correctIndex: 2,
        explanation:
          "Centuries of culinary tradition are on your side here. Tuscan Sangiovese's high acidity was shaped to cut through the olive oil-rich food of the region. Alsatian Riesling's sweetness and spice echoes the region's Germanic-French cuisine. Trust the geography.",
      },
      {
        id: "wp-q2",
        question: "Why does a full-bodied tannic red like Cabernet Sauvignon pair so successfully with a fatty ribeye steak?",
        options: [
          "The fat in the meat softens the wine's tannins, while the tannins cut through the richness — the two elements balance each other perfectly",
          "The wine's fruit sweetness balances the salt added to the steak's seasoning",
          "Red wines contain enzymes that help the digestive system process red meat",
          "The alcohol in the wine raises the steak's temperature slightly, improving the eating experience",
        ],
        correctIndex: 0,
        explanation:
          "This is a classic contrast pairing: tannins grip proteins and fat, making the wine taste smoother and the meat taste less heavy. The fat dissolves the tannin structure; the tannin cuts the fat. It's a two-way street of balance.",
      },
      {
        id: "wp-q3",
        question: "A crisp, high-acid white wine would be the most natural partner for which dish?",
        options: [
          "A slow-braised short rib with rich red wine reduction sauce",
          "A chocolate fondant with salted caramel",
          "A grilled sea bass with lemon and herbs, or freshly shucked oysters",
          "A creamy mushroom risotto finished with aged Parmesan and truffle oil",
        ],
        correctIndex: 2,
        explanation:
          "Acid in wine mirrors the acidity and brightness in seafood — lemon, brine, freshness. The pairing doesn't fight; it amplifies. A crisp Muscadet, Chablis, or Picpoul de Pinet with oysters is one of wine's simplest and most satisfying pleasures.",
      },
      {
        id: "wp-q4",
        question: "Why is it generally a mistake to serve a dry, austere red wine alongside a sweet dessert?",
        options: [
          "The wine's colour clashes visually with most desserts",
          "The alcohol content of red wines is always too high to serve alongside sugar",
          "The sweetness of the dessert makes the dry wine taste harsh, bitter, and sour by stark comparison",
          "Dry red wines are always served at the wrong temperature to complement sweet dishes",
        ],
        correctIndex: 2,
        explanation:
          "A dessert should never be sweeter than the wine served with it. If the food is sweeter, the wine tastes thin, acidic, and aggressive. This is why the classic pairing for dessert is a wine that is at least as sweet as the dish — Sauternes with tarte tatin, Port with chocolate.",
      },
      {
        id: "wp-q5",
        question: "Why does a glass of dry Champagne or sparkling wine work so beautifully with fried food like tempura, fish and chips, or fried chicken?",
        options: [
          "Both the bubbles in the wine and the crunch of the fried coating share a textural similarity",
          "The high acidity and persistent bubbles cut through fat and cleanse the palate between each bite, keeping the food tasting fresh",
          "Sparkling wines have a lower calorie count that nutritionally balances the richness of fried food",
          "Champagne's sweetness masks the greasiness that fried food often leaves on the palate",
        ],
        correctIndex: 1,
        explanation:
          "Acid and bubbles are natural palate cleansers. After a bite of battered, fried fish, a sip of Champagne scrubs your palate clean — the CO2 physically lifts fat from your taste receptors. It's why this unlikely pairing tastes so right.",
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

  // ── QUIZ 11: Vintage Knowledge Quiz ─────────────────────────────────────────
  {
    id: "vintage-knowledge-quiz",
    title: "Vintage Knowledge Quiz",
    description:
      "How well do you know your great vintages? Test your knowledge of the years that produced legendary wines — and the conditions that made them special.",
    guideId: "vintage-variation",
    questions: [
      {
        id: "vk-q1",
        question: "Which of the following is widely considered one of the greatest Bordeaux vintages of the modern era for its extraordinary structure and freshness?",
        options: [
          "2003 (the famous heatwave year)",
          "2010",
          "2007",
          "2001",
        ],
        correctIndex: 1,
        explanation:
          "The 2010 Bordeaux vintage is celebrated for combining richness with exceptional freshness and acidity — a counterpoint to the opulent 2009. Many critics consider it the finest Bordeaux vintage of the modern era for its classical structure and extraordinary aging potential.",
      },
      {
        id: "vk-q2",
        question: "What does 'NV' on a Champagne label indicate about the wine's vintage?",
        options: [
          "The vintage was poor, so no date was declared",
          "The wine is a blend of multiple harvest years to achieve a consistent house style",
          "The wine was made from non-vinifera grape varieties",
          "It stands for 'Natural Vintage' — farmed without intervention",
        ],
        correctIndex: 1,
        explanation:
          "NV (Non-Vintage) Champagne is intentionally blended from multiple years using reserve wines, creating the house's consistent flavor profile regardless of annual variation. It's an art form in itself — not a compromise.",
      },
      {
        id: "vk-q3",
        question: "In Burgundy, which recent vintage is celebrated for producing Pinot Noir and Chardonnay of extraordinary richness and depth?",
        options: ["2011", "2013", "2015", "2008"],
        correctIndex: 2,
        explanation:
          "The 2015 Burgundy vintage produced wines of remarkable concentration, depth, and balance — one of the most celebrated in recent decades. The 2019 is its nearest rival in the current era.",
      },
      {
        id: "vk-q4",
        question: "Which climatic event most commonly threatens a harvest in cool-climate regions like Chablis and Champagne?",
        options: [
          "Extended summer drought causing vine shutdown",
          "Late spring frosts after bud break, destroying young shoots",
          "Coastal fog blocking essential sunlight in July and August",
          "Excessive summer heat causing grapes to over-ripen",
        ],
        correctIndex: 1,
        explanation:
          "Spring frosts after bud break are a constant existential threat in cool-climate regions. Once the vine has sprouted, a single frost night can destroy the entire year's potential crop — a risk that drives significant investment in frost protection systems.",
      },
      {
        id: "vk-q5",
        question: "In warm, consistent wine-producing regions like much of California and South Australia, why does vintage variation tend to matter less to everyday wine buyers?",
        options: [
          "These regions use technology to standardize wine chemistry regardless of harvest conditions",
          "The consistent warm climate produces reliably ripe fruit each year, with far less dramatic variation than cooler European regions",
          "Wine from these regions is blended from multiple vintages before bottling, regardless of the label date",
          "Vintage variation only affects white wine, not red wine styles common in these regions",
        ],
        correctIndex: 1,
        explanation:
          "Warm, consistent climates produce reliably ripe fruit without the dramatic swings between cool, wet years and warm, dry years that define vintage character in places like Burgundy or the Mosel. This consistency is a feature for everyday wine but reduces the excitement of vintage variation.",
      },
    ],
  },

  // ── QUIZ 12: Winemaking Process Quiz ─────────────────────────────────────────
  {
    id: "winemaking-process-quiz",
    title: "Winemaking Process Quiz",
    description:
      "From harvest to bottling, do you understand what actually happens inside the winery? Test your knowledge of the decisions that turn grapes into wine.",
    guideId: "winemaking",
    questions: [
      {
        id: "wp-q1",
        question: "What is malolactic fermentation, and what flavor change does it produce in white wines like Chardonnay?",
        options: [
          "A second sugar fermentation that increases alcohol and adds a fruity sweetness",
          "A bacterial process that converts sharp malic acid to softer lactic acid, producing buttery, creamy notes",
          "A clarification process using egg whites that removes harsh tannins",
          "Cold stabilization that precipitates tartaric acid crystals before bottling",
        ],
        correctIndex: 1,
        explanation:
          "Malolactic fermentation (MLF) converts tart malic acid to softer lactic acid via bacteria — the same transformation that gives yogurt its creamy texture. In Chardonnay, MLF produces diacetyl (the compound that smells of butter), creating the rich, creamy, buttery style associated with many barrel-fermented Chardonnays.",
      },
      {
        id: "wp-q2",
        question: "What is the primary difference between using wild (native) yeast versus cultured yeast in fermentation?",
        options: [
          "Wild yeast produces more alcohol; cultured yeast produces less",
          "Wild yeast fermentations are riskier but can produce more complex, terroir-expressive wines; cultured yeast is reliable and predictable",
          "Cultured yeast can only be used for red wine fermentation",
          "Wild yeast adds sulfur dioxide naturally; cultured yeast does not",
        ],
        correctIndex: 1,
        explanation:
          "Wild yeasts — native to the vineyard and winery — ferment more slowly and unpredictably, with risk of stuck fermentation or off-flavors. But when they work well, they're celebrated for producing wines with greater complexity, site specificity, and character that cultured yeasts cannot replicate.",
      },
      {
        id: "wp-q3",
        question: "In red winemaking, what is maceration and why does it matter?",
        options: [
          "Filtering the wine through a membrane to remove particles before bottling",
          "Leaving the juice in contact with grape skins during fermentation to extract color, tannins, and flavor",
          "Blending wines from different grape varieties before final bottling",
          "Chilling the wine rapidly after fermentation to preserve fresh fruit aromas",
        ],
        correctIndex: 1,
        explanation:
          "Maceration is the contact between juice and grape skins during fermentation — it's what makes red wine red, extracting anthocyanin pigments, tannins, and flavor compounds from the skins. Longer, more aggressive maceration produces darker, more tannic wines; gentler, shorter maceration produces lighter, more fruit-forward styles.",
      },
      {
        id: "wp-q4",
        question: "Which aging vessel is described as 'inert' — adding no flavor to the wine — making it ideal for preserving fresh fruit aromatics?",
        options: [
          "New French oak barrique (225-liter barrel)",
          "Old large-format oak foudre",
          "Stainless steel tank",
          "New American oak barrel",
        ],
        correctIndex: 2,
        explanation:
          "Stainless steel is chemically inert: it neither adds flavor nor allows the micro-oxygenation that occurs in oak or clay vessels. This makes it ideal for wines where fresh, primary fruit aromatics — like Sauvignon Blanc, crisp Pinot Grigio, or young Riesling — are the point.",
      },
      {
        id: "wp-q5",
        question: "What are the three structural elements in wine that most determine its aging potential?",
        options: [
          "Color, clarity, and body",
          "Temperature, humidity, and cellar age at bottling",
          "Acidity, tannin, and residual sugar (or extract)",
          "Oak influence, alcohol level, and grape variety",
        ],
        correctIndex: 2,
        explanation:
          "High acidity, firm tannins, and significant extract (or residual sugar in sweet wines) are the structural pillars of age-worthy wine. Acidity preserves freshness; tannins slowly polymerize and soften over time; extract provides the richness that supports long development. Without these elements, wine simply fades rather than evolves.",
      },
    ],
  },

  // ── QUIZ 13: Wine Classifications Quiz ───────────────────────────────────────
  {
    id: "wine-classifications-quiz",
    title: "Wine Classifications Quiz",
    description:
      "From Bordeaux's 1855 rankings to Italy's DOCG — do you understand the classification systems that underpin fine wine? Test yourself here.",
    guideId: "classifications",
    questions: [
      {
        id: "wc-q1",
        question: "The 1855 Bordeaux Classification ranked châteaux into how many 'Growths' (Crus), and which châteaux are currently classified as Premier Cru Classé?",
        options: [
          "Three growths; Lafite, Latour, Margaux, and Pichon Baron",
          "Five growths; Lafite, Latour, Margaux, Haut-Brion, and Mouton Rothschild",
          "Five growths; Lafite, Latour, Margaux, Léoville-Las Cases, and Haut-Brion",
          "Four growths; Lafite, Latour, Pétrus, and Mouton Rothschild",
        ],
        correctIndex: 1,
        explanation:
          "The 1855 Classification has five tiers (growths). The five Premier Cru Classé estates are Lafite Rothschild, Latour, Margaux, Haut-Brion (the only Graves estate in the original list), and Mouton Rothschild — which was elevated from Second to First Growth in 1973, the only change in 170 years.",
      },
      {
        id: "wc-q2",
        question: "In Burgundy, what is a 'Grand Cru' designation, and approximately what percentage of total Burgundy production does it represent?",
        options: [
          "A prestigious producer cooperative; represents about 10% of production",
          "The highest vineyard classification in Burgundy; represents about 1% of total production",
          "A regional designation for wines from the Cote d'Or; represents about 30% of production",
          "An aging classification requiring minimum 5 years in barrel; represents about 5% of production",
        ],
        correctIndex: 1,
        explanation:
          "Grand Cru is Burgundy's highest vineyard designation — just 33 vineyards hold it, covering a tiny fraction of the region's total area and producing roughly 1% of Burgundy's wine. This extraordinary scarcity, combined with the wines' reputation, is why Grand Cru Burgundy commands some of the world's highest prices.",
      },
      {
        id: "wc-q3",
        question: "Italy's Super Tuscans (Sassicaia, Tignanello, Ornellaia) are often labeled as IGT despite being among Italy's most prestigious and expensive wines. Why?",
        options: [
          "These wines intentionally downgrade their classification for marketing reasons",
          "They were made from international varieties or using methods not permitted under DOC rules when first produced",
          "IGT is actually Italy's highest quality designation, equivalent to France's Grand Cru",
          "The producers refused Demeter biodynamic certification, making them ineligible for higher classifications",
        ],
        correctIndex: 1,
        explanation:
          "When pioneering Tuscan producers planted Cabernet Sauvignon and used new French oak barrels, these practices fell outside existing DOC regulations. So world-class wines like Sassicaia and Tignanello were labeled as humble Vino da Tavola (later IGT) — the classification system simply hadn't caught up with their ambitions.",
      },
      {
        id: "wc-q4",
        question: "In Germany, the VDP (Verband Deutscher Prädikatsweinüter) uses a quality hierarchy for dry wines. What is the top designation, equivalent to a Grand Cru?",
        options: [
          "Trockenbeerenauslese",
          "Kabinett",
          "Grosses Gewächs",
          "Erste Lage",
        ],
        correctIndex: 2,
        explanation:
          "Grosses Gewächs (GG) is the VDP's top tier for dry wines — always from a single, named Grand Cru vineyard site. It's the German equivalent of Burgundy's Grand Cru, and a Mosel or Rheingau Riesling GG from a top estate is among the finest dry whites in the world.",
      },
      {
        id: "wc-q5",
        question: "What is the key difference between how European wine classification systems and New World systems like the US AVA define quality?",
        options: [
          "European systems are voluntary while New World systems are mandatory",
          "European systems define specific rules (permitted grapes, yields, production methods) within geographic boundaries; New World systems primarily just define geographic boundaries without prescribing production methods",
          "New World systems are more rigorous because they require independent tasting panels before wines can be released",
          "There is no meaningful difference — both systems serve the same function of guaranteeing quality",
        ],
        correctIndex: 1,
        explanation:
          "European appellations encode rules about grape varieties, yields, ripeness levels, and winemaking methods — the appellation guarantees a style as well as an origin. An AVA in California defines geographic boundaries only: what grapes are grown, how the wine is made, and what the wine tastes like are entirely the producer's decision.",
      },
    ],
  },

  // ── QUIZ 14: Wine Service Quiz ────────────────────────────────────────────────
  {
    id: "wine-service-quiz",
    title: "Wine Service Quiz",
    description:
      "Temperature, decanting, glassware, restaurant etiquette — do you know how to serve wine to get the most out of it? Let's find out.",
    guideId: "wine-service",
    questions: [
      {
        id: "ws-q1",
        question: "What is the ideal serving temperature for a full-bodied red wine like Bordeaux or Barolo?",
        options: [
          "8–10°C (chilled, like a white wine)",
          "15–17°C (cool room temperature)",
          "17–18°C (slightly below typical room temperature)",
          "22–24°C (typical heated room temperature)",
        ],
        correctIndex: 2,
        explanation:
          "Full-bodied reds are best at 17–18°C — slightly cooler than a modern heated room (22–24°C). Serving reds too warm makes the alcohol seem harsh and suppresses delicate aromatics. A quick 20-minute chill in the fridge brings most reds to the right temperature before serving.",
      },
      {
        id: "ws-q2",
        question: "Decanting serves two distinct purposes. Which of the following correctly identifies both?",
        options: [
          "To chill the wine quickly and to add oxygen before serving",
          "To remove sediment from old wines and to aerate young tannic wines",
          "To remove tannins from young wines and to add flavor from the decanter",
          "To warm cold wines and to filter out natural sulfites",
        ],
        correctIndex: 1,
        explanation:
          "Decanting does two distinct jobs: it separates sediment (important for old wines and vintage Port) and aerates young, tannic wines (exposing them to oxygen softens tannins and opens up aromatics). Different wines need different approaches — old wines should be decanted carefully and drunk promptly; young reds can breathe for hours.",
      },
      {
        id: "ws-q3",
        question: "Why is a large bowl typically preferred for Burgundy-style Pinot Noir glasses over a taller, narrower Bordeaux-style glass?",
        options: [
          "Burgundy is always served at a lower temperature, and the larger bowl keeps it cooler",
          "Pinot Noir is higher in alcohol than Cabernet, requiring more space for vapors to dissipate",
          "The wide bowl allows vigorous swirling to capture and concentrate Pinot Noir's delicate, complex aromatics",
          "A larger bowl is required because Burgundy is traditionally served in larger pours",
        ],
        correctIndex: 2,
        explanation:
          "Pinot Noir's aromatics are delicate and complex — they need room to develop and be captured. The broad Burgundy bowl allows generous swirling without spillage, concentrating fragile cherry, earth, and floral notes in the glass. The slightly narrower rim then focuses those aromas as you bring it to your nose.",
      },
      {
        id: "ws-q4",
        question: "When tasting a wine in a restaurant before it's served to the table, what are you actually being asked to evaluate?",
        options: [
          "Whether the wine meets your personal taste preferences and you'd like to order something different",
          "Whether the wine is free from faults (particularly cork taint) — not whether you like the style",
          "Whether the wine has been stored correctly and is at the right temperature",
          "Whether the vintage matches the label and the wine hasn't been substituted",
        ],
        correctIndex: 1,
        explanation:
          "The restaurant tasting ritual is a quality check for faults, not a style approval. You're smelling and tasting for cork taint (musty, wet cardboard), oxidation, or other defects. If the wine smells clean and is technically correct, approve it — even if you'd have chosen a different style. Sending back a perfectly sound wine you simply don't love is bad form.",
      },
      {
        id: "ws-q5",
        question: "An old Burgundy (20+ years) is opened for a special dinner. What decanting approach is most appropriate?",
        options: [
          "Decant 2–3 hours in advance to allow full aeration and tannin softening",
          "Do not decant at all — pour directly from the bottle into the glass slowly",
          "Decant gently just before serving to remove sediment, then pour and drink promptly",
          "Decant overnight in the refrigerator to allow slow, cold aeration",
        ],
        correctIndex: 2,
        explanation:
          "Old wines are fragile — their tertiary aromatics (dried flowers, forest floor, tobacco, leather) are volatile and can fade within minutes of excessive air exposure. Decant gently to separate sediment, then serve immediately. Over-decanting an old wine is one of the most heartbreaking things you can do to it.",
      },
    ],
  },

  // ── QUIZ 15: Wine Faults Quiz ─────────────────────────────────────────────────
  {
    id: "wine-faults-quiz",
    title: "Wine Faults Quiz",
    description:
      "Would you recognize a corked wine? Know when to send it back and when you're just encountering something unfamiliar? Test your fault-spotting skills.",
    guideId: "wine-faults",
    questions: [
      {
        id: "wf-q1",
        question: "Cork taint (TCA) in a wine most commonly produces which aroma?",
        options: [
          "A sharp vinegar or nail polish remover smell",
          "A musty, damp basement or wet cardboard smell",
          "A barnyard or horse sweat character",
          "A struck match or burnt rubber smell",
        ],
        correctIndex: 1,
        explanation:
          "TCA (2,4,6-Trichloroanisole), the compound responsible for cork taint, produces an unmistakable musty, damp, wet cardboard smell that strips the wine of its fresh fruit character. Once you've experienced it, you'll recognize it immediately — and know to send the bottle back without hesitation.",
      },
      {
        id: "wf-q2",
        question: "A wine smells strongly of struck match or rubber when first opened, but the smell largely dissipates after 15 minutes in the glass. This is most likely:",
        options: [
          "Cork taint that has partially cleared due to contact with air",
          "Reduction — a reductive winemaking condition that often blows off with air exposure",
          "Volatile acidity that has converted to ethyl acetate in the glass",
          "Brettanomyces that is resolving itself at room temperature",
        ],
        correctIndex: 1,
        explanation:
          "Struck match and rubber notes are classic reduction (too little oxygen exposure during winemaking). Unlike most faults, reduction is often temporary and resolves with swirling and aeration. This is why sommeliers pour a small taste first — if the sulfur note blows off within minutes, it's not a fault that warrants returning the bottle.",
      },
      {
        id: "wf-q3",
        question: "Which of the following is definitively NOT a wine fault?",
        options: [
          "Cork taint producing a musty, cardboard aroma",
          "Tartrate crystals (white crystal deposits) found in a white wine",
          "Volatile acidity producing a vinegar-like sharpness",
          "Heat damage producing stewed fruit and prune aromas",
        ],
        correctIndex: 1,
        explanation:
          "Tartrate crystals are deposits of tartaric acid (cream of tartar) that have crystallized due to cold temperatures. They're completely harmless, tasteless, and natural — a sign the wine hasn't been cold-stabilized through filtration. Some people actually see them as a mark of less-processed wine.",
      },
      {
        id: "wf-q4",
        question: "Brettanomyces ('Brett') in wine is controversial because:",
        options: [
          "It only affects expensive wines, making it a sign of quality rather than a fault",
          "At low levels many wine drinkers find it complex and appealing; at high levels it's clearly unpleasant and overwhelms the wine",
          "It is only detectable by trained professionals and cannot be smelled by casual wine drinkers",
          "It adds the buttery, creamy quality that makes oaked Chardonnay so popular",
        ],
        correctIndex: 1,
        explanation:
          "Brett produces barnyard, leather, and saddle notes — at low levels these can be perceived as complexity and terroir character, especially in traditional Rhône wines. At high levels, the medicinal, band-aid quality becomes a fault that overwhelms all other character. The line between complex and unpleasant is intensely personal and debated.",
      },
      {
        id: "wf-q5",
        question: "A white wine opened at dinner appears significantly brown in color and smells flat and applesauce-like. This most likely indicates:",
        options: [
          "The wine is a naturally oxidized style like Sherry — correct and intentional",
          "Reduction from insufficient oxygen during winemaking",
          "Oxidation from excessive oxygen exposure, probably from a compromised closure or poor storage",
          "Brettanomyces, which causes color changes in white wine",
        ],
        correctIndex: 2,
        explanation:
          "Browning in white wine and flat, applesauce or sherry-like aromas are classic signs of oxidation. White wines brown just as cut apples do when exposed to air. A compromised cork, improper storage, or a wine left open too long are the usual culprits. Unlike Sherry, where oxidation is intentional, this is a fault in a conventional white wine.",
      },
    ],
  },

  // ── QUIZ: The World's Wine Styles ——————————————————————————──
  {
    id: "wine-styles-quiz",
    title: "The World's Wine Styles",
    description: "Test your knowledge of the major wine styles — from light reds to rich whites, sparkling, rosé, dessert, and fortified.",
    guideId: "wine-styles-explained",
    questions: [
      {
        id: "ws-q1",
        question: "Which of the following best describes a 'full-bodied' red wine?",
        options: [
          "Light in colour, high in acidity, low in tannins",
          "Sweet on the palate with low alcohol",
          "High in alcohol, rich in tannins, with a weighty mouthfeel",
          "Pale and delicate, best served chilled",
        ],
        correctIndex: 2,
        explanation: "Full-bodied reds — think Barossa Shiraz or Napa Cabernet — are defined by their weight on the palate, driven by higher alcohol, ripe tannins, and concentrated fruit. They pair beautifully with rich red meats.",
      },
      {
        id: "ws-q2",
        question: "What is the key characteristic that makes a white wine 'crisp'?",
        options: [
          "Extended oak ageing that adds vanilla and cream",
          "High residual sugar that balances the fruit",
          "Low alcohol that keeps the wine light and delicate",
          "High natural acidity that creates a mouth-watering freshness",
        ],
        correctIndex: 3,
        explanation: "'Crisp' refers to high natural acidity — the quality that makes your mouth water and gives wines like Chablis, Albariño, and Sauvignon Blanc their refreshing, zesty character.",
      },
      {
        id: "ws-q3",
        question: "How does rosé wine get its distinctive pink colour?",
        options: [
          "Through brief skin contact with red grape skins during fermentation",
          "By blending finished red and white wines together",
          "By adding natural fruit colouring during production",
          "By using a special pink grape variety found only in Provence",
        ],
        correctIndex: 0,
        explanation: "Rosé gets its colour from brief maceration — the grape skins are left in contact with the juice for hours (not days), extracting just enough pigment for that pink hue. The shorter the contact, the paler the wine.",
      },
      {
        id: "ws-q4",
        question: "What distinguishes a fortified wine from other wine styles?",
        options: [
          "It is always sweet and served as a dessert wine",
          "It is made from grapes grown at high altitude",
          "It is made from dried grapes to concentrate the sugar",
          "Grape spirit (brandy) is added during or after fermentation, raising alcohol to 15–22%",
        ],
        correctIndex: 3,
        explanation: "Fortification means adding neutral grape spirit to wine. In Port, this stops fermentation early, preserving natural sweetness. In Sherry, it is added after fermentation. The result is a wine with higher alcohol and remarkable longevity.",
      },
      {
        id: "ws-q5",
        question: "Traditional method sparkling wines (like Champagne) develop their bubbles through:",
        options: [
          "Fermentation using naturally carbonated spring water",
          "A secondary fermentation that takes place inside the sealed bottle",
          "Carbon dioxide being pumped into the wine before bottling",
          "Freezing the wine rapidly and then releasing the pressure",
        ],
        correctIndex: 1,
        explanation: "The traditional method (méthode champenoise) involves adding a small amount of sugar and yeast to the finished wine in a sealed bottle. The second fermentation produces CO2 that dissolves into the wine, creating those persistent, fine bubbles.",
      },
    ],
  },

  // ── QUIZ: A Brief History of Wine ———————————————————————──
  {
    id: "wine-history-quiz",
    title: "A Brief History of Wine",
    description: "From ancient Georgia to modern appellations — how well do you know wine's 8,000-year story?",
    guideId: "brief-history-of-wine",
    questions: [
      {
        id: "wh-q1",
        question: "Where is the oldest archaeological evidence of wine production, dating to around 6,000 BC?",
        options: [
          "Georgia, in the South Caucasus",
          "Egypt, along the Nile Delta",
          "Italy, in the Po Valley",
          "France, in the Rhone Valley",
        ],
        correctIndex: 0,
        explanation: "Georgia is considered the cradle of wine civilisation. Clay vessels (qvevri) found there show evidence of grape fermentation dating back approximately 8,000 years — making it the world's oldest known wine culture.",
      },
      {
        id: "wh-q2",
        question: "Which civilisation is most responsible for spreading viticulture throughout the Mediterranean world?",
        options: [
          "The Romans, through military conquest",
          "The Egyptians, through diplomatic gifts",
          "The Persians, through agricultural exchange",
          "The Greeks and Phoenicians, through trade networks",
        ],
        correctIndex: 3,
        explanation: "Greek and Phoenician traders planted vineyards wherever they established trading posts — southern France, Spain, Sicily, North Africa. The Romans later took these foundations and scaled viticulture across the entire empire.",
      },
      {
        id: "wh-q3",
        question: "The 1855 Bordeaux Classification ranked châteaux primarily on the basis of:",
        options: [
          "A blind tasting by a panel of expert sommeliers",
          "The age and size of their vineyards",
          "The price their wines historically commanded in the market",
          "Their proximity to the Gironde estuary",
        ],
        correctIndex: 2,
        explanation: "Napoleon III commissioned the classification for the Paris Exposition. Brokers ranked estates by the prices their wines consistently fetched — the market's verdict on quality. The classification has barely changed since, with Mouton Rothschild the only estate promoted (to First Growth) in 1973.",
      },
      {
        id: "wh-q4",
        question: "What was phylloxera, and why did it devastate European vineyards in the 19th century?",
        options: [
          "A root louse imported from North America that killed European vines by attacking their roots",
          "A fungal disease that rotted the grapes on the vine before harvest",
          "A severe frost event that wiped out most French vineyards",
          "A bacterial infection spread through infected winemaking equipment",
        ],
        correctIndex: 0,
        explanation: "Phylloxera vastatrix, a tiny aphid from North America, devastated European vineyards from the 1860s. American vines had evolved resistance; European vines had not. The solution: grafting European vines onto American rootstocks — a practice still used universally today.",
      },
      {
        id: "wh-q5",
        question: "What was the significance of the 1976 'Judgement of Paris' tasting?",
        options: [
          "It established the first official classification of Californian wines",
          "It settled a trade dispute between France and the United States over wine labelling",
          "California wines beat top French wines in a blind tasting judged by French experts",
          "It was the first tasting to use the 100-point scoring system",
        ],
        correctIndex: 2,
        explanation: "In Steven Spurrier's famous blind tasting, Californian Chardonnays and Cabernets outscored Burgundy and Bordeaux first growths — judged by French experts. It fundamentally changed the perception of New World wine and proved great wine wasn't exclusively European.",
      },
    ],
  },

  // ── QUIZ: Natural, Organic, Biodynamic ——————————————————──
  {
    id: "natural-wine-quiz",
    title: "Natural, Organic & Biodynamic",
    description: "Cut through the label confusion — test whether you know what these three terms actually mean in the vineyard and cellar.",
    guideId: "natural-organic-biodynamic",
    questions: [
      {
        id: "nw-q1",
        question: "Which of the following wine production terms is officially regulated by law with specific certification standards?",
        options: [
          "Natural wine",
          "Low-intervention wine",
          "Organic wine",
          "Minimal-sulphite wine",
        ],
        correctIndex: 2,
        explanation: "Organic certification is legally defined and regulated — in the EU, USDA, and other markets. 'Natural wine' has no legal definition or certification body, which is why the term means different things to different producers.",
      },
      {
        id: "nw-q2",
        question: "What is the Demeter certification used to identify?",
        options: [
          "Biodynamic farms and products that meet Rudolf Steiner's agricultural principles",
          "Wines made without any added sulphites",
          "Organic wines produced in the European Union",
          "Low-alcohol wines with certified reduced calorie content",
        ],
        correctIndex: 0,
        explanation: "Demeter is the international certification body for biodynamic agriculture, based on Rudolf Steiner's principles from the 1920s. It requires farms to be self-sustaining ecosystems, with specific practices around lunar cycles, composting, and biodiversity.",
      },
      {
        id: "nw-q3",
        question: "Biodynamic farming treats the vineyard as:",
        options: [
          "A scientific laboratory where inputs are carefully measured and controlled",
          "A commercial operation optimised for maximum yield per hectare",
          "A neutral environment where only the variety determines wine character",
          "A living, self-sustaining ecosystem guided by natural rhythms",
        ],
        correctIndex: 3,
        explanation: "Biodynamic farming, developed from Rudolf Steiner's philosophy, treats the farm as a single living organism. It emphasises biodiversity, the rejection of synthetic chemicals, and attunement to natural cycles — including lunar calendars for planting and harvesting.",
      },
      {
        id: "nw-q4",
        question: "Sulphites in wine primarily serve which purpose?",
        options: [
          "They add bitterness that balances residual sugar in sweet wines",
          "They give wine its colour by binding with anthocyanin pigments",
          "They act as preservatives that prevent oxidation and microbial spoilage",
          "They replace oak tannins in wines aged without barrels",
        ],
        correctIndex: 2,
        explanation: "Sulphur dioxide (SO2) is wine's most effective preservative — it inhibits oxidation and kills spoilage bacteria and wild yeasts. It occurs naturally during fermentation but is usually also added. Natural wine producers use minimal or no added sulphites, accepting shorter shelf lives.",
      },
      {
        id: "nw-q5",
        question: "What most accurately describes 'natural wine'?",
        options: [
          "Wine made with minimal intervention in vineyard and cellar, typically no additives or filtration",
          "Wine certified by an official natural wine organisation with strict legal standards",
          "Wine made exclusively from heirloom grape varieties not commercially cultivated",
          "Wine produced without any fermentation, preserving the natural grape juice",
        ],
        correctIndex: 0,
        explanation: "Natural wine is a philosophy, not a legal category. It typically means farming without synthetic chemicals, fermenting with wild yeasts only, and making no additions in the cellar — no cultured yeasts, fining agents, or heavy filtration. No SO2, or as little as possible.",
      },
    ],
  },
];
