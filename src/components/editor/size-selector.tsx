"use client";

import { useEditorState } from "@/hooks/use-editor-state";
import { PHOTO_SPECS, type PhotoSpecKey } from "@/constants/photo-specs";
import { calculateCropRect } from "@/lib/face-position";
import { resizeImage } from "@/lib/canvas/image-utils";

const MAX_IMAGE_SIZE = 2048;

export function SizeSelector() {
  const { state, dispatch } = useEditorState();

  function handleSpecChange(specKey: PhotoSpecKey) {
    dispatch({ type: "SET_SPEC", spec: specKey });

    if (state.originalImage) {
      const workingCanvas = resizeImage(state.originalImage, MAX_IMAGE_SIZE);
      const cropRect = calculateCropRect(
        workingCanvas.width,
        workingCanvas.height,
        state.faceBounds,
        PHOTO_SPECS[specKey]
      );
      dispatch({ type: "SET_CROP_RECT", rect: cropRect });
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {(Object.entries(PHOTO_SPECS) as [PhotoSpecKey, typeof PHOTO_SPECS[PhotoSpecKey]][]).map(
        ([key, spec]) => (
          <button
            key={key}
            onClick={() => handleSpecChange(key)}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
              state.selectedSpec === key
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <div>{spec.label}</div>
            <div className="mt-0.5 text-[10px] opacity-70">
              {spec.cmW}&times;{spec.cmH}cm
            </div>
          </button>
        )
      )}
    </div>
  );
}
