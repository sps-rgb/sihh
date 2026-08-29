import { INDIAN_STATES } from "@/types/userProfile";

export const STATE_ALIASES: Record<string, string> = {
  // UP / Uttar Pradesh
  "up": "Uttar Pradesh",
  "uttar pradesh": "Uttar Pradesh",
  "u.p.": "Uttar Pradesh",
  "u.p": "Uttar Pradesh",
  "uttarpradesh": "Uttar Pradesh",

  // HR / Haryana
  "hr": "Haryana",
  "haryana": "Haryana",
  "h.r.": "Haryana",
  "h.r": "Haryana",

  // DL / Delhi
  "dl": "Delhi",
  "delhi": "Delhi",
  "new delhi": "Delhi",
  "d.l.": "Delhi",
  "ncr": "Delhi",

  // MP / Madhya Pradesh
  "mp": "Madhya Pradesh",
  "madhya pradesh": "Madhya Pradesh",
  "m.p.": "Madhya Pradesh",
  "m.p": "Madhya Pradesh",
  "madhyapradesh": "Madhya Pradesh",

  // RJ / Rajasthan
  "rj": "Rajasthan",
  "rajasthan": "Rajasthan",
  "raj": "Rajasthan",
  "r.j.": "Rajasthan",

  // MH / Maharashtra
  "mh": "Maharashtra",
  "maharashtra": "Maharashtra",
  "maha": "Maharashtra",
  "m.h.": "Maharashtra",

  // KA / Karnataka
  "ka": "Karnataka",
  "karnataka": "Karnataka",
  "kar": "Karnataka",
  "k.a.": "Karnataka",

  // TN / Tamil Nadu
  "tn": "Tamil Nadu",
  "tamil nadu": "Tamil Nadu",
  "tamilnadu": "Tamil Nadu",
  "t.n.": "Tamil Nadu",

  // WB / West Bengal
  "wb": "West Bengal",
  "west bengal": "West Bengal",
  "bengal": "West Bengal",
  "w.b.": "West Bengal",
  "westbengal": "West Bengal",

  // AP / Andhra Pradesh
  "ap": "Andhra Pradesh",
  "andhra pradesh": "Andhra Pradesh",
  "andhra": "Andhra Pradesh",
  "a.p.": "Andhra Pradesh",

  // TS / TG / Telangana
  "ts": "Telangana",
  "tg": "Telangana",
  "telangana": "Telangana",

  // PB / Punjab
  "pb": "Punjab",
  "punjab": "Punjab",
  "p.b.": "Punjab",

  // UK / UT / Uttarakhand
  "uk": "Uttarakhand",
  "ut": "Uttarakhand",
  "ua": "Uttarakhand",
  "uttarakhand": "Uttarakhand",
  "uttaranchal": "Uttarakhand",

  // JK / Jammu and Kashmir
  "jk": "Jammu and Kashmir",
  "j&k": "Jammu and Kashmir",
  "jammu": "Jammu and Kashmir",
  "kashmir": "Jammu and Kashmir",
  "jammu and kashmir": "Jammu and Kashmir",
  "jammu & kashmir": "Jammu and Kashmir",

  // HP / Himachal Pradesh
  "hp": "Himachal Pradesh",
  "himachal pradesh": "Himachal Pradesh",
  "himachal": "Himachal Pradesh",
  "h.p.": "Himachal Pradesh",

  // BR / Bihar
  "br": "Bihar",
  "bihar": "Bihar",
  "bih": "Bihar",
  "b.r.": "Bihar",

  // JH / Jharkhand
  "jh": "Jharkhand",
  "jharkhand": "Jharkhand",
  "j.h.": "Jharkhand",

  // OD / OR / Odisha
  "od": "Odisha",
  "or": "Odisha",
  "odisha": "Odisha",
  "orissa": "Odisha",

  // CG / CH / Chhattisgarh
  "cg": "Chhattisgarh",
  "ch": "Chhattisgarh",
  "chhattisgarh": "Chhattisgarh",
  "chhatisgarh": "Chhattisgarh",

  // GA / Goa
  "ga": "Goa",
  "goa": "Goa",

  // GJ / Gujarat
  "gj": "Gujarat",
  "gujarat": "Gujarat",
  "guj": "Gujarat",

  // AS / Assam
  "as": "Assam",
  "assam": "Assam",

  // KL / Kerala
  "kl": "Kerala",
  "kerala": "Kerala",
  "ker": "Kerala",

  // SK / Sikkim
  "sk": "Sikkim",
  "sikkim": "Sikkim",

  // TR / Tripura
  "tr": "Tripura",
  "tripura": "Tripura",

  // MN / Manipur
  "mn": "Manipur",
  "manipur": "Manipur",

  // ML / Meghalaya
  "ml": "Meghalaya",
  "meghalaya": "Meghalaya",

  // MZ / Mizoram
  "mz": "Mizoram",
  "mizoram": "Mizoram",

  // NL / Nagaland
  "nl": "Nagaland",
  "nagaland": "Nagaland",

  // AR / Arunachal Pradesh
  "ar": "Arunachal Pradesh",
  "arunachal pradesh": "Arunachal Pradesh",
  "arunachal": "Arunachal Pradesh",

  // PY / Puducherry
  "py": "Puducherry",
  "puducherry": "Puducherry",
  "pondicherry": "Puducherry",

  // LA / Ladakh
  "la": "Ladakh",
  "ladakh": "Ladakh",
};

/**
 * Maps state abbreviations or common names (e.g. 'UP', 'hr', 'RJ', 'delhi')
 * to standard Indian state names recognized by the system.
 */
export function normalizeStateName(input: string): string {
  if (!input) return "";
  const cleaned = input.trim().toLowerCase().replace(/[^a-z0-9&.\s]/g, "");
  
  if (STATE_ALIASES[cleaned]) {
    return STATE_ALIASES[cleaned];
  }
  
  // Exact match against standard state list (case-insensitive)
  const exact = INDIAN_STATES.find(
    (s) => s.toLowerCase() === input.trim().toLowerCase()
  );
  if (exact) return exact;

  // Prefix match
  const prefix = INDIAN_STATES.find(
    (s) => s.toLowerCase().startsWith(cleaned)
  );
  if (prefix) return prefix;

  return input.trim();
}

