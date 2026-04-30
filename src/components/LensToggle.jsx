import { GraduationCap, Code2 } from 'lucide-react';

// 활동 워크스페이스 헤더에 다는 작은 director ↔ developer 렌즈 토글.
// 같은 개념(예: quiz)에서 어떤 콘텐츠 세트를 볼지 선택. 라우트는
// 'quiz' ↔ 'dev_quiz' 로 바뀌지만 챕터·발견 카드는 mirror 정규화로
// 같은 챕터 페이지를 채운다.
//
// 미러가 없는 활동(auto_*, demo_*)에서는 렌더 X.
function hasMirror(id) {
  if (!id) return false;
  if (id.startsWith('auto_') || id.startsWith('demo_')) return false;
  return true;
}

export default function LensToggle({ currentId, onSwitch }) {
  if (!hasMirror(currentId)) return null;
  const isDev = currentId.startsWith('dev_');
  const baseId = isDev ? currentId.slice(4) : currentId;
  const otherId = isDev ? baseId : `dev_${baseId}`;

  return (
    <div className="lens-toggle" role="group" aria-label="콘텐츠 렌즈">
      <button
        type="button"
        className={`lens-toggle-btn ${!isDev ? 'is-active' : ''}`}
        onClick={() => !isDev || onSwitch?.(baseId)}
        aria-pressed={!isDev}
        title="원장 렌즈 — 학원 운영 콘텐츠"
      >
        <GraduationCap size={14} aria-hidden="true" />
        <span>원장</span>
      </button>
      <button
        type="button"
        className={`lens-toggle-btn ${isDev ? 'is-active' : ''}`}
        onClick={() => isDev || onSwitch?.(otherId)}
        aria-pressed={isDev}
        title="개발자 렌즈 — 같은 개념의 개발 컨텍스트"
      >
        <Code2 size={14} aria-hidden="true" />
        <span>개발자</span>
      </button>
    </div>
  );
}
