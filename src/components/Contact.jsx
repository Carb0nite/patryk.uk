import { useEffect, useRef } from 'react'
import { Linkedin, Coffee } from 'lucide-react'

const Contact = () => {
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

    return (
        <section className="section section-dark" id="contact" ref={sectionRef}>
            <div className="section-container">
                <h2 className="section-title">Where to Find Me</h2>
                <div className="contact-content">
                    <div className="contact-links">
                        <a
                            href="https://www.linkedin.com/in/patryk-sobczak/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-link linkedin"
                        >
                            <Linkedin />
                            <span>LinkedIn</span>
                        </a>
                        <a
                            href="https://maps.app.goo.gl/k2JAb1Z1AZWe6ADTA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-link cafe"
                        >
                            <Coffee />
                            <span>working at my favourite cafe</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact
