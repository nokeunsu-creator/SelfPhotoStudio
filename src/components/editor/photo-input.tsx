"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useEditorState } from "@/hooks/use-editor-state";
import { loadImage, resizeImage } from "@/lib/canvas/image-utils";
import { segmentPerson } from "@/lib/ml/segmentation";
import { detectFace } from "@/lib/ml/face-detection";
import { replaceBackground } from "@/lib/canvas/background-replace";
import { BACKGROUND_COLORS } from "@/constants/photo-specs";
import { calculateCropRect } from "@/lib/face-position";
import { PHOTO_SPECS } from "@/constants/photo-specs";

const MAX_IMAGE_SIZE = 2048;

export function PhotoInput() {
  const { dispatch } = useEditorState();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;

    dispatch({ type: "SET_PROCESSING", isProcessing: true });

    let workingCanvas: HTMLCanvasElement | null = null;

    try {
      const img = await loadImage(file);
      dispatch({ type: "SET_ORIGINAL_IMAGE", image: img });

      workingCanvas = resizeImage(img, MAX_IMAGE_SIZE);

      // Run segmentation and face detection in parallel
      const [segResult, faceResult] = await Promise.all([
        segmentPerson(workingCanvas),
        detectFace(workingCanvas),
      ]);

      dispatch({ type: "SET_SEGMENTATION_MASK", mask: segResult.mask });
      dispatch({ type: "SET_FACE_BOUNDS", bounds: faceResult });

      const processedImageData = replaceBackground(
        workingCanvas,
        segResult.mask,
        BACKGROUND_COLORS.white.value
      );
      dispatch({ type: "SET_PROCESSED_IMAGE", imageData: processedImageData });

      const cropRect = calculateCropRect(
        workingCanvas.width,
        workingCanvas.height,
        faceResult,
        PHOTO_SPECS.passport
      );
      dispatch({ type: "SET_CROP_RECT", rect: cropRect });
      dispatch({ type: "SET_STEP", step: "edit" });
    } catch (error) {
      console.error("Processing failed:", error);
      // AI 처리 실패 시 원본 이미지로 폴백
      if (workingCanvas) {
        const ctx = workingCanvas.getContext("2d")!;
        const fallback = ctx.getImageData(0, 0, workingCanvas.width, workingCanvas.height);
        dispatch({ type: "SET_PROCESSED_IMAGE", imageData: fallback });
        const cropRect = calculateCropRect(workingCanvas.width, workingCanvas.height, null, PHOTO_SPECS.passport);
        dispatch({ type: "SET_CROP_RECT", rect: cropRect });
        dispatch({ type: "SET_STEP", step: "edit" });
      } else {
        alert("사진을 불러올 수 없습니다. 다른 사진으로 시도해주세요.");
        dispatch({ type: "RESET" });
      }
    } finally {
      dispatch({ type: "SET_PROCESSING", isProcessing: false });
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
          📷
        </div>
        <h2 className="text-xl font-bold text-gray-900">사진을 선택하세요</h2>
        <p className="mt-2 text-sm text-gray-500">
          카메라로 촬영하거나 갤러리에서 선택하세요
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Button
          size="lg"
          className="h-14 rounded-xl bg-blue-600 text-base font-semibold hover:bg-blue-700"
          onClick={() => fileInputRef.current?.click()}
        >
          사진 선택하기
        </Button>
      </div>

      <p className="text-xs text-gray-400">
        사진은 기기에서만 처리되며 서버에 전송되지 않습니다
      </p>
    </div>
  );
}
