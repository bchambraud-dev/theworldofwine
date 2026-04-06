export interface GuideSection {
  heading: string;
  content: string; // markdown-ish, 2-4 paragraphs per section, brand voice
}

export interface Guide {
  id: string;
  title: string;
  subtitle: string;
  category: "fundamentals" | "tasting" | "regions" | "culture";
  level: "beginner" | "intermediate" | "expert";
  description: string;
  readTimeMinutes: number;
  icon: string;
  heroImage?: string; // path to hero image (editorial photo or illustration)
  illustrations?: { src: string; alt: string; afterSection?: number }[]; // inline images placed after a section index
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
    level: "beginner",
    description:
      "Terroir is French for 'a sense of place' — the idea that wine carries the fingerprint of the land it came from. This guide unpacks what that actually means, from soil chemistry to climate and the human factor.",
    readTimeMinutes: 8,
    icon: "terroir",
    heroImage: "/guides/illus-02-terroir.webp",
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
    level: "beginner",
    description:
      "Tasting wine isn't about having the right vocabulary or impressing people — it's about training your attention to notice things you'd otherwise miss. This guide makes the classic Look-Swirl-Smell-Taste-Finish framework actually useful.",
    readTimeMinutes: 7,
    icon: "tasting",
    heroImage: "/guides/illus-01-tasting.webp",
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
    level: "beginner",
    description:
      "A wine label is a compressed system of information — and once you know how to decode it, choosing a bottle becomes much easier. This guide cuts through the confusion of two very different labeling traditions.",
    readTimeMinutes: 6,
    icon: "label",
    heroImage: "/guides/photo-reading-labels.webp",
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
    level: "beginner",
    description:
      "Wine scores are everywhere — 94 points, 97 points, 'Best in Class.' This guide explains who gives them, how they work, and why they're both useful and wildly overused in the wine industry.",
    readTimeMinutes: 6,
    icon: "scores",
    heroImage: "/guides/photo-wine-scores.webp",
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
    level: "beginner",
    description:
      "Wine comes in more forms than most people realize. This guide maps the entire landscape — eight fundamental styles — giving you the vocabulary and framework to explore more confidently.",
    readTimeMinutes: 10,
    icon: "styles",
    heroImage: "/guides/photo-wine-styles.webp",
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
    level: "beginner",
    description:
      "Pairing wine and food isn't a mysterious art reserved for sommeliers. It's based on a few practical principles that once understood, let you improvise confidently. This guide gives you the tools and the inspiration.",
    readTimeMinutes: 7,
    icon: "pairing",
    heroImage: "/guides/photo-food-pairing.webp",
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
    level: "beginner",
    description:
      "Wine is older than the written word. This guide traces its journey from ancient Georgia to the tables of Roman emperors, through medieval monasteries to the New World and today's natural wine movement — the remarkable human story behind every glass.",
    readTimeMinutes: 10,
    icon: "history",
    heroImage: "/guides/photo-history.webp",
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
    level: "beginner",
    description:
      "These three terms are often used interchangeably, but they mean very different things. This guide explains each one precisely, identifies what they guarantee (and what they don't), and helps you decide what to look for based on your values.",
    readTimeMinutes: 8,
    icon: "natural",
    heroImage: "/guides/photo-natural-organic.webp",
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

  // ── GUIDE 9 (INTERMEDIATE) ────────────────────────────────────────────────────
  {
    id: "vintage-variation",
    title: "Vintage Variation: Why the Year Matters",
    subtitle: "What makes one harvest legendary and another forgettable — and how to use that knowledge",
    category: "fundamentals",
    level: "intermediate",
    description:
      "The year on a wine label isn't just a date — it's a story about weather, harvest decisions, and the luck of farming. This guide explains what makes a vintage, how to read a vintage chart, and when the year genuinely matters (and when it doesn't).",
    readTimeMinutes: 10,
    icon: "scores",
    heroImage: "/guides/photo-vintage.webp",
    sections: [
      {
        heading: "What Makes a Vintage?",
        content:
          "Every bottle of wine with a year on the label is telling you something specific: this is when the grapes were harvested. Not when the wine was bottled, not when it was released — when those particular grapes hung on those particular vines, absorbing sunshine and rain and the specific character of that specific year. <strong>Vintage is a snapshot of weather</strong>, and weather, as every farmer knows, is never the same twice.\n\nThe growing season typically runs from bud break in spring through harvest in autumn — roughly six to eight months during which the vine goes from dormancy to producing ripe fruit. During that window, everything matters: rainfall and its timing, temperature during flowering (which affects how many berries set), heat during the growing season, and — critically — the conditions in the final weeks before harvest. A warm, dry September can rescue a mediocre summer; a cold, wet October can ruin a brilliant one.\n\nWinemakers watch the weather obsessively, because the decisions they make at harvest — when to pick, how quickly, which plots first — can mean the difference between a great vintage and a difficult one. In some years, <strong>those decisions are made for you by the weather</strong>; in others, the harvest window is generous and timing becomes a question of philosophy (pick earlier for freshness, later for richness).",
      },
      {
        heading: "How Weather Shapes Wine",
        content:
          "Think about what a grape needs: warmth to build sugar and flavor compounds, rainfall to keep the vine alive, sunlight to drive photosynthesis, and cool nights to preserve the acidity that makes wine taste fresh rather than flat. The ideal growing season provides all of these in roughly the right proportions and sequence. The problem is that nature rarely obliges.\n\nToo much rain — especially at harvest — dilutes grape juice and promotes rot. Too little rain throughout summer stresses the vine and can shut down ripening entirely. <strong>Hail is every vineyard's nightmare</strong> — a single storm in June can devastate an entire harvest before the berries have even formed properly. Spring frosts after bud break can kill an entire year's growth in a single night. Chablis and Champagne, both cold-climate regions, are particularly vulnerable to frost damage that can reduce a crop by 80% or more.\n\nThe flip side of difficult conditions is that extraordinary conditions produce extraordinary wines. The great vintages in cooler regions are usually defined by the combination of a warm summer that built sugar and flavor, cool nights that preserved acidity and freshness, and a dry, sunny autumn that allowed a leisurely harvest at perfect ripeness. In warmer regions, the great vintages are defined by <strong>unusual freshness</strong> — a cooler year that moderated the alcohol and preserved the structure that these climates can sometimes lack.",
      },
      {
        heading: "Great Vintages by Region",
        content:
          "In <strong>Bordeaux</strong>, the legendary modern vintages are 2005, 2009, 2010, 2015, and 2016. The 2005 was called the vintage of the century at the time — hot summer, late harvest, dense concentrated wines. Then 2009 arrived and surpassed it in sheer hedonistic richness. The 2010 was the structural counterpoint — more restrained, with incredible freshness, arguably the greatest Bordeaux vintage of the modern era. The 2015 and 2016 are the most recent additions to the pantheon: 2015 warm and luscious, 2016 more classical and age-worthy. Any bottle from these years from a top producer is something worth finding.\n\nIn <strong>Burgundy</strong>, 2015 and 2019 are the current stars — both producing wines of extraordinary richness and depth. Burgundy is far more variable than Bordeaux because Pinot Noir is more sensitive to weather, and the tiny plots mean site-level differences are amplified by vintage conditions. A grand cru from a great Burgundy vintage can be one of the most profound bottles of wine you'll ever open.\n\nIn <strong>Piedmont</strong>, 2010 and 2016 stand out as Barolo and Barbaresco vintages of a generation. Both combined the warm growing season that Nebbiolo needs with the cool autumn temperatures that allow a long, slow, perfect ripening. The 2016 Barolos in particular are already being talked about in legendary terms — and they've barely started to open up. Buy some now and hide them for a decade.",
      },
      {
        heading: "How to Read a Vintage Chart",
        content:
          "A vintage chart is a simplified grid: regions on one axis, years on the other, scores in the boxes. The best ones come from experienced critics who actually tasted the wines shortly after release and understand regional variation. Wine Spectator, Decanter, Wine Advocate, and Robert Parker's website all publish vintage charts — and while no two agree in every detail, there's usually broad consensus on the truly great and truly difficult years.\n\nRead vintage charts with an understanding of what they actually represent: <strong>average quality for the region that year</strong>. A bad year in Bordeaux doesn't mean every bottle is flawed — it means the producer had to work harder, and the best estates often made excellent wine even when the year was difficult. Conversely, a great year doesn't guarantee a great bottle if the producer made mistakes at harvest or in the cellar.\n\nThe most practical use of a vintage chart is in restaurant wine lists: if you're choosing between two unfamiliar bottles at similar prices, a good year versus a mediocre year for the same region can be a reasonable tiebreaker. But don't be a vintage snob — there are great wines in every year, and some of the most interesting bottles come from winemakers who excelled despite difficult conditions.",
      },
      {
        heading: "When Vintage Doesn't Matter",
        content:
          "Here's the counterintuitive part: for a very large proportion of the wine market, vintage variation matters relatively little. Most everyday wine — the bottle you're opening on a Tuesday with dinner — is made to be consistent across years. The winemaker blends from multiple parcels and sometimes multiple years specifically to produce reliability and approachability rather than vintage character.\n\n<strong>Non-vintage Champagne</strong> is the canonical example. The great houses (Moët & Chandon, Veuve Clicquot, Billecart-Salmon) maintain enormous reserve stocks of older wine precisely to blend away the inconsistencies of any given year and create a consistent 'house style.' The NV Champagne you buy this year should taste essentially the same as the one you bought last year. This is an art form in itself — the blending expertise required is extraordinary — and it's why NV Champagne from a top house is always a reliable choice.\n\nFor most everyday wines in the $12–25 range, <strong>vintage variation is largely managed away</strong> by large-scale sourcing and blending. In warm, consistent climates like much of California, South Australia, and Chile, dramatic vintage swings simply don't happen with the frequency of cooler European regions. If you're not spending a lot on a bottle, don't spend a lot of time worrying about the year on the label.",
      },
    ],
    relatedJourneyIds: ["six-grapes-that-changed-everything"],
    relatedGrapeIds: ["cabernet-sauvignon", "pinot-noir"],
    quizId: "vintage-knowledge-quiz",
  },

  // ── GUIDE 10 (INTERMEDIATE) ───────────────────────────────────────────────────
  {
    id: "winemaking",
    title: "How Wine is Made: From Grape to Glass",
    subtitle: "The full journey from harvest through fermentation, aging, and bottling",
    category: "fundamentals",
    level: "intermediate",
    description:
      "Every bottle of wine is the result of a series of decisions — harvest timing, fermentation method, aging vessel, bottling date — made by people who are part scientist, part artist, part gambler. This guide walks through the full process.",
    readTimeMinutes: 12,
    icon: "terroir",
    heroImage: "/guides/illus-06-winemaking.webp",
    sections: [
      {
        heading: "Harvest and Crush",
        content:
          "Everything begins with a decision: when to pick. <strong>Harvest timing is the most consequential choice</strong> a winemaker makes all year — too early and the grapes lack flavor and ripeness; too late and they lose freshness, acidity collapses, and botrytis (rot) can set in uninvited. In practice, picking windows are often measured in days or even hours, and the best winemakers obsessively track sugar levels (Brix), pH, and what they call 'physiological ripeness' — the actual flavor of the grape — before committing.\n\nIn regions with high-quality ambitions, the grapes are still often hand-harvested: pickers move through the vineyard row by row, selecting only ripe, healthy bunches. Machine harvesting is faster and cheaper but less discriminating. For some wines — those with intentional bunch selection or that require whole clusters — machine harvesting is simply not possible. The crew you pick your grapes with, and how carefully they work, matters enormously.\n\nAfter harvest comes crushing — breaking the grape skins to release the juice. Modern wineries often use gentle destemming machines and crushers rather than the romantic image of barefoot treading (though foot-treading is still used for premium Port production in the Douro). Some producers prefer whole-cluster fermentation — putting entire, uncrushed bunches into the fermentation vessel — which creates different flavors and adds structural complexity.",
      },
      {
        heading: "Fermentation: Wild vs Cultured Yeast and Temperature Control",
        content:
          "Fermentation is the core transformation: yeast consumes the sugar in grape juice and produces alcohol and carbon dioxide. It sounds simple, but the choices around fermentation are where winemaking philosophy becomes most visible. <strong>The first major question is: which yeast?</strong>\n\nCultured yeasts — selected strains developed for predictability, efficiency, and specific flavor contributions — are used by most commercial wineries worldwide. They're reliable: fermentation starts quickly, finishes completely, and produces consistent results year after year. Wild or 'native' yeasts — the indigenous yeasts that live on grape skins and in the winery environment — are the choice of producers who want maximum terroir expression and character. Wild fermentations are slower, riskier, sometimes volatile, and often produce wines with greater complexity and individuality. The risk is stuck fermentation or off-flavors; the reward is something genuinely distinctive.\n\nTemperature control during fermentation is equally fundamental. <strong>White wines are fermented cool</strong> (12–18°C) to preserve delicate fruit aromatics — warmth drives off the volatile aromatics that make a crisp Sauvignon Blanc or fragrant Riesling what it is. Red wines are typically fermented warmer (22–28°C) because heat helps extract color and tannin from the skins. Some producers push temperatures higher for extraction; others keep them moderate for elegance and freshness.",
      },
      {
        heading: "Maceration and Extraction: Color, Tannin, and Character",
        content:
          "For red wine, fermentation and maceration happen simultaneously: the juice (must) macerates on the grape skins, extracting color pigments (anthocyanins), tannins, and flavor compounds that are only present in the skins, not the juice itself. <strong>This skin contact is what makes red wine red</strong> — white grapes, even those with pink or red skins, can make white wine if you remove the skins immediately after crushing.\n\nHow long and how aggressively you macerate determines the style of the wine. Gentle extraction over a moderate time produces wines that are more elegant, with softer tannins and brighter fruit. Aggressive extraction — longer maceration, intensive pump-overs (pumping juice from the bottom of the tank over the 'cap' of skins that floats on top) or punch-downs — produces more deeply colored, more tannic, more structured wines. The right approach depends entirely on the grape variety, the vintage, and the style you're aiming for.\n\nPigéage (punch-down) is the traditional method for moving the cap: workers literally push the floating mass of skins down into the liquid with poles or paddles. It's gentle and effective. Délestage (rack and return) is more dramatic — draining all the liquid off the skins and then pouring it back over — and produces wines with more structural tannin. The options are many, the philosophy is what differentiates producers.",
      },
      {
        heading: "Aging: Oak vs Steel vs Concrete vs Amphora",
        content:
          "Once fermentation is complete, the wine needs a home while it develops complexity. <strong>The vessel choice fundamentally shapes the wine's character</strong>. Stainless steel tanks are inert — they protect the wine from oxidation while preserving fresh fruit aromatics. Most crisp whites (Sauvignon Blanc, light Pinot Grigio, Muscadet) age in steel for exactly this reason. The wine tastes of the grape and the vintage, with no interference.\n\nOak barrels are the traditional choice for wines meant to develop complexity and age-worthiness. Oak is slightly permeable, allowing micro-oxygenation that softens tannins and rounds mouthfeel. More importantly, <strong>new oak adds compounds</strong> — vanillin (vanilla flavor), toast (toasty, smoky), tannins (grippy structure), lactones (coconut and cedarwood notes) — that become part of the wine's flavor profile. The size of the barrel matters: smaller barriques (225 liters) have more wood-to-wine contact than large format barrels (500 liters, demi-muids) or large foudres (thousands of liters), creating more oak influence. New oak is more impactful than older, used oak.\n\nConcrete tanks are having a renaissance — they're inert like steel but thermally stable and somewhat porous, producing wines with great texture and minerality without oak influence. Amphora (clay vessels) are the oldest fermentation and aging vessel in the world, still used in Georgia and increasingly by natural wine producers worldwide, producing wines of distinctive tannic grip and earthy depth.",
      },
      {
        heading: "Malolactic Fermentation: Why Chardonnay Tastes Buttery",
        content:
          "After primary fermentation, most red wines and many white wines go through a second, bacterial fermentation called <strong>malolactic fermentation (MLF)</strong>. This process converts sharp malic acid (think green apples) into softer lactic acid (think milk or cream) — softening the wine's acidity and producing a compound called diacetyl, which smells unmistakably of butter.\n\nIn Chardonnay, the choice of whether to allow or prevent MLF defines the style more than almost any other decision. Allow full MLF plus aging in new French oak and you get the classic Napa or Meursault style: creamy, buttery, vanilla-edged, rich and textured. Block MLF — often by keeping fermentation temperatures low or adding a small amount of sulfur — and you get the lean, mineral, high-acid style of Chablis or Champagne base wine. Both are valid; they're simply different philosophies about what Chardonnay should taste like.\n\n<strong>Nearly all red wine goes through MLF</strong> — it's a natural process that happens in the cellar, often spontaneously. For reds, the impact on texture is the main benefit: MLF softens the harsh edges of primary fermentation, integrates tannins, and rounds out the mouthfeel. Wines that don't complete MLF can feel angular and sharp in their youth. It's one of the reasons winemakers carefully monitor fermentation progress — in temperature-controlled modern wineries, MLF can be induced with specific bacterial cultures or allowed to proceed naturally.",
      },
      {
        heading: "Bottling and Aging Potential",
        content:
          "Bottling is the final decision point before the wine leaves the producer's hands. <strong>Timing matters</strong>: bottle too early and the wine lacks integration; bottle too late and it may have lost freshness. Most wines are bottled between 6 and 24 months after harvest, with longer aging for premium and age-worthy wines. Before bottling, most wines are fined (using agents like egg whites or bentonite clay to clarify and soften) and filtered to remove particles — though some producers skip these steps, believing they strip character.\n\nThe closure also matters. Natural cork allows micro-oxygenation and is associated with long-term aging, but can transmit cork taint (TCA). Screwcaps are perfectly reliable, inert, and increasingly used even for serious wines in New Zealand and Australia — but some producers and markets resist them. Diam closures (technical corks made from agglomerated cork particles treated to remove TCA) offer cork's aesthetic appeal with screwcap's reliability.\n\n<strong>Aging potential is a function of acidity, tannin, and sugar</strong> — the structural elements that allow wine to evolve positively rather than deteriorate. High-acid whites (Riesling, Chenin Blanc, Chablis) can age for decades, softening and developing extraordinary complexity. Big tannic reds (Barolo, Bordeaux, Hermitage) age on the back of their tannin structure, which slowly polymerizes and softens over years. Most wine, however, is made to be drunk now — within 1–5 years of vintage. Knowing which is which prevents the disappointment of opening a wine either too young or past its peak.",
      },
    ],
    relatedJourneyIds: [],
    relatedGrapeIds: ["chardonnay", "syrah"],
    quizId: "winemaking-process-quiz",
  },

  // ── GUIDE 11 (INTERMEDIATE) ───────────────────────────────────────────────────
  {
    id: "classifications",
    title: "Understanding Wine Classifications",
    subtitle: "From Bordeaux's 1855 rankings to Italy's DOCG — the systems that define prestige",
    category: "fundamentals",
    level: "intermediate",
    description:
      "Wine classification systems can feel like hieroglyphics, but they encode centuries of accumulated knowledge about which vineyards and producers reliably produce the best wine. This guide decodes them, region by region.",
    readTimeMinutes: 10,
    icon: "label",
    heroImage: "/guides/illus-05-pyramid.webp",
    sections: [
      {
        heading: "Why Classifications Exist",
        content:
          "Long before the internet, before wine critics, before the 100-point scale, buyers needed a reliable way to know which bottles were worth paying more for. <strong>Classification systems are the original quality signal</strong> — a way of encoding market wisdom and critical judgment into a durable framework that could survive individual buyers and critics.\n\nThe oldest surviving classifications are based on two things: land and reputation. Certain vineyards, through their consistent production of exceptional wine over generations, earned recognition that became formalized into legal hierarchies. In Europe, where winemaking has been continuous for centuries, these systems have extraordinary depth — the 1855 Bordeaux classification ranks châteaux whose reputations were already well established by that point.\n\nModern classifications add a layer of regulatory control: defining not just which producers are recognized as quality leaders, but what they're allowed to grow, how much they can produce, and how they must make the wine. The classification becomes a guarantee of style as much as quality — which is why a Chablis tastes reliably different from a Meursault even when both are excellent.",
      },
      {
        heading: "France: AOC, Cru Classé, Grand Cru, Premier Cru",
        content:
          "France's classification system operates at multiple levels simultaneously. At the broadest level, the <strong>Appellation d'Origine Contrôlée (AOC/AOP)</strong> system defines which wines can use which geographic names, what grapes are permitted, and what practices must be followed. Every French wine of consequence exists within this framework.\n\nBordeaux's 1855 Classification is the most famous and most frozen. Commissioned by Napoleon III for the Paris Universal Exhibition, it ranked 61 red wine châteaux from the Médoc (and one from Graves — Haut-Brion) into five growths, from Premier Cru to Cinquième Cru. The ranking was based on the market prices achieved by those châteaux at the time, which turned out to be a surprisingly reliable proxy for quality. <strong>Only one château has been promoted since 1855</strong>: Mouton Rothschild, elevated from Second to First Growth in 1973. The rest of the classification is essentially unchanged after 170 years.\n\nIn Burgundy, the system is vineyard-based rather than producer-based, which is a fundamentally different philosophy. The hierarchy runs: regional (Bourgogne), village or communal (e.g., Gevrey-Chambertin), Premier Cru (a specific high-quality vineyard, of which there are about 640), and <strong>Grand Cru</strong> (the 33 greatest sites, producing around 1% of total Burgundy output). The same Grand Cru vineyard might be divided among 20 different producers — which is why the producer matters as much as the vineyard in Burgundy.",
      },
      {
        heading: "Italy: DOCG, DOC, IGT — The Quality Pyramid",
        content:
          "Italy's classification system, broadly similar to France's AOC structure, has three main levels. <strong>DOC (Denominazione di Origine Controllata)</strong> is the basic geographic and stylistic guarantee, defining which grape varieties, production methods, and aging requirements apply to a given region. There are over 300 DOC zones across Italy.\n\nDOCG (Denominazione di Origine Controllata e Garantita) is the top tier — the 'G' stands for 'Guaranteed,' meaning the wines are also subject to tasting panels before release. Famous DOCGs include Barolo, Barbaresco, Brunello di Montalcino, Chianti Classico, and Amarone della Valpolicella. These names on a label guarantee a specific style and minimum quality.\n\nThe most interesting — and counterintuitive — category is <strong>IGT (Indicazione Geografica Tipica)</strong>, which is theoretically the humblest designation but includes some of Italy's most celebrated wines. The Super Tuscans — Sassicaia, Tignanello, Ornellaia — are classified as IGT because they were made from international varieties (Cabernet Sauvignon, Merlot) that weren't permitted under the existing DOC rules. So wines worth hundreds of euros per bottle carry the same classification as basic table wine. The IGT label is a warning that the classification system isn't always a reliable guide to quality.",
      },
      {
        heading: "Spain: DO, DOCa, and Vino de Pago",
        content:
          "Spain's system closely parallels France and Italy, with <strong>DO (Denominación de Origen)</strong> as the standard quality tier and DOCa (Denominación de Origen Calificada) as the higher designation — currently awarded only to Rioja and Priorat. Within DO wines, Spain adds its own unique aging classification system: Joven (young), Crianza (minimum aging), Reserva (extended aging), and Gran Reserva (maximum aging), with specific legal minimums for time in oak and bottle for each category.\n\nThe highest individual-estate classification in Spain is <strong>Vino de Pago</strong> — a designation for a single estate of exceptional quality that has been awarded its own protected designation independent of the DO system. Currently there are around 20 recognized Pagos, mostly in Castile. It's similar in concept to Burgundy's Grand Cru but estate-based rather than vineyard-based.\n\nSpain's classification system rewards aging time as a proxy for quality, which works well for traditional regions like Rioja but can disadvantage modern producers who make better wine with shorter barrel time and higher-quality fruit. As a result, some forward-thinking Spanish producers are bottling under the most basic classification to have maximum freedom — a parallel to the Italian Super Tuscan situation.",
      },
      {
        heading: "Germany: Prädikatswein and the VDP",
        content:
          "Germany's classification is unique because it's based primarily on <strong>ripeness at harvest</strong> rather than geography. The Prädikatswein system (from Kabinett through Spätlese, Auslese, Beerenauslese, and Trockenbeerenauslese) ranks wines by how ripe the grapes were when picked — which correlates loosely with sweetness and concentration. Kabinett wines are the driest and most delicate; TBA (Trockenbeerenauslese) wines are made from individually selected, botrytized berries and are among the rarest, sweetest, most expensive wines in the world.\n\nThe <strong>VDP (Verband Deutscher Prädikatsweingüter)</strong> is a private association of Germany's top estates that has created its own parallel quality classification more focused on vineyard site. VDP wines are recognizable by the eagle logo and carry a Burgundy-inspired hierarchy: Gutsweins (estate level), Ortswein (village level), Erste Lage (First Cru), and <strong>Grosses Gewächs</strong> (Great Growth — the German equivalent of Grand Cru). VDP membership is voluntary but selective, and VDP Grosses Gewächs from top sites in the Mosel, Rheingau, or Pfalz are among Germany's most prestigious wines.\n\nOne complexity: the Prädikat system applies to wines of any sweetness level at a given ripeness tier. A wine labeled Spätlese can be off-dry or bone dry depending on the producer. The VDP GG designation is always dry, which helps clarify the style.",
      },
      {
        heading: "New World: AVA, GI — Why They Work Differently",
        content:
          "The American Viticultural Area (AVA) system and Australia's Geographical Indication (GI) system are fundamentally more permissive than their European counterparts. <strong>They define boundaries, not rules</strong>. An AVA in California tells you the wine comes from that geography; it doesn't tell you what grapes were grown, how the wine was made, what yields were permitted, or what quality standards were required. The winemaker has complete freedom within those geographic bounds.\n\nThis has advantages: it encourages innovation and doesn't lock producers into historical grape varieties or traditional styles. The emergence of Rhône varieties in California or Italian grapes in Australia wouldn't have been possible under a European-style regulatory framework. New World producers can experiment freely, and the best of them do so brilliantly.\n\nThe limitation is that geographic designations like 'Napa Valley' or 'Barossa Valley' don't guarantee much beyond origin. The quality signal comes from the producer's reputation, which the buyer has to evaluate independently. Some sub-AVAs (like Oakville, Rutherford, or Stags Leap within Napa) have developed strong enough track records that they carry meaningful quality associations — but this is market-created reputation, not regulatory guarantee.",
      },
    ],
    relatedJourneyIds: ["france-in-five-regions"],
    relatedGrapeIds: [],
    quizId: "wine-classifications-quiz",
  },

  // ── GUIDE 12 (INTERMEDIATE) ───────────────────────────────────────────────────
  {
    id: "wine-service",
    title: "Wine Service: Temperature, Decanting & Glassware",
    subtitle: "The practical stuff that makes a real difference between a good glass and a great one",
    category: "tasting",
    level: "intermediate",
    description:
      "Serving wine correctly isn't fussiness — it's the difference between experiencing a wine at its best or missing what makes it special. Temperature, decanting, and glass shape all genuinely matter. Here's what you need to know.",
    readTimeMinutes: 8,
    icon: "tasting",
    heroImage: "/guides/illus-03-glasses.webp",
    illustrations: [{ src: "/guides/illus-04-temperature.webp", alt: "Wine serving temperature guide", afterSection: 1 }],
    sections: [
      {
        heading: "Temperature: Most Reds Too Warm, Most Whites Too Cold",
        content:
          "Here's the uncomfortable truth about wine temperature: most people drink it wrong. Most reds are served <strong>too warm</strong> — 'room temperature' in a modern heated home is 22–24°C, which is hot enough to make alcohol seem harsh and mute the more delicate aromatic compounds. Most whites are served <strong>too cold</strong> — straight from a 4°C refrigerator, flavor compounds are suppressed and you're essentially tasting cold liquid rather than wine.\n\nThe practical target temperatures: light, crisp whites (Pinot Grigio, Vinho Verde, basic Sauvignon Blanc) work well at 8–10°C. Full-bodied whites (white Burgundy, Viognier, Alsatian Pinot Gris) are better at 12–14°C — they need some warmth to express their texture and complexity. Light reds (Beaujolais, lighter Pinot Noir) can be served at 14–15°C, slightly chilled — genuinely refreshing and often revelatory. Medium reds (Chianti, Rioja Crianza) at 16–17°C. Full-bodied reds (Bordeaux, Barolo, Napa Cabernet) at 17–18°C.\n\nThe simple rule: put your reds in the fridge for 20–30 minutes before serving, and take your whites out of the fridge 20–30 minutes before serving. These adjustments alone will noticeably improve the experience. <strong>A wine thermometer costs almost nothing</strong> and takes the guesswork out entirely.",
      },
      {
        heading: "Decanting: When, Why, and How Long",
        content:
          "Decanting serves two distinct purposes, and confusing them is one of the most common wine service mistakes. The first purpose is <strong>sediment removal</strong>: old wines (particularly vintage Port and Bordeaux over 10 years) develop sediment — tannin and pigment compounds that have polymerized and precipitated out of solution. This is completely natural and not a fault, but drinking sediment is gritty and unpleasant. Decanting slowly against a light source allows you to see the sediment moving and stop pouring before it enters the decanter.\n\nThe second purpose is <strong>aeration</strong> — exposing the wine to oxygen to open up the aromas and soften the tannins. Young, structured reds (a current-release Barolo, a just-released Napa Cabernet, a tight young Bordeaux) can benefit enormously from an hour or two of breathing in a decanter. The oxygen softens tannins and allows the aromatics to develop. How long? A general rule: the younger and more tannic the wine, the longer it benefits from decanting. A young Barolo can handle 2–3 hours; a lighter Pinot Noir might need only 20–30 minutes.\n\nOld wines need careful handling. An aged Burgundy that's 20 or 30 years old should be decanted just before serving — enough to remove sediment but without excessive oxygen exposure, which can cause the wine to fade within minutes. The delicate tertiary aromas that make old wine magical (forest floor, dried flowers, tobacco) are volatile and disappear with too much air. <strong>For old wines, timing is everything</strong>.",
      },
      {
        heading: "Glassware: Why Shape Matters",
        content:
          "Wine glass shapes are not just aesthetic choices — they genuinely affect how the wine smells, tastes, and feels. The key variables are the bowl size (which determines how much wine can be swirled and how much aromatic surface area is exposed), the bowl shape (which directs the wine to different parts of the palate when you drink), and the rim diameter (which determines how concentrated the aromatics are when you put your nose in the glass).\n\n<strong>Bordeaux glasses</strong> are large, tall, and relatively narrow at the rim — designed for full-bodied, tannic reds. The size allows aeration; the narrower rim concentrates the complex aromatics of Cabernet-based wines. <strong>Burgundy glasses</strong> are broader and more balloon-shaped, with a wide bowl and slightly narrower rim — designed to capture and concentrate the delicate, complex aromatics of Pinot Noir and Chardonnay. The wide bowl allows vigorous swirling without spillage.\n\nFlutes for sparkling wine direct the bubbles and concentrate the carbonation — though many sommeliers now serve Champagne in a white wine glass, arguing that the flute suppresses the complexity of the wine. Universal glasses — a compromise shape that works reasonably well for most wines — are the practical choice for most households. <strong>The single most important thing</strong> is that the glass is large enough to swirl without spilling, clean (not perfumed with soap residue), and held by the stem so your hand doesn't warm the wine.",
      },
      {
        heading: "Opening and Pouring",
        content:
          "Removing a wine capsule and cork is a skill worth developing properly, not because of tradition, but because a badly opened wine is a minor annoyance and a broken cork falling into the glass is a genuine problem. <strong>A waiter's friend corkscrew</strong> (the folding kind with a serrated knife, a worm, and a double-hinged lever) is the most reliable tool for most bottles — it's compact, durable, and effective once you get the technique right.\n\nThe technique: cut the capsule below the lip of the bottle (not above it) with the small knife, wipe the top of the cork, insert the worm at a slight angle to the center of the cork, and use the two-stage lever to withdraw it smoothly. For old wines with fragile corks, an Ah-So opener (two thin blades that slide down both sides of the cork and grip it) is gentler and less likely to push a crumbling cork into the bottle.\n\nPouring: a standard pour in a restaurant is 150ml (about 5oz) per glass — a 750ml bottle gives roughly five glasses. At home, generosity is fine, but avoid filling glasses more than a third full; the empty space is where the aromatics collect and swirling happens. <strong>Holding the bottle from the bottom</strong> (not the neck) gives you more control. After pouring, a slight twist of the wrist stops drips.",
      },
      {
        heading: "Ordering Wine at a Restaurant Without Stress",
        content:
          "Restaurant wine lists can feel intimidating, especially when the sommelier is hovering and your guests are waiting. A few practical strategies reduce the stress considerably. First: <strong>tell the sommelier your budget</strong>. This is standard practice among experienced wine buyers and will be met with professionalism, not judgment. Point to a price on the list and say 'something around here' — you don't have to say the number out loud.\n\nSecond: tell them what you're eating. A good sommelier can work with 'we're having fish and pasta' far better than 'something not too heavy.' If there's no sommelier, the house wine or wine-by-the-glass selections are usually safe — restaurants have incentive to make these work. The second-cheapest bottle on any list is usually excellent value (restaurants know that's where customers go when they're trying to avoid the cheapest).\n\nThird: the ritual of tasting before the table is served. You're not being asked to approve the wine; you're being given the opportunity to <strong>check for faults</strong> (particularly cork taint — a musty, wet cardboard smell). If the wine seems fine, approve it confidently. If you're genuinely uncertain, smell it again. If it smells like wet cardboard or vinegar, send it back — any good restaurant will replace it without question.",
      },
    ],
    relatedJourneyIds: [],
    relatedGrapeIds: ["cabernet-sauvignon", "pinot-noir", "chardonnay"],
    quizId: "wine-service-quiz",
  },

  // ── GUIDE 13 (INTERMEDIATE) ───────────────────────────────────────────────────
  {
    id: "wine-faults",
    title: "Wine Faults: When to Send It Back",
    subtitle: "The faults that ruin wine, the ones you can work with, and what's definitely not a fault",
    category: "tasting",
    level: "intermediate",
    description:
      "Knowing when a wine is actually faulty — and when it's just unfamiliar — is one of the most useful skills in wine. This guide walks through the main faults, what causes them, how to recognize them, and what to do about them.",
    readTimeMinutes: 7,
    icon: "scores",
    heroImage: "/guides/illus-08-faults.webp",
    sections: [
      {
        heading: "Cork Taint: The Most Common Fault",
        content:
          "Cork taint is caused by a compound called <strong>2,4,6-Trichloroanisole (TCA)</strong>, produced when certain airborne fungi react with chlorine compounds in natural corks. The result is unmistakable once you've encountered it: a musty, damp smell that's variously described as wet cardboard, wet dog, musty basement, or damp newspaper. It strips the fruit from a wine and replaces it with this overwhelmingly unpleasant musty character.\n\nAt higher concentrations, cork taint is immediately obvious. At lower concentrations — 'threshold taint' — the wine may not smell obviously musty but tastes flat, dull, and stripped of its character. You might not be able to put your finger on what's wrong, but the wine seems somehow less than it should be. This subtler expression is actually more common and harder to diagnose.\n\n<strong>Between 2–5% of all natural cork-sealed wines are affected</strong> by some level of TCA contamination — though estimates vary and the wine industry has worked hard to reduce the incidence. The solution when you encounter cork taint in a restaurant is straightforward: politely tell the sommelier that the wine seems corked. You don't need to be certain. They should smell it, agree or disagree, and if the wine is faulty, replace it without hesitation.",
      },
      {
        heading: "Oxidation: When Air Gets to the Wine",
        content:
          "Oxidation is what happens when wine is exposed to too much oxygen during production or after opening. Controlled oxidation is actually desirable in some wines — the nutty complexity of Sherry and the tawny richness of aged Port come from intentional oxidation. But <strong>unintentional oxidation in a non-oxidative wine</strong> is a fault.\n\nA white wine that's been oxidized will be noticeably brown or amber in color (white wines brown just like cut apples). The fresh fruit aromas are replaced by flat, sherried, applesauce-like notes. The acidity seems to have dropped. In a red wine, oxidation produces a browning at the rim, a flat aroma, and a wine that tastes tired and spiritless.\n\nOxidation can be caused by a compromised closure (a leaking or dried-out cork in storage), poor winemaking hygiene, or simply a wine that's been open too long. A wine that was perfectly fine yesterday can be noticeably oxidized today. <strong>Refrigerating open bottles and using a wine pump</strong> to remove air from the bottle extends life by a day or two, but wine is fundamentally an ephemeral product — the best time to open a bottle is usually with other people, so it gets finished.",
      },
      {
        heading: "Volatile Acidity and Reduction",
        content:
          "Volatile acidity (VA) is the presence of acetic acid — the same compound that makes vinegar smell sharp. At very low levels, VA is a normal component of wine and can actually add complexity. At elevated levels, it becomes a fault: the wine smells sharply of vinegar or nail polish remover (the latter is ethyl acetate, which forms alongside acetic acid). <strong>A wine with high VA is essentially partway to becoming vinegar</strong>.\n\nReduction is almost the opposite problem: not too much oxygen, but too little. Reduced wines smell of sulfur compounds — struck match, rubber, burnt rubber, or in more severe cases, rotten egg. This sounds alarming, but reduction is often temporary and fixable. Many wines that smell reductive when first opened will blow off the sulfur within 20–30 minutes of being poured or decanted. Swirling vigorously helps. Give the wine time before declaring it faulty.\n\nThis is why restaurants pour a small taste before serving — if a wine smells of struck match but tastes fine after swirling, it's likely just reductive and will resolve quickly. <strong>Reduction is one of the most common 'false faults'</strong> — wines that seem wrong but aren't actually flawed, just temporarily closed in on themselves.",
      },
      {
        heading: "Brettanomyces: The Controversial One",
        content:
          "Brettanomyces — usually called 'Brett' — is a wild yeast that produces phenolic compounds in wine, most notably 4-ethylphenol and 4-ethylguaiacol. The resulting aromas are distinctive: <strong>barnyard, horse sweat, leather, saddle, band-aid, medicinal</strong>. Brett is one of the most divisive topics in wine because at low levels, many wine drinkers and critics consider it a complexity-adding characteristic rather than a fault.\n\nClassic Rhône Valley reds, particularly from Châteauneuf-du-Pape, have historically shown elevated Brett levels, and traditional lovers of these wines consider the barnyard character part of the wine's identity. Similarly, some traditional Bordeaux châteaux produce wines with noticeable Brett. The counter-argument is that Brett masks rather than complements terroir expression, and that modern clean winemaking produces more authentic and expressive wines without it.\n\nAt high levels, Brett is unambiguously a fault — the medicinal, band-aid character overwhelms everything else. At low levels, the decision about whether to enjoy it or reject it as a fault is genuinely personal. <strong>Context matters</strong>: a wine from a traditional region with historical Brett notes is different from a fresh, supposedly fruit-forward wine ruined by unexpected barnyard. Trust your nose and your enjoyment — if it bothers you, it bothers you.",
      },
      {
        heading: "Heat Damage and What's Definitely Not a Fault",
        content:
          "Heat-damaged wine — sometimes called a 'cooked' wine — results from exposure to high temperatures during storage or transport. The proteins in wine denature under heat, destroying fruity aromatics and producing flat, jammy, stewed fruit flavors. The wine smells cooked: prune, raisin, jam, or sometimes caramel. The color in reds may be noticeably brown, and the cork may have pushed slightly above the level of the bottle lip (a sign of heat-expansion).\n\nHeat damage cannot be fixed. The chemical changes are permanent. If you open a wine expecting fresh, vivid fruit and find stewed jam instead, suspect heat damage — especially if the closure seems compromised or the bottle was stored somewhere warm. <strong>This is a reason to buy from reputable merchants</strong> who store wine properly, and to be wary of bottles that have spent time on shelves in warm shops or non-temperature-controlled warehouses.\n\nNow, the reassurance: many things in wine that alarm new drinkers are emphatically not faults. <strong>Sediment</strong> in a red wine or port is completely normal — it's just polymerized tannins and pigments, and you can decant the wine to separate them. <strong>Tartrate crystals</strong> — small, white crystal deposits in white wine or on the bottom of a cork — are harmless deposits of tartaric acid (cream of tartar) that have crystallized at cold temperatures. They look alarming but are entirely natural and tasteless. Natural wines may be cloudy, slightly fizzy, and taste yeasty — that can be entirely intentional. When in doubt, smell the wine: if it smells clean and appealing, drink it.",
      },
    ],
    relatedJourneyIds: ["natural-wine-movement"],
    relatedGrapeIds: [],
    quizId: "wine-faults-quiz",
  },

  // ── GUIDE 14 (INTERMEDIATE) ───────────────────────────────────────────────────
  {
    id: "wine-aging",
    title: "Beyond the Basics: How Wine Evolves With Age",
    subtitle: "Primary, secondary, and tertiary aromas — and why patience transforms the greatest wines",
    category: "culture",
    level: "intermediate",
    description:
      "Wine is one of the very few beverages that genuinely improves with age — at least, some wine does. This guide explains the science and art of wine evolution, what to look for, which wines age, and how to store them properly.",
    readTimeMinutes: 9,
    icon: "history",
    heroImage: "/guides/illus-07-aroma.webp",
    sections: [
      {
        heading: "Primary Aromas: The Grape's Voice",
        content:
          "Primary aromas are the first thing you smell in a young wine — the direct, immediate character of the grape variety itself. These are the <strong>fruit, floral, and herbal notes</strong> that are most vivid and expressive in the first few years after a wine is made. Cabernet Sauvignon's blackcurrant and green pepper. Riesling's lime, white peach, and floral blossom. Sauvignon Blanc's cut grass and gooseberry. Pinot Noir's cherry and raspberry. These are primary aromas.\n\nIn a very young wine — say, within the first year or two of release — primary aromas dominate everything. The wine tastes vivid, sometimes exuberantly fruity, often a little raw. The structure (acidity, tannin) can feel sharp and angular because it hasn't integrated yet. Many wine drinkers, accustomed to young, primary wines, have never experienced what happens to those aromas as the wine evolves.\n\n<strong>Primary aromas are the most volatile and fragile</strong>. They're the first to dissipate as a wine ages, giving way to more complex, subtle, and (many would argue) more interesting aromas as the wine evolves. This is the central paradox of wine aging: the things that make a young wine appealing are precisely what fades first. What develops in its place is often far more remarkable.",
      },
      {
        heading: "Secondary Aromas: Fermentation's Contribution",
        content:
          "Secondary aromas come from fermentation — the chemical processes by which yeast converts sugar to alcohol. These include the classic <strong>yeasty, bready, and creamy notes</strong> associated with wines that have spent time aging on their lees (the dead yeast cells left after fermentation). Champagne and Champagne-method sparkling wines are the canonical example: brioche, toast, fresh baked bread, croissant — all secondary aromas from extended lees contact.\n\nFor still wines, secondary aromas include the buttery quality from malolactic fermentation (diacetyl, as discussed in the winemaking guide), the vanilla and toast from oak aging (technically a secondary process), and the yeasty richness that comes from wines fermented on their skins or in barrel. A white Burgundy fermented and aged in new French oak barrels shows primary (Chardonnay fruit) and secondary (butter, toast, hazelnut) aromas in distinct layers.\n\nSecondary aromas tend to be more durable than primary ones — they persist into a wine's middle age, integrating with emerging tertiary complexity. <strong>The best wines at 5–10 years old</strong> typically show primary fruit still present but beginning to mellow, with secondary complexity fully integrated and the first hints of tertiary development beginning to appear. It's an exciting stage — the wine has moved beyond simplicity without losing vibrancy.",
      },
      {
        heading: "Tertiary Aromas: Aging's Gift",
        content:
          "Tertiary aromas — sometimes called 'bouquet' to distinguish them from primary and secondary 'aromas' — develop through oxidation and other chemical reactions during extended aging in bottle. These are the notes that make an old wine feel like a completely different experience from a young one: <strong>leather, tobacco, dried flowers, forest floor, truffle, mushroom, dried fruit, dried herbs, earth, tea, game, smoke</strong>.\n\nIn aged red wines, particularly Bordeaux, Burgundy, and Barolo, tertiary aromas are the reward for patience. A Barolo that smells of tar and roses in its youth — a famous description of young Nebbiolo — develops into something much more complex at 15 or 20 years: dried roses, leather, truffle, tobacco, dried cherry. The tar note softens into a kind of umami richness. The wine has been transformed.\n\n<strong>White wines develop tertiary aromas too</strong> — particularly aged Riesling (petrol, honey, beeswax, lanolin), aged Chenin Blanc (quince, dried apricot, beeswax, honey), and aged white Burgundy (nuttiness, mushroom, hazelnut). The first time you open an old white wine that has developed magnificent tertiary complexity is usually a revelation — these wines bear almost no resemblance to their young selves.",
      },
      {
        heading: "How Tannins Soften Over Time",
        content:
          "Tannins are the structural backbone of age-worthy red wines — the compounds responsible for that firm, drying sensation in young reds. Over time, <strong>tannin molecules polymerize</strong>: they link together into larger chains that are too big to bind to the proteins in your saliva, and so they no longer create that drying, astringent sensation. The wine feels softer, silkier, more harmonious.\n\nAt the same time, tannins combine with anthocyanin pigment molecules, forming larger color compounds that eventually precipitate as sediment. This is why aged red wines are lighter in color than their young selves — some of the color has literally fallen out of the wine as sediment. The remaining color is more brick-red or garnet-orange at the rim rather than the deep purple of youth.\n\nThe practical implication is that <strong>tannic red wines meant for aging should not be opened young</strong>. A Barolo or a top Bordeaux opened at 3–5 years may taste harsh, closed, and unappealing — not because it's a bad wine, but because the tannins haven't had time to soften and integrate. Merchants, sommeliers, and critics will often give a 'drink from' date alongside a score, indicating when a wine is expected to enter its drinking window. Pay attention to these recommendations.",
      },
      {
        heading: "Which Wines Age and Which Don't",
        content:
          "The honest answer is that most wine — perhaps 90% of what is produced — is made to be drunk within 1–5 years of vintage, and will not improve with additional aging. The structural elements that allow wine to age gracefully (high acidity, high tannin, residual sugar, low pH) are also what make young wine feel tight or austere. Most wine is made to be approachable and enjoyable immediately.\n\nThe wines that genuinely age and improve are a relatively small and well-defined group: <strong>top Bordeaux and top Burgundy</strong> (regularly cellared for 10–30 years), Barolo and Barbaresco (10–25 years), Northern Rhône Syrah (Hermitage, Côte-Rôtie), great German Riesling (10–30 years or more), Sauternes (10–50 years), aged Champagne, Vintage Port (20–50 years), and some exceptional examples from Rioja, Ribera del Duero, Australia, and California. Aged Chenin Blanc from the Loire (Savennières, Vouvray) can also develop magnificently.\n\n<strong>Most everyday wine does not age well</strong> and should be drunk young and fresh. This includes most under-$20 wine, most rosé, most Pinot Grigio and basic Sauvignon Blanc, most light reds. Trying to age these wines results in a wine that has lost its primary fruit without developing interesting tertiary complexity — just a faded, flat version of what it once was.",
      },
      {
        heading: "Practical Storage: Temperature, Humidity, Light, Vibration",
        content:
          "If you're going to age wine, you need to store it properly — otherwise, you'll open a bottle in 10 years and find that poor storage has ruined what should have been something magnificent. <strong>Temperature is the most critical factor</strong>: wines should be stored at around 12–14°C (54–57°F), consistent year-round. Temperature fluctuation — not just high temperature — is damaging, because repeated expansion and contraction degrades the wine and eventually compromises the closure.\n\nHumidity should be moderate — around 70% — to prevent corks from drying out and allowing air ingress. If corks dry out completely, the seal is compromised and the wine oxidizes. This is why traditional wine cellars are underground: the earth naturally maintains both a cool, stable temperature and moderate humidity. If you're using a wine fridge rather than a cellar, look for one with humidity control.\n\nLight — particularly UV light — degrades wine over time by breaking down certain aromatic compounds. Wine bottles are dark-colored for exactly this reason, but even so, wines should be stored away from direct light. <strong>Vibration is also damaging</strong> over extended periods — it disturbs sediment and can affect the chemical reactions in aging wine. This is why positioning bottles horizontally (label up so you can see without disturbing the sediment) in a vibration-free environment is the traditional and correct approach.",
      },
    ],
    relatedJourneyIds: [],
    relatedGrapeIds: [],
  },

  // ── GUIDE 15 (INTERMEDIATE) ───────────────────────────────────────────────────
  {
    id: "sub-appellations",
    title: "Wine Regions Masterclass: Sub-Appellations That Matter",
    subtitle: "When a region isn't just a region — how geography shapes personality at the neighborhood level",
    category: "regions",
    level: "intermediate",
    description:
      "Inside every great wine region is a set of smaller, more specific places that wine lovers argue about obsessively. This guide explains what makes sub-appellations distinctive and why the difference between Pauillac and Margaux matters more than you might think.",
    readTimeMinutes: 12,
    icon: "styles",
    heroImage: "/guides/photo-sub-appellations.webp",
    sections: [
      {
        heading: "Why Sub-Appellations Matter",
        content:
          "The bigger the region, the less the name on the label tells you about what's in the glass. 'Bordeaux' covers over 120,000 hectares and 60 sub-appellations producing red, white, sweet, rosé, and sparkling wine. <strong>'Pauillac' covers 1,200 hectares and produces only red wine</strong> from Cabernet Sauvignon-dominant blends on gravel-and-clay soils that produce some of the most structured, long-lived wine in the world. These are radically different levels of specificity.\n\nSub-appellations encode geographical and stylistic distinctions that took centuries to discover and codify. The differences between neighboring appellations are real: different soil types, different drainage patterns, different aspects and elevations, different microclimates created by topography. The winemakers who know these places intimately can feel and taste the differences between plots that are separated by a few hundred meters. The sub-appellation system exists to make those differences visible and legally protected.\n\nLearning sub-appellations rewards you in practical terms: <strong>knowing the difference between the Bordeaux appellations</strong> means you can predict whether you're getting something Merlot-dominant and approachable (Pomerol, St-Émilion) or Cabernet Sauvignon-dominant and structured (Pauillac, St-Julien). That knowledge translates directly into better choices at the wine shop or restaurant.",
      },
      {
        heading: "Bordeaux: Pauillac vs Margaux vs St-Émilion",
        content:
          "The Left Bank of Bordeaux is dominated by <strong>Cabernet Sauvignon</strong> on gravelly soils deposited by the Gironde estuary. But within this broad template, the sub-appellations are genuinely distinct. Pauillac — home to three of the five First Growths (Lafite, Latour, Mouton) — produces the most powerful, tannic, and structured wines of the Médoc. Pauillac is built for the long haul: most great Pauillacs need 15–25 years to fully open.\n\nMargaux, just to the south, is different in character. The soils are similar but with more clay, and somehow the wines — including Château Margaux, the First Growth — have a delicacy and perfume that makes them feel more feminine, more lifted, more floral. Classic descriptions include 'velvet glove' rather than Pauillac's 'iron fist.' The fragrance of a great Margaux is one of wine's most memorable experiences.\n\nCross the Gironde to the Right Bank and everything changes. <strong>St-Émilion and Pomerol</strong> are Merlot country — clay soils, softer wines, more approachable in youth. St-Émilion has its own classification (completely separate from the 1855 system, and controversially revised every decade), with Premier Grand Cru Classé at the top. Pomerol has no official classification, yet Pétrus — a tiny estate of unique clay — is one of the world's most expensive wines.",
      },
      {
        heading: "Burgundy's Four-Level Hierarchy",
        content:
          "Burgundy operates the most rigorous and intellectually satisfying vineyard classification in the wine world. <strong>Four levels of specificity</strong>, each representing a real quality distinction based on centuries of observation: Bourgogne Régional (broad, regional wines), Communale or Village (wines from a specific village's territory, e.g., Gevrey-Chambertin), Premier Cru (a specific high-quality named vineyard within that village, e.g., Gevrey-Chambertin 'Clos Saint-Jacques'), and Grand Cru (the 33 greatest individual vineyards in Burgundy, e.g., 'Chambertin').\n\nThe distinction between a village wine and a Premier Cru from the same producer can be remarkable — and instructive. The same domaine, the same vintage, the same winemaking, but different plots. Tasting them side by side is one of the clearest demonstrations that terroir is real: the grand cru wine is simply more complex, more layered, more persistent. The money buys you something specific.\n\nAt the top, the <strong>Grand Crus of the Côte de Nuits</strong> (Chambertin, Musigny, Romanée-Conti, Richebourg, La Tâche) and Côte de Beaune (Montrachet, Corton-Charlemagne, Bâtard-Montrachet) are benchmarks by which all other wines in the world are sometimes measured. They're expensive because they're genuinely exceptional and desperately scarce. If you ever have the opportunity to taste one, it's worth it.",
      },
      {
        heading: "Barolo vs Barbaresco: Same Grape, Different Personality",
        content:
          "Both Barolo and Barbaresco are made from <strong>100% Nebbiolo</strong> in the Langhe hills of Piedmont. Both are among Italy's most celebrated wines. And yet they are noticeably different experiences, shaped by geography that creates distinct microclimates and soil compositions within a relatively small area.\n\nBarolo is the bigger, more structured wine — higher in tannin, more powerful, requiring more aging before it opens. The Barolo zone is divided into historic subzones (comuni): Serralunga d'Alba produces the most austere, tannic, longest-lived Barolos; La Morra and Barolo village produce silkier, more aromatic, earlier-maturing wines. <strong>The terroir variation within Barolo itself</strong> rivals the differences between different regions in other countries.\n\nBarbaresco is smaller, slightly lower in tannin, and generally more approachable earlier — but no less complex. The three main villages (Barbaresco, Neive, Treiso) each produce wines with distinct characteristics. Producers like Gaja (Barbaresco) and Giacomo Conterno (Barolo) have built international reputations on the distinctiveness of their specific terroirs. Learning to distinguish between these two great wines — and between their internal geographies — is one of the more rewarding challenges in Italian wine.",
      },
      {
        heading: "Northern vs Southern Rhône",
        content:
          "The Rhône Valley is divided into two distinct wine worlds by a geographic gap of about 50 kilometers where virtually no vines are planted. <strong>The Northern Rhône is Syrah's kingdom</strong>: a narrow band of near-vertical granite terraces flanking the river, where Côte-Rôtie ('roasted slope'), Hermitage, Cornas, and Saint-Joseph produce the world's greatest and most age-worthy Syrah. These are wines of smoked meat, violet, black olive, iron, and extraordinary density — sometimes comparable in structure to top Bordeaux.\n\nViognier — one of the world's most seductively aromatic white grapes — also comes from the Northern Rhône, specifically Condrieu and Château-Grillet. These wines have essentially no parallel elsewhere: rich, opulent, peach and apricot and blossom-scented, with low acidity but extraordinary aromatic complexity.\n\nThe Southern Rhône is Mediterranean, warm, and dominated by <strong>Grenache-based blends</strong> — Châteauneuf-du-Pape (which can blend up to 13 grape varieties), Gigondas, Vacqueyras, Rasteau. These are ripe, generous, sun-soaked wines of red and dark fruit, garrigue (wild herbs of the Provençal hills), and spice. The contrast between a Côte-Rôtie and a Châteauneuf-du-Pape is an object lesson in how radically the same river valley can produce different wine worlds.",
      },
      {
        heading: "Napa Sub-AVAs: Where It Gets Specific",
        content:
          "Napa Valley itself is an AVA, but within it, <strong>16 sub-AVAs</strong> have been established that encode meaningful geographical distinctions. As Napa's reputation grew from the 1970s onward, producers and critics noticed that wines from different parts of the valley tasted distinctly different, and the sub-AVA system was developed to codify those differences.\n\nOakville and Rutherford, in the central valley floor, produce classic Napa Cabernet: full-bodied, rich, structured, with what Rutherford winemakers call 'Rutherford dust' — a distinctive earthy, mineral quality in the tannins attributed to the benchland's unique gravelly loam soils. <strong>Stags Leap District</strong>, in the southeastern corner, has softer, more velvety tannins and was the site of the 1976 Judgment of Paris win that put California on the world map.\n\nMount Veeder, Spring Mountain, and Howell Mountain are mountain AVAs — higher altitude, cooler temperatures, volcanic and rocky soils producing smaller berries with more concentrated flavors. Mountain Napa Cabernets tend to be firmer, more structured, and longer-lived than valley floor wines. The different characters of these sub-AVAs represent decades of observation and the maturing understanding that Napa, like Burgundy, is a landscape of microclimates rather than a monolithic whole.",
      },
    ],
    relatedJourneyIds: ["france-in-five-regions", "italy-north-to-south"],
    relatedGrapeIds: [],
  },

  // ── GUIDE 16 (EXPERT) ────────────────────────────────────────────────────────
  {
    id: "biodynamic",
    title: "Biodynamic Wine: Science, Philosophy & the Calendar",
    subtitle: "From Rudolf Steiner's cosmic agriculture to Romanée-Conti — the most rigorous farming philosophy in wine",
    category: "culture",
    level: "expert",
    description:
      "Biodynamic farming divides wine people like almost nothing else: its practitioners include some of the world's greatest producers, its critics include some of its finest scientists. This guide examines what biodynamics actually is, what its great practitioners do, and what the evidence says.",
    readTimeMinutes: 10,
    icon: "natural",
    heroImage: "/guides/photo-biodynamic.webp",
    sections: [
      {
        heading: "Rudolf Steiner and the Origins",
        content:
          "Biodynamic agriculture begins with a series of eight lectures delivered in 1924 by <strong>Rudolf Steiner</strong>, an Austrian philosopher, social reformer, and founder of anthroposophy. Steiner was responding to a group of farmers who had noticed that agricultural yields and soil health were declining across Europe after decades of increasingly intensive conventional farming. His response was not incremental — it was radical.\n\nSteiner proposed treating the farm as a <strong>self-sustaining organism</strong>, connected to larger rhythms of the cosmos: the moon, the planets, the stars. He spoke of 'cosmic forces' and 'spiritual forces' shaping the health of plants and soil. His framework incorporated homeopathic preparations, lunar calendars, and a holistic view of the farm ecosystem that was profoundly at odds with the reductionist, chemistry-based agriculture that was then becoming dominant.\n\nSteiner himself never farmed, and he died in 1925 before he could see biodynamics fully implemented. But his ideas were taken up by practitioners who developed the system into a coherent agricultural practice, eventually codified and certified by the organization <strong>Demeter International</strong>, now the global standard-setting and certifying body for biodynamic agriculture. Today, Demeter-certified farms operate in over 60 countries.",
      },
      {
        heading: "The Preparations: Horn Manure and Horn Silica",
        content:
          "The most iconic — and to critics, most baffling — elements of biodynamic practice are the nine 'preparations': specially made amendments designed to stimulate soil life, encourage root development, and improve plant health. Each is prepared in a specific way, often involving animal organs as vessels, and applied in homeopathic dilutions after vigorous stirring (dynamization) in water.\n\n<strong>Preparation 500 (horn manure)</strong> is made by packing fresh cow manure into a cow horn and burying it in the soil over winter. The horn is unearthed in spring and the transformed, earthy material inside is diluted in warm water — stirred for one hour in alternating directions — and sprayed on the soil. The goal is to stimulate soil microbial life and root growth. <strong>Preparation 501 (horn silica)</strong> uses finely ground quartz crystal packed into a horn and buried in summer; the resulting material is sprayed on foliage in minute quantities to stimulate photosynthesis and improve plant resistance.\n\nThe scientific explanation for these preparations is contested. There is no credible mechanism by which such extreme dilutions could have a direct chemical effect. Biodynamic proponents argue that the preparations work through stimulating soil biology in ways that conventional soil science doesn't fully account for, or through energetic mechanisms not yet understood. What's less disputed is that biodynamic vineyards consistently show high levels of soil microbial diversity and organic matter — possibly because the farming system as a whole (no synthetic inputs, cover crops, diverse plant life) creates beneficial conditions regardless of the specific preparations.",
      },
      {
        heading: "The Biodynamic Calendar",
        content:
          "Maria Thun, a German biodynamic researcher, spent decades studying the relationship between lunar cycles and plant growth, publishing her findings as the <strong>Biodynamic Calendar</strong> — now used by thousands of farmers worldwide. The calendar divides days into four types based on which element the moon is in as it transits the zodiac: <strong>Root days</strong> (earth signs — Capricorn, Taurus, Virgo), Flower days (air signs), Fruit days (fire signs — Aries, Leo, Sagittarius), and Leaf days (water signs — Pisces, Cancer, Scorpio).\n\nThe claim is that plants respond to these cosmic rhythms: root days are best for working with root vegetables and red wines (which should be drunk, harvested, or bottled on fruit days for optimal expression). Fruit days — when wines are said to taste most expressive and vibrant — are the preferred days for tasting and selling wine. Some critics and sommeliers organize their most important tastings on fruit days as a matter of professional standard.\n\nThe scientific evidence for the biodynamic calendar is thin. Controlled experiments trying to distinguish wine tasted on fruit days from wine tasted on other days have generally failed to find statistically significant differences. <strong>But many experienced tasters swear by it</strong>, and the practice remains influential among serious wine professionals. Whether the mechanism is cosmic, placebo, or something else entirely is a question the wine world has chosen to leave open.",
      },
      {
        heading: "Who Practices It: DRC, Leroy, and the Greats",
        content:
          "Biodynamics has attracted an extraordinary concentration of the wine world's most celebrated producers. In Burgundy, <strong>Domaine de la Romanée-Conti (DRC)</strong> — possibly the world's most famous winery — has been biodynamic since the early 1990s. Domaine Leroy, run by the legendary Lalou Bize-Leroy, is perhaps the most rigorous biodynamic practitioner in Burgundy, farming with fanatical attention to soil health and vine vitality. The yields at Leroy are astonishingly low, the wines astonishingly complex.\n\nIn Alsace, <strong>Zind-Humbrecht</strong> is one of the region's reference producers, biodynamic since 1997. In the Rhône, Chapoutier — one of the largest wine producers in the region — practices biodynamics across its entire portfolio, a remarkable commitment given the scale. In Austria, <strong>Nikolaihof</strong> in the Wachau is the oldest biodynamic wine estate in Austria, certified since 1971.\n\nThe list of great biodynamic producers is long enough to suggest that the philosophy either attracts exceptional people or makes exceptional wine, or both. Nicolas Joly at Coulée de Serrant in the Loire is perhaps biodynamics' most vocal advocate — his estate produces Chenin Blanc of startling longevity and complexity. Whether biodynamics is the cause or the correlation of excellence is the debate that refuses to be settled.",
      },
      {
        heading: "The Debate: Science vs Belief",
        content:
          "The scientific community's position on biodynamics is broadly skeptical of its theoretical framework while acknowledging some of its practical outcomes. <strong>The cosmic forces and planetary influences are not scientifically established</strong>. The preparations are applied at dilutions that would have no detectable chemical effect. The biodynamic calendar lacks robust experimental support.\n\nWhat research does show is that biodynamically farmed soils tend to have higher levels of microbial diversity, organic matter, and earthworm activity than conventionally farmed soils. This is probably attributable to the prohibition on synthetic inputs and the emphasis on building soil health through compost and cover crops — standard principles of good organic farming that don't require the cosmic framework to work.\n\nThe debate within wine is whether the philosophical framework matters or whether the outcomes are what count. Many producers practice what might be called 'biodynamic lite': following the organic farming principles, applying some preparations, but not necessarily subscribing to every aspect of Steiner's cosmology. Others are full believers. The practical reality is that <strong>the farming system works</strong>, producing healthy vines, expressive wines, and demonstrably better soil health than intensive conventional viticulture — whatever the mechanism.",
      },
      {
        heading: "Biodynamic vs Organic vs Natural: The Differences",
        content:
          "These three approaches are often conflated but represent distinct philosophies at different levels of rigor. <strong>Organic</strong> is the baseline certification: no synthetic pesticides, herbicides, or fertilizers in the vineyard, and restricted use of additives in the cellar. It's a well-defined regulatory standard. Most biodynamic farms are also certified organic; they go further.\n\n<strong>Biodynamic</strong> includes organic farming plus the Steiner-derived philosophical framework: the nine preparations, the biodynamic calendar, the farm-as-organism concept, and usually a stricter standard on self-sufficiency (the estate should ideally produce its own compost, keep animals, cultivate diverse plant life). Demeter certification is the recognized standard. Biodynamics is more demanding than organic and represents a more comprehensive commitment to the farming philosophy.\n\n<strong>Natural wine</strong> is neither a certification nor a farming standard — it's a cellar philosophy. Natural wine producers use minimal intervention: wild yeast fermentation, no added sugar, no fining or filtration, minimal or no added sulfur dioxide. Many natural wine producers are organic or biodynamic in the vineyard, but the 'natural' designation is specifically about what happens (or doesn't happen) in the winery. You can have organic grapes processed conventionally; you can have conventionally farmed grapes made into natural wine. The categories overlap but are not the same thing.",
      },
    ],
    relatedJourneyIds: ["natural-wine-movement"],
    relatedGrapeIds: ["pinot-noir"],
  },

  // ── GUIDE 17 (EXPERT) ────────────────────────────────────────────────────────
  {
    id: "orange-wine",
    title: "Orange Wine & Skin-Contact: The Ancient Future",
    subtitle: "Why the wine world's most polarizing style is also its oldest — and what it actually tastes like",
    category: "culture",
    level: "expert",
    description:
      "Orange wine is white wine made like red wine — with skin contact during fermentation. It's been made in Georgia for 8,000 years. It was rediscovered in Friuli in the 1990s. Now it's everywhere. This guide explains what it is, why it matters, and whether you'll like it.",
    readTimeMinutes: 9,
    icon: "natural",
    heroImage: "/guides/photo-orange-wine.webp",
    sections: [
      {
        heading: "What Orange Wine Actually Is",
        content:
          "The name is confusing and the look is distinctive, but the concept is simple: <strong>orange wine is white wine made with extended skin contact</strong>. White grapes, fermented with their skins, seeds, and sometimes stems intact — the same technique used to make red wine, just with white grape varieties. The extended contact with skins extracts tannins and phenolic compounds that white wine normally lacks, along with pigments that turn the wine from pale straw or yellow to amber, orange, or even deep gold.\n\nThe result is a wine that occupies a genuinely new category: it has the fruit aromatics of a white wine but the tannic structure of a light red. It tends toward savory, nutty, oxidative flavors rather than the fresh fruit and acidity of conventional whites. It's often cloudy from natural particles. It can be divisive — the tannins and oxidative quality are unfamiliar to drinkers accustomed to conventional white wine — but for those who connect with it, it becomes one of the most compelling and versatile food wines imaginable.\n\n<strong>The color depends on maceration time</strong>: a few hours of skin contact might produce a barely tinted rosé-like white; a few days produces a light orange tint; weeks or months produces the deep amber color that gives these wines their name. The longer the maceration, the more tannin, the more phenolic complexity, the more pronounced the oxidative character.",
      },
      {
        heading: "Georgia's 8,000-Year Qvevri Tradition",
        content:
          "The world's oldest wine culture didn't just make wine — it made orange wine, and it's been doing so continuously for approximately 8,000 years. In the Kakheti region of eastern Georgia, <strong>white grapes are fermented with their skins in clay vessels called qvevri</strong> — large, egg-shaped pots that are buried in the ground up to their necks. The earth maintains a cool, consistent temperature for fermentation; the egg shape promotes a gentle churning action that keeps the skins in contact with the juice without mechanical intervention.\n\nThe Kakhetian method — traditional to eastern Georgia — involves fermenting the entire harvest, grapes, skins, seeds, and stems, in the qvevri and leaving it all in contact for months. The resulting wines are deeply extracted, tannic, and amber-colored, with extraordinary complexity and savory, nutty depth. These aren't wines made in a primitive fashion; they're wines made in a sophisticated fashion that happens to be 8,000 years old.\n\nIn western Georgia, the Imeretian method uses less skin contact — sometimes just a few weeks — producing lighter, more delicate wines. Both traditions were nearly wiped out during Soviet collectivization, when industrial production replaced traditional qvevri winemaking. The revival of Georgian qvevri wine since independence, and particularly since the 2000s, is one of the wine world's most remarkable cultural recoveries. <strong>UNESCO recognized the qvevri winemaking tradition</strong> as an Intangible Cultural Heritage in 2013.",
      },
      {
        heading: "The Friuli Pioneers: Gravner, Radikon, Princic",
        content:
          "The modern orange wine movement has a specific genesis point: northeastern Italy's Friuli-Venezia Giulia region in the 1990s. <strong>Josko Gravner</strong> is the pivotal figure — a conventional, technically accomplished winemaker who became increasingly dissatisfied with what modern technology was doing to wine, and who made a journey to Georgia in the late 1990s that changed his direction entirely.\n\nGravner returned to Friuli and began making wine in amphora and qvevri, with extended skin maceration, in the ancient Caucasian style. The wine was nothing like what anyone in Friuli was making. It was controversial, polarizing, and — for those who got it — extraordinary. His neighbor and friend <strong>Stanko Radikon</strong> followed a parallel path, making wines from Ribolla Gialla and other native varieties with skin maceration and minimal intervention. Dario Princic, another Friulian, added further voice to what was becoming a movement.\n\nThese producers didn't just make orange wine — they articulated a philosophy about what wine should be: an expression of place and variety, made without technological artifice, capable of aging magnificently and pairing brilliantly with food. The international wine community took notice slowly and then all at once. By the 2010s, <strong>skin-contact white wine had become one of the wine world's most discussed and debated categories</strong>.",
      },
      {
        heading: "How It's Made: Maceration Time and Vessel",
        content:
          "The key decision in making orange wine is maceration time — how long the juice stays in contact with the skins. A few hours to a day produces what some call 'skin-contact white wine' rather than orange wine proper: slight tannin, slight color, but recognizably white-wine in character. A few days to weeks produces the classic orange wine: amber color, discernible tannins, richer mouthfeel. Months, in the Kakhetian style, produces deeply extracted, profoundly tannic wines that can age for a decade or more.\n\nThe vessel matters enormously. <strong>Qvevri and amphora</strong> — both ceramic or clay — are thermally stable and slightly porous, allowing micro-oxygenation that shapes the wine's oxidative character without overwhelming it. They impart no flavor of their own. Stainless steel with skin contact produces cleaner, more fruit-forward orange wine. Large oak vessels produce wines with subtle oak integration. Many producers use a combination — starting fermentation in amphora and finishing in barrel, or vice versa.\n\nSulfur use is often minimal in orange wine production — partly because the tannins from skin contact act as natural antioxidants, partly because the style's producers are typically aligned with the natural wine philosophy. The result is that orange wines can be more variable and more sensitive to poor storage than conventional whites. <strong>Temperature control is important</strong>: orange wine stored warm oxidizes more quickly than cool-stored bottles.",
      },
      {
        heading: "What It Tastes Like",
        content:
          "The flavor profile of orange wine is unlike anything else in the white wine world — which is exactly why it confuses people expecting crisp, fresh, fruity white wine and excites those looking for something genuinely different. The aromatics tend toward the <strong>savory, nutty, and oxidative</strong>: dried apricot, orange peel, dried flowers, chamomile, hazelnut, quince, and in longer-macerated examples, wax, leather, and earthy depth.\n\nOn the palate, the tannins are the most immediate difference from conventional white wine. Depending on maceration length, they range from barely perceptible (a gentle grip) to firmly structured (rivaling a light red wine). This tannic texture makes orange wine <strong>extraordinarily versatile with food</strong> — it bridges the territory usually occupied by either red or white wine. Fatty, rich dishes that would overwhelm a white but don't need a full red? Orange wine. Charcuterie boards, grilled oily fish, strong cheeses, fermented foods, Middle Eastern mezze, Indian spiced dishes — orange wine handles all of these beautifully.\n\nThe flavor intensity can be polarizing. For drinkers accustomed to the clean, bright, fruit-forward profile of conventional whites, orange wine can seem strange, flat, or even faulty. <strong>Context and expectations matter</strong>: if you're expecting Sauvignon Blanc and you get orange wine, you'll be confused. If you approach it as its own category, with different reference points, it often reveals itself as one of the most interesting and complex styles in wine.",
      },
      {
        heading: "The Natural Wine Connection and How to Approach It",
        content:
          "Orange wine and the natural wine movement grew up together, and there's a philosophical affinity: both prioritize minimal intervention, terroir expression, and rejection of technological shortcuts. Many of the world's most significant natural wine producers also make orange or skin-contact wine. The overlap is substantial enough that in many wine bars and shops, 'natural wine' and 'orange wine' are practically synonymous — though this is an oversimplification. Plenty of orange wine is made conventionally, and plenty of natural wine is not orange.\n\nThe association does have a practical implication: if you're exploring natural wine, you're very likely to encounter orange wine, and vice versa. The communities of producers, importers, restaurants, and drinkers that have grown up around both styles are largely the same community. <strong>Wine bars that specialize in natural wine</strong> (Terroirs in London, Chambers Street Wines in New York, Ten Bells in Manhattan) are the best places to explore the style in a guided, sympathetic context.\n\nIf you've never tried orange wine and want to approach it thoughtfully, start with shorter maceration examples — Gravner's Ribolla Gialla is a benchmark but intense; try a Friulian Pinot Grigio with 1–2 days of skin contact first, or an Italian Ramato (copper-colored Pinot Grigio). Serve it at red wine temperature (15–17°C), not chilled. Have it with food rather than on its own. <strong>Give it a second glass</strong> before deciding — orange wine is almost always more rewarding on the second pour than the first.",
      },
    ],
    relatedJourneyIds: [],
    relatedGrapeIds: ["pinot-grigio"],
  },

  // ── GUIDE 18 (EXPERT) ────────────────────────────────────────────────────────
  {
    id: "wine-investment",
    title: "Wine as Investment: Futures, Auctions & the Secondary Market",
    subtitle: "From en primeur Bordeaux to the Liv-ex 100 — understanding the financial side of fine wine",
    category: "culture",
    level: "expert",
    description:
      "Some bottles of wine are worth more than a car. The secondary market for fine wine is a multi-billion dollar global industry with its own indices, auction houses, storage requirements, and — like any investment market — its own risks. This guide explains how it works.",
    readTimeMinutes: 11,
    icon: "scores",
    heroImage: "/guides/photo-investment.webp",
    sections: [
      {
        heading: "Why Wine Appreciates: Scarcity and Drinking",
        content:
          "Wine is one of the few collectibles where the act of consumption literally reduces supply. Every bottle of 2005 Château Pétrus that gets opened and drunk means one fewer bottle available for the secondary market. <strong>Scarcity increases as drinking decreases supply</strong>, which is the fundamental economic driver of fine wine appreciation. This is most dramatic for the world's most limited productions: Pétrus makes around 25,000 bottles per year; Romanée-Conti produces around 6,000. When a significant proportion of these are opened over the following decades, the remaining bottles become increasingly rare and increasingly valuable.\n\nNot all wine appreciates, and the distinction is important. What makes a wine investment-grade? Four main factors: producer reputation (only the most storied names generate significant secondary market interest), vintage quality (poor or average vintages don't appreciate regardless of producer), critic scores (a perfect or near-perfect score from a major critic dramatically affects a wine's investment trajectory), and provenance (where the wine has been stored — wine from verifiable, professionally stored collections commands significant premiums over bottles of unknown history).\n\nThe time horizon also matters. <strong>Fine wine is a long-term investment</strong> — the appreciation happens over decades, not months. This is not a liquid asset class. Wine you buy today as an investment may reach its peak financial value in 10, 20, or 30 years. The investors who have done well in wine are those who understood it as a long-term store of value, not a short-term trade.",
      },
      {
        heading: "En Primeur: Buying Bordeaux Before It's Bottled",
        content:
          "En primeur — known in the English-speaking market as 'wine futures' — is the system by which Bordeaux releases its finest wines for sale while they are still aging in barrel, approximately 18 months before bottling. <strong>Buyers commit to purchase at a price set during the 'campaign'</strong>, tasting barrel samples in April each year, before the wine has been bottled or had time to develop fully.\n\nThe rationale for buying en primeur is a potential price advantage: if a vintage is recognized as exceptional and the en primeur prices are reasonable, buying early locks in a price below what the wine will command on release and in the secondary market. In great vintages — 2009, 2010, 2015, 2016 — early buyers have seen significant appreciation. In mediocre vintages bought at inflated prices, the opposite has happened.\n\nThe en primeur system is dominated by Bordeaux's classified châteaux, with secondary markets in Burgundy, the Rhône, and occasionally Italy. It operates through a network of Bordeaux négociants (wine merchants who act as intermediaries) and international fine wine merchants. <strong>The process requires trust</strong>: you're paying for wine you haven't received, from a barrel sample that may not perfectly represent the finished wine, on the assumption that the producer will bottle it as expected and the market will validate your purchase price. For many top châteaux, the track record is long enough that this trust is well-placed.",
      },
      {
        heading: "The Auction Houses: Christie's, Sotheby's, Hart Davis Hart",
        content:
          "Fine wine auctions are as old as the secondary market itself — <strong>Christie's held its first recorded wine auction in 1766</strong>, making wine one of the earliest established auction categories. Today, the major auction houses maintain specialist wine departments that handle thousands of lots per year, ranging from single bottles to large cellar consignments.",
      },
      {
        heading: "The Liv-ex 100: The Stock Market of Wine",
        content:
          "The <strong>Liv-ex Fine Wine Exchange</strong>, founded in 1999, is the global marketplace for professional fine wine trading — essentially the stock market of the wine world. The Liv-ex 100 is its flagship index, tracking the price movements of the 100 most-traded fine wines, dominated by First Growth Bordeaux and a small number of reference wines from Burgundy, Italy, and the Rhône.\n\nThe Liv-ex 100 and its companion indices (the Liv-ex 1000, which covers a broader range of wines) provide data that allows investors, merchants, and collectors to track wine price movements with the same rigor applied to other asset classes. The index is published monthly and shows long-term appreciation that has often outperformed equities over extended periods — though with significant volatility, particularly during the 2011–2012 Bordeaux market correction when en primeur prices fell sharply.\n\nFor serious investors, <strong>Liv-ex data is an essential research tool</strong>. It shows which wines are trending in what direction, which producers command the most liquidity, and how specific vintages are performing relative to the broader market. Wines that trade heavily on Liv-ex have better exit liquidity than those that don't — an important practical consideration for anyone treating wine as an investment.",
      },
      {
        heading: "What Makes a Wine Investable",
        content:
          "Investment-grade wine has a relatively well-defined profile. Producer is the most important factor: the investable universe is much smaller than most people realize. Bordeaux First Growths (Lafite, Latour, Margaux, Mouton, Haut-Brion), Pétrus, Le Pin, and a small number of other Right Bank estates dominate. From Burgundy: DRC, Leroy, Rousseau, and a handful of other domaines. From Italy: Sassicaia, Gaja, and a few Barolo producers. From California: Screaming Eagle, Harlan, and a few others. <strong>The investable list is perhaps 50 producers worldwide</strong>.\n\nVintage quality matters significantly. Top producers in exceptional vintages are the sweet spot. A First Growth from a great vintage (2005, 2009, 2010) is an entirely different investment proposition from the same producer in a mediocre year. Critic scores amplify this: a 100-point score from a major critic can move a wine's secondary market price dramatically upward within hours of publication.\n\nProvenance — documented storage history — is increasingly critical. A bottle of first-growth Bordeaux from a private cellar of unknown history trades at a significant discount to the same bottle with verifiable storage records. Wine investment funds and serious private collectors maintain meticulous storage documentation precisely because it protects the value of the asset. <strong>Without provenance, the authenticity and condition of the wine cannot be verified</strong>, and the market appropriately discounts it.",
      },
      {
        heading: "Storage Requirements, Risks, and Realities",
        content:
          "Investment-grade wine must be stored professionally. Home storage — even in a well-maintained wine refrigerator — is not sufficient for wine intended for the secondary market, because <strong>provenance documentation requires verifiable professional storage</strong>. The world's leading wine storage facilities (London City Bond, Octavian Vaults, Iron Gate Wine in Hong Kong) maintain temperature-controlled, humidity-controlled environments at consistent 12–14°C, with chain-of-custody records that allow the storage history of every case to be documented and verified.\n\nThe costs of professional storage are real: typically £10–20 per case per year in the UK, with additional insurance costs. Import duties and taxes apply when wine is removed from bonded storage. These carrying costs must be factored into investment return calculations — a wine that appreciates 50% over 20 years sounds impressive, but if annual storage and insurance costs have consumed 2% per year, the real return is significantly lower.\n\nThe risks of wine investment extend beyond storage. <strong>Not everything goes up</strong>. The 2011–2012 Bordeaux correction saw en primeur prices fall 30–40% for some wines that had been bought at inflated prices. Wines that fail to achieve critical acclaim, suffer storage issues, or face competition from new regions can remain flat or depreciate. Counterfeiting is a real risk at the highest price levels — the Rudy Kurniawan case, in which a collector fabricated dozens of rare wines and sold them at auction, exposed significant vulnerabilities in the auction market's authentication processes. Wine investment requires the same due diligence as any other alternative asset class.",
      },
    ],
    relatedJourneyIds: [],
    relatedGrapeIds: [],
  },
];
