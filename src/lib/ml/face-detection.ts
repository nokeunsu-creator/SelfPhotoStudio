import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import type { FaceBounds } from "@/types";

let detector: FaceDetector | null = null;

async function getDetector(): Promise<FaceDetector> {
  if (detector) return detector;

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  detector = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite",
      delegate: "GPU",
    },
    runningMode: "IMAGE",
  });

  return detector;
}

/**
 * Detect the primary (largest) face in the image.
 * Returns bounding box or null if no face found.
 */
export async function detectFace(
  image: HTMLImageElement | HTMLCanvasElement
): Promise<FaceBounds | null> {
  const det = await getDetector();
  const result = det.detect(image);

  if (!result.detections || result.detections.length === 0) {
    return null;
  }

  // Pick the largest face
  let largest = result.detections[0];
  for (const d of result.detections) {
    const area =
      (d.boundingBox?.width ?? 0) * (d.boundingBox?.height ?? 0);
    const largestArea =
      (largest.boundingBox?.width ?? 0) * (largest.boundingBox?.height ?? 0);
    if (area > largestArea) {
      largest = d;
    }
  }

  const bb = largest.boundingBox;
  if (!bb) return null;

  return {
    x: bb.originX,
    y: bb.originY,
    width: bb.width,
    height: bb.height,
  };
}
