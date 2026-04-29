import { Brain, Boxes, FileText, Sparkles } from 'lucide-react';
import PresentationShell from '../components/PresentationShell';

const INTRO_CARDS = [
  {
    icon: Brain,
    title: '암묵지 포착',
    detail: '원장이 반복적으로 해온 판단, 말투, 순서, 금기를 먼저 문장으로 꺼냅니다.',
  },
  {
    icon: FileText,
    title: '형식지 변환',
    detail: '말로 설명하기 어려운 감각을 체크리스트, 프롬프트, 데이터 규칙으로 바꿉니다.',
  },
  {
    icon: Boxes,
    title: '앱 구현',
    detail: '한 사람의 노하우가 다른 강사와 학부모도 쓸 수 있는 화면과 흐름이 됩니다.',
  },
];

export default function DemoShowcaseIntroActivity(props) {
  return (
    <PresentationShell
      step="0"
      title="0. Tacit KnowledgeLab 소개"
      subtitle="암묵지가 앱이 되는 전체 여정"
      storyText="이 쇼케이스는 좋은 앱 목록이 아니라, 원장님의 몸에 밴 판단과 운영 감각이 어떻게 데이터, 프롬프트, 화면, 자동화로 바뀌는지 보여주는 흐름입니다"
      actionText="쇼케이스 구조 열기"
      actionColor="#2563EB"
      xpReward={15}
      {...props}
    >
      <div
        style={{
          width: 'min(980px, 100%)',
          minHeight: '520px',
          borderRadius: '24px',
          border: '1px solid rgba(96, 165, 250, 0.28)',
          background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 48%, #f8fafc 100%)',
          color: '#0f172a',
          boxShadow: '0 28px 90px rgba(15, 23, 42, 0.35)',
          padding: '44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '30px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: '#2563eb',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 24px rgba(37, 99, 235, 0.32)',
            }}
          >
            <Sparkles size={26} />
          </div>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '0.78rem', color: '#2563eb', fontWeight: 800, letterSpacing: '0.16em' }}>
              AMP TACIT KNOWLEDGE
            </p>
            <h2 style={{ margin: 0, fontSize: '2rem', lineHeight: 1.2, color: '#0f172a' }}>
              경험을 데이터로, 노하우를 시스템으로
            </h2>
          </div>
        </div>

        <p style={{ margin: 0, maxWidth: '760px', fontSize: '1.08rem', lineHeight: 1.8, color: '#334155' }}>
          원장님이 무심코 하는 레벨 판단, 첨삭 기준, 상담 멘트, 수업 순서, 운영 이상 신호 감지는 대부분 매뉴얼에 없습니다.
          이 앱은 그 감각을 끌어내고, 아래 쇼케이스는 그것이 실제 도구로 구현되는 여러 단계를 보여줍니다.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
          {INTRO_CARDS.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                style={{
                  padding: '22px',
                  borderRadius: '18px',
                  background: '#ffffff',
                  border: '1px solid #dbeafe',
                  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.07)',
                }}
              >
                <Icon size={24} color="#2563eb" />
                <h3 style={{ margin: '14px 0 8px', fontSize: '1.05rem', color: '#0f172a' }}>{card.title}</h3>
                <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.65, color: '#475569' }}>{card.detail}</p>
              </article>
            );
          })}
        </div>
      </div>
    </PresentationShell>
  );
}
