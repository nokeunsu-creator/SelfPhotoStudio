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
          {/* Processing overlay */}
          {state.isProcessing && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80">
              <div className="text-center">
                <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                <p className="text-sm font-medium text-gray-700">
                  AI가 사진을 분석하고 있습니다...
                </p>
              </div>
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
