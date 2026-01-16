import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--error)' }}>
                    <h1>Something went wrong.</h1>
                    <p>Please refresh the page.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ padding: '0.5rem 1rem', background: 'var(--primary)', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Refresh
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
