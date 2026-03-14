import React from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Mail,
    Phone,
    MapPin,
    Heart
} from 'lucide-react';
import './Footer.css';

const Footer = ({ theme }) => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { name: 'About Us', path: '/about' },
        { name: 'AI Curriculum', path: '/curriculum' },
        { name: 'Teacher Training', path: '/training' },
        { name: 'Features', path: '/features' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Contact', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' }
    ];

    const socialLinks = [
        { icon: Facebook, href: 'https://facebook.com', name: 'Facebook' },
        { icon: Twitter, href: 'https://twitter.com', name: 'Twitter' },
        { icon: Linkedin, href: 'https://linkedin.com', name: 'LinkedIn' },
        { icon: Instagram, href: 'https://instagram.com', name: 'Instagram' }
    ];

    // Inline styles for navbar-style brand
    const brandContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.5rem'
    };

    const logoImageStyle = {
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        objectFit: 'cover'
    };

    const brandTextStyle = {
        fontSize: 'clamp(1.5rem, 1.5vw, 1.8rem)',
        fontWeight: '700',
    };

    return (
        <footer className={`footer ${theme}`}>
            <div className="footer-content">
                {/* Company Info Section */}
                <div className="company-info">  
                  <div className="footer-logo" style={brandContainerStyle}>
                        {/* Logo Image from public folder */}
                        <img 
                            src="/logo.png" 
                            alt="eSkillVeda Logo" 
                            style={logoImageStyle}
                        />
                        
                        {/* Title Text with navbar styling */}
                        <div style={brandTextStyle}>
                                  <span className="font-aligarh italic text-es-yellow leading-tight">e</span>
                                  <span className="font-platoon text-es-white leading-tight uppercase">SkillVeda</span>
                        </div>
                    </div>                  
                  <p className="company-description">
                        Empowering Northeast schools for the future through AI skill development partnership. 
                        Bridging the classroom-industry gap with innovative AI education solutions.
                    </p>

                    <div className="social-links">
                        {socialLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                className="social-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={link.name}
                            >
                                <link.icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links Section */}
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        {footerLinks.map((link, index) => (
                            <li key={index}>
                                <Link to={link.path}>{link.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Information */}
                <div className="contact-info">
                    <h4>Contact Us</h4>
                    <div className="contact-items">
                        <div className="contact-item">
                            <MapPin size={18} />
                            <span>
                                Ground Floor, Vedant Complex<br />
                                Sontola, Assam, India
                            </span>
                        </div>
                        <div className="contact-item">
                            <Phone size={18} />
                            <span>+91 XXX XXX XXXX</span>
                        </div>
                        <div className="contact-item">
                            <Mail size={18} />
                            <span>contact@eskillveda.com</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <div className="copyright">
                        <p>
                            © {currentYear} Eskillveda Edtech Private Limited. All rights reserved. 
                            Empowering Northeast India through AI Education.
                        </p>
                    </div>
                    <div className="made-with-love">
                        <span>Made with</span>
                        <Heart size={16} />
                        <span>for Northeast Schools</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
