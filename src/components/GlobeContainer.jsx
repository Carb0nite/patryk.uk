import { useRef, useState, useEffect, useMemo } from 'react'
import React from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import CityCard from './CityCard'

// City data with coordinates and information
const CITIES = {
    wroclaw: {
        name: 'Wrocław',
        country: 'Poland 🇵🇱',
        lat: 51.1079,
        lng: 17.0385,
        years: '1999-2001',
        current: false,
        stats: {
            passport: '#7',
            population: '640K',
            gdp: '$29B',
            gdpPercent: '4.5%',
            industries: 'IT, Manufacturing, Services',
            domain: '.pl',
            fact: 'There are over 300 bronze dwarf statues hidden throughout the city'
        },
        image: '/cities/wroclaw.png'
    },
    vienna: {
        name: 'Vienna',
        country: 'Austria 🇦🇹',
        lat: 48.2082,
        lng: 16.3738,
        years: '2001-2006',
        current: false,
        stats: {
            passport: '#3',
            population: '1.9M',
            gdp: '$113B',
            gdpPercent: '26%',
            industries: 'Tourism, Tech, Life Sciences',
            domain: '.at',
            fact: 'The Vienna Opera House sells 567 standing room tickets for €3-4 daily'
        },
        image: '/cities/vienna.png'
    },
    zurich: {
        name: 'Zurich',
        country: 'Switzerland 🇨🇭',
        lat: 47.3769,
        lng: 8.5417,
        years: '2006-2009',
        current: false,
        stats: {
            passport: '#2',
            population: '436K',
            gdp: '$138B',
            gdpPercent: '18%',
            industries: 'Finance, Insurance, Pharma',
            domain: '.ch',
            fact: "Zurich's water is so clean you can drink from any public fountain"
        },
        image: '/cities/zurich.png'
    },
    dubai: {
        name: 'Dubai',
        country: 'UAE 🇦🇪',
        lat: 25.2048,
        lng: 55.2708,
        years: '2010-2011, 2015-2017',
        current: false,
        stats: {
            passport: '#11',
            population: '3.5M',
            gdp: '$100B',
            gdpPercent: '25%',
            industries: 'Real Estate, Tourism, Trade',
            domain: '.ae',
            fact: 'Dubai has no income tax and the police drive Bugattis'
        },
        image: '/cities/dubai.png'
    },
    prague: {
        name: 'Prague',
        country: 'Czech Republic 🇨🇿',
        lat: 50.0755,
        lng: 14.4378,
        years: '2011-2015',
        current: false,
        stats: {
            passport: '#6',
            population: '1.3M',
            gdp: '$82B',
            gdpPercent: '25%',
            industries: 'Manufacturing, Tourism, IT',
            domain: '.cz',
            fact: 'Prague Castle is the largest ancient castle in the world'
        },
        image: '/cities/prague.png'
    },
    london: {
        name: 'London',
        country: 'United Kingdom 🇬🇧',
        lat: 51.5074,
        lng: -0.1278,
        years: '2017-present',
        current: true,
        stats: {
            passport: '#4',
            population: '8.8M',
            gdp: '$500B',
            gdpPercent: '23%',
            industries: 'Finance, Tech, Creative Arts',
            domain: '.uk',
            fact: 'London has over 170 museums, more than any other city'
        },
        image: '/cities/london.png'
    }
}

// Convert lat/lng to 3D coordinates
function latLngToVector3(lat, lng, radius = 1) {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lng + 180) * (Math.PI / 180)

    const x = -radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)

    return new THREE.Vector3(x, y, z)
}

// Countries where Patryk lived (use ISO 3166-1 alpha-3 codes for matching)
// GeoJSON URLs (Natural Earth 110m)
// GeoJSON URLs (Natural Earth 50m for better detail)
const GEOJSON_COUNTRIES_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson'
const GEOJSON_LAND_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_land.geojson'

// Countries where Patryk lived (use ISO 3166-1 alpha-3 codes for matching)
// Countries where Patryk lived (use ISO 3166-1 alpha-3 codes for matching)
const LIVED_COUNTRY_CODES = ['GBR', 'POL', 'AUT', 'CHE', 'CZE', 'ARE']
const LIVED_COUNTRY_NAMES = ['United Kingdom', 'Poland', 'Austria', 'Switzerland', 'Czech Republic', 'Czechia', 'United Arab Emirates']

// CountryBorders component - fetches and renders layered borders
function CountryBorders({ globalOpacity }) {
    const [countries, setCountries] = useState([])
    const [land, setLand] = useState([])

    useEffect(() => {
        // Fetch both datasets in parallel
        Promise.all([
            fetch(GEOJSON_COUNTRIES_URL).then(res => res.json()),
            fetch(GEOJSON_LAND_URL).then(res => res.json())
        ]).then(([countryData, landData]) => {
            const processedCountries = countryData.features.map(feature => ({
                name: feature.properties.ADMIN || feature.properties.NAME || feature.properties.name,
                iso: feature.properties.ISO_A3 || feature.properties.ADM0_A3,
                continent: feature.properties.CONTINENT, // Ideally use CONTINENT property if available
                region_un: feature.properties.REGION_UN, // Fallback
                subregion: feature.properties.SUBREGION, // Fallback
                geometry: feature.geometry
            }))
            setCountries(processedCountries)

            const processedLand = landData.features.map(feature => ({
                geometry: feature.geometry
            }))
            setLand(processedLand)
        }).catch(err => console.error('Failed to load GeoJSON data:', err))
    }, [])

    const borderLines = useMemo(() => {
        const lines = []

        // 1. Continent Outlines (Land) - Visible
        // 1. Continent Outlines (Land) - Visible
        land.forEach(feature => {
            const processCoordinates = (coords) => {
                // Use full detail (no simplification)
                const simplified = coords.filter((_, i) => i % 1 === 0)

                const segments = []
                let currentSegment = []

                simplified.forEach(([lng, lat]) => {
                    // Check overlap with detailed regions (Europe + UAE) to avoid double outlines
                    // Europe Box: Lat 34-72, Lng -25 to 34 (Rough approx covers EU/UK/Scandinavia/Ukraine)
                    // UAE Box: Lat 22-27, Lng 51-57
                    const inEurope = (lat > 34 && lat < 72 && lng > -25 && lng < 40)
                    const inUAE = (lat > 22 && lat < 27 && lng > 51 && lng < 57)
                    const isExcluded = inEurope || inUAE

                    if (isExcluded) {
                        if (currentSegment.length > 0) {
                            if (currentSegment.length > 1) segments.push(currentSegment)
                            currentSegment = []
                        }
                    } else {
                        currentSegment.push(latLngToVector3(lat, lng, 1.002))
                    }
                })
                if (currentSegment.length > 1) segments.push(currentSegment)

                segments.forEach(points => lines.push({ points, type: 'continent' }))
            }

            if (feature.geometry.type === 'Polygon') {
                feature.geometry.coordinates.forEach(processCoordinates)
            } else if (feature.geometry.type === 'MultiPolygon') {
                feature.geometry.coordinates.forEach(poly => poly.forEach(processCoordinates))
            }
        })

        // 2. Country Borders (Europe + UAE + Lived)
        countries.forEach(country => {
            const isLived = LIVED_COUNTRY_CODES.includes(country.iso) || LIVED_COUNTRY_NAMES.includes(country.name)
            const isUAE = country.iso === 'ARE' || country.name === 'United Arab Emirates'
            // Check for Europe (using various properties to be safe with 110m data)
            const isEurope = country.continent === 'Europe' || country.region_un === 'Europe' || country.subregion === 'Europe' || (country.iso && ['DEU', 'FRA', 'ITA', 'ESP', 'PRT', 'BEL', 'NLD', 'LUX', 'DNK', 'SWE', 'NOR', 'FIN', 'ISL', 'IRL', 'EST', 'LVA', 'LTU', 'BLR', 'UKR', 'MDA', 'ROU', 'BGR', 'GRC', 'ALB', 'MKD', 'MNE', 'SRB', 'BIH', 'HRV', 'SVN', 'HUN', 'SVK', 'CZE', 'POL', 'AUT', 'CHE', 'LIE', 'MCO', 'AND', 'SMR', 'VAT', 'MLT', 'CYP', 'GBR'].includes(country.iso))

            if (isLived || isUAE || isEurope) {
                const processCoordinates = (coords) => {
                    // Simplify: Use full detail (step 1) for all highlighted regions to ensure clarity
                    const step = 1
                    const simplified = coords.filter((_, i) => i % step === 0)
                    const points = simplified.map(([lng, lat]) => latLngToVector3(lat, lng, 1.004)) // Slightly higher than land
                    if (points.length > 2) {
                        lines.push({
                            points,
                            type: isLived ? 'lived' : 'detailed',
                            name: country.name
                        })
                    }
                }

                if (country.geometry.type === 'Polygon') {
                    country.geometry.coordinates.forEach(processCoordinates)
                } else if (country.geometry.type === 'MultiPolygon') {
                    country.geometry.coordinates.forEach(poly => poly.forEach(processCoordinates))
                }
            }
        })

        return lines
    }, [countries, land])

    return (
        <group>
            {borderLines.map((line, i) => {
                let color, opacity, linewidth

                if (line.type === 'continent') {
                    color = '#AAAAAA' // Lighter Grey - Clearly visible
                    opacity = 0.5 * globalOpacity
                    linewidth = 1

                } else if (line.type === 'detailed') {
                    color = '#CCCCCC' // Brighter Grey - Pop out more
                    opacity = 0.6 * globalOpacity
                    linewidth = 1
                } else { // lived
                    color = '#FFE500' // Yellow
                    opacity = 0.85 * globalOpacity
                    linewidth = 2
                }

                if (opacity <= 0.01) return null // Don't render if invisible

                return (
                    <line key={i}>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={line.points.length}
                                array={new Float32Array(line.points.flatMap(p => [p.x, p.y, p.z]))}
                                itemSize={3}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial color={color} transparent opacity={opacity} linewidth={linewidth} />
                    </line>
                )
            })}
        </group>
    )
}

// CityDot component (Memoized)
const CityDot = React.memo(function CityDot({ city, cityKey, onHover, onLeave, globalOpacity }) {
    const meshRef = useRef()
    const ringRef = useRef()
    const position = useMemo(() => latLngToVector3(city.lat, city.lng, 1.01), [city.lat, city.lng])

    useFrame(({ clock }) => {
        if (city.current && ringRef.current) {
            const scale = 1 + Math.sin(clock.elapsedTime * 2) * 0.3
            ringRef.current.scale.set(scale, scale, 1)
            // Pulse opacity multiplied by global scroll opacity
            ringRef.current.material.opacity = (0.8 - Math.sin(clock.elapsedTime * 2) * 0.4) * globalOpacity

            ringRef.current.lookAt(0, 0, 0)
        }
    })

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerOver={(e) => {
                    e.stopPropagation()
                    document.body.style.cursor = 'pointer'
                    onHover(cityKey, city, e)
                }}
                onPointerOut={(e) => {
                    e.stopPropagation()
                    document.body.style.cursor = 'auto'
                    onLeave()
                }}
            >
                <sphereGeometry args={[0.004, 8, 8]} />
                <meshBasicMaterial color="#FFE500" transparent opacity={globalOpacity} />
            </mesh>

            {/* Reduced ring geometry segments */}
            {city.current && (
                <mesh ref={ringRef}>
                    <ringGeometry args={[0.006, 0.008, 16]} />
                    <meshBasicMaterial color="#FFE500" transparent opacity={0.8 * globalOpacity} side={THREE.DoubleSide} />
                </mesh>
            )}
        </group>
    )
})

// Globe component (Memoized)
const Globe = React.memo(function Globe({ onCityHover, onCityLeave, scrollOpacity, ...props }) {
    const globeRef = useRef()

    useFrame(() => {
        if (globeRef.current) {
            globeRef.current.rotation.y += 0.0005
        }
    })

    // Create latitude lines (simplified segments)
    const latitudeLines = useMemo(() => {
        const lines = []
        for (let lat = -80; lat <= 80; lat += 20) {
            const points = []
            const phi = (90 - lat) * (Math.PI / 180)
            for (let lng = -180; lng <= 180; lng += 10) { // Reduced step
                const theta = (lng + 180) * (Math.PI / 180)
                const x = -Math.sin(phi) * Math.cos(theta)
                const y = Math.cos(phi)
                const z = Math.sin(phi) * Math.sin(theta)
                points.push(new THREE.Vector3(x, y, z))
            }
            lines.push(points)
        }
        return lines
    }, [])

    // Create longitude lines
    const longitudeLines = useMemo(() => {
        const lines = []
        for (let lng = -180; lng < 180; lng += 30) {
            const points = []
            const theta = (lng + 180) * (Math.PI / 180)

            for (let lat = -90; lat <= 90; lat += 10) { // Reduced step
                const phi = (90 - lat) * (Math.PI / 180)
                const x = -Math.sin(phi) * Math.cos(theta)
                const y = Math.cos(phi)
                const z = Math.sin(phi) * Math.sin(theta)
                points.push(new THREE.Vector3(x, y, z))
            }
            lines.push(points)
        }
        return lines
    }, [])

    return (
        <group ref={globeRef} rotation={[0, 2.8, -0.4]} >
            {/* Main globe sphere - Reduced segments */}
            < mesh >
                <sphereGeometry args={[1, 32, 32]} />
                <meshPhongMaterial
                    color="#0A0A0B"
                    transparent
                    opacity={0.95 * scrollOpacity}
                    shininess={30}
                    side={THREE.DoubleSide}
                />
            </mesh >

            {/* Atmosphere glow - Reduced segments */}
            < mesh >
                <sphereGeometry args={[1.02, 32, 32]} />
                <meshBasicMaterial
                    color="#FFE500"
                    transparent
                    opacity={0.08 * scrollOpacity}
                    side={THREE.BackSide}
                />
            </mesh >

            {/* Grid Lines */}
            {
                latitudeLines.map((points, i) => (
                    <line key={`lat-${i}`}>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={points.length}
                                array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                                itemSize={3}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial color="#FFE500" transparent opacity={0.15 * scrollOpacity} />
                    </line>
                ))
            }
            {
                longitudeLines.map((points, i) => (
                    <line key={`lng-${i}`}>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={points.length}
                                array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                                itemSize={3}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial color="#FFE500" transparent opacity={0.15 * scrollOpacity} />
                    </line>
                ))
            }

            <CountryBorders globalOpacity={scrollOpacity} />

            {
                Object.entries(CITIES).map(([key, city]) => (
                    <CityDot
                        key={key}
                        cityKey={key}
                        city={city}
                        onHover={onCityHover}
                        onLeave={onCityLeave}
                        globalOpacity={scrollOpacity}
                    />
                ))
            }
        </group >
    )
})

// Scene component with lighting
function Scene({ onCityHover, onCityLeave, scrollOpacity }) {
    return (
        <>
            <ambientLight intensity={0.6 * scrollOpacity} />
            <directionalLight position={[5, 3, 5]} intensity={0.8 * scrollOpacity} />
            <directionalLight position={[-5, -3, -5]} intensity={0.3 * scrollOpacity} color="#00C4CC" />
            <Globe
                onCityHover={onCityHover}
                onCityLeave={onCityLeave}
                scrollOpacity={scrollOpacity}
                position={[1.5, 0, 0]} // Globe positioned to the right
            />
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                rotateSpeed={0.5}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI * 2 / 3}
            />
        </>
    )
}

// Main GlobeContainer component
const GlobeContainer = () => {
    const [hoveredCity, setHoveredCity] = useState(null)
    const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 })
    const [scrollOpacity, setScrollOpacity] = useState(1)

    const handleCityHover = (cityKey, city, event) => {
        setHoveredCity({ key: cityKey, ...city })
        setCardPosition({
            x: event.clientX,
            y: event.clientY
        })
    }

    useEffect(() => {
        const handleScroll = () => {
            // Fade out based on scroll. Start fading immediately.
            // Globe will be fully invisible when scrolled 80% viewport
            const fadeStart = 0
            const fadeEnd = window.innerHeight * 0.8
            const currentScroll = window.scrollY

            let newOpacity = 1 - ((currentScroll - fadeStart) / (fadeEnd - fadeStart))
            newOpacity = Math.min(Math.max(newOpacity, 0), 1)

            setScrollOpacity(newOpacity)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleCityLeave = () => {
        setHoveredCity(null)
    }

    return (
        <div className="globe-container">
            <Canvas
                camera={{ position: [-3, 1, 0.5], fov: 25 }} // Camera shifted to view globe on right side
                style={{ background: 'transparent' }}
                dpr={[1, 3]} // Cap pixel ratio to 2x max to ensure performance on retina screens
                gl={{ powerPreference: "high-performance", antialias: true }}
            >
                <Scene
                    onCityHover={handleCityHover}
                    onCityLeave={handleCityLeave}
                    scrollOpacity={scrollOpacity}
                />
            </Canvas>

            {/* Render city card if a city is hovered AND globe is visible */}
            {hoveredCity && scrollOpacity > 0.1 && (
                <CityCard city={hoveredCity} position={cardPosition} />
            )}
        </div>
    )
}

export default GlobeContainer
