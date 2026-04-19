import { PHOTO_SPECS } from "@/constants/photo-specs";

export function SizeGuide() {
  return (
    <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          지원하는 증명사진 규격
        </h2>
        <p className="mt-4 text-center text-gray-600">
          300 DPI 고화질로 인쇄에 적합한 사이즈를 제공합니다.
        </p>
        <div className="mt-10 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-900">종류</th>
                <th className="px-6 py-4 font-semibold text-gray-900">용도</th>
                <th className="px-6 py-4 font-semibold text-gray-900">
                  크기 (cm)
                </th>
                <th className="px-6 py-4 font-semibold text-gray-900">
                  픽셀 (300 DPI)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.values(PHOTO_SPECS).map((spec) => (
                <tr key={spec.label} className="hover:bg-gray-50/80">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {spec.label}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {spec.description}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {spec.cmW} &times; {spec.cmH}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {spec.width} &times; {spec.height}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
