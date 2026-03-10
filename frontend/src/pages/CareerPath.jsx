import { useState } from 'react';

const API = 'http://localhost:8000/api';

export default function CareerPath() {
    const [resumeText, setResumeText] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!resumeText.trim() || !targetRole.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch(`${API}/career/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resume_text: resumeText,
                    target_role: targetRole,
                }),
            });
            const data = await res.json();

            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.detail || 'Failed to analyze career path.');
            }
        } catch (err) {
            setError('Cannot connect to backend. Make sure the server is running on port 8000.');
        }
        setLoading(false);
    };

    const getScoreClass = (score) => {
        if (score >= 75) return 'high';
        if (score >= 50) return 'mid';
        return 'low';
    };

    const phaseColors = [
        'var(--gradient-purple)',
        'var(--gradient-cyan)',
        'var(--gradient-blue)',
        'var(--gradient-pink)',
    ];

    return (
        <div className="page">
            <div className="container">

                <div className="page-header animate-in">
                    <h1>Career Path Planner</h1>
                    <p>Input your current profile and target role. Our AI will map out the optimal transition roadmap.</p>
                </div>

                {/* Input Phase */}
                {!result && (
                    <div className="animate-in animate-in-delay-1" style={{ maxWidth: 700, margin: '0 auto' }}>
                        <div className="glass-card" style={{ marginBottom: '2rem' }}>
                            <h3 style={styles.inputTitle}>1. Current Profile</h3>
                            <p style={styles.inputDesc}>Describe your current skills, experience, or paste your resume text.</p>
                            <textarea
                                className="input-field"
                                style={{ minHeight: '150px' }}
                                placeholder="e.g. 3 years as a Software Engineer working with Python, React, and SQL..."
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                            />
                        </div>

                        <div className="glass-card" style={{ marginBottom: '2rem' }}>
                            <h3 style={styles.inputTitle}>2. Target Role</h3>
                            <p style={styles.inputDesc}>What is the specific job title you are aiming for?</p>
                            <input
                                className="input-field"
                                placeholder="e.g. Senior Data Scientist, Machine Learning Engineer..."
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                            />

                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                                {['Data Scientist', 'Cloud Architect', 'Product Manager', 'Cybersecurity Analyst'].map((r) => (
                                    <button
                                        key={r}
                                        className="btn btn-secondary"
                                        style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem', borderRadius: '20px' }}
                                        onClick={() => setTargetRole(r)}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && <p style={styles.error}>{error}</p>}

                        <button
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%' }}
                            onClick={handleAnalyze}
                            disabled={!resumeText.trim() || !targetRole.trim() || loading}
                        >
                            {loading ? 'Generating Roadmap...' : 'Generate Career Roadmap 🗺️'}
                        </button>

                        {loading && (
                            <div className="loading-state" style={{ marginTop: '2rem' }}>
                                <div className="spinner" />
                                <p>Analyzing skill transitions and building timeline...</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Results Phase */}
                {result && (
                    <div style={styles.resultsArea}>

                        {/* Overview Section */}
                        <div style={styles.overviewGrid}>
                            <div className="glass-card animate-in">
                                <h3 style={{ color: '#eef0ff', marginBottom: '0.5rem', fontSize: '1.2rem' }}>Current State</h3>
                                <p style={{ color: 'var(--accent-purple)', fontWeight: 600, marginBottom: '1rem', fontSize: '1.1rem' }}>
                                    {result.current_profile?.identified_role}
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                    {result.current_profile?.top_skills?.map((s) => (
                                        <span key={s} className="badge badge-purple">{s}</span>
                                    ))}
                                </div>
                                <div style={{ color: '#a0a4c0', fontSize: '0.9rem' }}>
                                    <strong>Transferable Skills:</strong> {result.current_profile?.transferable_skills?.join(', ')}
                                </div>
                            </div>

                            <div className="glass-card animate-in animate-in-delay-1" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <h3 style={{ color: '#eef0ff', marginBottom: '0.5rem', fontSize: '1.2rem' }}>Skill Match</h3>
                                <p style={{ color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '1rem' }}>
                                    Target: {result.target_analysis?.role}
                                </p>
                                <div className={`score-circle ${getScoreClass(result.target_analysis?.skill_match_percentage)}`} style={{ margin: '0.5rem 0 1rem' }}>
                                    {result.target_analysis?.skill_match_percentage}%
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {result.target_analysis?.required_skills?.map((s) => (
                                        <span key={s} className="badge badge-cyan">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="glass-card animate-in animate-in-delay-2" style={{ textAlign: 'center', background: 'var(--gradient-purple)' }}>
                            <p style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 500, lineHeight: 1.6 }}>
                                "{result.motivation}"
                            </p>
                        </div>

                        {/* Roadmap Timeline */}
                        <div className="glass-card animate-in animate-in-delay-3" style={{ padding: '3rem 2rem' }}>
                            <div style={styles.timelineHeader}>
                                <h3 style={styles.sectionTitle}>Transition Roadmap</h3>
                                <div className="badge badge-blue">Estimated Time: {result.estimated_transition_time}</div>
                            </div>

                            <div style={styles.timeline}>
                                {result.roadmap?.map((phase, idx) => (
                                    <div key={idx} style={styles.timelineItem}>

                                        {/* Visual Line & Node */}
                                        <div style={styles.timelineVisual}>
                                            <div style={{ ...styles.timelineNode, background: phaseColors[idx % phaseColors.length] }}>
                                                {phase.phase}
                                            </div>
                                            {idx !== result.roadmap.length - 1 && <div style={styles.timelineLine} />}
                                        </div>

                                        {/* Content */}
                                        <div style={styles.timelineContent}>
                                            <div style={styles.phaseHeader}>
                                                <h4 style={styles.phaseTitle}>{phase.title}</h4>
                                                <span style={{ color: '#a0a4c0', fontSize: '0.9rem', fontWeight: 600 }}>{phase.duration}</span>
                                            </div>
                                            <p style={styles.phaseDesc}>{phase.description}</p>

                                            <div style={styles.taskList}>
                                                {phase.tasks?.map((task, tIdx) => (
                                                    <div key={tIdx} style={styles.taskCard}>
                                                        <h5 style={styles.taskTitle}>{task.task}</h5>
                                                        <p style={styles.taskResource}>
                                                            <span style={{ color: 'var(--accent-cyan)' }}>Resource:</span> {task.resource} <br />
                                                            <span style={{ color: 'var(--accent-purple)' }}>Platform:</span> {task.platform}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="glass-card animate-in animate-in-delay-4">
                            <h3 style={styles.sectionTitle}>Recommended Certifications</h3>
                            <div style={styles.certGrid}>
                                {result.certifications?.map((cert, idx) => (
                                    <div key={idx} style={styles.certCard}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                            <span className={`badge badge-${cert.priority === 'high' ? 'pink' : cert.priority === 'medium' ? 'orange' : 'blue'}`}>
                                                {cert.priority} priority
                                            </span>
                                            <span style={{ color: '#a0a4c0', fontSize: '0.85rem' }}>{cert.estimated_time}</span>
                                        </div>
                                        <h4 style={styles.certName}>{cert.name}</h4>
                                        <p style={styles.certProvider}>Provider: {cert.provider}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            className="btn btn-secondary"
                            style={{ margin: '0 auto', display: 'flex' }}
                            onClick={() => { setResult(null); setResumeText(''); setTargetRole(''); }}
                        >
                            &larr; Plan New Transition
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    inputTitle: { fontSize: '1.25rem', color: '#eef0ff', marginBottom: '0.5rem' },
    inputDesc: { color: '#a0a4c0', fontSize: '0.95rem', marginBottom: '1rem' },
    error: { color: 'var(--accent-pink)', textAlign: 'center', marginBottom: '1rem', fontWeight: 600 },

    resultsArea: { display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 950, margin: '0 auto' },
    overviewGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' },

    timelineHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' },
    sectionTitle: { fontSize: '1.4rem', color: '#eef0ff', fontWeight: 800 },

    timeline: { display: 'flex', flexDirection: 'column', gap: 0 },
    timelineItem: { display: 'flex', gap: '2rem' },
    timelineVisual: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    timelineNode: { width: 40, height: 40, borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', zIndex: 2, flexShrink: 0 },
    timelineLine: { width: 2, flex: 1, background: 'var(--border-subtle)', minHeight: '100px', margin: '8px 0', zIndex: 1 },
    timelineContent: { flex: 1, paddingBottom: '3rem', paddingTop: '6px' },

    phaseHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' },
    phaseTitle: { fontSize: '1.2rem', color: '#eef0ff', fontWeight: 700 },
    phaseDesc: { color: '#a0a4c0', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' },

    taskList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' },
    taskCard: { background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' },
    taskTitle: { fontSize: '0.95rem', color: '#eef0ff', fontWeight: 600, marginBottom: '0.5rem' },
    taskResource: { fontSize: '0.85rem', color: '#6b6f8d', lineHeight: 1.5 },

    certGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' },
    certCard: { background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' },
    certName: { fontSize: '1.1rem', color: '#eef0ff', fontWeight: 700, marginBottom: '0.25rem' },
    certProvider: { color: '#a0a4c0', fontSize: '0.9rem' },
};

/* Media Query override */
const mq = document.createElement('style');
mq.textContent = `
  @media (max-width: 600px) {
    .timelineItem { flex-direction: column !important; gap: 1rem !important; }
    .timelineVisual { display: none !important; }
    .timelineContent { padding-bottom: 2rem !important; }
  }
`;
document.head.appendChild(mq);
