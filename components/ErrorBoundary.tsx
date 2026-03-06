'use client';

import React from 'react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: '#000',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    fontFamily: 'system-ui, sans-serif',
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 400 }}>Something went wrong</h2>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        style={{
                            padding: '10px 24px',
                            border: '1px solid rgba(255,255,255,0.3)',
                            borderRadius: '20px',
                            background: 'transparent',
                            color: '#fff',
                            fontSize: '14px',
                            cursor: 'pointer',
                        }}
                    >
                        Try again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
