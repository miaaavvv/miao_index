// Keep the animated background within a predictable GPU pixel budget.
// Text and controls remain normal DOM and retain the display's full resolution.
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const ratioFor = (width, height, dpr, cap, pixels) => Math.min(dpr, cap, Math.sqrt(pixels / (width * height)));

export function renderDimensions({ width, height, dpr = 1, scale = 1, mobile = false, lowPower = false }) {
  width = Math.max(1, Number(width) || 1);
  height = Math.max(1, Number(height) || 1);
  dpr = Math.max(.1, Number(dpr) || 1);
  scale = clamp(Number(scale) || 1, .6, 1);
  const sceneBudget = lowPower ? 450000 : mobile ? 650000 : 900000;
  const outputBudget = lowPower ? 900000 : mobile ? 1400000 : 2200000;
  const sceneRatio = ratioFor(width, height, dpr, 1, sceneBudget) * scale;
  const outputRatio = ratioFor(width, height, dpr, lowPower ? 1.1 : 1.25, outputBudget) * Math.max(.8, scale);
  return {
    sceneRatio,
    sceneWidth: Math.max(1, Math.round(width * sceneRatio)),
    sceneHeight: Math.max(1, Math.round(height * sceneRatio)),
    outputWidth: Math.max(1, Math.round(width * outputRatio)),
    outputHeight: Math.max(1, Math.round(height * outputRatio)),
  };
}

export function backgroundFrameRate({ reading = false, reducedMotion = false } = {}) {
  return reading || reducedMotion ? 30 : 60;
}
