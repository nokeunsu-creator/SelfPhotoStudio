const features = [
  {
    icon: "📸",
    title: "카메라 또는 갤러리",
    description: "스마트폰 카메라로 바로 촬영하거나, 갤러리에서 사진을 선택하세요.",
  },
  {
    icon: "🤖",
    title: "AI 배경 제거",
    description:
      "인공지능이 사람을 자동으로 인식하고, 배경을 깔끔하게 제거합니다.",
  },
  {
    icon: "🎨",
    title: "배경색 변환",
    description:
      "흰색 또는 파란색 배경으로 자동 변환합니다. 증명사진 규격에 맞춰 제공됩니다.",
  },
  {
    icon: "✂️",
    title: "규격 자동 크롭",
    description:
      "여권, 반명함, 비자 등 원하는 규격을 선택하면 자동으로 크롭됩니다.",
  },
  {
    icon: "🔒",
    title: "개인정보 보호",
    description:
      "사진이 서버로 전송되지 않습니다. 모든 처리가 브라우저 내에서 이루어집니다.",
  },
  {
    icon: "💰",
    title: "사진관 비용 절약",
    description:
      "사진관에 가지 않아도 됩니다. 무료로 고품질 증명사진을 만들어보세요.",
  },
];

export function FeatureGrid() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          4단계로 완성하는 증명사진
        </h2>
        <p className="mt-4 text-center text-gray-600">
          복잡한 사진 편집 없이, 누구나 쉽게 만들 수 있습니다.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 text-3xl">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
