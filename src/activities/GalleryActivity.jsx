import { useState } from 'react';
import ActivityShell from '../components/ActivityShell';

export default function GalleryActivity({ data, onSave, onComplete, onBack }) {
  const [posts, setPosts] = useState(data?.posts ?? []);
  const [name, setName] = useState('');
  const [draft, setDraft] = useState('');

  const addPost = () => {
    if (!draft.trim()) {
      return;
    }

    const nextPosts = [
      {
        name: name.trim() || '익명',
        text: draft.trim(),
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      },
      ...posts,
    ];

    setPosts(nextPosts);
    onSave({ posts: nextPosts });
    setDraft('');
  };

  return (
    <ActivityShell
      title="암묵지 갤러리 워크"
      desc="오늘 발견한 가장 인상적인 암묵지를 한 문장으로 공유해보세요."
      icon="🖼️"
      color="#14B8A6"
      time="3분"
      onBack={onBack}
      actions={
        <button
          type="button"
          className="primary-button"
          disabled={posts.length === 0}
          onClick={() => onComplete({ activityData: { posts } })}
          aria-label="갤러리 활동 완료"
        >
          갤러리 완료
        </button>
      }
    >
      <div className="gallery-compose">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="이름 또는 닉네임" aria-label="공유자 이름 입력" />
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              addPost();
            }
          }}
          placeholder="오늘 발견한 암묵지를 한 문장으로 적어보세요."
          aria-label="공유 문장 입력"
        />
        <button type="button" className="primary-button" onClick={addPost} aria-label="암묵지 공유">
          공유
        </button>
      </div>

      <div className="gallery-list">
        {posts.length === 0 ? <p className="muted-copy empty-state">첫 번째 암묵지를 공유해보세요.</p> : null}
        {posts.map((post) => (
          <article key={`${post.name}-${post.time}-${post.text}`} className="gallery-post">
            <header>
              <strong>{post.name}</strong>
              <span>{post.time}</span>
            </header>
            <p>{post.text}</p>
          </article>
        ))}
      </div>
    </ActivityShell>
  );
}
