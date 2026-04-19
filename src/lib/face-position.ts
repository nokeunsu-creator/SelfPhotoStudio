import type { FaceBounds, CropRect } from "@/types";
import type { PhotoSpec } from "@/constants/photo-specs";

/**
 * Calculate optimal crop rectangle that centers the face.
 * For Korean ID photos, the face should be in the upper portion,
 * with the head occupying about 70-80% of the frame height.
 */
export function calculateCropRect(
  imageWidth: number,
  imageHeight: number,
  faceBounds: FaceBounds | null,
  spec: PhotoSpec
): CropRect {
  const aspectRatio = spec.width / spec.height;

  if (!faceBounds) {
    // No face detected — center crop
    return centerCrop(imageWidth, imageHeight, aspectRatio);
  }

  // Estimate full head height (face detection gives face only, head is ~1.4x taller)
  const headHeight = faceBounds.height * 1.4;
  // Target: head takes about 70% of frame height
  const frameHeight = headHeight / 0.7;
  const frameWidth = frameHeight * aspectRatio;

  // Center horizontally on face
  const faceCenterX = faceBounds.x + faceBounds.width / 2;
  let x = faceCenterX - frameWidth / 2;

  // Position vertically: face top should be about 25% from top of frame
  const faceTop = faceBounds.y;
  let y = faceTop - frameHeight * 0.25;

  // Clamp to image bounds
  x = Math.max(0, Math.min(x, imageWidth - frameWidth));
  y = Math.max(0, Math.min(y, imageHeight - frameHeight));

  // If frame exceeds image, scale down to fit
  let finalWidth = frameWidth;
  let finalHeight = frameHeight;
  if (finalWidth > imageWidth) {
    finalWidth = imageWidth;
    finalHeight = finalWidth / aspectRatio;
  }
  if (finalHeight > imageHeight) {
    finalHeight = imageHeight;
    finalWidth = finalHeight * aspectRatio;
  }

  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(finalWidth),
    height: Math.round(finalHeight),
  };
}

function centerCrop(
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number
): CropRect {
  let cropW: number;
  let cropH: number;

  if (imageWidth / imageHeight > aspectRatio) {
    cropH = imageHeight;
    cropW = cropH * aspectRatio;
  } else {
    cropW = imageWidth;
    cropH = cropW / aspectRatio;
  }

  return {
    x: Math.round((imageWidth - cropW) / 2),
    y: Math.round((imageHeight - cropH) / 2),
    width: Math.round(cropW),
    height: Math.round(cropH),
  };
}
