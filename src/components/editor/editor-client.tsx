"use client";

import { EditorProvider } from "@/hooks/use-editor-state";
import { EditorWorkspace } from "./editor-workspace";

export function EditorClient() {
  return (
    <EditorProvider>
      <EditorWorkspace />
    </EditorProvider>
  );
}
