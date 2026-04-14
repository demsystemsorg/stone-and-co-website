import {
  HomeHero,
  PracticeAreasGrid,
  ProcessSection,
  WhyChooseUs,
  LocationsSection,
  StatsSection,
} from "@/components/sections";
import { CTABanner } from "@/components/common";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <PracticeAreasGrid />
      <StatsSection />
      <ProcessSection />
      <WhyChooseUs />
      <LocationsSection />
      <CTABanner />
    </>
  );
}
