// Vintage commentary — brief explanation of what made each year notable in each region.
// Used in the Vintage Guide page table.

export interface VintageNote {
  regionId: string;
  year: number;
  note: string;
}

export const vintageNotes: VintageNote[] = [
  // Bordeaux
  { regionId: "bordeaux", year: 2022, note: "Hot, dry summer. Concentrated wines with ripe tannins. Merlot struggled on clay soils." },
  { regionId: "bordeaux", year: 2021, note: "Late frost devastated parts of Saint-Emilion. Right Bank hit harder than Left Bank." },
  { regionId: "bordeaux", year: 2020, note: "Near-perfect growing season. Power and freshness in harmony. One of the decade's best." },
  { regionId: "bordeaux", year: 2019, note: "Warm vintage, generous and approachable. Outstanding Pomerol and Pessac-Leognan." },
  { regionId: "bordeaux", year: 2018, note: "Extreme mildew pressure followed by a glorious summer. Rich, hedonistic wines." },
  { regionId: "bordeaux", year: 2016, note: "The year everything went right. Textbook conditions. Cabernet Sauvignon excelled." },
  { regionId: "bordeaux", year: 2015, note: "Warm and generous. Opulent, crowd-pleasing wines across both banks." },
  { regionId: "bordeaux", year: 2013, note: "Cool, late-ripening year. Light wines. Difficult for Merlot." },
  { regionId: "bordeaux", year: 2010, note: "Classic vintage with backbone and structure. Built to age for decades." },
  { regionId: "bordeaux", year: 2009, note: "Sumptuous, rich, ripe. Historically great. Drinking beautifully now." },
  { regionId: "bordeaux", year: 2005, note: "Structured and serious. Cabernet-dominated blends at their finest." },

  // Burgundy
  { regionId: "burgundy", year: 2022, note: "Extreme heat but earlier picking preserved acidity. Concentrated, ripe Pinots." },
  { regionId: "burgundy", year: 2021, note: "April frost reduced yields drastically. Surviving vines produced focused, pure wines." },
  { regionId: "burgundy", year: 2020, note: "Warm year, early harvest. Generous fruit with surprising freshness. Whites and reds excelled." },
  { regionId: "burgundy", year: 2019, note: "Heatwaves tested growers. Best producers made elegant wines; others cooked." },
  { regionId: "burgundy", year: 2016, note: "Frost devastated Chablis. Cote d'Or escaped, producing balanced, age-worthy wines." },
  { regionId: "burgundy", year: 2015, note: "The warmest vintage in a generation. Big, generous Pinots. Rich whites." },
  { regionId: "burgundy", year: 2010, note: "Cool, classic vintage. Precise acidity, fine tannins. Textbook Burgundy for the cellar." },
  { regionId: "burgundy", year: 2005, note: "Structured reds that took years to open. Rewarding patience now." },

  // Piedmont
  { regionId: "piedmont", year: 2020, note: "Early-ripening, warm year. Approachable Barolos with ripe fruit and fine tannins." },
  { regionId: "piedmont", year: 2019, note: "Classic structure with long aging potential. Balanced acidity and firm tannins." },
  { regionId: "piedmont", year: 2016, note: "Exceptional. Perfect balance of power and elegance. The best since 2010." },
  { regionId: "piedmont", year: 2013, note: "Late harvest, cool year. Elegant, perfumed Barolos with lighter body." },
  { regionId: "piedmont", year: 2010, note: "Monumental. Deep colour, massive structure. Decades of life ahead." },
  { regionId: "piedmont", year: 2006, note: "Underrated. Lifted aromatics, silky tannins. Drinking beautifully now." },

  // Napa Valley
  { regionId: "napa-valley", year: 2021, note: "Drought year, tiny berries, concentrated flavours. Excellent despite low yields." },
  { regionId: "napa-valley", year: 2020, note: "Devastating wildfires. Smoke taint affected many wines. Most top producers declassified." },
  { regionId: "napa-valley", year: 2019, note: "Long, cool growing season. Elegant Cabernets with polished tannins." },
  { regionId: "napa-valley", year: 2018, note: "Near-perfect conditions. Generous fruit, structured tannins, seamless texture." },
  { regionId: "napa-valley", year: 2017, note: "October wildfires disrupted harvest. Mixed results; some extraordinary, some smoky." },
  { regionId: "napa-valley", year: 2016, note: "Benchmark year. Concentration and freshness. The best Cabernets in a decade." },
  { regionId: "napa-valley", year: 2013, note: "The 'perfect storm' vintage. Three warm, dry months of uninterrupted ripening." },

  // Rhone
  { regionId: "rhone", year: 2020, note: "Standout for Cote-Rotie and Hermitage. Concentration with northern freshness." },
  { regionId: "rhone", year: 2019, note: "Intense heat. Powerful Syrahs with dark fruit. Some alcohol levels pushed high." },
  { regionId: "rhone", year: 2015, note: "Extraordinary. Rich, complex, complete. Hermitage and Cote-Rotie at their peak." },
  { regionId: "rhone", year: 2010, note: "Benchmark. Cool, structured, age-worthy. Northern Rhone at its classical best." },
  { regionId: "rhone", year: 2009, note: "Opulent, generous, hedonistic. Drinking gorgeously now." },

  // Tuscany
  { regionId: "tuscany", year: 2019, note: "Outstanding Brunello vintage. Perfect weather from spring to harvest. Age-worthy." },
  { regionId: "tuscany", year: 2016, note: "Superb. Balanced Sangiovese with structure and elegance. Brunello benchmark." },
  { regionId: "tuscany", year: 2015, note: "Warm, early-drinking. Generous, fruity Brunellos ready sooner than usual." },
  { regionId: "tuscany", year: 2010, note: "Classic vintage. Firm structure, fine acidity, long-lived. Still cellar-worthy." },

  // Rioja
  { regionId: "rioja", year: 2019, note: "Late-season rain complicated harvest. Best producers made concentrated, elegant wines." },
  { regionId: "rioja", year: 2016, note: "Outstanding. Cool nights preserved acidity in ripe fruit. Built for aging." },
  { regionId: "rioja", year: 2011, note: "Warm year, early harvest. Rich, concentrated wines. Tempranillo excelled." },
  { regionId: "rioja", year: 2010, note: "Benchmark. Cool climate vintage with impeccable balance. Top Gran Reservas." },
  { regionId: "rioja", year: 2005, note: "Outstanding across the board. Deep colour, firm structure, still aging well." },

  // Barossa
  { regionId: "barossa", year: 2021, note: "Cooler vintage, lower alcohol. Elegant, restrained Shiraz. A style shift." },
  { regionId: "barossa", year: 2018, note: "Warm, classic Barossa. Rich, full-bodied Shiraz with dark fruit and chocolate." },
  { regionId: "barossa", year: 2012, note: "Exceptional. Cool-climate character in a warm region. Fine tannins, great acidity." },
  { regionId: "barossa", year: 2010, note: "Powerful and concentrated. The old vines shone. Icon wines were extraordinary." },
  { regionId: "barossa", year: 2006, note: "Consistently excellent. Balanced, complex. Penfolds Grange was a standout." },
  { regionId: "barossa", year: 2005, note: "One of the great Barossa vintages. Intense, layered, still evolving." },

  // Mosel
  { regionId: "mosel", year: 2021, note: "Devastating July floods. Vineyards washed away. Surviving wines intense and pure." },
  { regionId: "mosel", year: 2019, note: "Warm but balanced. Ripe fruit with Mosel's signature razor acidity. Exceptional." },
  { regionId: "mosel", year: 2016, note: "Classic Mosel. High acidity, focused mineral character. Age beautifully." },
  { regionId: "mosel", year: 2008, note: "Standout for sweet wines. TBAs and Auslesen of extraordinary concentration." },

  // Mendoza
  { regionId: "mendoza", year: 2017, note: "Outstanding Malbec. High-altitude vineyards delivered concentration and freshness." },
  { regionId: "mendoza", year: 2015, note: "Warm year, generous fruit. Approachable, crowd-pleasing Malbecs." },
  { regionId: "mendoza", year: 2010, note: "Cool vintage, more European in style. Elegant Malbecs with aging potential." },
  { regionId: "mendoza", year: 2005, note: "The year that put Mendoza on the world stage. Concentrated, complex, still great." },
];
