import { Hero } from "@/components/landing/Hero"
import { SearchSection } from "@/components/landing/SearchButton"
import { RecentServices } from "@/components/landing/RecentServices"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Features } from "@/components/landing/Features"
import { Pricing } from "@/components/landing/Pricing"

const HomePage = () => {

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden overflow-y-auto">

      {/* New Landing */}
      <Hero />
      <SearchSection />
      <RecentServices />
      <Features />
      <HowItWorks />
      <Pricing />
    </div>
  )
}

export default HomePage

