import { useEffect, useRef, useState } from 'react'
import { SalesforceLogo } from './CompanyLogos'
import coverGeniusLogo from '../assets/logos/covergenius-logo.png'
import ibmLogo from '../assets/logos/ibm-logo.png'
import ciscoLogo from '../assets/logos/cisco-logo.png'
import { fetchMultipleStocks } from '../services/stockService'


// Simple SVG sparkline component for stock visualization
const StockSparkline = ({ data }) => {
    const width = 120
    const height = 40
    const padding = 4

    // Normalize data to fit in the chart area
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    const points = data.map((value, i) => {
        const x = padding + (i / (data.length - 1)) * (width - 2 * padding)
        const y = height - padding - ((value - min) / range) * (height - 2 * padding)
        return `${x},${y}`
    }).join(' ')

    // Determine if stock is up or down
    const isUp = data[data.length - 1] >= data[0]
    const lineColor = isUp ? '#00C853' : '#FF5252'

    return (
        <svg width={width} height={height} className="stock-sparkline">
            <polyline
                fill="none"
                stroke={lineColor}
                strokeWidth="1.5"
                points={points}
            />
            {/* Current price dot */}
            <circle
                cx={width - padding}
                cy={height - padding - ((data[data.length - 1] - min) / range) * (height - 2 * padding)}
                r="3"
                fill={lineColor}
            />
        </svg>
    )
}

const Experience = () => {
    const sectionRef = useRef(null)
    const [stockData, setStockData] = useState({})

    // Fetch live stock data on mount
    useEffect(() => {
        const tickers = ['CRM', 'CSCO', 'IBM']

        fetchMultipleStocks(tickers)
            .then(data => {
                setStockData(data)
            })
            .catch(error => {
                console.error('Error loading stock data:', error)
            })
    }, [])

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

    const experiences = [
        {
            id: 'cover-genius',
            company: 'Cover Genius',
            role: 'Client Solution Engineer',
            period: 'Jan 2025 - Present',
            startYear: 2025,
            logo: coverGeniusLogo,
            companyInfo: {
                industry: 'InsurTech',
                revenue: '$300M+ ARR',
                hq: 'Sydney, Australia',
                employees: '600',
                ticker: null, // Private company
                founded: '2014'
            },
            description: '1 of 4 Solution Engineers within EMEA at a Series E InsurTech unicorn, owning technical relationships across pre-sales, onboarding, and post-launch expansion.',
            highlights: [
                'Owning relationships for 15+ partners across EMEA',
                'Collaborating with sales, product, and engineering teams to deliver solutions',
                'Architecting API-first integrations across ticketing and travel industries'
            ]
        },
        {
            id: 'salesforce',
            company: 'Salesforce (MuleSoft)',
            role: 'Technical Consultant',
            period: 'Sep 2022 - Jan 2025',
            startYear: 2022,
            logo: SalesforceLogo,
            companyInfo: {
                industry: 'Enterprise SaaS',
                revenue: '$34.9B',
                hq: 'San Francisco, USA',
                employees: '80K',
                ticker: 'CRM'
            },
            description: 'Delivered enterprise integration solutions for global clients, progressing from Associate to Technical Consultant while building expertise in API-led connectivity.',
            highlights: [
                'Delivered 8 use cases, 15 RESTful APIs processing 100K transactions in first week',
                "Finalist in internal GenAI hackathon building with Google's Gemini (Vertex AI)",
                'Configured CI/CD pipelines on Azure DevOps for 3 environments'
            ]
        },
        {
            id: 'cisco',
            company: 'Cisco Systems',
            role: 'Business Analyst Intern',
            period: 'Jul 2019 - Jul 2020',
            startYear: 2019,
            logo: ciscoLogo,
            companyInfo: {
                industry: 'Networking & Security',
                revenue: '$57B',
                hq: 'San Jose, USA',
                employees: '85K',
                ticker: 'CSCO'
            },
            description: 'Delivered a mobile device management solution for 50,000+ employees as part of the Digital Workplace Transformation team.',
            highlights: []
        },
        {
            id: 'ibm',
            company: 'IBM',
            role: 'Internship at The Wimbledon Championships',
            period: 'Jun - Jul 2018',
            startYear: 2018,
            logo: ibmLogo,
            companyInfo: {
                industry: 'Enterprise Tech & Consulting',
                revenue: '$61B',
                hq: 'Armonk, NY, USA',
                employees: '350K',
                ticker: 'IBM'
            },
            description: "Deployed and supported over 100 Wimbledon Information Systems across one of IBM's most prestigious client sites.",
            highlights: []
        }
    ]

    return (
        <section className="section section-dark" id="experience" ref={sectionRef}>
            <div className="section-container">
                <h2 className="section-title">Experience</h2>

                <div className="timeline">
                    {experiences.map((exp, index) => {
                        const Logo = exp.logo
                        return (
                            <div className="timeline-item" id={exp.id} key={exp.id}>
                                {/* Timeline line and dot */}
                                <div className="timeline-marker">
                                    <div className="timeline-dot"></div>
                                    {index < experiences.length - 1 && (
                                        <div className="timeline-line"></div>
                                    )}
                                </div>

                                {/* Date label */}
                                <div className="timeline-date">
                                    <span className="timeline-year">{exp.startYear}</span>
                                    <span className="timeline-period">{exp.period}</span>
                                </div>

                                {/* Experience card */}
                                <div className="experience-card">
                                    <div className="experience-header">
                                        <div className="experience-logo">
                                            {typeof Logo === 'string' ? (
                                                <img src={Logo} alt={`${exp.company} logo`} className={`company-logo-img logo-${exp.id}`} />
                                            ) : (
                                                <Logo className={`company-logo-svg logo-${exp.id}`} />
                                            )}
                                        </div>
                                        <div className="experience-title-group">
                                            <h3 className="experience-company">{exp.company}</h3>
                                            <p className="experience-role">{exp.role}</p>
                                        </div>
                                        {/* Stock chart for public companies */}
                                        {exp.companyInfo.ticker && stockData[exp.companyInfo.ticker] && (
                                            <div className="stock-chart">
                                                <StockSparkline data={stockData[exp.companyInfo.ticker]} />
                                                <span className="stock-ticker">{exp.companyInfo.ticker}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Company metadata */}
                                    <div className="company-meta">
                                        <span className="meta-item">
                                            <span className="meta-label">Industry</span>
                                            <span className="meta-value">{exp.companyInfo.industry}</span>
                                        </span>
                                        <span className="meta-item">
                                            <span className="meta-label">Revenue</span>
                                            <span className="meta-value">{exp.companyInfo.revenue}</span>
                                        </span>
                                        <span className="meta-item">
                                            <span className="meta-label">HQ</span>
                                            <span className="meta-value">{exp.companyInfo.hq}</span>
                                        </span>
                                        {exp.companyInfo.employees && (
                                            <span className="meta-item">
                                                <span className="meta-label">Employees</span>
                                                <span className="meta-value">{exp.companyInfo.employees}</span>
                                            </span>
                                        )}
                                    </div>

                                    <p className="experience-description">{exp.description}</p>

                                    {exp.highlights.length > 0 && (
                                        <ul className="experience-highlights">
                                            {exp.highlights.map((highlight, i) => (
                                                <li key={i}>{highlight}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section >
    )
}

export default Experience
