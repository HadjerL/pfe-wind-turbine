import HeroSecton from "@/app/ui/home/hero-section";
import EducationSection from "../ui/home/eduction-section";
import CTASection from "../ui/home/cta-section";
import Showcase from "../ui/home/showcase-section";

export default function page() {
  return (
    <div className="">
      <HeroSecton/>
      <EducationSection/>
      <Showcase/>
      <CTASection/>
    </div>
  );
}
