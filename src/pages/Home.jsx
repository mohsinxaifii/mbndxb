import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { onReveal } from '../lib/reveal.js'
import { scrollTo } from '../lib/smooth.js'
import Hero from '../sections/Hero.jsx'
import Statement from '../sections/Statement.jsx'
import Selected from '../sections/Selected.jsx'
import Feed from '../sections/Feed.jsx'
import Motion from '../sections/Motion.jsx'
import Index from '../sections/Index.jsx'
import Brands from '../sections/Brands.jsx'
import Footer from '../components/Footer.jsx'

export default function Home() {
  const { hash } = useLocation()

  useEffect(() => {
    document.title = 'Mubeen Saifi — Creative Director, Dubai'
    if (hash) return onReveal(() => setTimeout(() => scrollTo(hash, { immediate: true }), 50))
  }, [])

  return (
    <main>
      <Hero />
      <Statement />
      <Selected />
      <Feed />
      <Motion />
      <Index />
      <Brands />
      <Footer />
    </main>
  )
}
