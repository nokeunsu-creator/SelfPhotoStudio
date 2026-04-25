"use client";

import { useReducer, createContext, useContext } from "react";
import type { EditorState, EditorAction } from "@/types";

const initialState: EditorState = {
  step: "upload",
  originalImage: null,
  processedImageData: null,
  segmentationMask: null,
  faceBounds: null,
  selectedSpec: "passport",
  backgroundColor: "white",
  cropRect: null,
  isProcessing: false,
  aiFailed: false,
  watermarkRemoved: false,
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SET_ORIGINAL_IMAGE":
      return { ...state, originalImage: action.image, step: "edit" };
    case "SET_PROCESSED_IMAGE":
      return { ...state, processedImageData: action.imageData };
    case "SET_SEGMENTATION_MASK":
      return { ...state, segmentationMask: action.mask };
    case "SET_FACE_BOUNDS":
      return { ...state, faceBounds: action.bounds };
    case "SET_SPEC":
      return { ...state, selectedSpec: action.spec };
    case "SET_BACKGROUND_COLOR":
      return { ...state, backgroundColor: action.color };
    case "SET_CROP_RECT":
      return { ...state, cropRect: action.rect };
    case "SET_PROCESSING":
      return { ...state, isProcessing: action.isProcessing };
    case "SET_AI_FAILED":
      return { ...state, aiFailed: action.failed };
    case "REMOVE_WATERMARK":
      return { ...state, watermarkRemoved: true };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
} | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorState() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorState must be used within an EditorProvider");
  }
  return context;
}
