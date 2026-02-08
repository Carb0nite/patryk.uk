import { useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'
import { UCLLogo } from './CompanyLogos'


const Education = () => {
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

    const education = [
        {
            id: 'ucl-msc',
            school: 'University College London',
            degree: 'MSc Business Analytics (Distinction)',
            period: '2021 - 2022',
            description: [
                'Joint Data Science and Business degree at the UCL School of Management.',
                'Key modules: NLP, Data Visualisation, Data Engineering, Machine Learning.'
            ],
            location: 'Canary Wharf',
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.3799628995917!2d-0.021816684216847765!3d51.50517040803439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487602cb89c2df47%3A0x548b321de970e0b5!2sUCL%20School%20of%20Management!5e0!3m2!1sen!2suk!4v1738975746000!5m2!1sen!2suk'
        },
        {
            id: 'ucl-bsc',
            school: 'University College London',
            degree: 'BSc Information Management for Business (First Class)',
            period: '2017 - 2021',
            description: 'Joint IT and Business degree at the UCL School of Management.',
            location: 'Bloomsbury',
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.6797766717253!2d-0.13659368422144404!3d51.52398450805989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b3354f1d655%3A0xc2a20a2f8e0e3dc1!2sUniversity%20College%20London!5e0!3m2!1sen!2suk!4v1738975746000!5m2!1sen!2suk'
        }
    ]

    return (
        <section className="section" id="education" ref={sectionRef}>
            <div className="section-container">
                <h2 className="section-title">Education</h2>

                {education.map(edu => (
                    <div className="education-card" id={edu.id === 'ucl-msc' ? 'ucl' : undefined} key={edu.id}>
                        <div className="education-header">
                            <div className="education-logo">
                                <UCLLogo className="university-logo-svg" />
                            </div>
                            <div className="education-info">
                                <h3 className="education-school">{edu.school}</h3>
                                <p className="education-degree">{edu.degree}</p>
                                <p className="education-period">{edu.period}</p>
                                <p className="education-location">
                                    <MapPin size={14} />
                                    {edu.location}
                                </p>
                            </div>
                        </div>
                        <div className="education-description">
                            {Array.isArray(edu.description) ? (
                                edu.description.map((paragraph, idx) => (
                                    <p key={idx}>{paragraph}</p>
                                ))
                            ) : (
                                <p>{edu.description}</p>
                            )}
                        </div>

                        {/* Hover map */}
                        <div className="education-map">
                            <iframe
                                src={edu.mapUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={`Map of ${edu.location}`}
                            ></iframe>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Education
