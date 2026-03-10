import { useState, useRef } from 'react';

const API = 'http://localhost:8000/api';

export default function ResumeEvaluator() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const fileRef = useRef();

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer?.files?.[0];
        if (droppedFile && droppedFile.name.endsWith('.pdf')) {
            setFile(droppedFile);
        } else {
            setError('Please upload a valid PDF file.');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(`${API}/resume/evaluate`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                setResult(data.evaluation);
            } else {
                setError(data.detail || 'Failed to process resume.');
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

    return (
        <div className="page">
            <div className="container">
                <div className="page-header animate-in">
                    <h1>Resume Evaluator</h1>
                    <p>Upload your PDF resume. Our AI will analyze your profile and provide a detailed review, including skill gaps and course recommendations.</p>
                </div>

                {/* Upload Area */}
                {!result && (
                    <div className="animate-in animate-in-delay-1" style={{ maxWidth: 600, margin: '0 auto' }}>
                        <div
                            className="glass-card"
                            style={styles.dropzone}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileRef.current?.click()}
                        >
                            <input
                                ref={fileRef}
                                type="file"
                                accept=".pdf"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    setFile(e.target.files[0]);
                                    setError('');
                                }}
                            />
                            <div style={styles.dropIcon}>📄</div>
                            <p style={styles.dropText}>
                                {file ? file.name : 'Drag & drop your PDF here, or click to browse'}
                            </p>
                            {file && <span className="badge badge-purple" style={{ marginTop: '1rem' }}>{(file.size / 1024).toFixed(2)} KB</span>}
                        </div>

                        {error && <p style={styles.error}>{error}</p>}

                        <button
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: '1.5rem' }}
                            onClick={handleUpload}
                            disabled={!file || loading}
                        >
                            {loading ? 'Analyzing Resume...' : 'Analyze Resume ✨'}
                        </button>

                        {loading && (
                            <div className="loading-state">
                                <div className="spinner" />
                                <p>Extracting text and running AI evaluation...</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Results Area */}
                {result && (
                    <div style={styles.resultsArea}>
                        {/* Top Overview */}
                        <div className="glass-card animate-in" style={styles.scoreCard}>
                            <div className={`score-circle ${getScoreClass(result.overall_score)}`}>
                                {result.overall_score}
                                <small>SCORE</small>
                            </div>
                            <div>
                                <h2 style={styles.summaryTitle}>Profile Summary</h2>
                                <p style={styles.summaryText}>{result.summary}</p>
                                <div style={styles.tagsArea}>
                                    <span className="badge badge-blue">Expertise: {result.experience_level}</span>
                                    {result.top_skills?.map((s) => (
                                        <span key={s} className="badge badge-purple">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Strengths and Gaps */}
                        <div style={styles.twoCol}>
                            <div className="glass-card animate-in animate-in-delay-1">
                                <h3 style={styles.sectionTitle}>🏆 Key Strengths</h3>
                                <div style={styles.skillList}>
                                    {result.strengths?.map((s, idx) => (
                                        <div key={idx} style={styles.skillRow}>
                                            <div style={styles.skillHeader}>
                                                <span style={styles.skillName}>{s.skill}</span>
                                                <span style={styles.skillScore}>{s.score}% Match</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="fill cyan" style={{ width: `${s.score}%` }} />
                                            </div>
                                            <p style={styles.skillDetail}>{s.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card animate-in animate-in-delay-2">
                                <h3 style={styles.sectionTitle}>⚠️ Skill Gaps & Alerts</h3>
                                <div style={styles.skillList}>
                                    {result.gaps?.map((g, idx) => (
                                        <div key={idx} style={styles.skillRow}>
                                            <div style={styles.skillHeader}>
                                                <span style={styles.skillName}>{g.skill}</span>
                                                <span className={`badge badge-${g.importance === 'high' ? 'pink' : g.importance === 'medium' ? 'orange' : 'blue'}`}>
                                                    {g.importance} priority
                                                </span>
                                            </div>
                                            <p style={styles.skillDetail}>{g.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="glass-card animate-in animate-in-delay-3">
                            <h3 style={styles.sectionTitle}>📚 Recommended Learning Plan</h3>
                            <div style={styles.courseGrid}>
                                {result.recommendations?.map((r, idx) => (
                                    <div key={idx} style={styles.courseCard}>
                                        <span className="badge badge-purple">{r.platform}</span>
                                        <h4 style={styles.courseTitle}>{r.course}</h4>
                                        <p style={styles.courseTarget}>To improve: {r.skill_addressed}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            className="btn btn-secondary"
                            style={{ margin: '2rem auto 0', display: 'flex' }}
                            onClick={() => { setResult(null); setFile(null); }}
                        >
                            &larr; Analyze Another Resume
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    dropzone: {
        textAlign: 'center',
        cursor: 'pointer',
        border: '2px dashed var(--border-subtle)',
        padding: '3rem 2rem',
    },
    dropIcon: { fontSize: '3rem', marginBottom: '1rem' },
    dropText: { fontSize: '1.1rem', color: '#a0a4c0', fontWeight: 500 },
    error: { color: 'var(--accent-pink)', textAlign: 'center', marginTop: '1rem', fontWeight: 600 },

    resultsArea: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        maxWidth: 900,
        margin: '0 auto',
    },
    scoreCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '2.5rem',
    },
    summaryTitle: { fontSize: '1.5rem', marginBottom: '0.5rem', color: '#eef0ff' },
    summaryText: { color: '#a0a4c0', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' },
    tagsArea: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },

    twoCol: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
    },
    sectionTitle: { fontSize: '1.25rem', marginBottom: '1.5rem', color: '#eef0ff' },
    skillList: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    skillRow: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    skillHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    skillName: { fontWeight: 600, color: '#eef0ff' },
    skillScore: { color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.9rem' },
    skillDetail: { color: '#a0a4c0', fontSize: '0.9rem', lineHeight: 1.5 },

    courseGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
    },
    courseCard: {
        background: 'var(--bg-primary)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.75rem',
    },
    courseTitle: { fontSize: '1.1rem', color: '#eef0ff', fontWeight: 700 },
    courseTarget: { color: '#6b6f8d', fontSize: '0.85rem' },
};

/* Media Query override for component */
const mq2 = document.createElement('style');
mq2.textContent = `
  @media (max-width: 600px) {
    .scoreCard { flex-direction: column !important; text-align: center !important; }
    .tagsArea { justify-content: center !important; }
  }
`;
document.head.appendChild(mq2);
