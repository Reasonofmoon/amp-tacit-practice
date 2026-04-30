import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DIRECTOR_GALLERY_SEEDS, DEV_GALLERY_SEEDS } from '../data/galleryPosts';
import { fetchGalleryPosts, isGalleryServerEnabled, publishGalleryPost } from '../utils/galleryClient';

export default function GalleryActivity({ id, data, saveData, complete, onBack }) {
  const isDev = id?.startsWith('dev_');
  const seeds = useMemo(() => (isDev ? DEV_GALLERY_SEEDS : DIRECTOR_GALLERY_SEEDS), [isDev]);
  const [posts, setPosts] = useState(data?.posts ?? []);
  const [livePosts, setLivePosts] = useState([]);
  const [name, setName] = useState('');
  const [draft, setDraft] = useState('');
  const [shareToServer, setShareToServer] = useState(false);
  const galleryServerOn = isGalleryServerEnabled();

  // 서버 모드일 때 다른 사용자 게시물을 fetch. 시드와 동일 카드 톤 + sharedFromServer 플래그.
  useEffect(() => {
    if (!galleryServerOn) return;
    let cancelled = false;
    fetchGalleryPosts({ isDev, limit: 20 }).then((remote) => {
      if (cancelled) return;
      const adapted = remote.map((p) => ({
        id: p.id,
        name: p.name,
        text: p.text,
        time: '커뮤니티',
        likes: p.likes ?? 0,
        isSharedFromServer: true,
      }));
      setLivePosts(adapted);
    });
    return () => { cancelled = true; };
  }, [galleryServerOn, isDev]);

  // 표시 순서: 내 게시물 → 다른 사용자 실시간 게시물 → 베테랑 시드.
  const displayPosts = useMemo(
    () => [...posts, ...livePosts, ...seeds],
    [posts, livePosts, seeds],
  );
  const userPostCount = posts.length;

  const addPost = () => {
    if (!draft.trim()) {
      return;
    }
    const authorName = name.trim() || (isDev ? '익명의 개발자' : '익명의 원장님');

    const nextPosts = [
      {
        id: crypto.randomUUID(),
        name: authorName,
        text: draft.trim(),
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        likes: Math.floor(Math.random() * 5) + 1,
      },
      ...posts,
    ];
    setPosts(nextPosts);
    saveData({ posts: nextPosts });

    // 서버 공유 — 작성자가 명시적으로 동의했고 + "N년차" 형식이면 송신.
    if (shareToServer && galleryServerOn && /년차/.test(authorName)) {
      publishGalleryPost({ name: authorName, text: draft.trim(), isDev }).then((result) => {
        if (result?.post) {
          setLivePosts((prev) => [
            { ...result.post, time: '방금', isSharedFromServer: true },
            ...prev.filter((p) => p.id !== result.post.id),
          ]);
        }
      });
    }
    setDraft('');
  };

  const handleLike = (postId) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="activity-workspace">
      <header className="workspace-header">
        <div>
          <span className="tag" style={{ marginBottom: '8px' }}>Community &amp; Exchange</span>
          <h2 className="question-title" style={{ marginBottom: 0 }}>{isDev ? '오픈소스 에이전트 갤러리' : '원장님 노하우 갤러리'}</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>{isDev ? '유용한 AI 에이전트 스니펫이나 프롬프트 패턴을 한 줄로 공유하고 통찰을 얻어가세요.' : '오늘 발견한 가장 인상적인 노하우를 한 줄로 공유하고 다른 원장님들의 통찰을 얻어가세요.'}</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </header>

      <div className="workspace-content split-view">
        
        {/* Left: Input Form */}
        <div className="split-left" style={{ flex: '0 0 350px' }}>
          <div className="card" style={{ background: 'var(--blue-wash)', border: '1px solid var(--ink-blue)', borderLeft: '4px solid var(--ink-blue)' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.125rem', color: 'var(--ink-900)' }}>{isDev ? '에이전트 스니펫 공유하기' : '새로운 식견 공유하기'}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--ink-900)', marginBottom: '8px' }}>작성자</label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={isDev ? '예: GitHub AI Hacker' : '예: 강남 대치 마스터'}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--paper-300)', background: 'var(--paper-50)', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--ink-900)', marginBottom: '8px' }}>{isDev ? '오늘의 한 줄 스니펫' : '오늘의 한 줄 노하우'}</label>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      addPost();
                    }
                  }}
                  placeholder={isDev ? '예: Claude Code에서 --compact 플래그를 쓰면 토큰을 아낄 수 있다.' : '예: 가장 조용한 학부모가 등록을 가장 오래 유지한다.'}
                  style={{ width: '100%', minHeight: '100px', padding: '12px', borderRadius: '8px', border: '1px solid var(--paper-300)', background: 'var(--paper-50)', fontSize: '0.95rem', resize: 'vertical' }}
                />
              </div>

              {galleryServerOn && (
                <label style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.82rem', color: 'var(--ink-700)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={shareToServer}
                    onChange={(e) => setShareToServer(e.target.checked)}
                    style={{ marginTop: '3px', flexShrink: 0 }}
                  />
                  <span>
                    <strong style={{ color: 'var(--ink-900)' }}>커뮤니티에 익명으로 공유하기</strong>
                    <br />
                    켜면 다른 {isDev ? '엔지니어' : '원장'}들에게도 이 한 줄이 보입니다. 작성자를
                    <code style={{ background: 'var(--paper-100)', padding: '0 4px', borderRadius: '4px', margin: '0 2px' }}>"N년차 OO학원"</code>
                    형식으로 적어주세요. 그 외 형식은 서버에서 거부됩니다.
                  </span>
                </label>
              )}

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
            <p style={{ marginBottom: '16px' }}><strong>{userPostCount}개</strong>의 {isDev ? '스니펫' : '한 줄'} 공유 완료 · 베테랑 시드 {seeds.length}개와 함께 묶여 표시됩니다.</p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', background: userPostCount > 0 ? 'var(--primary)' : 'var(--border)', color: userPostCount > 0 ? 'white' : 'var(--text-muted)' }}
              disabled={userPostCount === 0}
              onClick={() => complete({ activityData: { posts }, bonusXp: 15 })}
            >
              갤러리 활동 저장 및 종료
            </button>
          </div>
        </div>

        {/* Right: Gallery Feed (user posts + veteran seeds) */}
        <div className="split-right" style={{ paddingLeft: '24px', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📡 인사이트 피드
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-500)', marginBottom: '20px' }}>
            아래는 다른 {isDev ? '엔지니어' : '원장'}들이 공유한 한 줄들입니다. 당신의 한 줄을 추가하면 같은 묶음에 보입니다.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
            <AnimatePresence>
              {displayPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  layout
                  className="card"
                  style={{
                    background: post.isSeed
                      ? 'var(--paper-100)'
                      : post.isSharedFromServer
                      ? 'var(--lavender-wash)'
                      : 'var(--paper-50)',
                    border: post.isSeed
                      ? '1px dashed var(--paper-400)'
                      : post.isSharedFromServer
                      ? '1px solid var(--lavender)'
                      : '1px solid var(--paper-300)',
                    borderLeft: post.isSeed
                      ? '3px solid var(--sage)'
                      : post.isSharedFromServer
                      ? '3px solid var(--lavender)'
                      : '3px solid var(--ink-blue)',
                  }}
                >
                  <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: post.isSeed
                          ? 'var(--sage)'
                          : post.isSharedFromServer
                          ? 'var(--lavender)'
                          : 'var(--ink-blue)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '0.75rem', fontWeight: 'bold',
                        flexShrink: 0,
                      }}>
                        {post.name.charAt(0)}
                      </div>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--ink-900)' }}>{post.name}</strong>
                      {post.isSeed && (
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px',
                          borderRadius: '999px', background: 'var(--green-wash)', color: '#3F6620',
                          border: '1px solid var(--sage)', letterSpacing: '0.4px',
                        }}>🌱 베테랑 시드</span>
                      )}
                      {post.isSharedFromServer && (
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px',
                          borderRadius: '999px', background: 'var(--paper-50)', color: '#5B3EA6',
                          border: '1px solid var(--lavender)', letterSpacing: '0.4px',
                        }}>🌐 커뮤니티</span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink-500)' }}>{post.time}</span>
                  </header>
                  <p style={{ fontSize: '1.02rem', lineHeight: 1.55, color: 'var(--ink-900)', marginBottom: '12px' }}>
                    "{post.text}"
                  </p>
                  <div style={{ borderTop: '1px dashed var(--paper-300)', paddingTop: '10px', display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => !post.isSeed && handleLike(post.id)}
                      className="btn btn-ghost"
                      disabled={post.isSeed}
                      style={{
                        padding: '4px 12px',
                        fontSize: '0.85rem',
                        color: 'var(--ink-700)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: post.isSeed ? 'default' : 'pointer',
                      }}
                    >
                      👍 공감 {post.likes}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
