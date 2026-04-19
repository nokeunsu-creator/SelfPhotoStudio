import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0047AB",
};

export const metadata: Metadata = {
  title: {
    default: "셀프증명 - 무료 증명사진 편집기",
    template: "%s | 셀프증명",
  },
  description:
    "무료로 증명사진을 만드세요. 여권사진, 반명함, 비자사진 규격을 지원합니다. AI가 배경을 자동으로 제거하고, 흰색/파란색 배경으로 변환합니다. 사진관 방문 없이 스마트폰으로 간편하게.",
  keywords: [
    "증명사진",
    "증명사진 앱",
    "여권사진",
    "반명함",
    "비자사진",
    "셀프 증명사진",
    "증명사진 만들기",
    "여권사진 만들기",
    "무료 증명사진",
    "증명사진 배경",
    "주민등록증 사진",
  ],
  authors: [{ name: "셀프증명" }],
  creator: "셀프증명",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "셀프증명",
    title: "셀프증명 - 무료 증명사진 편집기 | 여권사진, 반명함, 비자사진",
    description:
      "AI 배경 제거로 증명사진을 무료로 만드세요. 사진관 비용 절약! 여권, 반명함, 비자 규격 지원.",
  },
  twitter: {
    card: "summary_large_image",
    title: "셀프증명 - 무료 증명사진 편집기",
    description:
      "AI 배경 제거로 증명사진을 무료로 만드세요. 여권, 반명함, 비자 규격 지원.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "셀프증명",
              applicationCategory: "PhotographyApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "KRW",
              },
              description:
                "AI 배경 제거로 증명사진을 무료로 만드는 웹 앱. 여권, 반명함, 비자 규격 지원.",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
