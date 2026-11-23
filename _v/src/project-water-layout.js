const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Keep the full hit targets inside the water arena, away from the dock/player.
export function layoutProjectCoordinates({ width, height, detailLeft = null, count = 4 }) {
  const pointCount = Math.max(0, Math.min(4, Math.trunc(count)));
  const arenaWidth = Math.max(180, detailLeft === null ? width - (width < 1000 ? 16 : 104) : detailLeft - 24);
  const singleColumn = width < 760 || arenaWidth < 610;
  const nodeWidth = Math.min(268, arenaWidth - 16);
  const anchorX = width < 760 ? nodeWidth / 2 : 56;
  const minX = anchorX + 16;
  const maxX = Math.max(minX, arenaWidth - nodeWidth + anchorX);
  const shortPhone = height < 540 || (width < 760 && height < 700);
  const compact = width < 1000;
  const nodeHeight = compact && height < 420 && singleColumn ? 44 : shortPhone ? 56 : 72;
  // Compact screens reserve space for the labeled dock and player; short
  // landscape screens hide the player while browsing projects.
  const bottomReserve = compact ? height < 540 ? singleColumn && height < 420 ? 80 : 96 : nodeHeight + 140 : shortPhone ? 104 : 132;
  const maxY = Math.max(180, height - bottomReserve);
  let points;
  if (singleColumn) {
    const gaps = Math.max(0, pointCount - 1);
    const top = Math.max(116, Math.min(height * .53, maxY - gaps * nodeHeight));
    points = [.48, .54, .46, .52].slice(0, pointCount).map((x, index) => ({
      x: clamp(width * x, minX, maxX),
      y: top + (maxY - top) * index / Math.max(1, gaps),
    }));
  } else {
    const top = Math.min(height * .60, maxY - nodeHeight - 20);
    const bottom = Math.min(height * .82, maxY);
    const fractions = detailLeft === null ? [.24, .64, .34, .78] : [.22, .65, .28, .72];
    points = fractions.slice(0, pointCount).map((x, index) => ({
      x: clamp(arenaWidth * x, minX, maxX),
      y: index < 2 ? top - (index % 2) * 22 : bottom - (index % 2) * 14,
    }));
    for (const [left, right] of [[0, 1], [2, 3]]) {
      if (!points[right]) continue;
      points[right].x = Math.max(points[right].x, points[left].x + nodeWidth + 18);
      if (points[right].x > maxX) {
        points[right].x = maxX;
        points[left].x = Math.min(points[left].x, maxX - nodeWidth - 18);
      }
    }
  }
  return { points, nodeWidth, nodeHeight, anchorX, singleColumn, arenaWidth, maxY, shortPhone };
}
