import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
          100% 무료 &middot; 설치 불필요 &middot; 개인정보 안전
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          증명사진,
          <br />
          <span className="text-blue-600">스마트폰으로 바로</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
          AI가 배경을 자동으로 제거하고 흰색/파란색으로 변환합니다.
          <br className="hidden sm:block" />
          여권, 반명함, 비자 규격을 지원합니다.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/editor"
            className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-blue-600 px-8 text-lg font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
          >
            사진 편집 시작하기
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          사진은 서버에 업로드되지 않습니다. 모든 처리는 브라우저에서 이루어집니다.
        </p>
      </div>
    </section>
  );
}
