import { Link } from 'react-router-dom';

export default function Dashboard() {
    const features = [
        {
            icon: '📄',
            title: 'Resume Evaluator',
            desc: 'Get instant AI feedback on your resume, match it against job descriptions, and find skill gaps.',
            link: '/resume',
            btnClass: 'btn-primary',
            bgGradient: 'var(--gradient-purple)',
        },
        {
            icon: '🎤',
            title: 'Mock Interview',
            desc: 'Practice real-time interviews with an AI recruiter. Get detailed scoring on confidence and accuracy.',
            link: '/interview',
            btnClass: 'btn-cyan',
            bgGradient: 'var(--gradient-cyan)',
        },
        {
            icon: '🗺️',
            title: 'Career Path Planner',
            desc: 'Generate a step-by-step roadmap to transition into your dream role, including courses and certifications.',
            link: '/career',
            btnClass: 'btn-pink',
            bgGradient: 'var(--gradient-pink)',
        },
    ];

    return (
        <div className="page">
            <div className="container">
                <div className="page-header animate-in">
                    <h1>Welcome to Your Dashboard</h1>
                    <p>Select a tool below to accelerate your career journey.</p>
                </div>

                <div style={styles.grid}>
                    {features.map((f, i) => (
                        <div
                            key={f.title}
                            className={`glass-card animate-in animate-in-delay-${i + 1}`}
                            style={styles.card}
                        >
                            <div style={{ ...styles.iconWrap, background: f.bgGradient }}>
                                <span style={styles.icon}>{f.icon}</span>
                            </div>
                            <h2 style={styles.cardTitle}>{f.title}</h2>
                            <p style={styles.cardDesc}>{f.desc}</p>
                            <Link to={f.link} className={`btn ${f.btnClass}`} style={{ width: '100%', marginTop: '1rem' }}>
                                Start Tool →
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Quick Tips */}
                <div className="glass-card animate-in animate-in-delay-4" style={{ marginTop: '3rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>💡 Pro Tips for Success</h3>
                    <div style={styles.tipGrid}>
                        <div style={styles.tip}>
                            <span style={styles.tipCheck}>✓</span>
                            <span>Always start with the <strong>Resume Evaluator</strong> to know where you stand.</span>
                        </div>
                        <div style={styles.tip}>
                            <span style={styles.tipCheck}>✓</span>
                            <span>Use the <strong>Mock Interview</strong> tool before any actual job interview to calm nerves.</span>
                        </div>
                        <div style={styles.tip}>
                            <span style={styles.tipCheck}>✓</span>
                            <span>The <strong>Career Path Planner</strong> is best used when you want a long-term progression strategy.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '1rem',
    },
    iconWrap: {
        width: 64,
        height: 64,
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '0.5rem',
    },
    icon: { fontSize: '1.75rem' },
    cardTitle: { fontSize: '1.35rem', fontWeight: 700, color: '#eef0ff' },
    cardDesc: { color: '#a0a4c0', fontSize: '0.95rem', lineHeight: 1.6, flex: 1 },
    tipGrid: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    tip: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#a0a4c0', fontSize: '1rem' },
    tipCheck: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: 'rgba(6, 214, 160, 0.15)',
        color: 'var(--accent-cyan)',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        flexShrink: 0,
        marginTop: 2,
    },
};
