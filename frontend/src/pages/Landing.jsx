import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <div className="page">
            {/* ─── Hero ──────────────────────────────────── */}
            <section style={styles.hero}>
                <div style={styles.heroBg} />
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="animate-in" style={styles.heroContent}>
                        <span style={styles.chip}>🚀 AI-Powered Career Platform</span>
                        <h1 style={styles.heroTitle}>
                            Transform Your Career with <br />
                            <span style={styles.heroGradient}>VidyaMitra</span>
                        </h1>
                        <p style={styles.heroSub}>
                            Get personalized resume evaluation, AI-driven mock interviews, and intelligent career path recommendations — all in one platform.
                        </p>
                        <div style={styles.heroCTA}>
                            <Link to="/dashboard" className="btn btn-primary btn-lg">
                                Get Started Free →
                            </Link>
                            <Link to="/resume" className="btn btn-secondary btn-lg">
                                Evaluate My Resume
                            </Link>
                        </div>
                        <div style={styles.stats}>
                            <div style={styles.stat}><strong style={styles.statNum}>10K+</strong><span>Resumes Analyzed</span></div>
                            <div style={styles.statDivider} />
                            <div style={styles.stat}><strong style={styles.statNum}>5K+</strong><span>Mock Interviews</span></div>
                            <div style={styles.statDivider} />
                            <div style={styles.stat}><strong style={styles.statNum}>95%</strong><span>User Satisfaction</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Features ──────────────────────────────── */}
            <section style={styles.features}>
                <div className="container">
                    <h2 style={styles.sectionTitle}>Everything You Need to Succeed</h2>
                    <p style={styles.sectionSub}>Three powerful AI tools designed to accelerate your career growth</p>
                    <div style={styles.featureGrid}>
                        <FeatureCard
                            icon="📄"
                            title="Resume Evaluator"
                            description="Upload your resume and get instant AI-powered evaluation with skill gap analysis, scoring, and personalized course recommendations."
                            gradient="linear-gradient(135deg, #8b5cf6, #6d28d9)"
                            link="/resume"
                            delay={1}
                        />
                        <FeatureCard
                            icon="🎤"
                            title="Mock Interview"
                            description="Practice with our AI interviewer. Get real-time feedback on your answers, communication skills, and confidence with detailed scoring."
                            gradient="linear-gradient(135deg, #06d6a0, #059669)"
                            link="/interview"
                            delay={2}
                        />
                        <FeatureCard
                            icon="🗺️"
                            title="Career Path Planner"
                            description="Get a personalized career transition roadmap with phased learning plans, certifications, and timeline recommendations."
                            gradient="linear-gradient(135deg, #f472b6, #db2777)"
                            link="/career"
                            delay={3}
                        />
                    </div>
                </div>
            </section>

            {/* ─── How It Works ──────────────────────────── */}
            <section style={styles.howSection}>
                <div className="container">
                    <h2 style={styles.sectionTitle}>How It Works</h2>
                    <p style={styles.sectionSub}>Simple steps to unlock your career potential</p>
                    <div style={styles.stepsGrid}>
                        {[
                            { num: '01', title: 'Upload or Input', desc: 'Share your resume, skills, or target role with VidyaMitra.', color: '#8b5cf6' },
                            { num: '02', title: 'AI Analysis', desc: 'Our AI engine processes your data and generates deep insights.', color: '#06d6a0' },
                            { num: '03', title: 'Get Roadmap', desc: 'Receive actionable feedback, courses, and step-by-step plans.', color: '#f472b6' },
                            { num: '04', title: 'Grow & Succeed', desc: 'Follow your personalized plan and track your career progress.', color: '#3b82f6' },
                        ].map((step, i) => (
                            <div key={i} className={`glass-card animate-in animate-in-delay-${i + 1}`} style={styles.stepCard}>
                                <div style={{ ...styles.stepNum, color: step.color }}>{step.num}</div>
                                <h3 style={styles.stepTitle}>{step.title}</h3>
                                <p style={styles.stepDesc}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ───────────────────────────────────── */}
            <section style={styles.ctaSection}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="glass-card" style={styles.ctaCard}>
                        <h2 style={styles.ctaTitle}>Ready to Accelerate Your Career?</h2>
                        <p style={styles.ctaSub}>Join thousands of students and professionals using VidyaMitra to reach their goals faster.</p>
                        <Link to="/dashboard" className="btn btn-primary btn-lg">
                            Start Now — It's Free ✨
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── Footer ────────────────────────────────── */}
            <footer style={styles.footer}>
                <div className="container" style={styles.footerInner}>
                    <span style={styles.footerBrand}>🎓 VidyaMitra</span>
                    <span style={styles.footerCopy}>© 2026 VidyaMitra. Built with AI for your future.</span>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description, gradient, link, delay }) {
    return (
        <Link to={link} className={`glass-card animate-in animate-in-delay-${delay}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ ...styles.featureIcon, background: gradient }}>{icon}</div>
            <h3 style={styles.featureTitle}>{title}</h3>
            <p style={styles.featureDesc}>{description}</p>
            <span style={styles.featureLink}>Explore →</span>
        </Link>
    );
}

const styles = {
    /* Hero */
    hero: {
        position: 'relative',
        overflow: 'hidden',
        padding: '6rem 0 4rem',
    },
    heroBg: {
        position: 'absolute',
        top: -200,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 800,
        height: 800,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(6,214,160,0.05) 50%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
    },
    heroContent: { textAlign: 'center', maxWidth: 750, margin: '0 auto' },
    chip: {
        display: 'inline-block',
        padding: '0.4rem 1rem',
        borderRadius: 20,
        background: 'rgba(139,92,246,0.12)',
        color: '#8b5cf6',
        fontSize: '0.85rem',
        fontWeight: 600,
        marginBottom: '1.5rem',
    },
    heroTitle: { fontSize: '3.2rem', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.25rem', color: '#eef0ff' },
    heroGradient: {
        background: 'linear-gradient(135deg, #8b5cf6, #06d6a0, #3b82f6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundSize: '200% auto',
        animation: 'gradient-shift 4s ease infinite',
    },
    heroSub: { fontSize: '1.15rem', color: '#a0a4c0', maxWidth: 600, margin: '0 auto 2rem', lineHeight: 1.7 },
    heroCTA: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' },
    stats: { display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' },
    stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: '#a0a4c0', fontSize: '0.85rem' },
    statNum: { fontSize: '1.5rem', fontWeight: 800, color: '#eef0ff' },
    statDivider: { width: 1, height: 30, background: 'rgba(255,255,255,0.1)' },

    /* Features */
    features: { padding: '4rem 0' },
    sectionTitle: { textAlign: 'center', fontSize: '2rem', fontWeight: 800, color: '#eef0ff', marginBottom: '0.5rem' },
    sectionSub: { textAlign: 'center', color: '#a0a4c0', fontSize: '1.05rem', marginBottom: '2.5rem' },
    featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' },
    featureIcon: {
        width: 56,
        height: 56,
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        marginBottom: '1rem',
    },
    featureTitle: { fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#eef0ff' },
    featureDesc: { color: '#a0a4c0', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1rem' },
    featureLink: { color: '#8b5cf6', fontWeight: 600, fontSize: '0.9rem' },

    /* How it works */
    howSection: { padding: '4rem 0' },
    stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' },
    stepCard: { textAlign: 'center' },
    stepNum: { fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem' },
    stepTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#eef0ff' },
    stepDesc: { color: '#a0a4c0', fontSize: '0.88rem', lineHeight: 1.6 },

    /* CTA */
    ctaSection: { padding: '3rem 0' },
    ctaCard: { padding: '3rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,214,160,0.05))', border: '1px solid rgba(139,92,246,0.2)' },
    ctaTitle: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem', color: '#eef0ff' },
    ctaSub: { color: '#a0a4c0', marginBottom: '1.5rem', maxWidth: 500, margin: '0 auto 1.5rem' },

    /* Footer */
    footer: { borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem 0', marginTop: '2rem' },
    footerInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' },
    footerBrand: { fontWeight: 700, fontSize: '1rem', color: '#eef0ff' },
    footerCopy: { color: '#6b6f8d', fontSize: '0.82rem' },
};
