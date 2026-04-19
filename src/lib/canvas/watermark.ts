/**
 * Draw a repeating diagonal watermark on a canvas.
 */
export function applyWatermark(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const result = document.createElement("canvas");
  result.width = canvas.width;
  result.height = canvas.height;
  const ctx = result.getContext("2d")!;

  // Draw original image
  ctx.drawImage(canvas, 0, 0);

  // Watermark settings
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#888888";
  const fontSize = Math.max(14, Math.round(canvas.width / 15));
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Rotate and draw repeated text
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 4);

  const text = "셀프증명";
  const spacing = fontSize * 4;
  const diagonal = Math.sqrt(
    canvas.width * canvas.width + canvas.height * canvas.height
  );

  for (let y = -diagonal; y < diagonal; y += spacing) {
    for (let x = -diagonal; x < diagonal; x += spacing) {
      ctx.fillText(text, x, y);
    }
  }

  ctx.restore();
  return result;
}
