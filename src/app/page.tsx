import {
  HomeHero,
  PracticeAreasGrid,
  ProcessSection,
  WhyChooseUs,
  LocationsSection,
} from "@/components/sections";
import { CTABanner } from "@/components/common";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <PracticeAreasGrid />
      <ProcessSection />
      <WhyChooseUs />
      <LocationsSection />
      <CTABanner />
    </>
  );
}
