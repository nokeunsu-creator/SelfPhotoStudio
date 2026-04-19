/**
 * Replace the background of an image using a segmentation mask.
 * Uses soft-edge blending for clean transitions around hair/edges.
 */
export function replaceBackground(
  sourceCanvas: HTMLCanvasElement,
  mask: Float32Array,
  bgColor: string
): ImageData {
  const { width, height } = sourceCanvas;
  const ctx = sourceCanvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Parse background color
  const bg = hexToRgb(bgColor);

  // Soft edge thresholds
  const LOW = 0.3;
  const HIGH = 0.7;

  for (let i = 0; i < mask.length; i++) {
    const confidence = mask[i];
    const px = i * 4;

    if (confidence < LOW) {
      // Definitely background — replace completely
      pixels[px] = bg.r;
      pixels[px + 1] = bg.g;
      pixels[px + 2] = bg.b;
      pixels[px + 3] = 255;
    } else if (confidence < HIGH) {
      // Edge zone — blend
      const alpha = (confidence - LOW) / (HIGH - LOW);
      pixels[px] = Math.round(pixels[px] * alpha + bg.r * (1 - alpha));
      pixels[px + 1] = Math.round(
        pixels[px + 1] * alpha + bg.g * (1 - alpha)
      );
      pixels[px + 2] = Math.round(
        pixels[px + 2] * alpha + bg.b * (1 - alpha)
      );
      pixels[px + 3] = 255;
    }
    // confidence >= HIGH: keep original pixel
  }

  return imageData;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 255, g: 255, b: 255 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}
