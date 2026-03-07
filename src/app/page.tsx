import { Hero } from "@/components/home/Hero";
import { TutorialSection } from "@/components/home/TutorialSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Hero />
      <TutorialSection />
      <FeaturesSection />
    </div>
  );
}
