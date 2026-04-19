"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEditorState } from "@/hooks/use-editor-state";
import { PHOTO_SPECS } from "@/constants/photo-specs";
import { BACKGROUND_COLORS } from "@/constants/photo-specs";
import { resizeImage, canvasToBlob, downloadBlob } from "@/lib/canvas/image-utils";
import { replaceBackground } from "@/lib/canvas/background-replace";
import { cropToSpec } from "@/lib/canvas/crop";
import { applyWatermark } from "@/lib/canvas/watermark";
import { injectJpegDpi, injectPngDpi } from "@/lib/canvas/dpi-export";

const MAX_IMAGE_SIZE = 2048;

export function SaveDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { state } = useEditorState();
  const [format, setFormat] = useState<"jpeg" | "png">("jpeg");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!state.originalImage || !state.segmentationMask || !state.cropRect)
      return;

    setIsSaving(true);
    try {
      const spec = PHOTO_SPECS[state.selectedSpec];
      const bgColor = BACKGROUND_COLORS[state.backgroundColor].value;

      // Rebuild from original at full resolution for best quality
      const workingCanvas = resizeImage(state.originalImage, MAX_IMAGE_SIZE);
      const processedImageData = replaceBackground(
        workingCanvas,
        state.segmentationMask,
        bgColor
      );

      // Put processed data on canvas
      const processedCanvas = document.createElement("canvas");
      processedCanvas.width = processedImageData.width;
      processedCanvas.height = processedImageData.height;
      processedCanvas.getContext("2d")!.putImageData(processedImageData, 0, 0);

      // Crop to spec
      let finalCanvas = cropToSpec(processedCanvas, state.cropRect, spec);

      // Apply watermark if not removed
      if (!state.watermarkRemoved) {
        finalCanvas = applyWatermark(finalCanvas);
      }

      // Export with DPI
      const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
      let blob = await canvasToBlob(
        finalCanvas,
        mimeType as "image/jpeg" | "image/png"
      );

      // Inject DPI metadata
      if (format === "jpeg") {
        blob = await injectJpegDpi(blob, spec.dpi);
      } else {
        blob = await injectPngDpi(blob, spec.dpi);
      }

      // Download
      const ext = format === "jpeg" ? "jpg" : "png";
      const filename = `셀프증명_${spec.label}_${spec.width}x${spec.height}.${ext}`;
      downloadBlob(blob, filename);

      onOpenChange(false);
    } catch (error) {
      console.error("Save failed:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  }

  const spec = PHOTO_SPECS[state.selectedSpec];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>사진 저장</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">규격</span>
              <span className="font-medium">{spec.label}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-gray-500">크기</span>
              <span className="font-medium">
                {spec.width} &times; {spec.height}px ({spec.dpi} DPI)
              </span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-gray-500">실제 크기</span>
              <span className="font-medium">
                {spec.cmW} &times; {spec.cmH}cm
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              파일 형식
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setFormat("jpeg")}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                  format === "jpeg"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                JPEG (권장)
              </button>
              <button
                onClick={() => setFormat("png")}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                  format === "png"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                PNG
              </button>
            </div>
          </div>

          {!state.watermarkRemoved && (
            <p className="text-xs text-amber-600">
              무료 버전은 워터마크가 포함됩니다.
            </p>
          )}

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-12 w-full rounded-xl bg-blue-600 text-base font-semibold hover:bg-blue-700"
          >
            {isSaving ? "저장 중..." : "다운로드"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
