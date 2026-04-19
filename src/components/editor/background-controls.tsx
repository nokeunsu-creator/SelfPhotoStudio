"use client";

import { useEditorState } from "@/hooks/use-editor-state";
import { BACKGROUND_COLORS, type BackgroundColorKey } from "@/constants/photo-specs";
import { replaceBackground } from "@/lib/canvas/background-replace";
import { resizeImage } from "@/lib/canvas/image-utils";

const MAX_IMAGE_SIZE = 2048;

export function BackgroundControls() {
  const { state, dispatch } = useEditorState();

  function handleColorChange(colorKey: BackgroundColorKey) {
    if (!state.originalImage || !state.segmentationMask) return;

    dispatch({ type: "SET_BACKGROUND_COLOR", color: colorKey });

    const workingCanvas = resizeImage(state.originalImage, MAX_IMAGE_SIZE);
    const processedImageData = replaceBackground(
      workingCanvas,
      state.segmentationMask,
      BACKGROUND_COLORS[colorKey].value
    );
    dispatch({ type: "SET_PROCESSED_IMAGE", imageData: processedImageData });
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">배경색</span>
      {(Object.entries(BACKGROUND_COLORS) as [BackgroundColorKey, typeof BACKGROUND_COLORS[BackgroundColorKey]][]).map(
        ([key, color]) => (
          <button
            key={key}
            onClick={() => handleColorChange(key)}
            className={`h-8 w-8 rounded-full border-2 transition-all ${
              state.backgroundColor === key
                ? "border-blue-600 ring-2 ring-blue-200"
                : "border-gray-300"
            }`}
            style={{ backgroundColor: color.value }}
            title={color.label}
          />
        )
      )}
    </div>
  );
}
