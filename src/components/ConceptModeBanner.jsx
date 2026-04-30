// 자동화(auto_*) 활동에서 비개발자 학원장이 챕터 6를 채울 수 있도록
// "체험 모드" 진입 배너. 실제 키 발급/코드 실행 없이도 컨셉만 이해하고
// 챕터 페이지를 채울 수 있게 한다.
import { Eye, ArrowRight } from 'lucide-react';

export default function ConceptModeBanner({ onConceptComplete, label }) {
  return (
    <div className="concept-mode-banner" role="region" aria-label="체험 모드">
      <div className="concept-mode-banner-text">
        <span className="concept-mode-banner-eyebrow">
          <Eye size={14} aria-hidden="true" /> 체험 모드
        </span>
        <p>
          <strong>실제 코드/키 입력 없이</strong> 컨셉만 보고 이 단계를 마칠 수 있어요.
          챕터 6 자동화 페이지가 그대로 채워집니다.
        </p>
      </div>
      <button
        type="button"
        className="concept-mode-banner-cta"
        onClick={onConceptComplete}
      >
        {label ?? '체험으로 완료'}
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
