import { useEffect, useRef } from 'react'

const About = () => {
    const sectionRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible')
                    }
                })
            },
            { threshold: 0.1 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const languages = [
        { flag: '🇬🇧', name: 'English', level: 'Fluent' },
        { flag: '🇵🇱', name: 'Polish', level: 'Native' },
        { flag: '🇩🇪', name: 'German', level: 'Professional (B2)' }
    ]

    return (
        <section className="section" id="about" ref={sectionRef}>
            <div className="section-container">
                <h2 className="section-title">About Me</h2>
                <div className="about-content">
                    <p className="about-text">
                        Born in Poland, raised across Europe and the Middle East, I've learned that the best solutions
                        come from understanding diverse perspectives. My journey through{' '}
                        <strong>Poland → Austria → Switzerland → United Arab Emirates → Czech Republic → United Kingdom</strong>{' '}
                        has shaped how I approach even the most ambiguous problems—with curiosity, adaptability, and a global mindset.
                    </p>
                    <p className="about-text">
                        Today, I'm a Solution Engineer at Cover Genius, helping enterprise partners
                        integrate embedded insurance solutions across EMEA. I thrive at the intersection
                        of technology and business, translating complex technical requirements into
                        actionable solutions.
                    </p>
                    <div className="about-languages">
                        {languages.map(lang => (
                            <div className="language" key={lang.name}>
                                <span className="language-flag">{lang.flag}</span>
                                <span className="language-name">{lang.name}</span>
                                <span className="language-level">{lang.level}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
