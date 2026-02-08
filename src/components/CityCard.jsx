import { useState, useMemo } from 'react'

const CityCard = ({ city, position }) => {
    const [imageError, setImageError] = useState(false)

    const cardPosition = useMemo(() => {
        if (!city) return { left: 0, top: 0 }

        const cardWidth = 480
        const cardHeight = 280
        const padding = 20

        let left = position.x - cardWidth - padding // Default: appear to the left
        let top = position.y - cardHeight / 2 // Center vertically on cursor

        // Keep within left boundary
        if (left < padding) {
            left = position.x + padding // Show to the right if no room on left
        }

        // Keep within right boundary
        if (left + cardWidth > window.innerWidth - padding) {
            left = window.innerWidth - cardWidth - padding
        }

        // Keep within top boundary
        if (top < padding) {
            top = padding
        }

        // Keep within bottom boundary
        if (top + cardHeight > window.innerHeight - padding) {
            top = window.innerHeight - cardHeight - padding
        }

        return { left, top }
    }, [city, position])

    if (!city) return null

    const cardStyle = {
        left: `${cardPosition.left}px`,
        top: `${cardPosition.top}px`
    }

    return (
        <div className="city-card visible" style={cardStyle}>
            <div className="city-card-content">
                <div className="city-info">
                    <h3 className="city-name">{city.name}</h3>
                    <p className="city-country">{city.country}</p>
                    <div className="city-stats">
                        <div className="stat">
                            <span className="stat-label">Passport Power</span>
                            <span className="stat-value">{city.stats.passport}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Population</span>
                            <span className="stat-value">{city.stats.population}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">GDP</span>
                            <span className="stat-value">{city.stats.gdp}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">% of Country</span>
                            <span className="stat-value">{city.stats.gdpPercent}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Domain</span>
                            <span className="stat-value">{city.stats.domain}</span>
                        </div>
                        <div className="stat stat-full">
                            <span className="stat-label">Main Industries</span>
                            <span className="stat-value">{city.stats.industries}</span>
                        </div>
                        <div className="stat stat-full stat-fact">
                            <span className="stat-label">Fun Fact</span>
                            <span className="stat-value">{city.stats.fact}</span>
                        </div>
                    </div>
                </div>
                <div className="city-image">
                    {!imageError ? (
                        <img
                            src={city.image}
                            alt={city.name}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #1E1E21, #0A0A0B)',
                            color: '#FFE500',
                            fontSize: '2rem'
                        }}>
                            🏙️
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CityCard
