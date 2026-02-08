import { Bot } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <p className="flex items-center justify-center gap-2">
                &copy; 2026 Patryk Sobczak. Built with agents <Bot className="w-4 h-4 floating-bot" />
            </p>
        </footer>
    )
}

export default Footer
