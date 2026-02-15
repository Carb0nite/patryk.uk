import GlobeContainer from './GlobeContainer'

const Hero = () => {
    return (
        <section className="hero" id="home">
            <div className="hero-content">
                <h1 className="hero-title">Patryk Sobczak</h1>
                <p className="hero-subtitle">Solution Engineer • Global Citizen</p>
                <p className="hero-description">
                    Building technical solutions across borders.{' '}
                    <span className="highlight">6 countries</span>,{' '}
                    <span className="highlight">3 languages</span>,{' '}
                    <span className="highlight">20+ clients and integrations</span>,{' '}
                    <span className="highlight">1 passion</span>.
                </p>
            </div>
            <GlobeContainer />
        </section>
    )
}

export default Hero
