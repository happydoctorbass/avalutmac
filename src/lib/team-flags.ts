/** FIFA team name → ISO 3166-1 alpha-2 (or subdivision slug for flagcdn) */
const TEAM_COUNTRY_CODE: Record<string, string> = {
  Algeria: 'DZ',
  Argentina: 'AR',
  Australia: 'AU',
  Austria: 'AT',
  Belgium: 'BE',
  'Bosnia & Herzegovina': 'BA',
  Brazil: 'BR',
  Canada: 'CA',
  'Cape Verde': 'CV',
  Colombia: 'CO',
  Croatia: 'HR',
  'Curaçao': 'CW',
  'Czech Republic': 'CZ',
  'DR Congo': 'CD',
  Ecuador: 'EC',
  Egypt: 'EG',
  England: 'gb-eng',
  France: 'FR',
  Germany: 'DE',
  Ghana: 'GH',
  Haiti: 'HT',
  Iran: 'IR',
  Iraq: 'IQ',
  'Ivory Coast': 'CI',
  Japan: 'JP',
  Jordan: 'JO',
  Mexico: 'MX',
  Morocco: 'MA',
  Netherlands: 'NL',
  'New Zealand': 'NZ',
  Norway: 'NO',
  Panama: 'PA',
  Paraguay: 'PY',
  Portugal: 'PT',
  Qatar: 'QA',
  'Saudi Arabia': 'SA',
  Scotland: 'gb-sct',
  Senegal: 'SN',
  'South Africa': 'ZA',
  'South Korea': 'KR',
  Spain: 'ES',
  Sweden: 'SE',
  Switzerland: 'CH',
  Tunisia: 'TN',
  Turkey: 'TR',
  USA: 'US',
  Uruguay: 'UY',
  Uzbekistan: 'UZ',
};

/** Subdivision flags not in country-flag-icons — served via flagcdn */
const SUBDIVISION_CODES = new Set(['gb-eng', 'gb-sct']);

export function getTeamCountryCode(team: string): string | null {
  return TEAM_COUNTRY_CODE[team] ?? null;
}

export function isSubdivisionFlag(code: string) {
  return SUBDIVISION_CODES.has(code.toLowerCase());
}
