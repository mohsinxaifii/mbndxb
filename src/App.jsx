import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TransitionProvider } from './lib/transition.jsx'
import { LightboxProvider } from './components/Lightbox.jsx'
import Nav from './components/Nav.jsx'
import Cursor from './components/Cursor.jsx'
import Loader from './components/Loader.jsx'
import Home from './pages/Home.jsx'
import Project from './pages/Project.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  const [intro, setIntro] = useState(() => document.documentElement.classList.contains('intro'))

  // Fonts change line heights, which moves every trigger below the fold.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <TransitionProvider>
      <LightboxProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<Project />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {intro && <Loader onDone={() => setIntro(false)} />}
        <Cursor />
        <div className="grain" aria-hidden="true" />
      </LightboxProvider>
    </TransitionProvider>
  )
}
