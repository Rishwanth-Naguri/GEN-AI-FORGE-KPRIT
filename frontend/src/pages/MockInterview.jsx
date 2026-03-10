import { useState, useRef, useEffect } from 'react';

const API = 'http://localhost:8000/api';

export default function MockInterview() {
    const [jobRole, setJobRole] = useState('');
    const [started, setStarted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Chat state
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [currentQ, setCurrentQ] = useState(null);
    const [qNum, setQNum] = useState(1);
    const [history, setHistory] = useState('');

    // Result state
    const [summary, setSummary] = useState(null);

    const chatEndRef = useRef(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startInterview = async () => {
        if (!jobRole.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`${API}/interview/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ job_role: jobRole }),
            });
            const data = await res.json();

            if (data.success) {
                const q = data.data;
                setCurrentQ(q);
                setQNum(q.question_number || 1);
                setMessages([{ role: 'ai', type: 'question', data: q }]);
                setStarted(true);
            }
        } catch (err) {
            setMessages([{ role: 'system', text: 'Error connecting to backend server.' }]);
        }
        setLoading(false);
    };

    const sendAnswer = async () => {
        if (!input.trim() || !currentQ) return;

        const answer = input;
        setInput('');
        setMessages((m) => [...m, { role: 'user', text: answer }]);
        setLoading(true);

        const newHistory = `${history}\nQ${qNum}: ${currentQ.question}\nA${qNum}: ${answer}`;
        setHistory(newHistory);

        try {
            const res = await fetch(`${API}/interview/respond`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    job_role: jobRole,
                    current_question: currentQ.question,
                    user_answer: answer,
                    conversation_history: newHistory,
                    question_number: qNum,
                }),
            });
            const data = await res.json();

            if (data.success) {
                const d = data.data;
                setMessages((m) => [
                    ...m,
                    { role: 'ai', type: 'feedback', data: d.feedback },
                    { role: 'ai', type: 'question', data: d.next_question },
                ]);
                setCurrentQ(d.next_question);
                setQNum(d.next_question?.question_number || qNum + 1);
            }
        } catch (err) {
            setMessages((m) => [...m, { role: 'system', text: 'Failed to get response.' }]);
        }
        setLoading(false);
    };

    const endInterview = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/interview/summary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    job_role: jobRole,
                    conversation_history: history,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setSummary(data.data);
            }
        } catch (err) {
            setMessages((m) => [...m, { role: 'system', text: 'Failed to generate summary.' }]);
        }
        setLoading(false);
    };

    const restart = () => {
        setStarted(false);
        setMessages([]);
        setInput('');
        setCurrentQ(null);
        setQNum(1);
        setHistory('');
        setSummary(null);
        setJobRole('');
    };

    const getScoreClass = (score) => {
        if (score >= 75) return 'high';
        if (score >= 50) return 'mid';
        return 'low';
    };

    // ─── Summary View ──────────────────────────────
    if (summary) {
        return (
            <div className="page">
                <div className="container" style={{ maxWidth: 800 }}>
                    <div className="page-header animate-in">
                        <h1>Interview Performance</h1>
                        <p>Role: {jobRole}</p>
                    </div>

                    <div className="glass-card animate-in animate-in-delay-1" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div className={`score-circle ${getScoreClass(summary.overall_score)}`} style={{ marginBottom: '1.5rem', margin: '0 auto' }}>
                            {summary.overall_score}
                        </div>
                        <p style={{ color: '#a0a4c0', lineHeight: 1.6, fontSize: '1.05rem', maxWidth: 600, margin: '0 auto' }}>
                            {summary.performance_summary}
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                            <span className={`badge badge-${summary.readiness_level === 'interview ready' ? 'cyan' : summary.readiness_level === 'almost ready' ? 'blue' : 'orange'}`}>
                                Status: {summary.readiness_level}
                            </span>
                        </div>
                    </div>

                    <div style={styles.metricsGrid}>
                        <MetricCard title="Communication" score={summary.communication_score} color="var(--accent-purple)" />
                        <MetricCard title="Confidence" score={summary.confidence_score} color="var(--accent-cyan)" />
                        <MetricCard title="Technical Accuracy" score={summary.technical_score} color="var(--accent-blue)" />
                    </div>

                    <div style={styles.twoColGrid}>
                        <div className="glass-card animate-in animate-in-delay-2">
                            <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '1rem', fontSize: '1.2rem' }}>Top Strengths</h4>
                            {summary.top_strengths?.map((s, i) => (
                                <div key={i} style={styles.listItem}>
                                    <span style={styles.bulletCyan}>•</span>
                                    <span>{s}</span>
                                </div>
                            ))}
                        </div>
                        <div className="glass-card animate-in animate-in-delay-3">
                            <h4 style={{ color: 'var(--accent-pink)', marginBottom: '1rem', fontSize: '1.2rem' }}>Areas to Improve</h4>
                            {summary.areas_to_improve?.map((s, i) => (
                                <div key={i} style={styles.listItem}>
                                    <span style={styles.bulletPink}>•</span>
                                    <span>{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card animate-in animate-in-delay-4" style={{ marginTop: '2rem' }}>
                        <h4 style={{ color: 'var(--accent-purple)', marginBottom: '1rem', fontSize: '1.2rem' }}>Final Tips</h4>
                        {summary.final_tips?.map((t, i) => (
                            <div key={i} style={styles.listItem}>
                                <span style={styles.bulletPurple}>💡</span>
                                <span>{t}</span>
                            </div>
                        ))}
                    </div>

                    <button className="btn btn-primary" style={{ margin: '3rem auto 0', display: 'flex' }} onClick={restart}>
                        Start New Interview
                    </button>
                </div>
            </div>
        );
    }

    // ─── Setup Screen ──────────────────────────────
    if (!started) {
        return (
            <div className="page">
                <div className="container" style={{ maxWidth: 600 }}>
                    <div className="page-header animate-in">
                        <h1>Mock Interview Simulator</h1>
                        <p>Practice with our AI recruiter. Get real-time feedback on your answers, communication style, and confidence.</p>
                    </div>

                    <div className="glass-card animate-in animate-in-delay-1" style={{ textAlign: 'center' }}>
                        <h3 style={{ color: '#eef0ff', marginBottom: '1.5rem', fontSize: '1.2rem' }}>What role are you applying for?</h3>
                        <input
                            className="input-field"
                            placeholder="e.g. Frontend Developer, Data Scientist, Product Manager..."
                            value={jobRole}
                            onChange={(e) => setJobRole(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && startInterview()}
                            autoFocus
                        />

                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem', justifyContent: 'center' }}>
                            {['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer'].map((r) => (
                                <button
                                    key={r}
                                    className="btn btn-secondary"
                                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', borderRadius: '20px' }}
                                    onClick={() => setJobRole(r)}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        <button
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: '2.5rem' }}
                            onClick={startInterview}
                            disabled={!jobRole.trim() || loading}
                        >
                            {loading ? 'Connecting to AI...' : 'Start Interview 🎤'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Active Chat Screen ──────────────────────────
    return (
        <div className="page">
            <div className="container" style={{ maxWidth: 800 }}>

                <div style={styles.chatHeader}>
                    <div>
                        <span style={{ fontSize: '0.9rem', color: '#a0a4c0' }}>Interviewing for:</span>
                        <strong style={{ display: 'block', fontSize: '1.2rem', color: '#eef0ff' }}>{jobRole}</strong>
                    </div>
                    <button className="btn btn-secondary" style={{ borderColor: 'var(--accent-pink)', color: 'var(--accent-pink)' }} onClick={endInterview} disabled={loading}>
                        End & Get Feedback
                    </button>
                </div>

                <div style={styles.chatContainer}>
                    {messages.map((m, i) => {
                        if (m.role === 'user') {
                            return (
                                <div key={i} style={styles.userBubbleWrapper}>
                                    <div style={styles.userBubble}>{m.text}</div>
                                </div>
                            );
                        }
                        if (m.role === 'system') {
                            return <div key={i} style={styles.systemBubble}>{m.text}</div>;
                        }
                        if (m.type === 'question') {
                            return (
                                <div key={i} style={styles.aiBubbleWrapper}>
                                    <div style={styles.aiCardQuestion}>
                                        <div style={styles.aiCardHeader}>
                                            <span className="badge badge-purple">Q{m.data.question_number}</span>
                                            <span className="badge badge-blue">{m.data.category} ({m.data.difficulty})</span>
                                        </div>
                                        <p style={styles.questionText}>{m.data.question}</p>
                                        {m.data.tip && <p style={styles.questionTip}>💡 Tip: {m.data.tip}</p>}
                                    </div>
                                </div>
                            );
                        }
                        if (m.type === 'feedback') {
                            return (
                                <div key={i} style={styles.aiBubbleWrapper}>
                                    <div style={styles.aiCardFeedback}>
                                        <div style={styles.feedbackHeader}>
                                            <strong style={{ color: '#eef0ff' }}>Feedback on Previous Answer</strong>
                                            <span className={`badge badge-${m.data.score >= 75 ? 'cyan' : m.data.score >= 50 ? 'orange' : 'pink'}`}>
                                                Score: {m.data.score}/100
                                            </span>
                                        </div>
                                        <div style={styles.feedbackGrid}>
                                            <div><span style={{ color: '#a0a4c0' }}>Accuracy:</span> <span style={{ color: '#eef0ff' }}>{m.data.accuracy}</span></div>
                                            <div><span style={{ color: '#a0a4c0' }}>Confidence:</span> <span style={{ color: '#eef0ff' }}>{m.data.confidence}</span></div>
                                            <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#a0a4c0' }}>Tone:</span> <span style={{ color: '#eef0ff' }}>{m.data.tone}</span></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}

                    {loading && (
                        <div className="loading-state" style={{ padding: '2rem 0' }}>
                            <div className="spinner" />
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div style={styles.inputContainer}>
                    <textarea
                        className="input-field"
                        style={styles.textarea}
                        placeholder="Type your answer here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendAnswer();
                            }
                        }}
                        autoFocus
                    />
                    <button
                        className="btn btn-primary"
                        style={styles.sendBtn}
                        onClick={sendAnswer}
                        disabled={!input.trim() || loading}
                    >
                        Send
                    </button>
                </div>
                <p style={{ textAlign: 'center', color: '#6b6f8d', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                    Press Enter to send, Shift+Enter for new line.
                </p>

            </div>
        </div>
    );
}

function MetricCard({ title, score, color }) {
    return (
        <div className="glass-card animate-in" style={{ textAlign: 'center', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color }}>{score}%</div>
            <div style={{ color: '#a0a4c0', fontWeight: 500 }}>{title}</div>
        </div>
    );
}

const styles = {
    chatHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        background: 'var(--bg-card)',
        padding: '1rem 1.5rem',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
    },
    chatContainer: {
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        padding: '1.5rem',
        minHeight: '60vh',
        maxHeight: '65vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    aiBubbleWrapper: { display: 'flex', justifyContent: 'flex-start', width: '100%' },
    userBubbleWrapper: { display: 'flex', justifyContent: 'flex-end', width: '100%' },
    userBubble: {
        background: 'var(--gradient-purple)',
        color: '#ffffff',
        padding: '1rem 1.25rem',
        borderRadius: '16px 16px 4px 16px',
        maxWidth: '85%',
        fontSize: '0.95rem',
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)',
    },
    systemBubble: {
        textAlign: 'center',
        color: 'var(--accent-pink)',
        fontSize: '0.85rem',
        margin: '1rem 0',
    },
    aiCardQuestion: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-subtle)',
        borderLeft: '4px solid var(--accent-purple)',
        borderRadius: '12px 16px 16px 12px',
        padding: '1.25rem 1.5rem',
        maxWidth: '90%',
    },
    aiCardHeader: { display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' },
    questionText: { color: '#eef0ff', fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.6, marginBottom: '0.75rem' },
    questionTip: { color: '#a0a4c0', fontSize: '0.9rem', fontStyle: 'italic' },
    aiCardFeedback: {
        background: 'rgba(6, 214, 160, 0.05)',
        border: '1px solid rgba(6, 214, 160, 0.2)',
        borderLeft: '4px solid var(--accent-cyan)',
        borderRadius: '12px 16px 16px 12px',
        padding: '1.25rem 1.5rem',
        maxWidth: '85%',
    },
    feedbackHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    feedbackGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' },
    inputContainer: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1.5rem',
        alignItems: 'flex-end',
    },
    textarea: {
        minHeight: '80px',
        flex: 1,
        background: 'var(--bg-card)',
    },
    sendBtn: {
        height: '60px',
        padding: '0 2rem',
        marginBottom: '2px', // Align with input
    },
    metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' },
    twoColGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
    listItem: { display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: '#a0a4c0', fontSize: '0.95rem', marginBottom: '0.75rem' },
    bulletCyan: { color: 'var(--accent-cyan)', fontWeight: 'bold' },
    bulletPink: { color: 'var(--accent-pink)', fontWeight: 'bold' },
    bulletPurple: { color: 'var(--accent-purple)', fontWeight: 'bold' },
};
