import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const links = [
        { path: '/', label: 'Home' },
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/resume', label: 'Resume Evaluator' },
        { path: '/interview', label: 'Mock Interview' },
        { path: '/career', label: 'Career Path' },
    ];

    return (
        <nav style={styles.nav}>
            <div style={styles.inner}>
                <Link to="/" style={styles.logo}>
                    <span style={styles.logoIcon}>🎓</span>
                    <span style={styles.logoText}>VidyaMitra</span>
                </Link>

                {/* Desktop links */}
                <div style={styles.links}>
                    {links.map((l) => (
                        <Link
                            key={l.path}
                            to={l.path}
                            style={{
                                ...styles.link,
                                ...(location.pathname === l.path ? styles.linkActive : {}),
                            }}
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile hamburger */}
                <button
                    style={styles.hamburger}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span style={{ ...styles.bar, ...(menuOpen ? styles.bar1Open : {}) }} />
                    <span style={{ ...styles.bar, ...(menuOpen ? styles.bar2Open : {}) }} />
                    <span style={{ ...styles.bar, ...(menuOpen ? styles.bar3Open : {}) }} />
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div style={styles.mobileMenu}>
                    {links.map((l) => (
                        <Link
                            key={l.path}
                            to={l.path}
                            style={{
                                ...styles.mobileLink,
                                ...(location.pathname === l.path ? styles.mobileLinkActive : {}),
                            }}
                            onClick={() => setMenuOpen(false)}
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}

const styles = {
    nav: {
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10, 10, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
    },
    inner: {
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        textDecoration: 'none',
    },
    logoIcon: { fontSize: '1.5rem' },
    logoText: {
        fontSize: '1.25rem',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #8b5cf6, #06d6a0)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    links: {
        display: 'flex',
        gap: '0.25rem',
        alignItems: 'center',
    },
    link: {
        padding: '0.5rem 0.85rem',
        borderRadius: 8,
        fontSize: '0.88rem',
        fontWeight: 500,
        color: '#a0a4c0',
        textDecoration: 'none',
        transition: 'all 0.2s',
    },
    linkActive: {
        color: '#eef0ff',
        background: 'rgba(139, 92, 246, 0.15)',
    },
    hamburger: {
        display: 'none',
        flexDirection: 'column',
        gap: 5,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 4,
    },
    bar: {
        display: 'block',
        width: 22,
        height: 2,
        background: '#a0a4c0',
        borderRadius: 2,
        transition: 'all 0.3s',
    },
    bar1Open: { transform: 'rotate(45deg) translate(5px, 5px)' },
    bar2Open: { opacity: 0 },
    bar3Open: { transform: 'rotate(-45deg) translate(5px, -5px)' },
    mobileMenu: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0.5rem 1.5rem 1rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
    },
    mobileLink: {
        padding: '0.75rem 0',
        color: '#a0a4c0',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: 500,
        borderBottom: '1px solid rgba(255,255,255,0.04)',
    },
    mobileLinkActive: {
        color: '#8b5cf6',
    },
};

/* Show hamburger on mobile via a style tag */
const mq = document.createElement('style');
mq.textContent = `
  @media (max-width: 768px) {
    nav > div > div:nth-child(2) { display: none !important; }
    nav > div > button { display: flex !important; }
  }
`;
document.head.appendChild(mq);
