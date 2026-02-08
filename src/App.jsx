import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import BadgeContainer from './components/BadgeContainer'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './styles/index.css'

function App() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    // Cache section elements and their dimensions
    let sections = []
    const updateSectionCache = () => {
      const sectionElements = document.querySelectorAll('section[id]')
      sections = Array.from(sectionElements).map(section => ({
        id: section.getAttribute('id'),
        top: section.offsetTop - 100,
        height: section.offsetHeight
      }))
    }

    // Initial cache update
    updateSectionCache()

    // Throttled scroll handler using requestAnimationFrame
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const active = sections.find(section =>
            scrollY >= section.top && scrollY < section.top + section.height
          )

          if (active) {
            setActiveSection(active.id)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateSectionCache) // Update cache on resize

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateSectionCache)
    }
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const navbarHeight = 60
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      <Navbar activeSection={activeSection} onNavigate={scrollToSection} />
      <BadgeContainer onNavigate={scrollToSection} />
      <Hero />
      <About />
      <Experience />
      <Education />
      <Contact />
      <Footer />
    </>
  )
}

export default App
