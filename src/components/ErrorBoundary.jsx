import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ marginBottom: '12px' }}>문제가 발생했습니다</h2>
          <p style={{ marginBottom: '12px', color: 'var(--text-muted)' }}>배포 직후에는 일부 화면 청크가 바뀌어 로딩이 실패할 수 있습니다.</p>
          <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>새로고침 후에도 계속되면 최신 배포가 반영될 때까지 잠시 후 다시 시도해주세요.</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            새로고침
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
