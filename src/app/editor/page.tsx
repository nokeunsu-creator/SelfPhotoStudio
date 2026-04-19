import type { Metadata } from "next";
import { EditorClient } from "@/components/editor/editor-client";

export const metadata: Metadata = {
  title: "사진 편집",
  description:
    "AI 배경 제거로 증명사진을 편집하세요. 여권, 반명함, 비자 규격을 지원합니다.",
};

export default function EditorPage() {
  return <EditorClient />;
}
