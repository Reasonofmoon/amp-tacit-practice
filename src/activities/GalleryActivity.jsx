import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GalleryActivity({ data, saveData, complete, onBack }) {
  const [posts, setPosts] = useState(data?.posts ?? []);
  const [name, setName] = useState('');
  const [draft, setDraft] = useState('');

  const addPost = () => {
    if (!draft.trim()) {
      return;
    }

    const nextPosts = [
      {
        id: crypto.randomUUID(),
        name: name.trim() || '익명의 원장님',
        text: draft.trim(),
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        likes: Math.floor(Math.random() * 5) + 1 // Add some fake interactions for gamification
      },
      ...posts,
    ];

    setPosts(nextPosts);
    saveData({ posts: nextPosts });
    setDraft('');
  };

  const handleLike = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="activity-workspace">
      <header className="workspace-header">
        <div>
          <span className="tag" style={{ marginBottom: '8px', background: 'var(--primary-dark)', color: 'white' }}>Community & Exchange</span>
          <h2 className="question-title" style={{ marginBottom: 0 }}>원장님 암묵지 갤러리</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>오늘 발견한 가장 인상적인 노하우를 한 줄로 공유하고 다른 원장님들의 통찰을 얻어가세요.</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </header>

      <div className="workspace-content split-view">
        
        {/* Left: Input Form */}
        <div className="split-left" style={{ flex: '0 0 350px' }}>
          <div className="card" style={{ background: 'var(--layer-a)', border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.125rem' }}>새로운 식견 공유하기</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>작성자</label>
                <input 
                  value={name} 
                  onChange={(event) => setName(event.target.value)} 
                  placeholder="예: 강남 대치 마스터"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.95rem' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>오늘의 한 줄 암묵지</label>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      addPost();
                    }
                  }}
                  placeholder="예: 가장 조용한 학부모가 등록을 가장 오래 유지한다."
                  style={{ width: '100%', minHeight: '100px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.95rem', resize: 'vertical' }}
                />
              </div>

              <button 
                className="btn btn-primary" 
                onClick={addPost} 
                disabled={!draft.trim()}
                style={{ width: '100%' }}
              >
                갤러리에 전시하기 🚀
              </button>
            </div>
          </div>

          <div className="confidence-module" style={{ marginTop: '24px' }}>
            <p style={{ marginBottom: '16px' }}><strong>{posts.length}개</strong>의 암묵지 공유 완료</p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', background: posts.length > 0 ? 'var(--primary)' : 'var(--border)', color: posts.length > 0 ? 'white' : 'var(--text-muted)' }}
              disabled={posts.length === 0}
              onClick={() => complete({ activityData: { posts }, bonusXp: 15 })}
            >
              갤러리 활동 저장 및 종료
            </button>
          </div>
        </div>

        {/* Right: Gallery Feed */}
        <div className="split-right" style={{ paddingLeft: '24px', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📡 최신 인사이트 피드
          </h3>
          
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--bg-body)', borderRadius: '16px', border: '2px dashed var(--border)' }}>
              <span style={{ fontSize: '3rem', opacity: 0.5, display: 'block', marginBottom: '16px' }}>👀</span>
              <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>아직 공유된 식견이 없습니다.<br/>첫 번째 암묵지를 전시해보세요!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
              <AnimatePresence>
                {posts.map((post) => (
                  <motion.div 
                    key={post.id} 
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    layout
                    className="card"
                    style={{ background: 'white', border: '1px solid var(--border)' }}
                  >
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--layer-b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          {post.name.charAt(0)}
                        </div>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{post.name}</strong>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{post.time}</span>
                    </header>
                    <p style={{ fontSize: '1.05rem', lineHeight: 1.5, color: 'var(--text-main)', marginBottom: '16px' }}>
                      "{post.text}"
                    </p>
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', gap: '16px' }}>
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="btn btn-ghost" 
                        style={{ padding: '4px 12px', fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        👍 공감 {post.likes}
                      </button>
                      <button className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        💬 답글달기
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
