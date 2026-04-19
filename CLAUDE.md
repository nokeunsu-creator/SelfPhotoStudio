# 셀프증명 (Self Photo Studio) 프로젝트

## 프로젝트 개요

증명사진 편집 웹앱. 카메라/갤러리 사진 선택 → AI 배경 제거 → 배경색 변환 → 규격 크롭 → 다운로드. **모든 처리 클라이언트 사이드**, 서버 비용 0. SEO 트래픽("증명사진 앱") + 광고/워터마크 기반 수익화.

## 기술 스택

| 영역 | 선택 |
|------|------|
| 프레임워크 | Next.js 16.2.3 (App Router, Turbopack) |
| 언어 | TypeScript |
| UI | Tailwind CSS v4 + shadcn/ui (v4) |
| 폰트 | Noto Sans KR (next/font/google) |
| 배경 제거 | @mediapipe/tasks-vision — Image Segmenter |
| 얼굴 인식 | @mediapipe/tasks-vision — Face Detector |
| 상태관리 | useReducer + Context |
| 배포 | Vercel (예정) |

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx              # 한국어 메타데이터, JSON-LD SoftwareApplication 구조화 데이터
│   ├── page.tsx                # 랜딩 페이지 (SSG)
│   ├── editor/page.tsx         # 에디터 페이지 (EditorClient 래퍼)
│   ├── privacy/page.tsx        # 개인정보처리방침 (AdSense 요구사항)
│   ├── sitemap.ts              # /sitemap.xml 자동 생성
│   ├── robots.ts               # /robots.txt 자동 생성
│   └── globals.css             # Noto Sans KR을 기본 sans 폰트로 설정
├── components/
│   ├── ui/                     # shadcn/ui (button, dialog, tabs, slider, sheet)
│   ├── landing/
│   │   ├── hero-section.tsx    # 히어로 + CTA (Link 직접 스타일링)
│   │   ├── feature-grid.tsx    # 6개 특징 카드
│   │   ├── size-guide.tsx      # 규격 테이블 (SEO 콘텐츠)
│   │   └── faq-section.tsx     # FAQ + FAQPage JSON-LD
│   └── editor/
│       ├── editor-client.tsx       # EditorProvider 래퍼 (client)
│       ├── editor-workspace.tsx    # 에디터 메인 레이아웃
│       ├── photo-input.tsx         # 카메라/갤러리 입력 + ML 실행
│       ├── canvas-preview.tsx      # 크롭 가이드 포함 프리뷰 캔버스
│       ├── background-controls.tsx # 흰색/파란색 토글
│       ├── size-selector.tsx       # 규격 선택 탭
│       └── save-dialog.tsx         # 저장 다이얼로그 (JPEG/PNG, DPI 삽입)
├── hooks/
│   └── use-editor-state.tsx    # 에디터 전역 상태 (useReducer + Context)
├── lib/
│   ├── ml/
│   │   ├── segmentation.ts     # MediaPipe Image Segmenter 래퍼 (CDN 모델)
│   │   └── face-detection.ts   # MediaPipe Face Detector 래퍼
│   ├── canvas/
│   │   ├── image-utils.ts      # loadImage, resizeImage, canvasToBlob, downloadBlob
│   │   ├── background-replace.ts # 마스크 기반 soft-edge 배경 교체
│   │   ├── crop.ts             # 다단계 축소 크롭 (품질 확보)
│   │   ├── watermark.ts        # 대각선 반복 워터마크
│   │   └── dpi-export.ts       # JPEG JFIF APP0 / PNG pHYs 청크 DPI 삽입
│   └── face-position.ts        # 얼굴 기반 자동 크롭 위치 계산
├── constants/
│   └── photo-specs.ts          # 증명사진 규격 상수 (여권/반명함/비자/주민등록증)
└── types/
    └── index.ts                # EditorState, EditorAction, CropRect, FaceBounds
```

## 증명사진 규격 (300 DPI 기준)

| 종류 | 라벨 | cm | 픽셀 |
|------|------|-----|------|
| passport | 여권사진 | 3.5 × 4.5 | 413 × 531 |
| halfCard | 반명함 | 3.0 × 4.0 | 354 × 472 |
| visa | 비자사진 | 5.0 × 5.0 | 591 × 591 |
| idCard | 주민등록증 | 3.5 × 4.5 | 413 × 531 |

변환 공식: `pixels = (cm / 2.54) × 300`

배경색: 흰색 `#FFFFFF`, 파란색 `#0047AB` (한국 표준)

## 주요 기술 결정

### 1. MediaPipe 모델 로드
CDN에서 직접 로드:
- WASM: `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm`
- Selfie Segmenter: `https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite`
- Face Detector: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite`

모델 인스턴스는 모듈 레벨 변수로 캐싱하여 재사용.

### 2. COOP/COEP 헤더
`next.config.ts`에서 `/editor` 경로에만 적용:
- `Cross-Origin-Embedder-Policy: credentialless` (광고 스크립트 호환)
- `Cross-Origin-Opener-Policy: same-origin`

MediaPipe의 SharedArrayBuffer 사용을 위한 설정.

### 3. 배경 교체 알고리즘
Soft-edge 블렌딩 사용:
- confidence < 0.3 → 배경색으로 완전 교체
- 0.3 ≤ confidence < 0.7 → 선형 보간 블렌딩 (가장자리 부드러움)
- confidence ≥ 0.7 → 원본 픽셀 유지

### 4. 크롭 품질
다단계 축소(step-downscale): 목표의 2배보다 크면 반복해서 반으로 축소 → 최종 단계에서 정확한 크기로 리사이즈. 단일 drawImage 대비 훨씬 선명한 결과.

### 5. DPI 메타데이터
- **JPEG**: JFIF APP0 마커(FFE0)를 찾아서 density units=1(DPI), X/Y density=300으로 설정
- **PNG**: PNG 시그니처+IHDR 이후에 pHYs 청크(9바이트 데이터 + CRC32) 삽입

정확한 픽셀 크기가 우선이고 DPI 메타데이터는 부가적 개선.

### 6. 얼굴 기반 자동 크롭
- 머리 전체 높이 ≈ 얼굴 감지 박스 × 1.4
- 머리가 프레임 높이의 70% 차지
- 얼굴 상단이 프레임 상단에서 25% 아래 위치
- 이미지 경계를 벗어나면 자동으로 축소하여 맞춤

### 7. 상태관리
`useReducer` + `Context`. 디스패치 액션:
- `SET_STEP`, `SET_ORIGINAL_IMAGE`, `SET_PROCESSED_IMAGE`
- `SET_SEGMENTATION_MASK`, `SET_FACE_BOUNDS`
- `SET_SPEC`, `SET_BACKGROUND_COLOR`, `SET_CROP_RECT`
- `SET_PROCESSING`, `REMOVE_WATERMARK`, `RESET`

### 8. 빌드 시스템 주의사항
- shadcn/ui v4의 `Button`은 **asChild 미지원** → Link에 직접 스타일링 사용
- JSX를 포함한 훅 파일은 **.tsx 확장자 필수** (`use-editor-state.tsx`)
- Server Component에서 `dynamic(..., { ssr: false })` 불가 → 클라이언트 컴포넌트로 감싸거나 직접 import

## SEO 구성

### layout.tsx
- `metadata`: 한국어 키워드 11개 (증명사진, 여권사진, 반명함, 비자사진, 셀프 증명사진 등)
- `metadataBase`, `title.template`, Open Graph (`ko_KR`), Twitter Card
- JSON-LD: SoftwareApplication 타입, 무료(KRW 0) 표시

### faq-section.tsx
- FAQPage JSON-LD (리치 스니펫용) — 6개 Q&A

### sitemap.ts / robots.ts
- 3개 URL 사이트맵 (`/`, `/editor`, `/privacy`)
- robots.txt: 모든 경로 허용, sitemap 링크

## Phase 진행 상황

- **Phase 1 ✅ 완료**: 프로젝트 초기화 + SEO 랜딩 페이지 + 개인정보처리방침 + sitemap/robots + COOP/COEP 헤더 설정
- **Phase 2 ⏸ 파일 작성됨, 미검증**: 이미지 입력 + 배경 제거 (코드는 있으나 브라우저 동작 미확인)
- **Phase 3 ⏸ 파일 작성됨, 미검증**: 크롭 + 얼굴 감지
- **Phase 4 ⏸ 파일 작성됨, 미검증**: 내보내기 (DPI 삽입, 다단계 축소)
- **Phase 5 ⏳ 미완**: 수익화 (광고 SDK 미통합, 워터마크만 구현됨)
- **Phase 6 ⏳ 미완**: PWA + 최적화 (Serwist 미설치, manifest 없음)

### Phase 1 완료 검증
- `npx next build` 성공, 모든 페이지 정적 생성 완료
- `/`, `/editor`, `/privacy`, `/sitemap.xml`, `/robots.txt` 라우트 확인

### 다음 작업
Phase 2로 돌아갈 때 브라우저 실제 동작 확인:
1. `npm run dev` 실행
2. `/editor`에서 사진 업로드 → 세그멘테이션 성공 여부
3. 모바일 기기 (iOS Safari, Android Chrome)에서 MediaPipe 동작
4. 실제 크롭 결과물 픽셀 크기 검증 (413×531 등)

## 실행 명령어

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npx next build

# shadcn/ui 컴포넌트 추가
npx shadcn@latest add <component>
```

## 계획 문서

전체 구현 계획은 `C:\Users\nokeu\.claude\plans\indexed-booping-dragon.md`에 있음.

## 참고: 수익화 전략

- 무료 버전: 워터마크 포함 다운로드 (`watermark.ts` 구현됨)
- 전면광고 시청: 저장 직전 interstitial (`save-dialog.tsx`에 통합 예정)
- 보상광고 시청: 워터마크 제거 (`REMOVE_WATERMARK` 액션 + sessionStorage)
- 광고 차단기 폴백: 광고 실패 시 워터마크 포함으로 다운로드 허용
