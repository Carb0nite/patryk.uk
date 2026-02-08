import { GraduationCap } from 'lucide-react'
import { SalesforceLogo } from './CompanyLogos'
import coverGeniusLogo from '../assets/logos/covergenius-logo.png'
import ciscoLogo from '../assets/logos/cisco-logo.png'
import ibmLogo from '../assets/logos/ibm-logo.png'

const BadgeContainer = ({ onNavigate }) => {
    const badges = [
        {
            id: 'cover-genius',
            logo: coverGeniusLogo,
            type: 'company',
            title: 'Cover Genius',
            isImage: true
        },
        {
            id: 'salesforce',
            logo: SalesforceLogo,
            type: 'company',
            title: 'Salesforce',
            isImage: false
        },
        {
            id: 'cisco',
            logo: ciscoLogo,
            type: 'company',
            title: 'Cisco',
            isImage: true
        },
        {
            id: 'ibm',
            logo: ibmLogo,
            type: 'company',
            title: 'IBM',
            isImage: true
        },
        {
            id: 'education',
            icon: GraduationCap,
            type: 'education',
            title: 'UCL'
        }
    ]

    return (
        <div className="badge-container">
            {badges.map(badge => {
                return (
                    <a
                        key={badge.id}
                        href={`#${badge.id}`}
                        className="badge"
                        title={badge.title}
                        onClick={(e) => {
                            e.preventDefault()
                            onNavigate(badge.id)
                        }}
                    >
                        <div className={`badge-circle ${badge.type}`}>
                            {badge.icon ? (
                                <badge.icon strokeWidth={2} />
                            ) : badge.isImage ? (
                                <img src={badge.logo} alt={badge.title} className="badge-logo-img" />
                            ) : (
                                <badge.logo className="badge-logo-svg" />
                            )}
                        </div>
                    </a>
                )
            })}
        </div>
    )
}

export default BadgeContainer
