"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useEditorState } from "@/hooks/use-editor-state";
import { PhotoInput } from "./photo-input";
import { CanvasPreview } from "./canvas-preview";
import { BackgroundControls } from "./background-controls";
import { SizeSelector } from "./size-selector";
import { SaveDialog } from "./save-dialog";
import Link from "next/link";

export function EditorWorkspace() {
  const { state, dispatch } = useEditorState();
  const [saveOpen, setSaveOpen] = useState(false);

  return (
    <div className="relative flex h-dvh flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <Link
          href="/"
          className="text-lg font-bold text-blue-600"
        >
          셀프증명
        </Link>
        {state.step !== "upload" && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch({ type: "RESET" })}
            >
              다시 찍기
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setSaveOpen(true)}
            >
              저장
            </Button>
          </div>
        )}
      </header>

      {/* Main content */}
      {state.step === "upload" ? (
        <PhotoInput />
      ) : (
        <>
          {/* Processing banner */}
          {state.isProcessing && (
            <div className="flex items-center justify-center gap-2 bg-blue-50 px-4 py-2 text-sm text-blue-700">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
              AI 배경 제거 중...
            </div>
          )}

          {/* AI failure banner */}
          {!state.isProcessing && state.aiFailed && !state.segmentationMask && (
            <div className="flex items-center justify-center gap-2 bg-amber-50 px-4 py-2 text-xs text-amber-800">
              <span>⚠️</span>
              AI 배경 제거 실패 — 원본 사진 그대로 크롭/저장할 수 있습니다.
            </div>
          )}

          {/* Canvas */}
          <CanvasPreview />

          {/* Controls */}
          <div className="border-t border-gray-200 bg-white px-4 py-4 space-y-4">
            <BackgroundControls />
            <SizeSelector />
          </div>
        </>
      )}

      <SaveDialog open={saveOpen} onOpenChange={setSaveOpen} />
    </div>
  );
}
