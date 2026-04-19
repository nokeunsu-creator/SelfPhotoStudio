"use client";

import { useRef, useEffect } from "react";
import { useEditorState } from "@/hooks/use-editor-state";

export function CanvasPreview() {
  const { state } = useEditorState();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !state.processedImageData) return;

    const ctx = canvas.getContext("2d")!;
    canvas.width = state.processedImageData.width;
    canvas.height = state.processedImageData.height;
    ctx.putImageData(state.processedImageData, 0, 0);

    // Draw crop guide
    if (state.cropRect) {
      const { x, y, width, height } = state.cropRect;

      // Dim area outside crop
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      // Top
      ctx.fillRect(0, 0, canvas.width, y);
      // Bottom
      ctx.fillRect(0, y + height, canvas.width, canvas.height - y - height);
      // Left
      ctx.fillRect(0, y, x, height);
      // Right
      ctx.fillRect(x + width, y, canvas.width - x - width, height);

      // Crop border
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Center crosshair
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      // Vertical center
      ctx.beginPath();
      ctx.moveTo(x + width / 2, y);
      ctx.lineTo(x + width / 2, y + height);
      ctx.stroke();
      // Horizontal center
      ctx.beginPath();
      ctx.moveTo(x, y + height / 2);
      ctx.lineTo(x + width, y + height / 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [state.processedImageData, state.cropRect]);

  if (!state.processedImageData) return null;

  return (
    <div
      ref={containerRef}
      className="flex flex-1 items-center justify-center overflow-hidden bg-gray-100 p-4"
    >
      <canvas
        ref={canvasRef}
        className="max-h-full max-w-full rounded-lg shadow-lg"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}
