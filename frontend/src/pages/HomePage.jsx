// src/pages/HomePage.jsx
import HeroSection from '../components/home/HeroSection'
import ExperienceSplit from '../components/home/ExperienceSplit'
import BrandStoryTeaser from '../components/home/BrandStoryTeaser'
import AIRecommendations from '../components/home/AIRecommendations'
import SpecialOffersBanner from '../components/home/SpecialOffersBanner'

function HomePage() {
  return (
    <>
      <HeroSection />
      <SpecialOffersBanner />
      <ExperienceSplit />
      <AIRecommendations />
      <BrandStoryTeaser />
    </>
  )
}

export default HomePage