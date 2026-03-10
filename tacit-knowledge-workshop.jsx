import { useState, useEffect, useRef, useCallback } from "react";

// ─── Data & Constants ───
const MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

const YEAR_EVENTS = [
  { month: 0, label: "신학기 준비", icon: "🌱", desc: "신규 등록, 반편성, 레벨테스트" },
  { month: 1, label: "안정화", icon: "📐", desc: "수업 루틴 정착, 학부모 첫 상담" },
  { month: 2, label: "중간점검", icon: "📊", desc: "첫 성적 분석, 피드백 사이클" },
  { month: 3, label: "학부모 설명회", icon: "🎤", desc: "성과 보고, 여름 프로그램 안내" },
  { month: 4, label: "여름특강 기획", icon: "☀️", desc: "캠프/특강 준비, 마케팅" },
  { month: 5, label: "여름특강 운영", icon: "🏊", desc: "집중 프로그램, 신규 유입" },
  { month: 6, label: "하반기 전환", icon: "🔄", desc: "반 재편성, 커리큘럼 조정" },
  { month: 7, label: "2학기 안정화", icon: "📚", desc: "수업 가속, 숙제 관리 강화" },
  { month: 8, label: "성과 점검", icon: "🎯", desc: "학력평가 대비, 중간 리포트" },
  { month: 9, label: "학부모 면담", icon: "🤝", desc: "개별 면담 시즌, 재등록 상담" },
  { month: 10, label: "겨울특강 기획", icon: "❄️", desc: "겨울방학 프로그램, 마케팅" },
  { month: 11, label: "연말 정산", icon: "🎊", desc: "성과 분석, 다음해 전략 수립" },
];

const ACTIVITIES = [
  {
    id: "timeline",
    title: "나의 1년 타임라인",
    subtitle: "학원 운영의 12개월을 돌아보며 숨겨진 패턴을 발견합니다",
    icon: "🗓️",
    color: "#10B981",
    time: "5분",
  },
  {
    id: "autopilot",
    title: "자동조종 탐지기",
    subtitle: "무의식적으로 하고 있는 것들 — 그것이 암묵지입니다",
    icon: "🧭",
    color: "#6366F1",
    time: "4분",
  },
  {
    id: "crisis",
    title: "위기의 순간 리플레이",
    subtitle: "위기 상황에서 내린 즉각적 판단 속 숨은 전문성",
    icon: "⚡",
    color: "#F59E0B",
    time: "4분",
  },
  {
    id: "transfer",
    title: "신입에게 전수하기",
    subtitle: "가르칠 때 비로소 보이는 나의 암묵지",
    icon: "🎓",
    color: "#EC4899",
    time: "4분",
  },
  {
    id: "seci",
    title: "SECI 변환 실습",
    subtitle: "발견한 암묵지를 AI 프롬프트로 전환합니다",
    icon: "🔮",
    color: "#8B5CF6",
    time: "5분",
  },
  {
    id: "gallery",
    title: "암묵지 갤러리 워크",
    subtitle: "서로의 발견을 공유하고 새로운 영감을 얻습니다",
    icon: "🖼️",
    color: "#14B8A6",
    time: "3분",
  },
];

const AUTOPILOT_PROMPTS = [
  { area: "학부모 상담", q: "학부모가 \"우리 아이 성적이 안 올라요\"라고 할 때, 당신이 가장 먼저 하는 것은?", hint: "성적표를 먼저 볼까요? 아이의 태도를 먼저 이야기할까요? 그 순서가 당신의 암묵지입니다." },
  { area: "반 편성", q: "새 학기 반편성을 할 때, 레벨테스트 점수 외에 당신이 무의식적으로 고려하는 것은?", hint: "친구 관계? 성격 조합? 학부모 요청? 숫자에 없는 판단이 있습니다." },
  { area: "위험 학생 감지", q: "\"이 학생 곧 그만두겠다\" — 어떤 신호로 알아차립니까?", hint: "출결? 표정? 숙제 패턴? 당신만의 안테나가 있습니다." },
  { area: "수업 관찰", q: "좋은 수업과 나쁜 수업을 교실 문 밖에서도 구분할 수 있습니까? 어떻게?", hint: "소리? 분위기? 학생 자세? 이것은 매뉴얼에 없습니다." },
  { area: "마케팅 타이밍", q: "\"지금이 홍보할 때다\" — 그 감각은 어디서 옵니까?", hint: "시즌? 경쟁학원 동향? 학부모 문의 패턴? 달력에 없는 타이밍 감각." },
  { area: "강사 채용", q: "이력서가 완벽한데도 \"이 사람은 아니다\" 느낀 적 있습니까? 그 기준은?", hint: "눈빛? 말투? 아이에 대한 태도? 면접 스킬 너머의 판단력." },
];

const CRISIS_SCENARIOS = [
  { title: "학부모 항의 전화", desc: "저녁 9시, 화난 학부모로부터 전화가 옵니다. \"우리 아이가 수업에서 무시당했대요.\" 당신의 첫 반응은?", prompts: ["가장 먼저 한 말은?", "그 다음 확인한 것은?", "최종적으로 어떻게 마무리했나요?"] },
  { title: "핵심 강사 돌연 퇴사", desc: "수업 시작 1주일 전, 가장 인기 있는 강사가 갑자기 그만둡니다. 학부모들은 아직 모릅니다.", prompts: ["24시간 안에 한 일 3가지는?", "학부모에게 어떻게 알렸나요?", "이 경험에서 이후 바꾼 것은?"] },
  { title: "등록생 급감", desc: "2월인데 신규 등록이 작년의 절반입니다. 주변에 새 학원이 생겼습니다.", prompts: ["가장 먼저 분석한 것은?", "기존 학부모에게 한 행동은?", "3개월 후 결과는?"] },
];

const TRANSFER_QUESTIONS = [
  "첫 학부모 상담 전에 반드시 준비해야 할 것 3가지",
  "레벨테스트 결과를 볼 때 숫자 외에 꼭 봐야 할 것",
  "수업 첫날 학생의 마음을 여는 나만의 방법",
  "학부모 불만이 왔을 때 절대 하면 안 되는 말",
  "퇴원 위험 신호를 가장 빨리 알아차리는 법",
  "강사에게 피드백할 때 나만의 원칙",
];

// ─── Components ───
function GlowOrb({ color, size = 200, top, left, delay = 0 }) {
  return (
    <div style={{
      position: "absolute", top, left, width: size, height: size,
      background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
      borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none",
      animation: `float ${6 + delay}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }} />
  );
}

function ActivityCard({ activity, onClick, completed, index }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? `${activity.color}12` : "rgba(255,255,255,0.03)",
        border: `1px solid ${completed ? activity.color : hover ? `${activity.color}60` : "rgba(255,255,255,0.08)"}`,
        borderRadius: 16, padding: "24px 20px", cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hover ? "translateY(-4px)" : "none",
        boxShadow: hover ? `0 8px 32px ${activity.color}20` : "none",
        position: "relative", overflow: "hidden",
        animation: `fadeSlideUp 0.5s ease forwards`,
        animationDelay: `${index * 0.08}s`,
        opacity: 0,
      }}
    >
      {completed && <div style={{
        position: "absolute", top: 12, right: 12,
        background: activity.color, borderRadius: "50%",
        width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14,
      }}>✓</div>}
      <div style={{ fontSize: 36, marginBottom: 12 }}>{activity.icon}</div>
      <div style={{ fontSize: 11, color: activity.color, fontWeight: 700, letterSpacing: 1, marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>
        {activity.time}
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: "#F1F5F9", marginBottom: 6, fontFamily: "'Noto Sans KR', sans-serif" }}>
        {activity.title}
      </div>
      <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5, fontFamily: "'Noto Sans KR', sans-serif" }}>
        {activity.subtitle}
      </div>
    </div>
  );
}

// ─── Activity Views ───
function TimelineActivity({ onBack, onSave }) {
  const [entries, setEntries] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [input, setInput] = useState("");

  return (
    <ActivityShell title="🗓️ 나의 1년 타임라인" desc="각 월을 클릭하여 그 시기에 당신이 무의식적으로 하는 일을 적어보세요." onBack={onBack} color="#10B981">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {YEAR_EVENTS.map((ev, i) => (
          <div key={i} onClick={() => { setSelectedMonth(i); setInput(entries[i] || ""); }}
            style={{
              background: selectedMonth === i ? `${ev.month < 6 ? "#10B981" : "#6366F1"}18` : entries[i] ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${selectedMonth === i ? "#10B981" : entries[i] ? "#10B98140" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 12, padding: "14px 12px", cursor: "pointer",
              transition: "all 0.2s",
            }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{ev.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", fontFamily: "'Noto Sans KR', sans-serif" }}>{MONTHS[i]}</div>
            <div style={{ fontSize: 11, color: "#64748B", fontFamily: "'Noto Sans KR', sans-serif" }}>{ev.label}</div>
            {entries[i] && <div style={{ marginTop: 6, fontSize: 11, color: "#10B981", fontStyle: "italic" }}>✍️ 작성됨</div>}
          </div>
        ))}
      </div>
      {selectedMonth !== null && (
        <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#10B981", marginBottom: 4, fontFamily: "'Noto Sans KR', sans-serif" }}>
            {MONTHS[selectedMonth]} — {YEAR_EVENTS[selectedMonth].label}
          </div>
          <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 12, fontFamily: "'Noto Sans KR', sans-serif" }}>
            {YEAR_EVENTS[selectedMonth].desc}
          </div>
          <div style={{ fontSize: 14, color: "#CBD5E1", marginBottom: 12, fontWeight: 600, fontFamily: "'Noto Sans KR', sans-serif" }}>
            이 시기에 당신이 매년 반복적으로 하지만, 매뉴얼에는 없는 일은 무엇인가요?
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={3}
            placeholder="예: 3월이면 항상 조용한 아이들을 먼저 파악해서 짝을 지어줍니다..."
            style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 14, color: "#E2E8F0", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "'Noto Sans KR', sans-serif", boxSizing: "border-box" }}
          />
          <button onClick={() => { setEntries(p => ({...p, [selectedMonth]: input})); setSelectedMonth(null); }}
            style={{ marginTop: 10, padding: "10px 24px", background: "#10B981", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "'Noto Sans KR', sans-serif" }}>
            저장하고 다음 달로
          </button>
        </div>
      )}
      {Object.keys(entries).length >= 3 && (
        <div style={{ marginTop: 20, padding: 16, background: "rgba(16,185,129,0.08)", borderRadius: 12, border: "1px solid rgba(16,185,129,0.2)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#10B981", marginBottom: 8, fontFamily: "'Noto Sans KR', sans-serif" }}>
            💡 발견: {Object.keys(entries).length}개월의 암묵지를 기록했습니다
          </div>
          <div style={{ fontSize: 13, color: "#94A3B8", fontFamily: "'Noto Sans KR', sans-serif" }}>
            매뉴얼에 없지만 매년 반복하는 것 — 이것이 당신만의 암묵지입니다. 이것을 문서화하면 누구에게든 전수할 수 있고, AI와 결합하면 자동화할 수 있습니다.
          </div>
        </div>
      )}
    </ActivityShell>
  );
}

function AutopilotActivity({ onBack }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [input, setInput] = useState("");
  const p = AUTOPILOT_PROMPTS[current];

  return (
    <ActivityShell title="🧭 자동조종 탐지기" desc="6가지 상황에서 당신이 무의식적으로 하는 것을 포착합니다." onBack={onBack} color="#6366F1">
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {AUTOPILOT_PROMPTS.map((_, i) => (
          <div key={i} onClick={() => { setCurrent(i); setInput(answers[i] || ""); }}
            style={{ flex: 1, height: 6, borderRadius: 3, cursor: "pointer",
              background: answers[i] ? "#6366F1" : i === current ? "#6366F180" : "rgba(255,255,255,0.08)",
              transition: "all 0.3s" }} />
        ))}
      </div>
      <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 16, padding: 24 }}>
        <div style={{ fontSize: 12, color: "#6366F1", fontWeight: 700, letterSpacing: 1, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>
          {current + 1}/6 — {p.area}
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#E2E8F0", marginBottom: 12, lineHeight: 1.6, fontFamily: "'Noto Sans KR', sans-serif" }}>
          {p.q}
        </div>
        <div style={{ fontSize: 13, color: "#818CF8", marginBottom: 16, fontStyle: "italic", lineHeight: 1.5, fontFamily: "'Noto Sans KR', sans-serif" }}>
          💡 {p.hint}
        </div>
        <textarea value={input} onChange={e => setInput(e.target.value)} rows={3}
          placeholder="당신의 답을 적어보세요..."
          style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 14, color: "#E2E8F0", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "'Noto Sans KR', sans-serif", boxSizing: "border-box" }}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          {current > 0 && <button onClick={() => { setCurrent(c => c-1); setInput(answers[current-1]||""); }}
            style={{ padding: "10px 20px", background: "rgba(255,255,255,0.06)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, cursor: "pointer", fontSize: 14, fontFamily: "'Noto Sans KR', sans-serif" }}>← 이전</button>}
          <button onClick={() => { setAnswers(p => ({...p, [current]: input})); if(current < 5) { setCurrent(c => c+1); setInput(answers[current+1]||""); } }}
            style={{ padding: "10px 24px", background: "#6366F1", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "'Noto Sans KR', sans-serif" }}>
            {current < 5 ? "다음 →" : "완료 ✓"}
          </button>
        </div>
      </div>
      {Object.keys(answers).length >= 4 && (
        <div style={{ marginTop: 20, padding: 16, background: "rgba(99,102,241,0.08)", borderRadius: 12, border: "1px solid rgba(99,102,241,0.2)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#818CF8", fontFamily: "'Noto Sans KR', sans-serif" }}>
            🧭 {Object.keys(answers).length}개의 자동조종 모드를 발견했습니다
          </div>
          <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 6, fontFamily: "'Noto Sans KR', sans-serif" }}>
            당신이 "그냥 하는 것"이라고 생각한 것들 — 그것은 수천 번의 경험이 압축된 전문가의 직관입니다.
          </div>
        </div>
      )}
    </ActivityShell>
  );
}

function CrisisActivity({ onBack }) {
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});

  return (
    <ActivityShell title="⚡ 위기의 순간 리플레이" desc="위기 상황을 선택하고, 그때의 즉각적 판단을 되돌아봅니다." onBack={onBack} color="#F59E0B">
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {CRISIS_SCENARIOS.map((s, i) => (
          <div key={i} onClick={() => setSelected(i)}
            style={{
              background: selected === i ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${selected === i ? "#F59E0B" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.2s",
            }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#FCD34D", marginBottom: 6, fontFamily: "'Noto Sans KR', sans-serif" }}>{s.title}</div>
            <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5, fontFamily: "'Noto Sans KR', sans-serif" }}>{s.desc}</div>
          </div>
        ))}
      </div>
      {selected !== null && (
        <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 16, padding: 24 }}>
          {CRISIS_SCENARIOS[selected].prompts.map((prompt, pi) => (
            <div key={pi} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#FCD34D", marginBottom: 8, fontFamily: "'Noto Sans KR', sans-serif" }}>{prompt}</div>
              <textarea
                value={answers[`${selected}-${pi}`] || ""} rows={2}
                onChange={e => setAnswers(p => ({...p, [`${selected}-${pi}`]: e.target.value}))}
                placeholder="그때 했던 것을 떠올려보세요..."
                style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 12, color: "#E2E8F0", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "'Noto Sans KR', sans-serif", boxSizing: "border-box" }}
              />
            </div>
          ))}
          <div style={{ fontSize: 13, color: "#F59E0B", fontStyle: "italic", marginTop: 8, fontFamily: "'Noto Sans KR', sans-serif" }}>
            💡 위기 순간에 즉각적으로 나온 판단 — 그것은 교과서에서 배운 것이 아니라 경험이 만든 암묵지입니다.
          </div>
        </div>
      )}
    </ActivityShell>
  );
}

function TransferActivity({ onBack }) {
  const [selected, setSelected] = useState(null);
  const [answer, setAnswer] = useState("");
  const [saved, setSaved] = useState({});

  return (
    <ActivityShell title="🎓 신입에게 전수하기" desc="내일 신입 선생님이 옵니다. 이것만은 꼭 알려줘야 하는 것을 골라 전수해보세요." onBack={onBack} color="#EC4899">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 20 }}>
        {TRANSFER_QUESTIONS.map((q, i) => (
          <div key={i} onClick={() => { setSelected(i); setAnswer(saved[i] || ""); }}
            style={{
              background: selected === i ? "rgba(236,72,153,0.1)" : saved[i] ? "rgba(236,72,153,0.05)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${selected === i ? "#EC4899" : saved[i] ? "#EC489940" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 12, padding: 16, cursor: "pointer", transition: "all 0.2s",
            }}>
            <div style={{ fontSize: 13, color: saved[i] ? "#F472B6" : "#CBD5E1", lineHeight: 1.5, fontFamily: "'Noto Sans KR', sans-serif" }}>
              {saved[i] ? "✅ " : ""}{q}
            </div>
          </div>
        ))}
      </div>
      {selected !== null && (
        <div style={{ background: "rgba(236,72,153,0.06)", border: "1px solid rgba(236,72,153,0.2)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#F472B6", marginBottom: 12, fontFamily: "'Noto Sans KR', sans-serif" }}>
            🎓 신입 선생님에게 전수: {TRANSFER_QUESTIONS[selected]}
          </div>
          <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 12, fontFamily: "'Noto Sans KR', sans-serif" }}>
            교과서적 답이 아니라, 당신만의 방법을 구체적으로 적어주세요.
          </div>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={4}
            placeholder='예: "첫 상담 전에 반드시 아이의 학교 시험지를 받아서 틀린 유형을 3가지로 분류합니다. 점수가 아니라 틀리는 패턴이 상담의 시작이에요."'
            style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 14, color: "#E2E8F0", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "'Noto Sans KR', sans-serif", boxSizing: "border-box" }}
          />
          <button onClick={() => { setSaved(p => ({...p, [selected]: answer})); setSelected(null); }}
            style={{ marginTop: 10, padding: "10px 24px", background: "#EC4899", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "'Noto Sans KR', sans-serif" }}>
            전수 완료 ✓
          </button>
        </div>
      )}
      {Object.keys(saved).length >= 3 && (
        <div style={{ marginTop: 20, padding: 16, background: "rgba(236,72,153,0.08)", borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#F472B6", fontFamily: "'Noto Sans KR', sans-serif" }}>
            🎓 {Object.keys(saved).length}개를 전수했습니다
          </div>
          <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 6, fontFamily: "'Noto Sans KR', sans-serif" }}>
            방금 적은 것 — 이것이 매뉴얼에 넣어야 할 진짜 노하우입니다. AI에게 이 내용을 학습시키면 24시간 작동하는 "당신의 분신"이 됩니다.
          </div>
        </div>
      )}
    </ActivityShell>
  );
}

function SeciActivity({ onBack }) {
  const [step, setStep] = useState(0);
  const [tacit, setTacit] = useState("");
  const [prompt, setPrompt] = useState("");

  const exampleTransform = tacit ?
    `[역할] 너는 경력 20년의 영어학원 운영 전문가야.\n[암묵지] ${tacit}\n[작업] 이 노하우를 기반으로:\n1. 체크리스트 5개를 만들어줘\n2. 신입 선생님이 따라할 수 있는 단계별 가이드를 작성해줘\n3. 이 상황에서 흔히 하는 실수 3가지를 알려줘` : "";

  return (
    <ActivityShell title="🔮 SECI 변환 실습" desc="당신이 발견한 암묵지를 AI 프롬프트로 전환합니다." onBack={onBack} color="#8B5CF6">
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["1. 암묵지 입력", "2. AI 프롬프트 변환", "3. 결과 확인"].map((s, i) => (
          <div key={i} style={{
            flex: 1, padding: "10px 0", textAlign: "center", borderRadius: 8,
            background: step === i ? "#8B5CF6" : step > i ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)",
            color: step >= i ? "white" : "#64748B", fontSize: 13, fontWeight: step === i ? 700 : 400,
            transition: "all 0.3s", fontFamily: "'Noto Sans KR', sans-serif",
          }}>{s}</div>
        ))}
      </div>

      {step === 0 && (
        <div style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#A78BFA", marginBottom: 12, fontFamily: "'Noto Sans KR', sans-serif" }}>
            앞의 활동에서 발견한 암묵지 중 하나를 적어주세요
          </div>
          <textarea value={tacit} onChange={e => setTacit(e.target.value)} rows={3}
            placeholder='예: "퇴원 위험 학생은 성적이 아니라 숙제 제출 패턴으로 먼저 감지합니다. 3주 연속 숙제가 불성실하면 거의 100% 퇴원합니다."'
            style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 14, color: "#E2E8F0", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "'Noto Sans KR', sans-serif", boxSizing: "border-box" }}
          />
          <button onClick={() => { if(tacit.trim()) setStep(1); }}
            disabled={!tacit.trim()}
            style={{ marginTop: 12, padding: "10px 24px", background: tacit.trim() ? "#8B5CF6" : "#334155", color: "white", border: "none", borderRadius: 8, cursor: tacit.trim() ? "pointer" : "default", fontWeight: 700, fontSize: 14, fontFamily: "'Noto Sans KR', sans-serif" }}>
            변환하기 →
          </button>
        </div>
      )}

      {step === 1 && (
        <div style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#A78BFA", marginBottom: 8, fontFamily: "'Noto Sans KR', sans-serif" }}>
            당신의 암묵지:
          </div>
          <div style={{ fontSize: 13, color: "#CBD5E1", marginBottom: 16, padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 8, fontStyle: "italic", fontFamily: "'Noto Sans KR', sans-serif" }}>
            "{tacit}"
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#A78BFA", marginBottom: 8, fontFamily: "'Noto Sans KR', sans-serif" }}>
            ↓ AI 프롬프트로 변환됨:
          </div>
          <pre style={{ background: "rgba(0,0,0,0.4)", borderRadius: 10, padding: 16, color: "#E2E8F0", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap", border: "1px solid rgba(139,92,246,0.3)", fontFamily: "'JetBrains Mono', 'Noto Sans KR', monospace", overflow: "auto" }}>
            {exampleTransform}
          </pre>
          <div style={{ fontSize: 13, color: "#A78BFA", marginTop: 12, fontFamily: "'Noto Sans KR', sans-serif" }}>
            💡 당신의 경험이 AI가 이해할 수 있는 언어로 바뀌었습니다. 이 프롬프트를 ChatGPT나 Claude에 넣으면 당신의 노하우가 작동합니다.
          </div>
          <button onClick={() => setStep(2)}
            style={{ marginTop: 12, padding: "10px 24px", background: "#8B5CF6", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "'Noto Sans KR', sans-serif" }}>
            이해했습니다 ✓
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 16, padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#A78BFA", marginBottom: 12, fontFamily: "'Noto Sans KR', sans-serif" }}>
            SECI 변환 완료!
          </div>
          <div style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.7, maxWidth: 480, margin: "0 auto", fontFamily: "'Noto Sans KR', sans-serif" }}>
            방금 일어난 일:<br/>
            <strong style={{ color: "#A78BFA" }}>암묵지</strong>(머릿속) →
            <strong style={{ color: "#F472B6" }}> 표출화</strong>(말로 적기) →
            <strong style={{ color: "#10B981" }}> 연결화</strong>(AI 프롬프트) →
            <strong style={{ color: "#FCD34D" }}> 내면화</strong>(누구나 사용 가능)<br/><br/>
            이것이 SECI 모델의 전체 사이클입니다.<br/>
            당신의 20년이 5분 만에 전수 가능한 형태가 되었습니다.
          </div>
        </div>
      )}
    </ActivityShell>
  );
}

function GalleryActivity({ onBack }) {
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");

  return (
    <ActivityShell title="🖼️ 암묵지 갤러리 워크" desc="오늘 발견한 가장 인상적인 암묵지를 공유하세요. 서로의 발견에서 영감을 얻습니다." onBack={onBack} color="#14B8A6">
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="이름 (익명 가능)"
          style={{ flex: "0 0 120px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", color: "#E2E8F0", fontSize: 14, outline: "none", fontFamily: "'Noto Sans KR', sans-serif" }}
        />
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="오늘 발견한 나의 암묵지를 한 문장으로..."
          onKeyDown={e => { if(e.key === "Enter" && input.trim()) { setPosts(p => [{name: name||"익명", text: input, time: new Date().toLocaleTimeString("ko-KR", {hour:"2-digit",minute:"2-digit"})}, ...p]); setInput(""); }}}
          style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", color: "#E2E8F0", fontSize: 14, outline: "none", fontFamily: "'Noto Sans KR', sans-serif" }}
        />
        <button onClick={() => { if(input.trim()) { setPosts(p => [{name: name||"익명", text: input, time: new Date().toLocaleTimeString("ko-KR", {hour:"2-digit",minute:"2-digit"})}, ...p]); setInput(""); } }}
          style={{ padding: "10px 20px", background: "#14B8A6", color: "white", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", fontFamily: "'Noto Sans KR', sans-serif" }}>
          공유
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 400, overflowY: "auto" }}>
        {posts.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#64748B", fontFamily: "'Noto Sans KR', sans-serif" }}>
            아직 공유된 암묵지가 없습니다. 첫 번째로 공유해보세요!
          </div>
        )}
        {posts.map((p, i) => (
          <div key={i} style={{
            background: "rgba(20,184,166,0.06)", border: "1px solid rgba(20,184,166,0.15)",
            borderRadius: 12, padding: 16, animation: "fadeSlideUp 0.3s ease forwards",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#5EEAD4", fontFamily: "'Noto Sans KR', sans-serif" }}>{p.name}</span>
              <span style={{ fontSize: 11, color: "#64748B", fontFamily: "'JetBrains Mono', monospace" }}>{p.time}</span>
            </div>
            <div style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.6, fontFamily: "'Noto Sans KR', sans-serif" }}>"{p.text}"</div>
          </div>
        ))}
      </div>
    </ActivityShell>
  );
}

function ActivityShell({ title, desc, onBack, color, children }) {
  return (
    <div style={{ animation: "fadeSlideUp 0.4s ease forwards" }}>
      <button onClick={onBack}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 14, marginBottom: 20, padding: 0, fontFamily: "'Noto Sans KR', sans-serif" }}>
        ← 활동 목록으로
      </button>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#F1F5F9", marginBottom: 6, fontFamily: "'Noto Sans KR', sans-serif" }}>{title}</div>
        <div style={{ fontSize: 14, color: "#94A3B8", fontFamily: "'Noto Sans KR', sans-serif" }}>{desc}</div>
      </div>
      {children}
    </div>
  );
}

// ─── Main App ───
export default function TacitKnowledgeApp() {
  const [view, setView] = useState("home");
  const [completed, setCompleted] = useState(new Set());

  const markComplete = (id) => setCompleted(p => new Set([...p, id]));

  const renderActivity = () => {
    switch(view) {
      case "timeline": return <TimelineActivity onBack={() => { setView("home"); markComplete("timeline"); }} />;
      case "autopilot": return <AutopilotActivity onBack={() => { setView("home"); markComplete("autopilot"); }} />;
      case "crisis": return <CrisisActivity onBack={() => { setView("home"); markComplete("crisis"); }} />;
      case "transfer": return <TransferActivity onBack={() => { setView("home"); markComplete("transfer"); }} />;
      case "seci": return <SeciActivity onBack={() => { setView("home"); markComplete("seci"); }} />;
      case "gallery": return <GalleryActivity onBack={() => { setView("home"); markComplete("gallery"); }} />;
      default: return null;
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0B1120",
      color: "#E2E8F0", position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        * { box-sizing: border-box; }
        textarea:focus, input:focus { border-color: rgba(255,255,255,0.25) !important; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      <GlowOrb color="#6366F1" size={300} top="-50px" left="-100px" delay={0} />
      <GlowOrb color="#10B981" size={250} top="40%" left="80%" delay={2} />
      <GlowOrb color="#F59E0B" size={200} top="70%" left="10%" delay={4} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: view === "home" ? 48 : 24, animation: "fadeSlideUp 0.5s ease forwards" }}>
          <div style={{ fontSize: 12, letterSpacing: 3, color: "#64748B", fontWeight: 700, marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>
            고려대 AMP · KEYNOTE WORKSHOP
          </div>
          <h1 style={{ fontSize: view === "home" ? 32 : 22, fontWeight: 900, margin: "0 0 12px", lineHeight: 1.3,
            background: "linear-gradient(135deg, #E2E8F0, #94A3B8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            fontFamily: "'Noto Sans KR', sans-serif", transition: "font-size 0.3s",
          }}>
            학원 원장의 1년
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", maxWidth: 500, margin: "0 auto", lineHeight: 1.6, fontFamily: "'Noto Sans KR', sans-serif" }}>
            당신이 인식하지 못하고 있는 잠재적 암묵지 역량을 발견합니다
          </p>
          {view === "home" && (
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 24 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#6366F1", fontFamily: "'JetBrains Mono', monospace" }}>{completed.size}</div>
                <div style={{ fontSize: 11, color: "#64748B", fontFamily: "'Noto Sans KR', sans-serif" }}>완료</div>
              </div>
              <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#94A3B8", fontFamily: "'JetBrains Mono', monospace" }}>6</div>
                <div style={{ fontSize: 11, color: "#64748B", fontFamily: "'Noto Sans KR', sans-serif" }}>전체</div>
              </div>
              <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#10B981", fontFamily: "'JetBrains Mono', monospace" }}>25분</div>
                <div style={{ fontSize: 11, color: "#64748B", fontFamily: "'Noto Sans KR', sans-serif" }}>총 소요</div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {view === "home" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
            {ACTIVITIES.map((a, i) => (
              <ActivityCard key={a.id} activity={a} index={i}
                completed={completed.has(a.id)}
                onClick={() => setView(a.id)} />
            ))}
          </div>
        ) : renderActivity()}

        {/* Footer */}
        {view === "home" && (
          <div style={{ textAlign: "center", marginTop: 48, padding: "24px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, fontFamily: "'Noto Sans KR', sans-serif" }}>
              "당신의 20년은 사라지지 않습니다. AI와 결합하면 7개의 앱이 됩니다."
            </div>
            <div style={{ fontSize: 11, color: "#334155", marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>
              송세훈 · 암묵지에서 AI 앱까지
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
