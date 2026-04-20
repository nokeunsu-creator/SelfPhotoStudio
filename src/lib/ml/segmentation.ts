import {
  ImageSegmenter,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

let segmenter: ImageSegmenter | null = null;

async function getSegmenter(): Promise<ImageSegmenter> {
  if (segmenter) return segmenter;

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  const modelPath =
    "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite";
  try {
    segmenter = await ImageSegmenter.createFromOptions(vision, {
      baseOptions: { modelAssetPath: modelPath, delegate: "GPU" },
      runningMode: "IMAGE",
      outputCategoryMask: false,
      outputConfidenceMasks: true,
    });
  } catch {
    segmenter = await ImageSegmenter.createFromOptions(vision, {
      baseOptions: { modelAssetPath: modelPath, delegate: "CPU" },
      runningMode: "IMAGE",
      outputCategoryMask: false,
      outputConfidenceMasks: true,
    });
  }

  return segmenter;
}

/**
 * Run selfie segmentation on an image element or canvas.
 * Returns a Float32Array confidence mask where 1.0 = person, 0.0 = background.
 */
export async function segmentPerson(
  image: HTMLImageElement | HTMLCanvasElement
): Promise<{ mask: Float32Array; width: number; height: number }> {
  const seg = await getSegmenter();
  const result = seg.segment(image);

  const confidenceMask = result.confidenceMasks![0];
  const maskData = confidenceMask.getAsFloat32Array();

  // Copy the data since MediaPipe reuses the buffer
  const mask = new Float32Array(maskData);

  const width =
    image instanceof HTMLCanvasElement ? image.width : image.naturalWidth;
  const height =
    image instanceof HTMLCanvasElement ? image.height : image.naturalHeight;

  result.close();
  return { mask, width, height };
}
