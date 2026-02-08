import { useState, useEffect } from 'react'
import { User } from 'lucide-react'

const Navbar = ({ activeSection, onNavigate }) => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [scrolled])

    const navItems = [
        { id: 'about', label: 'About', href: '#about' },
        { id: 'experience', label: 'Experience', href: '#experience' },
        { id: 'education', label: 'Education', href: '#education' },
        { id: 'contact', label: 'Contact', href: '#contact' }
    ]

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-content">
                <span
                    className="nav-logo"
                    onClick={() => onNavigate('home')}
                >
                    <User size={18} strokeWidth={2.5} />
                </span>
                <ul className="nav-links">
                    {navItems.map(item => (
                        <li key={item.id}>
                            <a
                                href={item.external ? item.href : `#${item.id}`}
                                className={activeSection === item.id ? 'active' : ''}
                                onClick={(e) => {
                                    if (!item.external) {
                                        e.preventDefault()
                                        onNavigate(item.id)
                                    }
                                }}
                                target={item.external ? '_blank' : undefined}
                                rel={item.external ? 'noopener noreferrer' : undefined}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
