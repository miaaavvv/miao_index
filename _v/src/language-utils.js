export const supportedLanguages = ['zh-Hans', 'zh-Hant', 'en'];

export function languageForCountry(country) {
  const code = String(country || '').toUpperCase();
  if (code === 'CN') return 'zh-Hans';
  if (['TW', 'HK', 'MO'].includes(code)) return 'zh-Hant';
  return 'en';
}

// Used when the network region cannot be resolved. Explicit browser regions
// take precedence over a time zone, which may cover more than one region.
export function browserCountry(languages = [], timeZone = '') {
  for (const language of languages) {
    try {
      const region = new Intl.Locale(language).region;
      if (region) return region;
    } catch {}
  }
  const regions = {
    'Asia/Shanghai': 'CN', 'Asia/Chongqing': 'CN', 'Asia/Chungking': 'CN',
    'Asia/Harbin': 'CN', 'Asia/Urumqi': 'CN', 'Asia/Taipei': 'TW',
    'Asia/Hong_Kong': 'HK', 'Asia/Macau': 'MO', 'Asia/Macao': 'MO',
  };
  if (regions[timeZone]) return regions[timeZone];
  if (languages.some(value => /^zh-Hant(?:-|$)/i.test(value))) return 'TW';
  if (languages.some(value => /^zh-Hans(?:-|$)/i.test(value))) return 'CN';
  return null;
}
