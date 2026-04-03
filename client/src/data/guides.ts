export interface GuideSection {
  heading: string;
  content: string; // markdown-ish, 2-4 paragraphs per section, brand voice
}

export interface Guide {
  id: string;
  title: string;
  subtitle: string;
  category: "fundamentals" | "tasting" | "regions" | "culture";
  description: string;
  readTimeMinutes: number;
  icon: string;
  sections: GuideSection[];
  relatedJourneyIds: string[];
  relatedGrapeIds: string[];
  quizId?: string;
}

export const guides: Guide[] = [
  // ── GUIDE 1 ───────────────────────────────────────────────────────────────────
  {
    id: "what-is-terroir",
    title: "What is Terroir? The Soul of Wine",
    subtitle: "Why the same grape tastes completely different depending on where it grows",
    category: "fundamentals",
    description:
      "Terroir is French for 'a sense of place' — the idea that wine carries the fingerprint of the land it came from. This guide unpacks what that actually means, from soil chemistry to climate and the human factor.",
    readTimeMinutes: 8,
    icon: "terroir",
    sections: [
      {
        heading: "The Big Idea: Place Matters",
        content:
          "Here's a thought experiment: take Pinot Noir — one grape variety — and grow it in Burgundy, in California, in Oregon, in New Zealand's Central Otago, and in Germany's Baden region. You'll get five completely different wines. Same grape. Different places. Completely different results. Why? That's terroir.\n\nTerroir is a French word that has no precise English equivalent, which is either maddening or poetic depending on your temperament. It encompasses everything about a place that influences the wine growing there: the soil composition, the climate, the altitude, the aspect (which direction the vineyard faces), the proximity to water bodies, and — importantly — the accumulated human knowledge of how to work that particular piece of land. All of these factors leave fingerprints on the wine.\n\nFor a long time, critics outside France thought terroir was a romantic French concept designed to justify high prices. Then winemakers in California, Australia, and New Zealand started talking about it too — because they were noticing the same thing. Plant the same vine in two different plots ten kilometers apart, and you get different wine. The soil, the drainage, the microclimate — it all registers in the glass. Terroir is real. Once you understand it, wine makes a different kind of sense.",
      },
      {
        heading: "Soil: The Foundation",
        content:
          "Soil might be the single most discussed element of terroir, and with good reason — it affects everything. The mineral composition of soil doesn't directly add 'mineral flavor' to wine (that's a myth that scientists have been correcting for years), but soil's physical properties profoundly influence the vine's behavior.\n\nDrainage is critical. Vines need enough water to photosynthesize but not so much that they become lazy and over-productive. Well-drained soils — gravel, limestone, chalk, volcanic rock — stress the vine productively, forcing roots to go deep in search of water. Those deep roots reach different layers of the subsoil, interacting with a much wider range of minerals and creating more complex flavor compounds in the fruit.\n\nSoil color and composition affect temperature, too. Dark slate soils in the Mosel absorb heat during the day and release it slowly at night, helping grapes ripen in what would otherwise be too cool a climate. White chalk soils in Champagne reflect light and drain freely. Red clay in Pomerol retains water, helping Merlot thrive in dry years. The list goes on — every great wine region has a soil story that explains, at least partly, why it produces what it does.",
      },
      {
        heading: "Climate: The Big Picture and the Small Details",
        content:
          "Climate operates at multiple levels in wine, and understanding the difference between them is key. Macroclimate is the broad regional weather pattern — continental, maritime, Mediterranean, or some combination. Mesoclimate is the local conditions within a region: a valley that channels morning mist, a hillside that catches afternoon breezes. Microclimate is the tiny environment around individual vines — how close to the ground the canopy sits, how much heat the soil reflects.\n\nEach level matters. A winemaker in Burgundy will tell you that a grand cru vineyard 200 meters up the slope from a village-level plot can experience a frost event differently, harvest two weeks earlier, and produce fruit of a completely different character — even though the two vineyards are separated by a five-minute walk.\n\nThe tension between warmth and coolness is at the heart of wine's flavor profile. Too cool and grapes don't ripen; the wine is thin, tart, green. Too warm and grapes ripen too quickly, losing acidity and producing wines that taste fat, soft, and jammy. The great wine regions exist at the edge of this equation — just warm enough to ripen fully, cool enough to retain freshness. That tension is what creates complexity.",
      },
      {
        heading: "Aspect, Altitude, and Water",
        content:
          "Aspect — which direction a vineyard faces — can mean the difference between greatness and mediocrity in cooler climates. In Burgundy and the Mosel, south-facing slopes are prized above all others because they receive the most sunlight. A vine on a south-facing slope in northern Germany gets significantly more solar energy than one on a north-facing slope, and the difference registers in how completely the grapes ripen.\n\nAltitude adds another variable: for every 100 meters of elevation gain, temperatures drop by roughly half a degree Celsius. In hot climates like Argentina's Mendoza, altitude is the key to producing wines with freshness and acidity — vineyards at 1,000+ meters in the Andes produce Malbec of a completely different character than valley-floor vineyards. The UV intensity at altitude also increases, promoting thicker grape skins and deeper color.\n\nWater bodies — rivers, lakes, seas — moderate temperature extremes. Bordeaux's wines benefit from the Atlantic Ocean's moderating influence. The Mosel River stores heat and reflects light back onto the vineyards above it. The deep Finger Lakes in New York prevent killing frosts by releasing stored heat in autumn. Water is wine's thermostat.",
      },
      {
        heading: "The Human Element",
        content:
          "Here's the piece that often gets forgotten in terroir discussions: people. Terroir doesn't express itself automatically — it requires human observation, experimentation, and accumulated wisdom to reveal what a place is capable of. The Cistercian monks who mapped Burgundy's vineyards in the Middle Ages were essentially doing terroir research: tasting the wine from different plots, noticing what varied, systematically categorizing quality. That work took centuries.\n\nThe grower who farms the same plot for 40 years knows when to pick, how to prune, which part of the vineyard to keep as grand cru and which to sell as village wine — knowledge that isn't in any textbook. Traditional winemaking knowledge is terroir in human form: the accumulated learning of generations making sense of a particular place.\n\nThis is why the concept of terroir resists reduction to chemistry and physics alone. Yes, you can measure the mineral content of the soil and the diurnal temperature range and the slope angle. But the expression of those physical facts requires human understanding to translate into great wine. Terroir is always a collaboration between place and people — and that's part of what makes it so endlessly fascinating.",
      },
    ],
    relatedJourneyIds: ["how-terroir-works", "france-in-five-regions"],
    relatedGrapeIds: ["pinot-noir", "riesling", "chardonnay", "assyrtiko"],
    quizId: "wine-basics",
  },

  // ── GUIDE 2 ───────────────────────────────────────────────────────────────────
  {
    id: "how-to-taste-wine",
    title: "How to Taste Wine Like You Mean It",
    subtitle: "Practical, non-pretentious techniques that actually help you enjoy wine more",
    category: "tasting",
    description:
      "Tasting wine isn't about having the right vocabulary or impressing people — it's about training your attention to notice things you'd otherwise miss. This guide makes the classic Look-Swirl-Smell-Taste-Finish framework actually useful.",
    readTimeMinutes: 7,
    icon: "tasting",
    sections: [
      {
        heading: "Why Tasting Matters (It's Not About Being Fancy)",
        content:
          "Let's start with honesty: most formal wine tasting looks ridiculous from the outside. People holding glasses up to the light, swirling vigorously, sniffing with intense concentration, spitting into buckets. At a professional tasting, that's all practical — you have to assess 50 wines without getting drunk. But the underlying techniques are actually useful for anyone who wants to get more pleasure from a glass of wine at home or at dinner.\n\nTasting with intention is simply paying attention. When you slow down and notice what you're experiencing — the color, the smell, the texture, the aftertaste — you build a vocabulary of sensation that makes future wines more meaningful. You start to recognize a Riesling's petrol note, or the way Pinot Noir's tannins are always silky rather than grippy. You remember wines better, communicate about them better, and choose them better. That's the whole point.\n\nNone of this requires expensive glasses, a perfectly set table, or extensive wine education. It requires curiosity and five minutes of focused attention. You already have both.",
      },
      {
        heading: "Look: What Color Tells You",
        content:
          "Tilt your glass at a 45-degree angle against a white background — a napkin, a piece of paper, the tablecloth. Now look at the color at the rim versus the center. In a red wine, a purple-red rim usually indicates youth; a brick-red or orange-tinged rim suggests the wine is older and has been oxidizing as it ages. In a white wine, pale straw suggests a young, cool-climate wine; deep gold suggests either oak aging, botrytis, or time in the cellar.\n\nClarity matters too — a clear, brilliant wine suggests it's been filtered. A slightly hazy wine might be unfiltered (common in natural wines) or might indicate a fault. Legs, those streaks that run down the inside of the glass after you swirl, are mostly aesthetic — they tell you the wine is high in alcohol or glycerol, not much more. Don't be swayed by big, impressive legs into thinking a wine is higher quality.\n\nYou're probably spending about 30 seconds on this step, which is just right. Visual assessment sets your expectations and gives you context for what follows.",
      },
      {
        heading: "Smell: The Most Important Step",
        content:
          "Roughly 80% of what we experience as 'taste' is actually smell — aroma compounds from the wine reaching your olfactory receptors. This means that the sniffing step, which often gets rushed or skipped, is actually the most important part of the whole process.\n\nFirst sniff: stick your nose in the glass and take a quick initial impression. What do you get immediately? This is your first aroma — often the most volatile, most obvious notes. Then swirl the wine gently to oxygenate it and release more aromatic compounds. Second sniff: a longer, deeper breath. Now what do you notice? Try to organize what you're smelling into categories: fruit (what kind?), earth or mineral, floral, spice, oak-related (vanilla, toast), reduction (sulfur, struck match — will blow off in minutes).\n\nYou don't need a massive flavor vocabulary to do this well. 'This smells like cherries' is a more useful piece of information than 'this has notes of maraschino cherry and Bing cherry with subtle undertones of hibiscus.' Trust your instincts. Wine smells like things you already know — flowers, fruits, minerals, spices, wood, earth. You have all the references you need.",
      },
      {
        heading: "Taste: Structure, Texture, and Flavor",
        content:
          "Take a medium sip — bigger than a polite sip, smaller than a gulp. Let it coat your entire mouth. Now pay attention to four structural elements in roughly this order: sweetness (is there any residual sugar?), acidity (does it make your mouth water?), tannins (do you feel a drying, gripping sensation on your gums and cheeks — mostly from red wines), and alcohol (warmth in the back of your throat, a certain weight).\n\nThese structural elements are your guide to quality and potential. High acidity and tannin in a young red often means it needs time — those elements will soften with age. Excessive alcohol produces warmth that overwhelms other flavors. Good balance means no single structural element dominates — everything in equilibrium.\n\nNow think about flavor. What does it taste like? Try to be specific: 'fruit' is not useful. 'Dark cherries' is useful. 'Black cherries with a hint of something savory, like dried herbs or leather' is excellent. Work your way through the palate — flavors often change as you hold the wine in your mouth. What starts as fruit might finish as earth. That development is complexity, and it's a very good sign.",
      },
      {
        heading: "Finish: The Most Revealing Part",
        content:
          "After you swallow (or spit, at a professional tasting), count how long you continue to taste the wine. That's the finish — and it's arguably the most reliable single indicator of quality. A simple, inexpensive wine might leave flavor in your mouth for 5-10 seconds. A good wine: 15-30 seconds. A great wine: 45 seconds to a minute or more. Some legendary wines have finishes that seem to linger for the entire length of a meal.\n\nA long, complex finish isn't just impressive — it's your money's worth. You're tasting more of the wine after you've swallowed it. The compounds responsible for a long finish are the same ones responsible for complexity and age-worthiness — they're linked. When people say a wine is 'great,' a long, evolving finish is usually part of what they mean.\n\nBut here's the thing: even if you follow none of these steps, even if you just drink the wine and enjoy it, that's completely valid. Tasting techniques are tools for attention, not rituals for their own sake. The goal is always more pleasure — and pleasure doesn't require a score.",
      },
    ],
    relatedJourneyIds: ["six-grapes-that-changed-everything", "old-world-vs-new-world"],
    relatedGrapeIds: [
      "cabernet-sauvignon",
      "pinot-noir",
      "chardonnay",
      "riesling",
    ],
    quizId: "tasting-terms",
  },

  // ── GUIDE 3 ───────────────────────────────────────────────────────────────────
  {
    id: "reading-wine-labels",
    title: "Reading a Wine Label",
    subtitle: "Old World, New World, and what the terms actually tell you about what's inside",
    category: "fundamentals",
    description:
      "A wine label is a compressed system of information — and once you know how to decode it, choosing a bottle becomes much easier. This guide cuts through the confusion of two very different labeling traditions.",
    readTimeMinutes: 6,
    icon: "label",
    sections: [
      {
        heading: "Two Different Systems, One Goal",
        content:
          "Wine labels look confusing because there are two fundamentally different philosophies behind them — and they coexist on shelves worldwide without much explanation. The Old World (Europe) labels primarily tell you where the wine came from. The New World labels primarily tell you what grape variety is in the bottle. Once you internalize that distinction, a lot of confusion evaporates.\n\nA French label that says 'Chablis' isn't being coy about grapes — it's assuming you know that Chablis means Chardonnay, because Chablis is a place in France and all wine from that place is made from Chardonnay. A New Zealand label that says 'Marlborough Sauvignon Blanc' is making the grape variety the headline and using the place as supporting information. Both approaches are rational. You just need to know which one you're looking at.\n\nThe Old World system rewards regional knowledge. The New World system rewards varietal knowledge. Both are learnable. And increasingly, both worlds are borrowing from each other — you see more European labels showing grape varieties, and more New World labels emphasizing place. The lines are blurring.",
      },
      {
        heading: "What to Look for on a European Label",
        content:
          "On a French, Italian, Spanish, or German label, the most important information is usually the appellation — the legally designated geographic origin. These aren't arbitrary lines on a map; they define which grapes are permitted, what viticultural practices must be followed, minimum ripeness levels, and sometimes even ageing requirements. The appellation is the guarantee of a certain style.\n\nIn France, the hierarchy goes: regional (Bordeaux, Bourgogne), communal (Pomerol, Pommard), and premier or grand cru (a specific vineyard). In general, more specific means higher quality — but it also means higher price. A bottle labeled 'Bourgogne Pinot Noir' is Burgundian wine following regional rules. A bottle labeled 'Gevrey-Chambertin Premier Cru' is from a specific hillside in one specific village. The difference in specificity correlates with the difference in the wine.\n\nOther important terms to know: 'Château' (a Bordeaux estate), 'Domaine' (a Burgundy estate where the owner grows the grapes), 'Negociant' (a producer who buys grapes or wine from others and blends them — not inherently inferior), 'Cru' (literally 'growth' — a ranked site or producer), and various aging designations like 'Reserva' or 'Riserva' indicating minimum aging requirements.",
      },
      {
        heading: "What to Look for on a New World Label",
        content:
          "New World labels are generally more consumer-friendly, which is both a feature and a limitation. You'll almost always see the grape variety (Chardonnay, Cabernet Sauvignon, Pinot Gris), the vintage year, the producer name, and the region of origin. In many countries, the region can be specific — 'Napa Valley,' 'Marlborough,' 'Barossa Valley' — or general: 'South Australia,' 'California.'\n\nIn the US, if a grape variety appears on the label, the wine must contain at least 75% of that variety (85% in Oregon, which has stricter rules). In Australia, the minimum is 85%. These aren't necessarily high thresholds — 'Merlot' on a California label could mean 25% other grapes — but in practice, most varietal wines are dominated by the stated variety.\n\nLook also for the alcohol level, which tells you about ripeness and style. A Riesling at 8% alcohol is delicate and likely off-dry. A Napa Cabernet at 15.5% is going to be rich and warm. The alcohol level is honest information about what's in the bottle — use it.",
      },
      {
        heading: "Vintage, Non-Vintage, and Aging",
        content:
          "The vintage year on a label tells you when the grapes were harvested — not when the wine was made or bottled. This matters because vintage variation (differences in weather from year to year) affects wine significantly, especially in cooler regions. A Burgundy from a warm year like 2015 is richer and more opulent than one from a cool, challenging year like 2013. In most New World regions, the climate is more consistent, but vintage still matters.\n\nNon-vintage wines (labeled 'NV') are blended from multiple years. This is standard in Champagne, where the goal is consistency of 'house style' across years — a producer's NV Champagne should taste reliably similar year to year. It's also used in some fortified wines (Port, Sherry) where consistency is more valuable than vintage expression. NV is not a mark of inferiority; in Champagne, it's an art form.\n\nAgeing designations — 'Reserva,' 'Gran Reserva,' 'Riserva,' 'Crianza' — indicate that the wine has spent legally mandated time in barrel and/or bottle before release. In Spain, a Rioja Reserva has aged at least 3 years (1 in oak, 2 in bottle); a Gran Reserva at least 5 years. These wines are typically more complex and food-ready. In Australia and California, 'Reserve' has no legal meaning whatsoever — it's purely marketing.",
      },
      {
        heading: "What Actually Matters",
        content:
          "Here's a useful simplification for the wine shop: the most important thing on the label is the producer. A great producer in a mediocre appellation will often beat a mediocre producer in a prestigious appellation. The label on the bottle tells you where it's from and who made it — and the producer matters more than almost everything else.\n\nSecond most important: the region or appellation, because it gives you a reliable expectation of style. Knowing 'Chablis' means 'steely Chardonnay' or 'Barossa Valley Shiraz' means 'rich, full-bodied red' helps you predict what you're getting.\n\nThird: the vintage, in regions where it genuinely varies. Fourth: the specific ranking or classification. The grape variety — for Old World wines where it's not listed — is worth learning as you go, but it's not the first thing to chase. Focus on producers you trust, regions you love, and styles that match what you're having for dinner. The rest is refinement.",
      },
    ],
    relatedJourneyIds: ["old-world-vs-new-world", "france-in-five-regions"],
    relatedGrapeIds: ["chardonnay", "sauvignon-blanc", "cabernet-sauvignon"],
    quizId: "wine-labels-scores",
  },

  // ── GUIDE 4 ───────────────────────────────────────────────────────────────────
  {
    id: "understanding-wine-scores",
    title: "Understanding Wine Scores",
    subtitle: "Parker, Wine Spectator, Jancis Robinson — what the numbers mean and what they don't",
    category: "culture",
    description:
      "Wine scores are everywhere — 94 points, 97 points, 'Best in Class.' This guide explains who gives them, how they work, and why they're both useful and wildly overused in the wine industry.",
    readTimeMinutes: 6,
    icon: "scores",
    sections: [
      {
        heading: "The 100-Point Scale: How It Happened",
        content:
          "Robert Parker didn't invent the 100-point wine scale — but he made it famous, and in doing so changed the wine industry forever. Parker, an American lawyer-turned-wine-critic, launched The Wine Advocate in 1978, using a school-grade approach: wines were graded from 50 to 100, with scores above 90 indicating 'outstanding' quality. The scale was intuitive for American consumers, and Parker's palate — and his willingness to champion powerful, fruit-forward styles at a time when European wine dominated — resonated enormously.\n\nBy the 1990s, a high Parker score could change a wine's price overnight. Winemakers in Bordeaux, Napa, and beyond started making wines they thought would appeal to Parker's preferences: richer, more extracted, more opulent. Critics of 'Parkerization' argued that this homogenized wine styles globally. Supporters pointed out that Parker democratized wine knowledge and challenged European snobbery. Both sides had a point.\n\nToday, Robert Parker has retired, and The Wine Advocate continues under different critics. But the 100-point scale itself is used by Wine Spectator, Wine Enthusiast, James Suckling, Vinous, Decanter, and dozens of other publications — each with their own scale interpretation and palate preferences.",
      },
      {
        heading: "The Big Critics: Who Gives the Scores",
        content:
          "Wine Spectator is America's most widely read wine magazine, publishing reviews from a team of critics who specialize in different regions. Their scores are reliable guides within their specialty areas, though they've historically favored powerful, ripe styles. Wine Enthusiast publishes a huge volume of reviews — useful for breadth, though depth varies. Vinous, founded by Antonio Galloni, covers fine wine in detail and has become influential in the collector market.\n\nJancis Robinson MW takes a different approach: she uses a 20-point scale (derived from Oxford's academic scoring system), which is more nuanced in the crucial 16-20 range where fine wine decisions actually matter. More importantly, Robinson's writing about wines is extraordinarily analytical and reference-quality. Her Purple Pages website is a treasure trove for serious wine research.\n\nDecanter is the UK's leading wine magazine, with a strong focus on European wines. The Decanter World Wine Awards are among the most comprehensive competition results in the world — useful for identifying value and quality at scale. Tim Atkin MW produces authoritative annual regional reports (especially on South Africa and Argentina) that are among the best primary sources for those regions.",
      },
      {
        heading: "What Scores Actually Tell You",
        content:
          "A score of 90+ on any major scale is a reliable indicator that the wine is genuinely good — there's enough consensus among critics that this threshold means something. Below 90, quality can vary widely; above 95, you're usually in exceptional territory. The spread between 85 and 89 is where interesting wines live at good prices — critics all agree they're solid, but the score hasn't inflated the price.\n\nHere's something critics rarely say openly: scores are relative to price expectations and regional norms. An 88-point Chilean Carménère and an 88-point Burgundy represent very different qualities of wine at very different price points. The score is calibrated within context. Reading just the number without understanding the critic's framework and the wine's price tier can be misleading.\n\nScores also capture a wine at a specific moment in time. A Barolo assessed at release might score 91 — structured, tannic, not yet open — and scored again at 15 years might deserve 96. Old World wines in particular often improve dramatically with age, and a release score may dramatically underrepresent what the wine becomes. Ask your merchant about aging potential before assuming the score reflects the wine's ceiling.",
      },
      {
        heading: "What Scores Don't Tell You",
        content:
          "Scores tell you very little about whether you'll personally enjoy a wine. Palates vary enormously. If you dislike the grippy tannins and earthy character of traditional Barolo, a 98-point Barolo will be less enjoyable to you than a 91-point Willamette Pinot Noir that matches your preferences. The score reflects a critic's assessment of quality — not your pleasure.\n\nScores also can't capture context. The 87-point Muscadet that was perfect with oysters at a seaside restaurant in Brittany was far more enjoyable than the 96-point Napa Cabernet you opened too young at home with takeout pizza. Wine is contextual in a way that scores are inherently not. A good score should make you curious — it shouldn't tell you how to feel.\n\nFinally, scores can't measure what's genuinely interesting or unusual. The most exciting developments in the wine world right now — natural wines, emerging regions, ancient grape revivals — are happening in places and styles that don't always produce wines that score 95+. If you only follow scores, you'll miss the most alive parts of the wine conversation.",
      },
      {
        heading: "Using Scores Wisely",
        content:
          "Treat scores as one input among many, not as authoritative verdicts. Here's a practical framework: use scores to filter at scale — if you're choosing between 20 unknown bottles, scores give you a reasonable starting shortlist. Then read the tasting notes for the ones that score well — the notes tell you the style, flavor profile, and whether it matches what you're looking for. Then factor in price: the best value is often in the 88-92 range, where quality is confirmed but scores haven't driven the price sky-high.\n\nFind critics whose palate preferences align with yours and follow them specifically. If you love elegant, restrained wines, follow a critic known for favoring that style. If you love powerful, extracted reds, find a critic who does too. A critic's 95 for a wine you're guaranteed to love is more useful than a different critic's 97 for a wine that's stylistically not your thing.\n\nAnd consider going entirely score-free sometimes. Pick a wine based on the story of the producer, the region, the grape variety you want to understand better — let curiosity drive the choice. Some of the most interesting bottles in your memory will come from those unscored, curious choices.",
      },
    ],
    relatedJourneyIds: ["france-in-five-regions", "big-reds-world-tour"],
    relatedGrapeIds: ["cabernet-sauvignon", "nebbiolo", "pinot-noir"],
    quizId: "wine-labels-scores",
  },

  // ── GUIDE 5 ───────────────────────────────────────────────────────────────────
  {
    id: "wine-styles-explained",
    title: "The World's Wine Styles Explained",
    subtitle: "Light reds, full reds, crisp whites, rich whites, rosé, sparkling, dessert, fortified — the complete picture",
    category: "fundamentals",
    description:
      "Wine comes in more forms than most people realize. This guide maps the entire landscape — eight fundamental styles — giving you the vocabulary and framework to explore more confidently.",
    readTimeMinutes: 10,
    icon: "styles",
    sections: [
      {
        heading: "Why Styles Matter More Than Grape Names",
        content:
          "Wine education often starts with grape varieties — learn Cabernet Sauvignon, then Pinot Noir, then Chardonnay — but for practical purposes, style is more useful. When you're choosing a wine for dinner, you're often thinking: 'I want something light and refreshing' or 'I want something bold and warming.' That's style thinking, not variety thinking. Understanding styles lets you navigate any wine list or shop with confidence, even when you don't know the specific producer or vintage.\n\nStyles are defined by a combination of color, body, sweetness, acidity, tannin, and effervescence. Each style has a range of typical varieties and regions that produce it, but the style category transcends those specifics. Knowing you want 'a full-bodied red' means you can successfully choose between a Barossa Shiraz, a Napa Cabernet, a Bordeaux, a Barolo, and a Ribera del Duero — all different grapes and places, all meeting the same fundamental style need.",
      },
      {
        heading: "Light and Medium Reds: Elegance and Freshness",
        content:
          "Light reds are defined by low tannins, bright acidity, and red fruit flavors — often served slightly cooler than full reds (around 14°C). Pinot Noir is the archetype: cherry, raspberry, earth, silky texture. Gamay (Beaujolais) is the most joyous expression of the style: pure red fruit, low tannins, almost effervescent freshness. Barbera from Piedmont is medium-bodied, high in acidity, deeply fruited — one of Italy's most food-friendly grapes.\n\nThe best light reds are revelations for people who think red wine means heavy and tannic. They work beautifully with foods that would overwhelm a big red: salmon, roast chicken, duck breast, light pasta dishes. In summer, serve them slightly chilled — this is heresy to some traditionalists but genuinely enhances the experience.\n\nMedium-bodied reds — Merlot, Sangiovese, Tempranillo, Grenache — bridge the gap between light and full. These are the workhorses of wine: versatile, food-friendly, reliably satisfying. The entire category of Rioja, Chianti, and most Côtes du Rhône lives here.",
      },
      {
        heading: "Full-Bodied Reds: Power and Structure",
        content:
          "Full-bodied reds are what most people picture when they think 'serious wine': dark color, firm tannins, concentrated fruit, significant structure, high alcohol. Cabernet Sauvignon from Napa or Bordeaux, Nebbiolo in Barolo, Syrah from the northern Rhône, old-vine Barossa Shiraz — these are wines that command attention and demand appropriate food (fatty proteins, rich sauces, aged cheeses).\n\nThe tannins in big reds serve a purpose: they bind to proteins in food and soften, which is why a tannic Barolo that feels aggressive on its own becomes harmonious with a rich braised beef. The food tames the tannin; the wine cuts through the fat. This synergy is what wine-and-food pairing is ultimately about.\n\nFull-bodied reds also benefit most from aging. The same tannins that can feel harsh in youth soften and integrate over years in the cellar, allowing the fruit to shine and secondary complexity (leather, tobacco, truffle, dried fruits) to develop. Opening a Bordeaux or Barolo too young is one of the most common wine mistakes — patience is rewarded.",
      },
      {
        heading: "Crisp Whites, Rich Whites, and Rosé",
        content:
          "Crisp whites are defined by high acidity, light body, and citrus-driven flavors: Sauvignon Blanc, dry Riesling, Pinot Grigio, Vinho Verde, Muscadet. These are the aperitivo wines, the oyster wines, the 'first glass of the evening' wines. They work brilliantly with delicate seafood, green vegetables, and fresh cheeses — anything that would be overwhelmed by a heavier wine.\n\nRich whites — oaked Chardonnay, Viognier, Grüner Veltliner Smaragd, Alsatian Pinot Gris — have more body, lower acidity, and richer textures. They pair with richer foods: lobster, roast chicken, creamy pastas, grilled fish with butter sauces. The oak in Chardonnay provides vanilla and toast flavors and also allows micro-oxygenation in barrel, creating a rounder, more textured mouthfeel.\n\nRosé occupies its own category — not really red, not really white, with characteristics of both. The best rosés (Provence, Bandol, Tavel, Loire) are serious wines with real complexity — mineral, saline, red fruit, excellent acidity. The worst are sweet, insipid, and exist only because of pretty packaging. Seek out dry rosé; drink it cold.",
      },
      {
        heading: "Sparkling, Dessert, and Fortified: The Special Occasions",
        content:
          "Sparkling wine is defined by the presence of carbon dioxide — created either in a second fermentation (traditional method: Champagne, Cava, English sparkling) or in a tank (Charmat method: Prosecco, most Lambrusco). Traditional method sparkling wines have finer, more persistent bubbles and greater complexity from lees contact; Charmat wines are fresher, more fruit-forward, best drunk young.\n\nDessert wines span an enormous range of styles: from gently sweet German Spätlese Riesling to the opulent golden richness of Sauternes (botrytized Sémillon) to the orange-marmalade intensity of Hungarian Tokaj Aszú. What unites them is residual sugar balanced by high acidity — without the acid, sweetness becomes cloying. The best dessert wines are never simple: they're complex, aromatic, and age magnificently.\n\nFortified wines — Port, Sherry, Madeira, Marsala — are wines to which grape spirit has been added, raising the alcohol and halting fermentation (which preserves sweetness). Port is the most famous: rich, sweet, complex, perfect with blue cheese or chocolate. Sherry is one of wine's most underappreciated categories — dry Fino is haunting and saline, Amontillado is nutty and complex, Pedro Ximénez is almost impossibly rich. Fortified wines are a world unto themselves, and they're almost always excellent value.",
      },
    ],
    relatedJourneyIds: ["sparkling-around-the-world", "big-reds-world-tour", "white-wine-deep-dive"],
    relatedGrapeIds: [
      "pinot-noir",
      "gamay",
      "cabernet-sauvignon",
      "nebbiolo",
      "chardonnay",
      "riesling",
      "muscat",
      "semillon",
    ],
  },

  // ── GUIDE 6 ───────────────────────────────────────────────────────────────────
  {
    id: "wine-and-food-pairing",
    title: "Wine and Food: The Art of Pairing",
    subtitle: "The principles that actually work — and the surprising pairings you didn't see coming",
    category: "tasting",
    description:
      "Pairing wine and food isn't a mysterious art reserved for sommeliers. It's based on a few practical principles that once understood, let you improvise confidently. This guide gives you the tools and the inspiration.",
    readTimeMinutes: 7,
    icon: "pairing",
    sections: [
      {
        heading: "The Guiding Principle: Balance",
        content:
          "Wine and food pairing is fundamentally about balance — making sure neither the food nor the wine overwhelms the other. There are two basic strategies: complement (similar flavors and weights) or contrast (opposites that enhance each other). Both work. The goal is that each bite makes the wine taste better, and each sip makes the food taste better. When it clicks, it's genuinely greater than the sum of its parts.\n\nThe simplest rule: match the weight of the food to the weight of the wine. Light foods need light wines; rich foods need rich wines. Grilled Dover sole with a Burgundy Grand Cru would be dominated by the wine — the sole would disappear. The same sole with a mineral Chablis or a lean Muscadet would let both shine. That's not complicated; it's just paying attention.\n\nRegional pairings are another reliable shortcut: what grows together goes together. The wines and foods of a region evolved alongside each other over centuries, and local cuisine tends to match local wine almost automatically. Chianti with pasta, Sancerre with goat cheese, Muscadet with oysters, Rioja with lamb — these are all regional marriages that work because they were developed together.",
      },
      {
        heading: "Acid and Fat: The Perfect Partnership",
        content:
          "High-acid wines are the sommelier's first resort for rich, fatty foods — and for good reason. Acid cuts through fat on the palate, cleansing and refreshing between bites. It's why Champagne is magnificent with fried chicken (seriously — the bubbles and acidity cut through the richness perfectly), why Chablis works with oysters, why Riesling is the ideal pairing for fatty pork dishes.\n\nSauvignon Blanc with goat cheese is perhaps the most perfect acid/fat pairing in wine: the wine's acidity matches the cheese's acidity, and the grassy herbal notes in the wine echo the grassy flavors in the cheese. It's so good it almost feels designed. Sancerre and chèvre is a French classic that seems ordained by geography.\n\nFor very rich, cream-based dishes, you want a wine with enough body to match but enough acidity to cut. Oaked Chardonnay with lobster bisque, Viognier with scallops in cream sauce, white Burgundy with roast chicken with a butter-wine sauce — the richness of the wine matches the richness of the dish, while the wine's acidity keeps the whole thing fresh.",
      },
      {
        heading: "Tannin and Protein: Red Wine with Red Meat",
        content:
          "Tannins are polyphenols that create a drying, astringent sensation in the mouth — that firm, gripping feeling from a young Barolo or Napa Cabernet. On their own, tannic wines can be aggressive and sharp. But tannins bind to proteins, which is why red wine with a fatty, protein-rich steak makes both taste better: the protein softens the tannin; the tannin cuts the fat.\n\nThis is the foundation of the classic 'red wine with red meat' rule — and it's not just tradition, it's chemistry. Aged beef, lamb, venison: high in protein and fat, perfect partners for structured, tannic reds. A leaner cut (filet mignon, for example) actually works better with a less tannic red like Pinot Noir — there's less protein and fat to soften a big tannin structure.\n\nThe principle extends beyond beef: Barolo with braised wild boar, Rioja with roast lamb, Cahors Malbec with duck confit — all classic pairings where tannin and protein dance together. And aged cheeses (Parmigiano, aged cheddar) work beautifully with tannic reds for the same reason: the protein in the cheese tames the tannin.",
      },
      {
        heading: "Sweet and Spicy: Unexpected Allies",
        content:
          "Here's a counterintuitive one: off-dry and sweet wines often pair better with spicy food than dry wines do. Why? Alcohol amplifies the perception of heat — so a high-alcohol dry red with a spicy Thai curry can feel like you're eating fire. A slightly sweet, lower-alcohol Riesling or Gewürztraminer provides sweetness that tames the spice and alcohol that doesn't amplify it. It's one of wine's most useful and underused principles.\n\nGewürztraminer is basically custom-made for this role: its naturally sweet, aromatic, spiced character echoes and harmonizes with the complex spice of Thai, Chinese, and Alsatian cuisine (hence the choucroute pairing). German Riesling Spätlese with Vietnamese pho or Japanese ramen is a revelation once you've tried it. Don't be scared of sweet wines as food pairings — they're often the most elegant solution.\n\nConversely, wine and very sweet desserts can be tricky: the wine needs to be as sweet or sweeter than the dessert, or the wine tastes thin and acidic by comparison. That's why the classic pairing is Sauternes with Roquefort (the sweetness balances the salt and tang of the cheese) rather than Sauternes with crème brûlée (two sweet things fighting for attention).",
      },
      {
        heading: "Surprising Pairings Worth Trying",
        content:
          "Champagne with fried chicken. Don't laugh — this is genuinely excellent, and many chefs swear by it. The bubbles and acidity cut through the fat and crunch perfectly. Anything fried, actually: chips, tempura, salt-and-pepper squid. Bubbles were made for fried food.\n\nPort with blue cheese is a classic for a reason. Stilton and Vintage Port is one of England's greatest culinary gifts to the world. But try any strong, salty blue with a sweet, fortified wine — the sweetness balances the salt, the richness matches the richness, and the whole combination makes both wine and cheese taste more complex.\n\nDry Fino Sherry with sushi or sashimi. This sounds eccentric but is increasingly championed by Japanese restaurants that take their beverage program seriously. The saline, oxidative quality of Fino echoes the sea character in raw fish, and the cleanness of the wine doesn't overwhelm delicate flavors. Similarly: Muscadet and oysters, Albariño and grilled octopus. The principle is the same — wines from coastal regions with raw or simply prepared seafood. The ocean is in the wine.",
      },
    ],
    relatedJourneyIds: ["france-in-five-regions", "italy-north-to-south"],
    relatedGrapeIds: [
      "chardonnay",
      "sauvignon-blanc",
      "riesling",
      "gewurztraminer",
      "cabernet-sauvignon",
      "pinot-noir",
      "nebbiolo",
    ],
    quizId: "tasting-terms",
  },

  // ── GUIDE 7 ───────────────────────────────────────────────────────────────────
  {
    id: "brief-history-of-wine",
    title: "A Brief History of Wine",
    subtitle: "8,000 years in 10 minutes — from Georgian clay pots to global phenomenon",
    category: "culture",
    description:
      "Wine is older than the written word. This guide traces its journey from ancient Georgia to the tables of Roman emperors, through medieval monasteries to the New World and today's natural wine movement — the remarkable human story behind every glass.",
    readTimeMinutes: 10,
    icon: "history",
    sections: [
      {
        heading: "The Beginning: Georgia and the Ancient World",
        content:
          "The oldest evidence of winemaking we have comes from Georgia — specifically from the Caucasus region — where archaeological remains of crushed grapes and winemaking residues in clay vessels (qvevri) date to approximately 6000 BCE. That's 8,000 years of winemaking. The Georgians didn't just discover wine; they apparently invented the agricultural practices around it: terracing hillsides, developing grape cultivation techniques, building specialized storage vessels.\n\nFrom the Caucasus, winemaking spread westward: to ancient Mesopotamia (modern Iraq and Iran), where wine vessels appear in Sumerian texts from around 3100 BCE. To Egypt, where wine was an elite beverage, a religious offering, and a trade commodity — wine jars in Egyptian tombs are among the earliest examples of what we might recognize as wine labeling, with vintage, region, and producer information. The pharaohs apparently knew the difference between a good year and a bad one.\n\nTo ancient Greece, where wine became culturally central in a way that had no precedent. The Greeks had a god of wine (Dionysus), symposia (philosophical drinking parties), and a wine-trade network that covered the entire Mediterranean. They also spread viticulture wherever they colonized: to southern France (Massalia, modern Marseille), to Sicily, to the Black Sea coast. The Greek world made wine universal.",
      },
      {
        heading: "Rome: Wine Goes Global",
        content:
          "The Romans took what the Greeks started and industrialized it. The Roman Empire was an enormous, interconnected wine market: wine was drunk by soldiers on campaign, workers in cities, aristocrats at dinner parties, priests in temples. Amphorae — ceramic wine vessels — have been found at every corner of the Roman world, from Scotland to Syria, from Morocco to Romania. Wine was as fundamental to Roman civilization as roads.\n\nThe Romans also developed many of the wine regions that are still famous today. Bordeaux (Burdigala), Burgundy, the Rhône Valley, the Rhine and Mosel in Germany, Rioja in Spain — all had established viticulture by the Roman period. Historians of wine sometimes wonder how different the modern wine map would look if the Romans had colonized somewhere else.\n\nRoman wine culture also gave us some early wine writing that sounds remarkably contemporary. Pliny the Elder wrote about specific vineyards and vintages with a connoisseur's attention. The 121 BCE vintage in the Falernian region of Italy was considered so exceptional that it was still being drunk (and praised) a hundred years later. The idea that some wines are worth saving — that specific years are exceptional — is ancient.",
      },
      {
        heading: "The Medieval Period: Monks as Winemakers",
        content:
          "After the fall of the Roman Empire, it was the Christian Church that preserved and advanced wine culture in Europe. Wine was essential for the Eucharist — the transformation of wine into the Blood of Christ — which meant that monasteries not only consumed wine but grew it, studied it, and improved it with the dedication that religion brings to everything it touches.\n\nThe Cistercian monks of Burgundy are perhaps the most important winemakers in history — not just for their time, but for all time. Working in the 11th through 13th centuries, they systematically mapped the Côte d'Or vineyards: tasting the wine from different plots, noting which produced consistently superior results, walling off the best sites as 'clos' (enclosed vineyards). Their work — the classification of Burgundy's vineyards — is still substantially in use today, over 800 years later.\n\nMonasteries also developed wine regions that the Romans had never touched: Champagne, the Loire Valley, parts of Germany's Rhine. Benedictine monks in Hautvillers — the same monastery where Dom Pérignon worked in the 17th century — made Champagne famous. The idea of a dedicated viticultural estate, the idea of quality being site-specific, the knowledge of which plots were best — all of this emerged from monastic practice. We drink the work of 12th-century monks every time we open a Burgundy.",
      },
      {
        heading: "The New World and Modern Wine",
        content:
          "European colonialism brought vines to every new territory — South Africa (Dutch settlers, 1652), Australia (First Fleet, 1788), America (Spanish missionaries moving north from Mexico through California), Argentina and Chile (Spanish colonization of South America in the 16th century). In every case, the colonizers brought vines because they couldn't imagine life without wine. In every case, those vines adapted, often magnificently, to their new environments.\n\nThe 19th century brought catastrophe and transformation simultaneously. Phylloxera — a tiny aphid-like insect from North America — arrived in European vineyards in the 1860s and within 30 years had destroyed nearly every vineyard on the continent. The solution — grafting European varieties onto phylloxera-resistant American rootstock — saved European viticulture but also fundamentally changed it. Every vine in France, Italy, and Spain today (with very few volcanic-soil exceptions) grows on American roots.\n\nThe 20th century democratized wine. Technological advances in viticulture and winemaking made consistent, affordable wine available to mass markets for the first time. New refrigeration technology allowed hot-climate regions (California, Australia) to make fresh, clean whites that previously weren't possible. Better understanding of fermentation chemistry reduced faults. The wine world expanded from a European specialty to a global industry.",
      },
      {
        heading: "Today: The Great Diversification",
        content:
          "The most interesting thing happening in wine right now is a simultaneous move in two opposite directions. On one hand: the natural wine movement, returning to ancient practices — minimal intervention, wild yeast fermentation, Georgia's qvevri tradition. These producers are asking whether modern technology has over-corrected for ancient uncertainty. They want wines that taste alive and specific and human.\n\nOn the other: new wine regions emerging in places nobody expected — England, China (Ningxia), Brazil (Serra Gaúcha), Turkey (Cappadocia), Lebanon (Bekaa Valley) — producing wines of genuine international quality and, sometimes, genuinely new flavor profiles. Climate change is redrawing the wine map, warming regions that were previously too cool and challenging regions that are getting too hot.\n\nSomewhere between these two trajectories is the conversation wine is having with itself right now: what does it mean to make good wine, and where is the next great wine region? The answer changes every decade, which means being a wine drinker today means being part of a living story. The 8,000-year journey is still going.",
      },
    ],
    relatedJourneyIds: ["hidden-gems-uncommon-regions", "natural-wine-movement", "how-terroir-works"],
    relatedGrapeIds: [
      "assyrtiko",
      "chenin-blanc",
      "cabernet-sauvignon",
      "riesling",
    ],
  },

  // ── GUIDE 8 ───────────────────────────────────────────────────────────────────
  {
    id: "natural-organic-biodynamic",
    title: "Natural, Organic, Biodynamic: What's the Difference?",
    subtitle: "Cutting through the label confusion — what each term really means in the vineyard and cellar",
    category: "culture",
    description:
      "These three terms are often used interchangeably, but they mean very different things. This guide explains each one precisely, identifies what they guarantee (and what they don't), and helps you decide what to look for based on your values.",
    readTimeMinutes: 8,
    icon: "natural",
    sections: [
      {
        heading: "Why This Matters (And Why It's Confusing)",
        content:
          "Walk into any wine shop and you'll encounter labels advertising 'organic,' 'biodynamic,' 'sustainable,' 'natural,' 'low-intervention,' and 'minimal-input' — sometimes on the same shelf, sometimes on the same bottle. These terms have overlapping but distinct meanings, and the confusion is partly by design: some are legally defined certifications with specific requirements, others are marketing terms with no regulatory definition whatsoever.\n\nUnderstanding the differences matters for several reasons. If you care about pesticide use in agriculture, you need to know what 'organic' actually guarantees. If you care about the taste profile of a wine, you should know that 'natural' production tends to create different (not always better, not always worse) flavors than conventional. And if you're paying a premium for any of these labels, you should know what you're actually paying for.\n\nThe overarching context: conventional wine production can involve dozens of approved chemical inputs — synthetic pesticides, herbicides, fungicides in the vineyard; cultured yeasts, acidification, de-acidification, oak chips, fining agents, and sulfur in the cellar. None of these are automatically bad, and most are undetectable in the finished wine. But there's a legitimate question about whether they're necessary, and a growing community of producers and drinkers who believe they're not.",
      },
      {
        heading: "Organic: The Legal Baseline",
        content:
          "Organic wine is the most clearly defined of the three categories, with legally certified standards in most wine-producing countries. In the EU, organic viticulture means no synthetic pesticides, herbicides, or fertilizers in the vineyard. Organic winemaking has slightly different rules: sulfur dioxide is allowed but at lower maximum levels than in conventional wine; most synthetic additives are prohibited, though a variety of natural additives are permitted.\n\nImportantly: a vineyard can be farmed organically without being certified organic — the certification process is expensive and bureaucratic, and many small producers farm organically as a matter of principle without pursuing the paperwork. This is why you'll often see 'practicing organic' or 'organic farming without certification' on back labels.\n\nOrganic certification doesn't guarantee great wine. A large, industrially run organic winery with high yields and technological intervention in the cellar produces a fundamentally different wine from a small, obsessive organic producer with meticulous vineyard work. The certification guarantees the absence of synthetic inputs — not the presence of quality, care, or terroir expression.",
      },
      {
        heading: "Biodynamic: The Holistic Approach",
        content:
          "Biodynamic farming is organic farming plus a philosophical and spiritual framework derived from the teachings of Rudolf Steiner, an early 20th-century Austrian philosopher. Biodynamics treats the farm as a self-sustaining organism: using compost and plant-based preparations (nine specific 'preparations' are specified by Demeter, the certifying body), following an agricultural calendar based on lunar cycles and astronomical rhythms, and cultivating diverse plant and animal life on the estate.\n\nIt sounds esoteric, and parts of it are — the homeopathic dilutions and lunar calendars are scientifically contested. But the practical outcomes of biodynamic farming are generally accepted to be beneficial: healthier, more biodiverse soils; reduced external inputs; vines that are more resilient to disease. Many of the world's greatest winemakers are biodynamic practitioners: Leroy in Burgundy, Nicolas Joly in the Loire, Chapoutier in the Rhône.\n\nDoes biodynamic wine taste different? Proponents insist it does — more alive, more expressive, greater terroir character. Critics say any taste difference is attributable to the high quality of care and attention that biodynamic producers typically apply, not the lunar calendar. The debate is genuinely unresolved. But the category contains a disproportionate number of extraordinary wines, which is suggestive of something.",
      },
      {
        heading: "Natural Wine: Philosophy, Not Certification",
        content:
          "Natural wine has no legal definition — which is simultaneously its most honest quality and its greatest commercial vulnerability. The term refers to a loose set of principles rather than a certified standard: hand-harvesting, organic or biodynamic farming, wild yeast fermentation (no added commercial yeasts), no added sugar, no fining or filtration, and minimal to no added sulfur dioxide.\n\nThe goal is to make wine that is as unmanipulated as possible — letting the grape, the vintage, and the place speak without technological assistance. At its best, natural wine has an extraordinary aliveness: texture, complexity, specificity of place that's genuinely different from conventionally made wine. At its worst, it's unstable, faulty, smelling of vinegar or barnyard in ways that are not appealing.\n\nThe natural wine community is also a cultural movement, not just a winemaking approach — with its own wine bars, fairs, publications, and aesthetics. RAW Wine (the most prominent natural wine fair, held in multiple cities) has become an important gathering for producers and enthusiasts alike. The conversation about what natural wine is and should be is ongoing and lively, which is itself a sign of a healthy movement.",
      },
      {
        heading: "Sustainable and Beyond: The Practical Middle Ground",
        content:
          "'Sustainable' is the most pragmatic of these terms, and arguably the most practically impactful. Sustainable viticulture means minimizing environmental impact while maintaining economic viability — using the least amount of intervention necessary, reducing chemical inputs, protecting biodiversity, managing water responsibly. Many sustainable certifications (New Zealand's Sustainable Winegrowing, California Sustainable Winegrowing, South Africa's Integrated Production of Wine) allow some synthetic inputs but require documentation and reduction targets.\n\nMost of the world's thoughtful conventional winemakers are practicing sustainability in some form, even if they're not certified organic or biodynamic. They're reducing herbicide use, planting cover crops between vine rows to improve soil health, using minimal sulfur, making decisions based on vineyard need rather than calendar spraying schedules. This pragmatic approach is less philosophically pure but arguably more achievable at scale.\n\nThe honest conclusion: the terms matter, and so does reading beyond them. A certified organic producer who doesn't care about quality is less interesting than a conventional producer who farms with extraordinary attention to the vineyard. The certifications are useful signals, not guarantees. The most reliable indicator of a thoughtful producer is still the same as it's always been: taste the wine.",
      },
    ],
    relatedJourneyIds: ["natural-wine-movement", "hidden-gems-uncommon-regions"],
    relatedGrapeIds: ["chenin-blanc", "assyrtiko", "grenache"],
  },
];
