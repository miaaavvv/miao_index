// Screenshot variants follow the scene clock, including manual time travel.
export function screenshotThemeForMinutes(minutes) {
  if (!Number.isFinite(minutes)) return 'light';
  const clock = ((minutes % 1440) + 1440) % 1440;
  return clock >= 360 && clock < 1080 ? 'light' : 'dark';
}

export function screenshotForTheme(screen, theme = 'light') {
  return screen.variants?.[theme] ?? screen;
}
