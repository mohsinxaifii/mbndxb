import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { onReveal } from '../lib/reveal.js'
import { scrollTo } from '../lib/smooth.js'
import Hero from '../sections/Hero.jsx'
import Chapters from '../sections/Chapters.jsx'
import Resume from '../sections/Resume.jsx'
import Footer from '../components/Footer.jsx'

export default function Home() {
  const { hash } = useLocation()

  useEffect(() => {
    document.title = 'Mobeen Saifi — Creative Director, Dubai'
    if (hash) return onReveal(() => setTimeout(() => scrollTo(hash, { immediate: true }), 50))
  }, [])

  return (
    <main>
      <Hero />
      <Chapters />
      <Resume />
      <Footer />
    </main>
  )
}
