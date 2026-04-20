export interface PhotoSpec {
  label: string;
  description: string;
  width: number;
  height: number;
  cmW: number;
  cmH: number;
  dpi: number;
}

export const PHOTO_SPECS: Record<string, PhotoSpec> = {
  passport: {
    label: "여권사진",
    description: "여권 / 주민등록증",
    width: 413,
    height: 531,
    cmW: 3.5,
    cmH: 4.5,
    dpi: 300,
  },
  halfCard: {
    label: "반명함",
    description: "이력서 / 수험표",
    width: 354,
    height: 472,
    cmW: 3.0,
    cmH: 4.0,
    dpi: 300,
  },
  visa: {
    label: "비자사진",
    description: "미국 / 중국 비자",
    width: 591,
    height: 591,
    cmW: 5.0,
    cmH: 5.0,
    dpi: 300,
  },
  idCard: {
    label: "주민등록증",
    description: "주민등록증 발급용",
    width: 413,
    height: 531,
    cmW: 3.5,
    cmH: 4.5,
    dpi: 300,
  },
  driverLicense: {
    label: "운전면허증",
    description: "운전면허증 갱신/발급",
    width: 413,
    height: 531,
    cmW: 3.5,
    cmH: 4.5,
    dpi: 300,
  },
} as const;

export const BACKGROUND_COLORS = {
  white: { label: "흰색", value: "#FFFFFF" },
  blue: { label: "파란색", value: "#0047AB" },
} as const;

export type BackgroundColorKey = keyof typeof BACKGROUND_COLORS;
export type PhotoSpecKey = keyof typeof PHOTO_SPECS;
