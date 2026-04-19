import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-blue-600 hover:underline"
      >
        &larr; 홈으로
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">개인정보처리방침</h1>
      <div className="mt-8 space-y-6 text-sm leading-7 text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            1. 수집하는 개인정보
          </h2>
          <p>
            셀프증명은 사용자의 개인정보를 수집하지 않습니다. 사용자가 업로드하는
            사진은 사용자의 기기(브라우저) 내에서만 처리되며, 서버로 전송되거나
            저장되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            2. 광고 서비스
          </h2>
          <p>
            본 서비스는 Google AdSense를 통해 광고를 게재합니다. Google은 광고
            제공을 위해 쿠키를 사용할 수 있습니다. 자세한 내용은 Google의
            개인정보처리방침을 참조하시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            3. 쿠키 사용
          </h2>
          <p>
            본 서비스는 사용자 경험 개선과 광고 제공을 위해 쿠키를 사용할 수
            있습니다. 사용자는 브라우저 설정에서 쿠키를 관리할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            4. 데이터 보안
          </h2>
          <p>
            모든 이미지 처리는 사용자의 브라우저 내에서 이루어지며, 외부 서버로
            전송되지 않습니다. 이를 통해 사용자의 사진 데이터가 안전하게
            보호됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. 문의</h2>
          <p>
            개인정보 관련 문의사항이 있으시면 서비스 내 문의 기능을 이용해주시기
            바랍니다.
          </p>
        </section>

        <p className="text-xs text-gray-400">
          본 방침은 2024년 1월 1일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
}
