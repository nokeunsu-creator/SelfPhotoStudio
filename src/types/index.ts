import type { PhotoSpecKey, BackgroundColorKey } from "@/constants/photo-specs";

export type EditorStep = "upload" | "edit" | "crop" | "save";

export interface FaceBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EditorState {
  step: EditorStep;
  originalImage: HTMLImageElement | null;
  processedImageData: ImageData | null;
  segmentationMask: Float32Array | null;
  faceBounds: FaceBounds | null;
  selectedSpec: PhotoSpecKey;
  backgroundColor: BackgroundColorKey;
  cropRect: CropRect | null;
  isProcessing: boolean;
  aiFailed: boolean;
  watermarkRemoved: boolean;
}

export type EditorAction =
  | { type: "SET_STEP"; step: EditorStep }
  | { type: "SET_ORIGINAL_IMAGE"; image: HTMLImageElement }
  | { type: "SET_PROCESSED_IMAGE"; imageData: ImageData }
  | { type: "SET_SEGMENTATION_MASK"; mask: Float32Array }
  | { type: "SET_FACE_BOUNDS"; bounds: FaceBounds | null }
  | { type: "SET_SPEC"; spec: PhotoSpecKey }
  | { type: "SET_BACKGROUND_COLOR"; color: BackgroundColorKey }
  | { type: "SET_CROP_RECT"; rect: CropRect }
  | { type: "SET_PROCESSING"; isProcessing: boolean }
  | { type: "SET_AI_FAILED"; failed: boolean }
  | { type: "REMOVE_WATERMARK" }
  | { type: "RESET" };
