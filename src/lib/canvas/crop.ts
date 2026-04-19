import type { CropRect } from "@/types";
import type { PhotoSpec } from "@/constants/photo-specs";

/**
 * Crop and resize an image to exact pixel dimensions for a photo spec.
 * Uses multi-step downscaling for quality.
 */
export function cropToSpec(
  sourceCanvas: HTMLCanvasElement,
  cropRect: CropRect,
  spec: PhotoSpec
): HTMLCanvasElement {
  // First, extract the crop region at original resolution
  const extractCanvas = document.createElement("canvas");
  extractCanvas.width = cropRect.width;
  extractCanvas.height = cropRect.height;
  const extractCtx = extractCanvas.getContext("2d")!;
  extractCtx.drawImage(
    sourceCanvas,
    cropRect.x,
    cropRect.y,
    cropRect.width,
    cropRect.height,
    0,
    0,
    cropRect.width,
    cropRect.height
  );

  // Multi-step downscale for quality
  return stepDownscale(extractCanvas, spec.width, spec.height);
}

/**
 * Progressively halve the canvas until close to target, then do final resize.
 * This produces much better quality than a single drawImage resize.
 */
function stepDownscale(
  source: HTMLCanvasElement,
  targetW: number,
  targetH: number
): HTMLCanvasElement {
  let current = source;

  // Step down by halves while still more than 2x the target
  while (current.width > targetW * 2 && current.height > targetH * 2) {
    const halfCanvas = document.createElement("canvas");
    halfCanvas.width = Math.round(current.width / 2);
    halfCanvas.height = Math.round(current.height / 2);
    const ctx = halfCanvas.getContext("2d")!;
    ctx.drawImage(current, 0, 0, halfCanvas.width, halfCanvas.height);
    current = halfCanvas;
  }

  // Final resize to exact target dimensions
  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = targetW;
  finalCanvas.height = targetH;
  const ctx = finalCanvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(current, 0, 0, targetW, targetH);

  return finalCanvas;
}
