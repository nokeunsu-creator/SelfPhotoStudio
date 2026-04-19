import { HeroSection } from "@/components/landing/hero-section";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { SizeGuide } from "@/components/landing/size-guide";
import { FaqSection } from "@/components/landing/faq-section";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureGrid />
      <SizeGuide />
      <FaqSection />
      <footer className="border-t border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500">
        <p>&copy; 2024 셀프증명. All rights reserved.</p>
        <Link href="/privacy" className="mt-2 inline-block hover:underline">
          개인정보처리방침
        </Link>
      </footer>
    </>
  );
}
