// Vintage quality ratings by region (2005-2023)
// Sources: Jeb Dunnuck, Wine Spectator, Sotheby's vintage charts
// Scale: 0-100 (mapped to display as: <80 = Average, 80-89 = Good, 90-94 = Excellent, 95+ = Exceptional)
// "NT" = not tasted / no data → stored as null

export interface VintageRating {
  year: number;
  score: number | null;
  maturity: "T" | "Y" | "E" | "R" | "O" | "U" | null;
  // T = Tannic/backward, Y = Young but approachable, E = Early maturing
  // R = Ready/Mature, O = Declining, U = Uneven quality
}

export interface RegionVintages {
  regionId: string;
  regionLabel: string;
  vintages: VintageRating[];
}

export const vintageData: RegionVintages[] = [
  {
    regionId: "bordeaux",
    regionLabel: "Bordeaux",
    vintages: [
      { year: 2023, score: null, maturity: null },
      { year: 2022, score: 96, maturity: "T" },
      { year: 2021, score: 88, maturity: "E" },
      { year: 2020, score: 97, maturity: "T" },
      { year: 2019, score: 97, maturity: "Y" },
      { year: 2018, score: 96, maturity: "Y" },
      { year: 2017, score: 91, maturity: "E" },
      { year: 2016, score: 99, maturity: "T" },
      { year: 2015, score: 96, maturity: "Y" },
      { year: 2014, score: 92, maturity: "Y" },
      { year: 2013, score: 81, maturity: "R" },
      { year: 2012, score: 92, maturity: "R" },
      { year: 2011, score: 88, maturity: "R" },
      { year: 2010, score: 98, maturity: "T" },
      { year: 2009, score: 98, maturity: "R" },
      { year: 2008, score: 91, maturity: "R" },
      { year: 2007, score: 88, maturity: "R" },
      { year: 2006, score: 89, maturity: "R" },
      { year: 2005, score: 97, maturity: "R" },
    ],
  },
  {
    regionId: "burgundy",
    regionLabel: "Burgundy (Red)",
    vintages: [
      { year: 2023, score: null, maturity: null },
      { year: 2022, score: 94, maturity: "T" },
      { year: 2021, score: 93, maturity: "T" },
      { year: 2020, score: 96, maturity: "T" },
      { year: 2019, score: 94, maturity: "Y" },
      { year: 2018, score: 91, maturity: "Y" },
      { year: 2017, score: 90, maturity: "E" },
      { year: 2016, score: 94, maturity: "Y" },
      { year: 2015, score: 95, maturity: "Y" },
      { year: 2014, score: 90, maturity: "R" },
      { year: 2013, score: 88, maturity: "R" },
      { year: 2012, score: 92, maturity: "R" },
      { year: 2011, score: 87, maturity: "R" },
      { year: 2010, score: 95, maturity: "R" },
      { year: 2009, score: 93, maturity: "R" },
      { year: 2008, score: 90, maturity: "R" },
      { year: 2007, score: 86, maturity: "R" },
      { year: 2006, score: 88, maturity: "R" },
      { year: 2005, score: 93, maturity: "R" },
    ],
  },
  {
    regionId: "champagne",
    regionLabel: "Champagne",
    vintages: [
      { year: 2023, score: null, maturity: null },
      { year: 2022, score: null, maturity: null },
      { year: 2021, score: null, maturity: null },
      { year: 2020, score: 96, maturity: "T" },
      { year: 2019, score: 96, maturity: "T" },
      { year: 2018, score: 93, maturity: "E" },
      { year: 2017, score: 89, maturity: "E" },
      { year: 2016, score: 94, maturity: "T" },
      { year: 2015, score: 91, maturity: "E" },
      { year: 2014, score: 93, maturity: "E" },
      { year: 2013, score: 96, maturity: "T" },
      { year: 2012, score: 97, maturity: "T" },
      { year: 2011, score: 88, maturity: "R" },
      { year: 2010, score: 90, maturity: "R" },
      { year: 2009, score: 93, maturity: "R" },
      { year: 2008, score: 99, maturity: "T" },
      { year: 2007, score: null, maturity: null },
      { year: 2006, score: null, maturity: null },
      { year: 2005, score: null, maturity: null },
    ],
  },
  {
    regionId: "rhone",
    regionLabel: "Northern Rhone",
    vintages: [
      { year: 2023, score: null, maturity: null },
      { year: 2022, score: 93, maturity: "Y" },
      { year: 2021, score: 84, maturity: "E" },
      { year: 2020, score: 97, maturity: "Y" },
      { year: 2019, score: 96, maturity: "T" },
      { year: 2018, score: 95, maturity: "Y" },
      { year: 2017, score: 95, maturity: "T" },
      { year: 2016, score: 92, maturity: "T" },
      { year: 2015, score: 99, maturity: "Y" },
      { year: 2014, score: 87, maturity: "E" },
      { year: 2013, score: 89, maturity: "T" },
      { year: 2012, score: 91, maturity: "E" },
      { year: 2011, score: 93, maturity: "R" },
      { year: 2010, score: 97, maturity: "T" },
      { year: 2009, score: 98, maturity: "T" },
      { year: 2008, score: 79, maturity: "R" },
      { year: 2007, score: 89, maturity: "E" },
      { year: 2006, score: 92, maturity: "R" },
      { year: 2005, score: 89, maturity: "T" },
    ],
  },
  {
    regionId: "piedmont",
    regionLabel: "Piedmont (Barolo)",
    vintages: [
      { year: 2023, score: null, maturity: null },
      { year: 2022, score: null, maturity: null },
      { year: 2021, score: null, maturity: null },
      { year: 2020, score: 96, maturity: "T" },
      { year: 2019, score: 96, maturity: "T" },
      { year: 2018, score: 91, maturity: "E" },
      { year: 2017, score: 94, maturity: "T" },
      { year: 2016, score: 98, maturity: "T" },
      { year: 2015, score: 93, maturity: "T" },
      { year: 2014, score: 89, maturity: "R" },
      { year: 2013, score: 95, maturity: "T" },
      { year: 2012, score: 90, maturity: "R" },
      { year: 2011, score: 88, maturity: "R" },
      { year: 2010, score: 97, maturity: "T" },
      { year: 2009, score: 89, maturity: "R" },
      { year: 2008, score: 92, maturity: "R" },
      { year: 2007, score: 88, maturity: "R" },
      { year: 2006, score: 93, maturity: "R" },
      { year: 2005, score: 92, maturity: "R" },
    ],
  },
  {
    regionId: "tuscany",
    regionLabel: "Tuscany (Brunello)",
    vintages: [
      { year: 2023, score: null, maturity: null },
      { year: 2022, score: null, maturity: null },
      { year: 2021, score: null, maturity: null },
      { year: 2020, score: 94, maturity: "T" },
      { year: 2019, score: 98, maturity: "T" },
      { year: 2018, score: 94, maturity: "E" },
      { year: 2017, score: 92, maturity: "T" },
      { year: 2016, score: 98, maturity: "T" },
      { year: 2015, score: 95, maturity: "T" },
      { year: 2014, score: 88, maturity: "R" },
      { year: 2013, score: 90, maturity: "R" },
      { year: 2012, score: 93, maturity: "R" },
      { year: 2011, score: 87, maturity: "R" },
      { year: 2010, score: 97, maturity: "R" },
      { year: 2009, score: 89, maturity: "R" },
      { year: 2008, score: 90, maturity: "R" },
      { year: 2007, score: 92, maturity: "R" },
      { year: 2006, score: 93, maturity: "R" },
      { year: 2005, score: 91, maturity: "R" },
    ],
  },
  {
    regionId: "rioja",
    regionLabel: "Rioja",
    vintages: [
      { year: 2023, score: null, maturity: null },
      { year: 2022, score: 92, maturity: "T" },
      { year: 2021, score: 90, maturity: "Y" },
      { year: 2020, score: 94, maturity: "T" },
      { year: 2019, score: 95, maturity: "T" },
      { year: 2018, score: 93, maturity: "Y" },
      { year: 2017, score: 91, maturity: "Y" },
      { year: 2016, score: 96, maturity: "T" },
      { year: 2015, score: 93, maturity: "Y" },
      { year: 2014, score: 90, maturity: "R" },
      { year: 2013, score: 87, maturity: "R" },
      { year: 2012, score: 91, maturity: "R" },
      { year: 2011, score: 94, maturity: "R" },
      { year: 2010, score: 96, maturity: "R" },
      { year: 2009, score: 92, maturity: "R" },
      { year: 2008, score: 90, maturity: "R" },
      { year: 2007, score: 88, maturity: "R" },
      { year: 2006, score: 89, maturity: "R" },
      { year: 2005, score: 95, maturity: "R" },
    ],
  },
  {
    regionId: "napa-valley",
    regionLabel: "Napa Valley Cabernet",
    vintages: [
      { year: 2023, score: null, maturity: null },
      { year: 2022, score: null, maturity: null },
      { year: 2021, score: 96, maturity: "T" },
      { year: 2020, score: 55, maturity: "U" },
      { year: 2019, score: 96, maturity: "Y" },
      { year: 2018, score: 97, maturity: "Y" },
      { year: 2017, score: 87, maturity: "U" },
      { year: 2016, score: 98, maturity: "Y" },
      { year: 2015, score: 95, maturity: "E" },
      { year: 2014, score: 94, maturity: "Y" },
      { year: 2013, score: 99, maturity: "T" },
      { year: 2012, score: 97, maturity: "R" },
      { year: 2011, score: 83, maturity: "R" },
      { year: 2010, score: 95, maturity: "T" },
      { year: 2009, score: 93, maturity: "T" },
      { year: 2008, score: 93, maturity: "T" },
      { year: 2007, score: 96, maturity: "R" },
      { year: 2006, score: 92, maturity: "R" },
      { year: 2005, score: 95, maturity: "R" },
    ],
  },
  {
    regionId: "barossa",
    regionLabel: "Barossa Valley",
    vintages: [
      { year: 2023, score: null, maturity: null },
      { year: 2022, score: 93, maturity: "T" },
      { year: 2021, score: 95, maturity: "T" },
      { year: 2020, score: 91, maturity: "Y" },
      { year: 2019, score: 93, maturity: "Y" },
      { year: 2018, score: 94, maturity: "Y" },
      { year: 2017, score: 90, maturity: "E" },
      { year: 2016, score: 93, maturity: "Y" },
      { year: 2015, score: 91, maturity: "R" },
      { year: 2014, score: 93, maturity: "R" },
      { year: 2013, score: 92, maturity: "R" },
      { year: 2012, score: 96, maturity: "R" },
      { year: 2011, score: 88, maturity: "R" },
      { year: 2010, score: 97, maturity: "R" },
      { year: 2009, score: 90, maturity: "R" },
      { year: 2008, score: 92, maturity: "R" },
      { year: 2007, score: 88, maturity: "R" },
      { year: 2006, score: 94, maturity: "R" },
      { year: 2005, score: 96, maturity: "R" },
    ],
  },
  {
    regionId: "mendoza",
    regionLabel: "Mendoza",
    vintages: [
      { year: 2023, score: null, maturity: null },
      { year: 2022, score: 91, maturity: "Y" },
      { year: 2021, score: 90, maturity: "Y" },
      { year: 2020, score: 93, maturity: "Y" },
      { year: 2019, score: 94, maturity: "Y" },
      { year: 2018, score: 93, maturity: "Y" },
      { year: 2017, score: 95, maturity: "Y" },
      { year: 2016, score: 92, maturity: "R" },
      { year: 2015, score: 94, maturity: "R" },
      { year: 2014, score: 91, maturity: "R" },
      { year: 2013, score: 93, maturity: "R" },
      { year: 2012, score: 90, maturity: "R" },
      { year: 2011, score: 92, maturity: "R" },
      { year: 2010, score: 95, maturity: "R" },
      { year: 2009, score: 91, maturity: "R" },
      { year: 2008, score: 89, maturity: "R" },
      { year: 2007, score: 90, maturity: "R" },
      { year: 2006, score: 93, maturity: "R" },
      { year: 2005, score: 96, maturity: "R" },
    ],
  },
  {
    regionId: "mosel",
    regionLabel: "Mosel Riesling",
    vintages: [
      { year: 2023, score: null, maturity: null },
      { year: 2022, score: 93, maturity: "Y" },
      { year: 2021, score: 95, maturity: "Y" },
      { year: 2020, score: 94, maturity: "Y" },
      { year: 2019, score: 96, maturity: "Y" },
      { year: 2018, score: 93, maturity: "Y" },
      { year: 2017, score: 91, maturity: "E" },
      { year: 2016, score: 95, maturity: "Y" },
      { year: 2015, score: 93, maturity: "R" },
      { year: 2014, score: 90, maturity: "R" },
      { year: 2013, score: 92, maturity: "R" },
      { year: 2012, score: 93, maturity: "R" },
      { year: 2011, score: 91, maturity: "R" },
      { year: 2010, score: 94, maturity: "R" },
      { year: 2009, score: 93, maturity: "R" },
      { year: 2008, score: 95, maturity: "R" },
      { year: 2007, score: 91, maturity: "R" },
      { year: 2006, score: 90, maturity: "R" },
      { year: 2005, score: 94, maturity: "R" },
    ],
  },
  {
    regionId: "southern-rhone",
    regionLabel: "Southern Rhone",
    vintages: [
      { year: 2023, score: 93, maturity: "Y" },
      { year: 2022, score: 91, maturity: "E" },
      { year: 2021, score: 86, maturity: "E" },
      { year: 2020, score: 93, maturity: "R" },
      { year: 2019, score: 95, maturity: "Y" },
      { year: 2018, score: 89, maturity: "E" },
      { year: 2017, score: 96, maturity: "T" },
      { year: 2016, score: 99, maturity: "T" },
      { year: 2015, score: 92, maturity: "T" },
      { year: 2014, score: 87, maturity: "E" },
      { year: 2013, score: 87, maturity: "R" },
      { year: 2012, score: 92, maturity: "R" },
      { year: 2011, score: 90, maturity: "R" },
      { year: 2010, score: 99, maturity: "R" },
      { year: 2009, score: 95, maturity: "E" },
      { year: 2008, score: 86, maturity: "R" },
      { year: 2007, score: 97, maturity: "R" },
      { year: 2006, score: 93, maturity: "R" },
      { year: 2005, score: 93, maturity: "R" },
    ],
  },
  {
    regionId: "willamette",
    regionLabel: "Willamette Valley Pinot",
    vintages: [
      { year: 2023, score: null, maturity: null },
      { year: 2022, score: 93, maturity: "T" },
      { year: 2021, score: 96, maturity: "T" },
      { year: 2020, score: 86, maturity: "U" },
      { year: 2019, score: 94, maturity: "Y" },
      { year: 2018, score: 95, maturity: "Y" },
      { year: 2017, score: 92, maturity: "T" },
      { year: 2016, score: 94, maturity: "R" },
      { year: 2015, score: 92, maturity: "R" },
      { year: 2014, score: 93, maturity: "R" },
      { year: 2013, score: 91, maturity: "R" },
      { year: 2012, score: 93, maturity: "R" },
      { year: 2011, score: 87, maturity: "R" },
      { year: 2010, score: 92, maturity: "R" },
      { year: 2009, score: 87, maturity: "R" },
      { year: 2008, score: 88, maturity: "R" },
      { year: 2007, score: 94, maturity: "R" },
      { year: 2006, score: 90, maturity: "R" },
      { year: 2005, score: 93, maturity: "R" },
    ],
  },
];

// Traffic light colour system — green (great) to red (poor)
export function vintageColor(score: number | null): string {
  if (score === null) return "rgba(160,160,160,0.12)";
  if (score >= 96) return "rgba(34,139,34,0.65)";     // exceptional — strong green
  if (score >= 93) return "rgba(76,175,80,0.50)";      // excellent — green
  if (score >= 89) return "rgba(205,185,50,0.45)";     // good — amber/gold
  if (score >= 85) return "rgba(230,140,50,0.40)";     // average — orange
  return "rgba(200,50,50,0.45)";                        // below average — red
}

export function vintageLabel(score: number | null): string {
  if (score === null) return "No data";
  if (score >= 96) return "Exceptional";
  if (score >= 93) return "Excellent";
  if (score >= 89) return "Good";
  if (score >= 85) return "Average";
  return "Below average";
}

// Legend items for the heatmap
export const VINTAGE_LEGEND = [
  { label: "Exceptional", color: "rgba(34,139,34,0.65)" },
  { label: "Excellent", color: "rgba(76,175,80,0.50)" },
  { label: "Good", color: "rgba(205,185,50,0.45)" },
  { label: "Average", color: "rgba(230,140,50,0.40)" },
  { label: "Below avg", color: "rgba(200,50,50,0.45)" },
  { label: "No data", color: "rgba(160,160,160,0.12)" },
];

export function maturityLabel(m: string | null): string {
  if (!m) return "";
  const labels: Record<string, string> = {
    T: "Tannic, needs time",
    Y: "Young but approachable",
    E: "Early maturing",
    R: "Ready to drink",
    O: "Declining",
    U: "Uneven quality",
  };
  return labels[m] || "";
}
