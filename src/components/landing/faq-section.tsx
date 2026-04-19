const faqs = [
  {
    question: "셀프증명은 정말 무료인가요?",
    answer:
      "네, 완전히 무료입니다. 짧은 광고를 시청하면 워터마크 없이 다운로드할 수 있습니다.",
  },
  {
    question: "사진이 서버에 저장되나요?",
    answer:
      "아니요. 모든 사진 처리는 사용자의 브라우저(기기) 내에서 이루어집니다. 사진이 서버로 전송되거나 저장되지 않습니다.",
  },
  {
    question: "어떤 증명사진 규격을 지원하나요?",
    answer:
      "여권사진(3.5×4.5cm), 반명함(3×4cm), 비자사진(5×5cm), 주민등록증(3.5×4.5cm)을 지원합니다. 모두 300 DPI 고화질로 인쇄에 적합합니다.",
  },
  {
    question: "스마트폰에서도 사용할 수 있나요?",
    answer:
      "네, 스마트폰 브라우저에서 바로 사용할 수 있습니다. 카메라로 직접 촬영하거나 갤러리에서 사진을 선택할 수 있습니다.",
  },
  {
    question: "배경 제거 품질은 어떤가요?",
    answer:
      "Google의 MediaPipe AI 모델을 사용하여 머리카락 등 세밀한 부분까지 깔끔하게 배경을 제거합니다.",
  },
  {
    question: "인쇄는 어떻게 하나요?",
    answer:
      "다운로드한 사진을 일반 프린터로 인쇄하거나, 편의점 사진 인쇄 서비스를 이용하시면 됩니다. 300 DPI 고화질이므로 선명하게 인쇄됩니다.",
  },
];

export function FaqSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          자주 묻는 질문
        </h2>
        <div className="mt-10 space-y-6">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-gray-200 bg-white"
            >
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-left font-medium text-gray-900 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span className="ml-4 flex-shrink-0 text-gray-400 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <div className="px-6 pb-5 text-sm leading-6 text-gray-600">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}
