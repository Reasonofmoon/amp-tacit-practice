import { lazy, Suspense, useEffect, useState } from 'react';
import Workshop from './workshop/Workshop';
const LegacyApp = lazy(() => import('./LegacyApp'));
export default function App() {
 const [legacy, setLegacy] = useState(() => window.location.hash === '#legacy');
 useEffect(() => { const update = () => setLegacy(window.location.hash === '#legacy'); window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update); }, []);
 if (legacy) return <><nav aria-label="워크숍으로 돌아가기" className="amp-legacy-nav"><a href="#workshop">AMP 26 새 워크숍으로 돌아가기</a></nav><Suspense fallback={<p role="status">이전 실습 자료를 여는 중입니다.</p>}><LegacyApp /></Suspense></>;
 return <Workshop />;
}
